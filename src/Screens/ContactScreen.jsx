import React from 'react';
import { X } from 'lucide-react';
import "../styles/ContactScreen.css";

const ContactScreen = ({ contact, onClose }) => {
    if (!contact) return null;

    return (
        <div className="contact-info-panel animate-slide-in">
            <header className="info-header">
                <button onClick={onClose} className="close-info-btn"><X size={24} /></button>
                <span>Info. del contacto</span>
            </header>
            
            <div className="info-scroll-content">
                <div className="info-profile-section">
                    <img src={contact.image} alt={contact.name} className="info-avatar-big" />
                    <h2>{contact.name}</h2>
                    <p>{contact.conection}</p>
                </div>

                <div className="info-section-card">
                    <label>Info. y número de teléfono</label>
                    <div className="info-bio">{contact.estado_bio}</div>
                </div>
            </div>
        </div>
    );
};

export default ContactScreen;