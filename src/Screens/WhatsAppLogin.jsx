import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Download, Monitor, MoreVertical, Settings, ChevronRight } from 'lucide-react';
import '../styles/WhatsAppLogin.css';

const WhatsAppLogin = () => {
    return (
        <div className="login-container">

            <header className="login-header">
                <div className="logo-wrapper">
                    <img src="/images/cracks-logo.svg" alt="CracksApp" height="34" width="34" />
                    <span className="brand-wordmark">CracksApp</span>
                </div>
            </header>

            <main className="main-content">
                <section className="download-banner">
                    <div className="banner-left">
                        <div className="device-illustration">
                            <Monitor size={48} color="#00a884" strokeWidth={1.5} />
                        </div>
                        <div className="banner-text">
                            <h3>Descargá CracksApp para Windows</h3>
                            <p>Descargá la aplicación para Windows y disfrutá de una experiencia más rápida.</p>
                        </div>
                    </div>
                    <button className="btn-download-pill" type="button">
                        Descargar <Download size={14} />
                    </button>
                </section>

                <section className="log-card">
                    <div className="card-inner">
                        <div className="instructions-side">
                            <h2>Pasos para iniciar sesión</h2>
                            <ol className="steps-list">
                                <li className="step-item">
                                    <span className="step-num">1</span>
                                    <div className="step-text-container">
                                        Abrí CracksApp
                                        <span className="wa-square-icon-wrapper">
                                            <img src="/images/cracks-logo.svg" alt="CracksApp" height="22" width="22" />
                                        </span>
                                        en tu teléfono.
                                    </div>
                                </li>
                                <li className="step-item">
                                    <span className="step-num">2</span>
                                    <div className="step-text-container">
                                        En Android, tocá Menú
                                        <span className="wa-icon-box"><MoreVertical size={16} /></span>
                                        . En iPhone, tocá Ajustes
                                        <span className="wa-icon-box"><Settings size={16} /></span>
                                        .
                                    </div>
                                </li>
                                <li>
                                    <span className="step-num">3</span>
                                    <span>Tocá Dispositivos vinculados y, luego, Vincular dispositivo.</span>
                                </li>
                                <li>
                                    <span className="step-num">4</span>
                                    <span>Escaneá el código QR para confirmar.</span>
                                </li>
                            </ol>
                            <ul className="link-phone">
                                <a href="#" className="green-link">¿Necesitás ayuda? ↗</a>
                            </ul>

                            <div className="session-keeper">
                                <label className="custom-checkbox">
                                    <input type="checkbox" defaultChecked />
                                    Mantener la sesión iniciada en este navegador
                                </label>
                            </div>
                        </div>

                        <div className="qr-side">
                            <div className="qr-frame" style={{ position: 'relative' }}>
                                <img src="/images/qr-code.png" alt="Código QR" />
                                <img
                                    src="/images/cracks-logo.svg"
                                    alt=""
                                    style={{ position: 'absolute', top: '50%', left: '50%', width: '22%', height: '22%', transform: 'translate(-50%, -50%)', borderRadius: '6px' }}
                                />
                            </div>
                            <div className="link-phone">
                                <a href="#">
                                    Iniciar sesión con número de teléfono
                                    <span className="chevron-icon"><ChevronRight size={14} /></span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="login-footer">
                    <p>¿No tenés cuenta de CracksApp? <Link to="#" className="green-link">Primeros pasos ↗</Link></p>
                    <div className="security-note">
                        <Lock size={12} strokeWidth={3} />
                        <span>Tus mensajes personales están cifrados de extremo a extremo.</span>
                    </div>
                    <p className="legal-text">Condiciones y Política de privacidad</p>
                </footer>
            </main>
        </div>
    );
};

export default WhatsAppLogin;
