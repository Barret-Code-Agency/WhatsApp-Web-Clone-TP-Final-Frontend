import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import LoadingScreen from './Screens/LoadingScreen.jsx';
import Sidebar from './Screens/Sidebar.jsx';
import WelcomeScreen from './Screens/WelcomeScreen.jsx';
import AddContactPanel from './components/chat/AddContactPanel.jsx';
import WhatsAppLogin from './Screens/WhatsAppLogin.jsx';
import ChatWindow from './components/chat/ChatWindow.jsx';
import Login from './Screens/Login.jsx';

import './styles/variables.css';
import './styles/index.css';
import './styles/App.css';
import './styles/ContactScreen.css';
import './styles/Login.css';
import './styles/Sidebar.css';
import './styles/StatusScreen.css';
import './styles/WelcomeScreen.css';
import './styles/WhatsAppLogin.css';


const STEPS = {
    LOADING: 'loading',
    WHATSAPP: 'whatsapp',
    LOGIN_FORM: 'login-form',
    MAIN: 'main',
};

function AppContent() {
    const [step, setStep] = useState(STEPS.LOADING);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAddContactOpen, setIsAddContactOpen] = useState(false);
    const { setTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth <= 767);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    const chatIsOpen = isMobile && location.pathname.startsWith('/chat/');

    const handleLoginSuccess = (mode) => {
        setTheme(mode === 'light' ? 'light' : 'dark');
        setIsAuthenticated(true);
        setStep(STEPS.MAIN);
        navigate('/', { replace: true });
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setStep(STEPS.WHATSAPP);
        navigate('/', { replace: true });
    };

    if (step === STEPS.LOADING)
        return <LoadingScreen onFinished={() => setStep(STEPS.WHATSAPP)} />;

    if (step === STEPS.WHATSAPP)
        return (
            <div onClick={() => setStep(STEPS.LOGIN_FORM)} style={{ cursor: 'pointer' }}>
                <WhatsAppLogin />
            </div>
        );

    if (step === STEPS.LOGIN_FORM && !isAuthenticated)
        return <Login onLogin={handleLoginSuccess} />;

    if (isAuthenticated)
        return (
            <div className="app-container">
                {(!isMobile || !chatIsOpen) && (
                    <Sidebar
                        onAddContactClick={() => setIsAddContactOpen(true)}
                        onLogout={handleLogout}
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
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>

                {isAddContactOpen && (
                    <div className="add-contact-aside">
                        <AddContactPanel onClose={() => setIsAddContactOpen(false)} />
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
