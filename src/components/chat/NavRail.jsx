
import React from 'react';
import ChannelIcon from '../components/conmon/ChannelIcon.jsx';
import ChatIcon from '../components/conmon/ChatIcon.jsx';
import ComunityIcon from '../components/conmon/ComunityIcon.jsx';
import SettingsIcon from '../components/conmon/SettingsIcon.jsx';
import StatusIcon from '../components/conmon/StatusIcon.jsx';
import MultimediaIcon from '../components/conmon/MultimediaIcon.jsx';


const getColor = (isActive) =>
    isActive
        ? 'var(--wa-nav-icon-active)'
        : 'var(--wa-nav-icon-color)';

const NavRail = ({ activeNav, setActiveNav, userName }) => (
    <nav className="nav-rail">
        <div className="nav-top">

            <div
                className={`nav-icon${activeNav === 'chats' ? ' nav-icon--active' : ''}`}
                onClick={() => setActiveNav('chats')}
                title="Chats"
            >
                <ChatIcon color={getColor(activeNav === 'chats')} />
            </div>

            <div
                className={`nav-icon${activeNav === 'estados' ? ' nav-icon--active' : ''}`}
                onClick={() => setActiveNav('estados')}
                title="Estados"
            >
                <StatusIcon color={getColor(activeNav === 'estados')} />
            </div>

            <div
                className={`nav-icon${activeNav === 'canales' ? ' nav-icon--active' : ''}`}
                onClick={() => setActiveNav('canales')}
                title="Canales"
            >
                <ChannelIcon color={getColor(activeNav === 'canales')} />
            </div>

            <div
                className={`nav-icon${activeNav === 'comunidad' ? ' nav-icon--active' : ''}`}
                onClick={() => setActiveNav('comunidad')}
                title="Comunidades"
            >
                <ComunityIcon color={getColor(activeNav === 'comunidad')} />
            </div>

        </div>
        <div className="nav-bottom">

            <div
                className={`nav-icon${activeNav === 'multimedia' ? ' nav-icon--active' : ''}`}
                onClick={() => setActiveNav('multimedia')}
                title="Contenido multimedia"
            >
                <MultimediaIcon color={getColor(activeNav === 'multimedia')} />
            </div>

            <div
                className={`nav-icon${activeNav === 'ajustes' ? ' nav-icon--active' : ''}`}
                onClick={() => setActiveNav('ajustes')}
                title="Ajustes"
            >
                <SettingsIcon color={getColor(activeNav === 'ajustes')} />
            </div>

            {/* Avatar de usuario con inicial*/}
            <div
                className={`nav-icon${activeNav === 'perfil' ? ' nav-icon--active' : ''}`}
                onClick={() => setActiveNav('perfil')}
                title="Perfil"
            >
                <div className="nav-user-avatar">
                    {userName?.[0]?.toUpperCase() || '?'}
                </div>
            </div>

        </div>
    </nav>
);

export default NavRail;
