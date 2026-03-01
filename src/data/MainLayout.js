import React, { useState } from 'react';
import Sidebar from '../Screens/Sidebar';
import UserAvatarButton from '../data/UserIcon.jsx';
import ChatIcon from '../data/ChatIcons.jsx';
import StatusIcon from '../data/StatusIcon.jsx';
import ChannelsIcon from '../data/ChannelIcon.jsx';
import CommunityIcon from '../data/ComunityIcon.jsx';
import ArchiveIcon from '../data/ArchiveIcon.jsx';
import SettingsIcon from '../data/SettingsIcon.jsx';
import '../styles/App.css';
import StatusScreen from '../Screens/StatusScreen';
import ProfileScreen from '../Screens/ProfileScreen';

const TOP_TABS = [
    { key: 'chats', Icon: ChatIcon },
    { key: 'status', Icon: StatusIcon },
    { key: 'channels', Icon: ChannelsIcon },
    { key: 'community', Icon: CommunityIcon },
];

const BOTTOM_TABS = [
    { key: 'archive', Icon: ArchiveIcon },
    { key: 'settings', Icon: SettingsIcon },
];

const renderContent = (activeTab) => {
    switch (activeTab) {
        case 'status': return <StatusScreen />;
        case 'profile': return <ProfileScreen />;
        default: return <Sidebar />;
    }
};

const MainLayout = () => {
    const [activeTab, setActiveTab] = useState('chats');

    return (
        <div className="main-layout-container">
            <nav className="side-navigation">

                <div className="nav-top-icons">
                    {TOP_TABS.map(({ key, Icon }) => (
                        <Icon
                            key={key}
                            isActive={activeTab === key}
                            onClick={() => setActiveTab(key)}
                        />
                    ))}
                </div>

                <div className="nav-bottom-icons">
                    {BOTTOM_TABS.map(({ key, Icon }) => (
                        <Icon
                            key={key}
                            isActive={activeTab === key}
                            onClick={() => setActiveTab(key)}
                        />
                    ))}


                    <div className="user-avatar-wrapper">
                        <UserAvatarButton
                            onClick={() => setActiveTab('profile')}
                        />
                    </div>
                </div>

            </nav>

            <main className="main-content-area">
                {renderContent(activeTab)}
            </main>
        </div>
    );
};

export default MainLayout;
