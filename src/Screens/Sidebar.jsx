import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useChat } from '../context/ChatContext';
import { useLocation, Link } from 'react-router-dom';
import { MessageSquarePlus, EllipsisVertical, Search, X } from 'lucide-react';
import { contactsData } from '../data/contactsData.jsx';
import { CANALES } from '../data/canalesData';
import ChannelIcon from '../components/conmon/ChannelIcon.jsx';
import ChatIcon from '../components/conmon/ChatIcon.jsx';
import ComunityIcon from '../components/conmon/ComunityIcon.jsx';
import SettingsIcon from '../components/conmon/SettingsIcon.jsx';
import StatusIcon from '../components/conmon/StatusIcon.jsx';
import MultimediaIcon from '../components/conmon/MultimediaIcon.jsx';
import ThemePanel from '../features/theme/ThemePanel.jsx';
import BackupPanel from '../features/backup/BackupPanel.jsx';
import FavoritesIllustration from '../components/conmon/FavoritesIlustration.jsx';
import StatusScreen from './StatusScreen.jsx';

import '../styles/Sidebar.css';

// ── Helpers ────────────────
const ic = (active) => active ? 'var(--wa-nav-icon-active)' : 'var(--wa-nav-icon-color)';

// ── Datos estáticos fuera del render ────────
const NUEVO_TIPO_OPCIONES = [
    { icon: '👥', label: 'Nuevo grupo' },
    { icon: '📢', label: 'Nueva difusión' },
    { icon: '🔒', label: 'Nuevo chat cifrado' },
    { icon: '📋', label: 'Nuevo grupo de encuesta' },
];

const AJUSTES_OPCIONES = [
    { icon: '🔔', label: 'Notificaciones' },
    { icon: '🔒', label: 'Privacidad' },
    { icon: '🔐', label: 'Seguridad' },
    { icon: '🎨', label: <ThemePanel /> },
    { icon: '💬', label: 'Chats' },
    { icon: '📦', label: <BackupPanel /> },
    { icon: '🌐', label: 'Idioma' },
    { icon: '❓', label: 'Ayuda' },
    { icon: '🚪', label: 'Cerrar sesión' },
];

const MENU_TRES_PUNTOS_ITEMS = [
    'Nuevo grupo',
    'Nueva difusión',
    'Dispositivos vinculados',
    'Contactos destacados',
    'Ajustes',
    'Cerrar sesión',
];

