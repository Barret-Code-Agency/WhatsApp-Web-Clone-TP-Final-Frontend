import React, { useState } from 'react';
import { useChat } from "../context/ChatContext";
import "../styles/Login.css";

const Login = ({ onLogin }) => {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const { setUserName } = useChat();

    const handleLogin = (e) => {
        e.preventDefault();
        if (user.trim() !== '' && pass.trim() !== '') {
            setUserName(user.trim()); // ya persiste en localStorage internamente
            onLogin(isDarkMode ? 'dark' : 'light');
        }
    };

    return (
        <div className={`login-screen-wrapper ${isDarkMode ? 'login-dark' : 'login-light'}`}>
            <div className="login-card">
                <div className="login-intro">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="login-logo-small" />
                    <h2>Iniciar sesión</h2>
                    <p>Introduce tu nombre de usuario para comenzar.</p>
                </div>
                <form className="login-form-fields" onSubmit={handleLogin}>
                    <input
                        className="wa-input"
                        type="text"
                        placeholder="Nombre de usuario"
                        value={user}
                        onChange={e => setUser(e.target.value)}
                        required
                    />
                    <input
                        className="wa-input"
                        type="password"
                        placeholder="Contraseña"
                        value={pass}
                        onChange={e => setPass(e.target.value)}
                        required
                    />
                    <button type="submit" className="wa-button-primary">Entrar</button>
                </form>
            </div>

            <div className="dark-mode-container">
                <span className={`dark-mode-text ${!isDarkMode ? 'dark-mode-text--active' : ''}`}>Modo claro</span>
                <label className="wa-custom-switch">
                    <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={() => setIsDarkMode(v => !v)}
                    />
                    <span className="wa-custom-slider">
                        <span className="wa-circle"></span>
                    </span>
                </label>
                <span className={`dark-mode-text ${isDarkMode ? 'dark-mode-text--active' : ''}`}>Modo oscuro</span>
            </div>
        </div>
    );
};

export default Login;
