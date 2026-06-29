import React, { useState } from 'react';
import { useChat } from "../context/ChatContext";
import { register as registerUser, login as loginUser } from "../services/authService";
import { AUTH_MODE, THEME } from "../constants/ui.js";
import TurnstileWidget from "../components/TurnstileWidget.jsx";
import ENVIRONMENT from "../config/environment.js";
import "../styles/Login.css";

const Login = ({ onLogin }) => {
    const [mode, setMode] = useState(AUTH_MODE.LOGIN);
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [loading, setLoading] = useState(false);
    const [devVerifyUrl, setDevVerifyUrl] = useState('');
    const [attempts, setAttempts] = useState(null); // { limit, remaining } del rate limit del backend
    const [captchaToken, setCaptchaToken] = useState(''); // token de Turnstile (CAPTCHA del registro)
    const [isDarkMode, setIsDarkMode] = useState(true);
    const { setCurrentUser } = useChat();

    const switchMode = (next) => {
        setMode(next);
        setError('');
        setInfo('');
        setAttempts(null);
        setCaptchaToken('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { user } = await loginUser({ email: email.trim(), password: pass });
            setCurrentUser(user);
            onLogin(isDarkMode ? THEME.DARK : THEME.LIGHT);
        } catch (err) {
            setError(err.message);
            if (err.rateLimit) setAttempts(err.rateLimit);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (ENVIRONMENT.TURNSTILE_SITE_KEY && !captchaToken) {
            setError('Completá la verificación anti-robot.');
            return;
        }
        setLoading(true);
        try {
            const data = await registerUser({
                email: email.trim(),
                password: pass,
                display_name: displayName.trim(),
                captcha_token: captchaToken
            });
            // En modo desarrollo el backend devuelve el link de verificacion
            if (data?.verification_url) {
                setDevVerifyUrl(data.verification_url);
            }
            setMode(AUTH_MODE.VERIFY);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDevVerify = async () => {
        setError('');
        setLoading(true);
        try {
            const res = await fetch(devVerifyUrl);
            if (!res.ok) throw new Error('No se pudo verificar la cuenta');
            setDevVerifyUrl('');
            setPass('');
            setMode(AUTH_MODE.LOGIN);
            setInfo('Cuenta verificada. Ya podés iniciar sesión.');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderBody = () => {
        if (mode === AUTH_MODE.VERIFY) {
            return (
                <div className="login-form-fields">
                    <p className="login-center">
                        Te enviamos un correo para verificar tu cuenta.
                    </p>
                    {devVerifyUrl ? (
                        <>
                            <p className="login-hint">
                                (Modo desarrollo: verificá con un click)
                            </p>
                            <button
                                type="button"
                                className="wa-button-primary"
                                onClick={handleDevVerify}
                                disabled={loading}
                            >
                                {loading ? 'Verificando...' : 'Verificar mi cuenta'}
                            </button>
                        </>
                    ) : (
                        <p className="login-hint">
                            Verificá el correo y volvé para iniciar sesión.
                        </p>
                    )}
                    {error && <p className="login-error">{error}</p>}
                    <button type="button" className="login-switch" onClick={() => switchMode(AUTH_MODE.LOGIN)}>
                        Volver a iniciar sesión
                    </button>
                </div>
            );
        }

        const isRegister = mode === AUTH_MODE.REGISTER;
        return (
            <form className="login-form-fields" onSubmit={isRegister ? handleRegister : handleLogin}>
                {isRegister && (
                    <input
                        className="wa-input"
                        type="text"
                        placeholder="Nombre"
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        required
                    />
                )}
                <input
                    className="wa-input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
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
                {isRegister && <TurnstileWidget onVerify={setCaptchaToken} />}

                <button type="submit" className="wa-button-primary" disabled={loading}>
                    {loading ? 'Procesando...' : (isRegister ? 'Crear cuenta' : 'Entrar')}
                </button>

                {error && <p className="login-error">{error}</p>}
                {info && <p className="login-info">{info}</p>}
                {!isRegister && attempts && (
                    <p className={`login-attempts ${attempts.remaining === 0 ? 'login-attempts--blocked' : ''}`}>
                        Intento {Math.min(attempts.limit - attempts.remaining, attempts.limit)} de {attempts.limit}
                    </p>
                )}

                <button
                    type="button"
                    className="login-switch"
                    onClick={() => switchMode(isRegister ? AUTH_MODE.LOGIN : AUTH_MODE.REGISTER)}
                >
                    {isRegister ? '¿Ya tenés cuenta? Iniciar sesión' : '¿No tenés cuenta? Crear una'}
                </button>
            </form>
        );
    };

    return (
        <main className={`login-screen-wrapper ${isDarkMode ? 'login-dark' : 'login-light'}`}>
            <div className="login-card">
                <div className="login-intro">
                    <img src="/images/cracks-logo.svg" alt="CracksApp" className="login-logo-small" />
                    <h2>{mode === AUTH_MODE.REGISTER ? 'Crear cuenta' : mode === AUTH_MODE.VERIFY ? 'Verificá tu cuenta' : 'Iniciar sesión'}</h2>
                    <p>
                        {mode === AUTH_MODE.REGISTER
                            ? 'Registrate para empezar a chatear.'
                            : mode === AUTH_MODE.VERIFY
                                ? 'Último paso antes de entrar.'
                                : 'Ingresá con tu email y contraseña.'}
                    </p>
                </div>

                {renderBody()}
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
        </main>
    );
};

export default Login;
