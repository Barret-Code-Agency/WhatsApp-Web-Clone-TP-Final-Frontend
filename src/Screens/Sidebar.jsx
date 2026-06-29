import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useChat } from '../context/ChatContext';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { MessageSquarePlus, EllipsisVertical, Search, X } from 'lucide-react';
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
import ProfilePanel from '../components/chat/ProfilePanel.jsx';

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
const ContactItem = ({ name, lastMessage, time, avatar, isActive }) => (
    <div className={`contact-item ${isActive ? 'contact-item--active' : ''}`}>
        <img src={avatar} alt={name} className="contact-avatar" />
        <div className="contact-info">
            <div className="contact-header">
                <span className="contact-name">{name}</span>
                <span className="contact-time">{time}</span>
            </div>
            <div className="contact-footer">
                <span className="contact-message">{lastMessage}</span>
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
    const { currentUser } = useChat();
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
                        <img src={currentUser?.avatar_url || '/images/avatar.avif'} alt="Mi perfil"></img>
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
                Haz que sea fácil encontrar a las personas y los grupos más importantes en CracksApp.
            </p>
        </div>
    </div>
);

const NuevoTipoPanel = ({ onClose, onNewGroup }) => (
    <div className="filter-panel animate-slide-in">
        <PanelHeader title="Nuevos elementos" onClose={onClose} />
        <div className="nuevo-tipo-list">
            {NUEVO_TIPO_OPCIONES.map((item, i) => (
                <div key={i} className="nuevo-tipo-item"
                    onClick={item.label === 'Nuevo grupo' ? onNewGroup : undefined}>
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
        <div className="filter-panel-empty sidebar-multimedia-empty">
            <div className="filter-panel-icon">
                <MultimediaIcon color="var(--wa-icon-lighter)" size={200} />
            </div>
            <h3 className="sidebar-multimedia-title">
                No hay archivos multimedia
            </h3>
            <p className="filter-panel-sub sidebar-multimedia-sub">
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

const NuevoChatPanel = ({ onClose }) => {
    const { contacts } = useChat();
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState('');

    const abrirChat = (id) => {
        navigate(`/chat/${id}`);
        onClose();
    };

    const filtrados = contacts.filter(c =>
        (c.name || '').toLowerCase().includes(busqueda.trim().toLowerCase())
    );

    return (
        <div className="side-full-panel animate-slide-in">
            <PanelHeader title="Nuevo chat" onClose={onClose} />
            <div className="canales-search">
                <Search size={16} color="var(--wa-text-secondary)" />
                <input
                    type="text"
                    placeholder="Buscar contacto"
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                />
            </div>
            {filtrados.map(c => (
                <div
                    key={c.id_usuario}
                    className="contact-item sidebar-nuevochat-item"
                    onClick={() => abrirChat(c.id_usuario)}
                    style={{ cursor: 'pointer' }}
                >
                    <img src={c.avatar_url} alt={c.name} className="contact-avatar sidebar-nuevochat-avatar" />
                    <div className="contact-info sidebar-nuevochat-info">
                        <span className="contact-name">{c.name}</span>
                        <span className="contact-message">{c.estado_bio}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

const MenuTresPuntos = ({ onClose, onLogout }) => (
    <div className="tres-puntos-menu">
        {MENU_TRES_PUNTOS_ITEMS.map((op, i) => (
            <div key={i} className="tres-puntos-item" onClick={() => {
                onClose();
                if (op === 'Cerrar sesión') onLogout();
            }}>{op}</div>
        ))}
    </div>
);


// ── BottomNav: reemplaza al NavRail en mobile-------------
const BottomNav = ({ activeNav, setActiveNav }) => {
    const { currentUser } = useChat();
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
                            <img src={currentUser?.avatar_url || '/images/avatar.avif'} alt="Perfil"></img>
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
const Sidebar = ({ onLogout, onNewGroup }) => {
    const location = useLocation();
    const activeId = (location.pathname.match(/\/(?:chat|group)\/(.+)/) || [])[1] || null;
    const { contacts, groups } = useChat();

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

    // En el filtro "Grupos" no se listan contactos individuales; en el resto, todos.
    const filteredContacts = useMemo(
        () => (activeFilter === 'Grupos' ? [] : contacts),
        [activeFilter, contacts]
    );

    const closePanel = () => setActiveNav('chats');

    if (activeNav !== 'chats') {
        const panelMap = {
            estados: <StatusScreen />,
            canales: <CanalesPanel onClose={closePanel} />,
            comunidad: <ComunidadesPanel onClose={closePanel} />,
            multimedia: <MultimediaPanel onClose={closePanel} />,
            ajustes: <AjustesPanel onClose={closePanel} onLogout={onLogout} />,
            perfil: <ProfilePanel onClose={closePanel} />,
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
                {activeFilter === 'Plus' && <NuevoTipoPanel onClose={() => setActiveFilter('Todos')} onNewGroup={onNewGroup} />}
                {showNuevoChatPanel && <NuevoChatPanel onClose={() => setShowNuevoChatPanel(false)} />}

                {activeFilter !== 'Favoritos' && activeFilter !== 'Plus' && !showNuevoChatPanel && (
                    <>
                        <header className="chats-header">
                            <h1>CracksApp</h1>
                            <div className="header-actions">
                                <div className="header-action-btn"
                                    onClick={() => setShowNuevoChatPanel(true)}
                                    title="Nuevo chat">
                                    <MessageSquarePlus size={20} color="var(--wa-text-secondary)" />
                                </div>
                                <div className="header-action-btn sidebar-menu-anchor"
                                    ref={menuRef}
                                    title="Menú">
                                    <div onClick={() => setShowMenuTresPuntos(v => !v)}>
                                        <EllipsisVertical size={20} color="var(--wa-text-secondary)" />
                                    </div>
                                    {showMenuTresPuntos && <MenuTresPuntos onClose={() => setShowMenuTresPuntos(false)} onLogout={onLogout} />}
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
                            {['Todos', 'Favoritos', 'Grupos'].map(f => (
                                <button key={f}
                                    className={`chip ${activeFilter === f ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(f)}>
                                    {f}
                                </button>
                            ))}
                            <button className="chip-plus" onClick={() => setActiveFilter('Plus')}>+</button>
                        </div>

                        <div className="contacts-list">
                            {groups.map(g => (
                                <Link key={g.group_id}
                                    to={`/group/${g.group_id}`}
                                    className="contact-link">
                                    <ContactItem
                                        name={g.name}
                                        lastMessage={g.description || 'Grupo'}
                                        time=""
                                        avatar={g.avatar_url || '/images/default-avatar.jpg'}
                                        isActive={String(activeId) === String(g.group_id)}
                                    />
                                </Link>
                            ))}
                            {filteredContacts.map(contact => (
                                <Link key={contact.id_usuario}
                                    to={`/chat/${contact.id_usuario}`}
                                    className="contact-link">
                                    <ContactItem
                                        name={contact.name}
                                        lastMessage={contact.estado_bio}
                                        time={contact.conection === 'En línea' ? 'En línea' : 'Ayer'}
                                        avatar={contact.avatar_url}
                                        isActive={String(activeId) === String(contact.id_usuario)}
                                    />
                                </Link>
                            ))}
                            {groups.length === 0 && filteredContacts.length === 0 && (
                                <div className="no-results"><p>No hay chats</p></div>
                            )}
                        </div>

                        <footer className="sidebar-footer">
                            <div className="footer-content">
                                <div className="footer-icon-container">
                                    <div className="wa-mini-logo">
                                        <img src="/images/cracks-logo.svg" alt="CracksApp" />
                                    </div>
                                </div>
                                <div className="footer-text">
                                    <p className="footer-title">Obtener CracksApp para Windows</p>
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