// ── Subcomponentes ─────────────
const ContactItem = ({ name, lastMessage, time, unreadCount, avatar, isActive }) => (
    <div className={`contact-item ${isActive ? 'contact-item--active' : ''}`}>
        <img src={avatar} alt={name} className="contact-avatar" />
        <div className="contact-info">
            <div className="contact-header">
                <span className="contact-name">{name}</span>
                <span className={`contact-time ${unreadCount > 0 ? 'contact-time--unread' : ''}`}>{time}</span>
            </div>
            <div className="contact-footer">
                <span className="contact-message">{lastMessage}</span>
                {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
            </div>
        </div>
    </div>
);

const PanelHeader = ({ title, onClose }) => (
    <div className="filter-panel-header">
        <button className="close-btn" onClick={onClose}><X size={20} /></button>
        <h2>{title}</h2>
    </div>
);

const NavRail = ({ activeNav, setActiveNav }) => {
    const navItems = [
        { key: 'chats', Icon: ChatIcon, title: 'Chats' },
        { key: 'estados', Icon: StatusIcon, title: 'Estados' },
        { key: 'canales', Icon: ChannelIcon, title: 'Canales' },
        { key: 'comunidad', Icon: ComunityIcon, title: 'Comunidades' },
    ];
    const navBottom = [
        { key: 'multimedia', Icon: MultimediaIcon, title: 'Contenido multimedia' },
        { key: 'ajustes', Icon: SettingsIcon, title: 'Ajustes' },
    ];
    return (
        <nav className="nav-rail">
            <div className="nav-top">
                {navItems.map(({ key, Icon, title }) => (
                    <div key={key}
                        className={`nav-icon${activeNav === key ? ' nav-icon--active' : ''}`}
                        onClick={() => setActiveNav(key)}
                        title={title}>
                        <Icon color={ic(activeNav === key)} />
                    </div>
                ))}
            </div>
            <div className="nav-bottom">
                {navBottom.map(({ key, Icon, title }) => (
                    <div key={key}
                        className={`nav-icon${activeNav === key ? ' nav-icon--active' : ''}`}
                        onClick={() => setActiveNav(key)}
                        title={title}>
                        <Icon color={ic(activeNav === key)} />
                    </div>
                ))}
                <div
                    className={`nav-icon${activeNav === 'perfil' ? ' nav-icon--active' : ''}`}
                    onClick={() => setActiveNav('perfil')}
                    title="Perfil">
                    <div className="nav-user-avatar1">
                        <img src="/images/avatar.avif" alt="User Profile"></img>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const FavoritosPanel = ({ onClose }) => (
    <div className="filter-panel animate-slide-in">
        <PanelHeader title="Favoritos" onClose={onClose} />
        <div className="filter-panel-empty">
            <div className="filter-panel-icon"><FavoritesIllustration width={180} /></div>
            <p>Añade chats a Favoritos</p>
            <p className="filter-panel-sub">
                Haz que sea fácil encontrar a las personas y los grupos más importantes en WhatsApp.
            </p>
        </div>
    </div>
);

const NuevoTipoPanel = ({ onClose }) => (
    <div className="filter-panel animate-slide-in">
        <PanelHeader title="Nuevos elementos" onClose={onClose} />
        <div className="nuevo-tipo-list">
            {NUEVO_TIPO_OPCIONES.map((item, i) => (
                <div key={i} className="nuevo-tipo-item">
                    <span className="nuevo-tipo-icon">{item.icon}</span>
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    </div>
);

const CanalesPanel = ({ onClose }) => {
    const [following, setFollowing] = useState([]);
    const toggle = (id) =>
        setFollowing(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    return (
        <div className="side-full-panel animate-slide-in">
            <PanelHeader title="Canales" onClose={onClose} />
            <div className="canales-search">
                <Search size={16} color="var(--wa-text-secondary)" />
                <input type="text" placeholder="Buscar canales" />
            </div>
            <p className="canales-subtitle">Seguir canales</p>
            {CANALES.map(c => (
                <div key={c.id} className="canal-item">
                    <img className="canal-avatar" src={c.avatar} alt={c.name}
                        onError={e => { e.target.src = '/images/default-avatar.jpg'; }} />
                    <div className="canal-info">
                        <span className="canal-name">{c.name}</span>
                        <span className="canal-followers">{c.followers} seguidores</span>
                    </div>
                    <button
                        className={`canal-follow-btn${following.includes(c.id) ? ' canal-follow-btn--on' : ''}`}
                        onClick={() => toggle(c.id)}>
                        {following.includes(c.id) ? 'Siguiendo' : 'Seguir'}
                    </button>
                </div>
            ))}
        </div>
    );
};

const ComunidadesPanel = ({ onClose }) => (
    <div className="side-full-panel animate-slide-in">
        <PanelHeader title="Comunidades" onClose={onClose} />
        <div className="comunidades-hero">
            <div className="comunidades-icon" />
            <h3>Crea una comunidad para mantenerte en contacto</h3>
            <p>Las comunidades reúnen a los miembros en grupos por temas y facilitan la recepción de avisos de los administradores.</p>
            <button className="comunidades-btn">Iniciar tu comunidad</button>
        </div>
    </div>
);

const MultimediaPanel = ({ onClose }) => (
    <div className="side-full-panel animate-slide-in">
        <PanelHeader title="Multimedia" onClose={onClose} />
        <div className="filter-panel-empty" style={{ marginTop: '80px' }}>
            <div className="filter-panel-icon">
                <MultimediaIcon color="var(--wa-icon-lighter)" size={200} />
            </div>
            <h3 style={{ color: 'var(--wa-text-primary)', marginTop: '20px' }}>
                No hay archivos multimedia
            </h3>
            <p className="filter-panel-sub" style={{ padding: '0 40px', textAlign: 'center' }}>
                Los archivos fotos, videos y documentos que compartas en tus chats aparecerán aquí.
            </p>
        </div>
    </div>
);

const AjustesPanel = ({ onClose, onLogout }) => (
    <div className="side-full-panel animate-slide-in">
        <PanelHeader title="Ajustes" onClose={onClose} />
        {AJUSTES_OPCIONES.map((o, i) => (
            <div key={i} className="ajuste-item"
                onClick={o.label === 'Cerrar sesión' ? onLogout : undefined}>
                <span className="ajuste-icon">{o.icon}</span>
                <span className="ajuste-label">{o.label}</span>
                <span className="ajuste-arrow">›</span>
            </div>
        ))}
    </div>
);

const PerfilPanel = ({ onClose, userName }) => (
    <div className="side-full-panel animate-slide-in">
        <PanelHeader title="Perfil" onClose={onClose} />
        <div className="perfil-hero">
            <div className="perfil-avatar-big">
                <img src="/images/avatar.avif" alt="Mi perfil" />
            </div>
            <div className="perfil-field">
                <label>Nombre</label>
                <input type="text" defaultValue={userName || 'Usuario'} />
            </div>
            <div className="perfil-field">
                <label>Info</label>
                <input type="text" defaultValue="¡Hola! Estoy usando WhatsApp." />
            </div>
            <div className="perfil-field">
                <label>Teléfono</label>
                <input type="text" defaultValue="+54 9 11 0000-0000" disabled />
            </div>
        </div>
    </div>
);

const NuevoChatPanel = ({ onClose }) => (
    <div className="side-full-panel animate-slide-in">
        <PanelHeader title="Nuevo chat" onClose={onClose} />
        <div className="canales-search">
            <Search size={16} color="var(--wa-text-secondary)" />
            <input type="text" placeholder="Buscar contacto" />
        </div>
        {contactsData.slice(0, 15).map(c => (
            <div key={c.id_usuario} className="contact-item" style={{ padding: '0 12px' }}>
                <img src={c.evatar_url} alt={c.name} className="contact-avatar" style={{ marginLeft: 0 }} />
                <div className="contact-info" style={{ padding: '0 12px' }}>
                    <span className="contact-name">{c.name}</span>
                    <span className="contact-message">{c.estado_bio}</span>
                </div>
            </div>
        ))}
    </div>
);

const MenuTresPuntos = ({ onClose }) => (
    <div className="tres-puntos-menu">
        {MENU_TRES_PUNTOS_ITEMS.map((op, i) => (
            <div key={i} className="tres-puntos-item" onClick={onClose}>{op}</div>
        ))}
    </div>
);


// ── BottomNav: reemplaza al NavRail en mobile-------------
const BottomNav = ({ activeNav, setActiveNav }) => {
    const allItems = [
        { key: 'chats', Icon: ChatIcon, title: 'Chats' },
        { key: 'estados', Icon: StatusIcon, title: 'Estados' },
        { key: 'canales', Icon: ChannelIcon, title: 'Canales' },
        { key: 'comunidad', Icon: ComunityIcon, title: 'Comunidades' },
        { key: 'multimedia', Icon: MultimediaIcon, title: 'Multimedia' },
        { key: 'ajustes', Icon: SettingsIcon, title: 'Ajustes' },
        { key: 'perfil', Icon: null, title: 'Perfil' },
    ];
    return (
        <div className="bottom-nav">
            {allItems.map(({ key, Icon, title }) => (
                <div
                    key={key}
                    className={`nav-icon${activeNav === key ? ' nav-icon--active' : ''}`}
                    onClick={() => setActiveNav(key)}
                    title={title}
                >
                    {Icon
                        ? <Icon color={ic(activeNav === key)} />
                        : <div className="nav-user-avatar2">
                            <img src="/images/avatar.avif" alt="Perfil"></img>
                        </div>
                    }
                </div>
            ))}
        </div>
    );
};

// ════════════════════════════════════════════════════════════════════════════
//  SIDEBAR PRINCIPAL
// ════════════════════════════════════════════════════════════════════════════
const Sidebar = ({ onAddContactClick, onLogout }) => {
    const location = useLocation();
    const activeId = location.pathname.split('/chat/')[1] || null;
    const { unreadCounts, userName } = useChat();

    const [activeFilter, setActiveFilter] = useState('Todos');
    const [activeNav, setActiveNav] = useState('chats');
    const [showMenuTresPuntos, setShowMenuTresPuntos] = useState(false);
    const [showNuevoChatPanel, setShowNuevoChatPanel] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target))
                setShowMenuTresPuntos(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filteredContacts = useMemo(() => {
        const list = activeFilter === 'No leídos'
            ? contactsData.filter(c => (unreadCounts?.[c.id_usuario] || 0) > 0)
            : contactsData;

        return [...list].sort(
            (a, b) => (unreadCounts?.[b.id_usuario] || 0) - (unreadCounts?.[a.id_usuario] || 0)
        );

    }, [activeFilter]);

    const closePanel = () => setActiveNav('chats');

    if (activeNav !== 'chats') {
        const panelMap = {
            estados: <StatusScreen />,
            canales: <CanalesPanel onClose={closePanel} />,
            comunidad: <ComunidadesPanel onClose={closePanel} />,
            multimedia: <MultimediaPanel onClose={closePanel} />,
            ajustes: <AjustesPanel onClose={closePanel} onLogout={onLogout} />,
            perfil: <PerfilPanel onClose={closePanel} userName={userName} />,
        };
        return (
            <aside className="sidebar-root">
                <NavRail activeNav={activeNav} setActiveNav={setActiveNav} />
                <div className="chats-container">{panelMap[activeNav]}</div>
                <BottomNav activeNav={activeNav} setActiveNav={setActiveNav} />
            </aside>
        );
    }

    return (
        <aside className="sidebar-root">
            <NavRail activeNav={activeNav} setActiveNav={setActiveNav} />

            <div className="chats-container">
                {activeFilter === 'Favoritos' && <FavoritosPanel onClose={() => setActiveFilter('Todos')} />}
                {activeFilter === 'Plus' && <NuevoTipoPanel onClose={() => setActiveFilter('Todos')} />}
                {showNuevoChatPanel && <NuevoChatPanel onClose={() => setShowNuevoChatPanel(false)} />}

                {activeFilter !== 'Favoritos' && activeFilter !== 'Plus' && !showNuevoChatPanel && (
                    <>
                        <header className="chats-header">
                            <h1>WhatsApp</h1>
                            <div className="header-actions">
                                <div className="header-action-btn"
                                    onClick={() => setShowNuevoChatPanel(true)}
                                    title="Nuevo chat">
                                    <MessageSquarePlus size={20} color="var(--wa-text-secondary)" />
                                </div>
                                <div className="header-action-btn"
                                    style={{ position: 'relative' }}
                                    ref={menuRef}
                                    title="Menú">
                                    <div onClick={() => setShowMenuTresPuntos(v => !v)}>
                                        <EllipsisVertical size={20} color="var(--wa-text-secondary)" />
                                    </div>
                                    {showMenuTresPuntos && <MenuTresPuntos onClose={() => setShowMenuTresPuntos(false)} />}
                                </div>
                            </div>
                        </header>

                        <div className="search-box-container">
                            <div className="search-bar">
                                <Search size={16} color="var(--wa-text-secondary)" />
                                <input type="text" placeholder="Busca un chat o inicia uno nuevo" />
                            </div>
                        </div>

                        <div className="filter-chips">
                            {['Todos', 'No leídos', 'Favoritos', 'Grupos'].map(f => (
                                <button key={f}
                                    className={`chip ${activeFilter === f ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(f)}>
                                    {f}
                                </button>
                            ))}
                            <button className="chip-plus" onClick={() => setActiveFilter('Plus')}>+</button>
                        </div>

                        <div className="contacts-list">
                            {filteredContacts.length === 0 ? (
                                <div className="no-results"><p>No hay chats no leídos</p></div>
                            ) : (
                                filteredContacts.map(contact => (
                                    <Link key={contact.id_usuario}
                                        to={`/chat/${contact.id_usuario}`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <ContactItem
                                            name={contact.name}
                                            lastMessage={contact.estado_bio}
                                            time={contact.conection === 'En línea' ? 'En línea' : 'Ayer'}
                                            unreadCount={unreadCounts?.[contact.id_usuario] || 0}
                                            avatar={contact.evatar_url}
                                            isActive={String(activeId) === String(contact.id_usuario)}
                                        />
                                    </Link>
                                ))
                            )}
                        </div>

                        <footer className="sidebar-footer">
                            <div className="footer-content">
                                <div className="footer-icon-container">
                                    <div className="wa-mini-logo">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA Logo" />
                                    </div>
                                </div>
                                <div className="footer-text">
                                    <p className="footer-title">Obtener WhatsApp para Windows</p>
                                </div>
                            </div>
                        </footer>
                    </>
                )}
            </div>
            <BottomNav activeNav={activeNav} setActiveNav={setActiveNav} />
        </aside>
    );
};

export default Sidebar;
