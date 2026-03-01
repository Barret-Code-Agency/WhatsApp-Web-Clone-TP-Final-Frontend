import React from 'react';
import { Lock, FileText, UserPlus } from 'lucide-react';
import "../styles/WelcomeScreen.css";

function WelcomeScreen({ onOpenAddContact }) {
    return (
        <div className="welcome-container">
            <div className="welcome-content">

                <div className="welcome-main-card">
                    <div className="welcome-icon-wrapper">
                        <div className="welcome-main-image" />
                    </div>

                    <h2 className="welcome-title">Descarga WhatsApp para Windows</h2>

                    <p className="welcome-description">
                        Obtén funciones adicionales, como llamadas y videollamadas, compartir pantalla y más..
                    </p>

                    <button
                        className="welcome-download-button"
                        onClick={() => window.open("https://get.microsoft.com/installer/download/9NKSQGP7F2NH?cid=website_cta_psi", "_blank")}
                    >
                        Descargar
                    </button>
                </div>

                <div className="welcome-quick-actions">
                    <div className="quick-action-item">
                        <div className="quick-action-card">
                            <FileText size={24} color="#aebac1" />
                        </div>
                        <span className="quick-action-label">Enviar documento</span>
                    </div>

                    <div className="quick-action-item" onClick={onOpenAddContact}>
                        <div className="quick-action-card">
                            <UserPlus size={24} color="#aebac1" />
                        </div>
                        <span className="quick-action-label">Añadir contacto</span>
                    </div>
                </div>
            </div>

            <footer className="welcome-footer">
                <Lock size={12} color="#8696a0" />
                <span>Tus mensajes personales están cifrados de extremo a extremo.</span>
            </footer>
        </div>
    );
}

export default WelcomeScreen;