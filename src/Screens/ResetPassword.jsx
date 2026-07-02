import React, { useState } from 'react';
import { resetPassword } from '../services/authService';
import '../styles/Login.css';

// Pantalla que abre el link del email (/reset-password?token=...). Es standalone
// (no requiere estar logueado): lee el token del query y fija la nueva contraseña.
const ResetPassword = ({ onDone }) => {
    const token = new URLSearchParams(window.location.search).get('token') || '';
    const [pass, setPass] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        if (pass !== confirm) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        setLoading(true);
        try {
            await resetPassword({ token, password: pass });
            setDone(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-screen-wrapper login-dark">
            <div className="login-card">
                <div className="login-intro">
                    <img src="/images/cracks-logo.svg" alt="CracksApp" className="login-logo-small" />
                    <h2>Nueva contraseña</h2>
                    <p>{done ? 'Listo, ya podés iniciar sesión.' : 'Elegí tu nueva contraseña.'}</p>
                </div>

                {!token ? (
                    <div className="login-form-fields">
                        <p className="login-error">El enlace no es válido o está incompleto.</p>
                        <button type="button" className="login-switch" onClick={onDone}>Volver al inicio</button>
                    </div>
                ) : done ? (
                    <div className="login-form-fields">
                        <p className="login-info">Tu contraseña se actualizó correctamente.</p>
                        <button type="button" className="wa-button-primary" onClick={onDone}>Ir a iniciar sesión</button>
                    </div>
                ) : (
                    <form className="login-form-fields" onSubmit={submit}>
                        <input
                            className="wa-input"
                            type="password"
                            placeholder="Nueva contraseña"
                            value={pass}
                            onChange={e => setPass(e.target.value)}
                            required
                        />
                        <input
                            className="wa-input"
                            type="password"
                            placeholder="Repetí la contraseña"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            required
                        />
                        <button type="submit" className="wa-button-primary" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar contraseña'}
                        </button>
                        {error && <p className="login-error">{error}</p>}
                    </form>
                )}
            </div>
        </main>
    );
};

export default ResetPassword;
