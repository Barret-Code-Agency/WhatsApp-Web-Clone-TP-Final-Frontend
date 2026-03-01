import React, { useState, useRef, useEffect } from 'react';
import { contactsData } from "../data/contactsData.jsx";
import "../styles/StatusScreen.css";

const VIDEO_IDS = ['001', '022', '049', '002', '003', '046', '005'];

const STATUS_VIDEOS = {
    '001': 'https://www.youtube.com/embed/7qlpNqXIhWM?autoplay=1&rel=0&enablejsapi=1',
    '022': 'https://www.youtube.com/embed/3nbjhpcZ9_g?autoplay=1&rel=0&enablejsapi=1',
    '049': 'https://www.youtube.com/embed/5HBpHE_LiGk?autoplay=1&rel=0&enablejsapi=1',
    '002': 'https://www.youtube.com/embed/dRHuMRspeI0?autoplay=1&rel=0&enablejsapi=1',
    '003': 'https://www.youtube.com/embed/3FhtXFoRz48?autoplay=1&rel=0&enablejsapi=1',
    '046': 'https://www.youtube.com/embed/7kKGDNiOBQY?autoplay=1&rel=0&enablejsapi=1',
    '005': 'https://www.youtube.com/embed/iw4DaGBx3ts?autoplay=1&rel=0&enablejsapi=1',
};

const StatusOverlay = ({ contact, onClose }) => {
    const [progress, setProgress] = useState(0);
    const timerRef = useRef(null);
    const startTime = useRef(Date.now());
    const duration = 30000;

    useEffect(() => {
        startTime.current = Date.now();
        timerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime.current;
            const pct = Math.min((elapsed / duration) * 100, 100);
            setProgress(pct);
            if (pct >= 100) { clearInterval(timerRef.current); onClose(); }
        }, 100);
        return () => clearInterval(timerRef.current);
    }, []);

    return (
        <div className="status-overlay" onClick={onClose}>
            <div className="status-overlay-inner" onClick={e => e.stopPropagation()}>
                <div className="status-progress-bar">
                    <div className="status-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="status-overlay-header">
                    <img src={contact.evatar_url} alt={contact.name} className="status-overlay-avatar" />
                    <span className="status-overlay-name">{contact.name}</span>
                    <span className="status-overlay-time">Hace 5 min</span>
                    <button className="status-close-btn" onClick={onClose}>✕</button>
                </div>
                <iframe
                    className="status-video"
                    src={STATUS_VIDEOS[contact.id_usuario]}
                    title={contact.name}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                />
            </div>
        </div>
    );
};

const StatusItem = ({ contact, time, viewed, onClick }) => (
    <div className="status-item" onClick={onClick}>
        <div className="status-avatar-wrapper">
            <div className={`status-ring ${viewed ? 'viewed' : ''}`}>
                <img src={contact.evatar_url} alt={contact.name} className="status-img" />
            </div>
        </div>
        <div className="status-info">
            <span className="status-name">{contact.name}</span>
            <span className="status-time">{time}</span>
        </div>
        {!viewed && <span className="status-has-video">▶</span>}
    </div>
);

const StatusScreen = () => {
    const [activeContact, setActiveContact] = useState(null);
    const [vistosIds, setVistosIds] = useState([]);

    const recientes = VIDEO_IDS
        .map(id => contactsData.find(c => c.id_usuario === id))
        .filter(Boolean);

    const vistosExtra = contactsData
        .filter(c => !VIDEO_IDS.includes(c.id_usuario))
        .slice(0, 4);

    const handleOpen = (contact) => {
        setActiveContact(contact);
        setVistosIds(prev => [...new Set([...prev, contact.id_usuario])]);
    };

    const handleClose = () => {
        setActiveContact(null);
    };

    return (
        <div className="status-screen-container">

            <div className="status-item">
                <div className="status-avatar-wrapper">
                    <img src="/images/avatar.avif" className="status-img" alt="Yo"
                        style={{ width: 52, height: 52 }} />
                    <div className="status-add-icon">+</div>
                </div>
                <div className="status-info">
                    <div className="status-name">Mi estado</div>
                    <div className="status-time">Añadir una actualización</div>
                </div>
            </div>

            {recientes.filter(c => !vistosIds.includes(c.id_usuario)).length > 0 && (
                <>
                    <div className="status-section-header">Recientes</div>
                    {recientes
                        .filter(c => !vistosIds.includes(c.id_usuario))
                        .map(c => (
                            <StatusItem
                                key={c.id_usuario}
                                contact={c}
                                time="Hace 5 min"
                                viewed={false}
                                onClick={() => handleOpen(c)}
                            />
                        ))
                    }
                </>
            )}

            <div className="status-section-header viewed">Vistos</div>
            {recientes
                .filter(c => vistosIds.includes(c.id_usuario))
                .map(c => (
                    <StatusItem
                        key={c.id_usuario}
                        contact={c}
                        time="Hace 5 min"
                        viewed={true}
                        onClick={() => handleOpen(c)}
                    />
                ))
            }
            {vistosExtra.map(c => (
                <StatusItem
                    key={c.id_usuario}
                    contact={c}
                    time="Ayer"
                    viewed={true}
                    onClick={() => { }}
                />
            ))}

            {activeContact && (
                <StatusOverlay
                    contact={activeContact}
                    onClose={handleClose}
                />
            )}
        </div>
    );
};

export default StatusScreen;
