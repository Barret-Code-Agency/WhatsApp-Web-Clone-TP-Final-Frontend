import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ChatProvider, useChat } from './context/ChatContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import LoadingScreen from './Screens/LoadingScreen.jsx';
import Sidebar from './Screens/Sidebar.jsx';
import WelcomeScreen from './Screens/WelcomeScreen.jsx';
import AddContactPanel from './components/chat/AddContactPanel.jsx';
import WhatsAppLogin from './Screens/WhatsAppLogin.jsx';
import ChatWindow from './components/chat/ChatWindow.jsx';
import Login from './Screens/Login.jsx';
import ResetPassword from './Screens/ResetPassword.jsx';
import GroupChatWindow from './components/chat/GroupChatWindow.jsx';
import NewGroupPanel from './components/chat/NewGroupPanel.jsx';
import { getToken } from './services/api.js';
import { APP_STEP, THEME } from './constants/ui.js';

import './styles/variables.css';
import './styles/utilities.css';
import './styles/index.css';
import './styles/App.css';
import './styles/Login.css';
import './styles/Sidebar.css';
import './styles/StatusScreen.css';
import './styles/WelcomeScreen.css';
import './styles/WhatsAppLogin.css';


function AppContent() {
    const [step, setStep] = useState(APP_STEP.LOADING);
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken());
    const [isAddContactOpen, setIsAddContactOpen] = useState(false);
    const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
    const { setTheme } = useTheme();
    const { logout: chatLogout } = useChat();
    const navigate = useNavigate();
    const location = useLocation();

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth <= 767);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    // En el landing, avanzamos solos al login a los 5 segundos (o antes si el usuario hace click).
    useEffect(() => {
        if (step !== APP_STEP.LANDING) return;
        const timer = setTimeout(() => setStep(APP_STEP.LOGIN_FORM), 5000);
        return () => clearTimeout(timer);
    }, [step]);

    const chatIsOpen = isMobile && (location.pathname.startsWith('/chat/') || location.pathname.startsWith('/group/'));

    const handleLoginSuccess = (mode) => {
        setTheme(mode === THEME.LIGHT ? THEME.LIGHT : THEME.DARK);
        setIsAuthenticated(true);
        setStep(APP_STEP.MAIN);
        navigate('/', { replace: true });
    };

    const handleLogout = () => {
        // chatLogout limpia el estado del chat (contactos, mensajes, conversaciones,
        // no leídos) + localStorage + token. Sin esto, el siguiente usuario que entre
        // en el mismo navegador veía los datos cacheados del usuario anterior.
        chatLogout();
        setIsAuthenticated(false);
        setStep(APP_STEP.LANDING);
        navigate('/', { replace: true });
    };

    // El link del email de recuperación abre /reset-password?token=... y debe
    // funcionar sin estar logueado, antes de cualquier paso del flujo normal.
    if (location.pathname === '/reset-password')
        return <ResetPassword onDone={() => { navigate('/', { replace: true }); setStep(APP_STEP.LOGIN_FORM); }} />;

    if (step === APP_STEP.LOADING)
        return <LoadingScreen onFinished={() => setStep(getToken() ? APP_STEP.MAIN : APP_STEP.LANDING)} />;

    if (step === APP_STEP.LANDING)
        return (
            <div className="qr-wrapper-clickable" onClick={() => setStep(APP_STEP.LOGIN_FORM)}>
                <WhatsAppLogin />
            </div>
        );

    if (step === APP_STEP.LOGIN_FORM && !isAuthenticated)
        return <Login onLogin={handleLoginSuccess} />;

    if (isAuthenticated)
        return (
            <div className="app-container">
                {(!isMobile || !chatIsOpen) && (
                    <Sidebar
                        onLogout={handleLogout}
                        onNewGroup={() => setIsNewGroupOpen(true)}
                    />
                )}

                <div className="main-content-area">
                    <Routes>
                        <Route
                            path="/"
                            element={<WelcomeScreen onOpenAddContact={() => setIsAddContactOpen(true)} />}
                        />
                        <Route
                            path="/chat/:id_usuario"
                            element={
                                <div className="chat-page-container">
                                    <ChatWindow isMobile={isMobile} onBack={() => navigate('/')} />
                                </div>
                            }
                        />
                        <Route
                            path="/group/:group_id"
                            element={
                                <div className="chat-page-container">
                                    <GroupChatWindow isMobile={isMobile} onBack={() => navigate('/')} />
                                </div>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>

                {isAddContactOpen && (
                    <div className="add-contact-aside">
                        <AddContactPanel onClose={() => setIsAddContactOpen(false)} />
                    </div>
                )}

                {isNewGroupOpen && (
                    <div className="add-contact-aside">
                        <NewGroupPanel onClose={() => setIsNewGroupOpen(false)} />
                    </div>
                )}
            </div>
        );

    return null;
}

function App() {
    return (
        <ThemeProvider>
            <ChatProvider>
                <AppContent />
            </ChatProvider>
        </ThemeProvider>
    );
}

export default App;
