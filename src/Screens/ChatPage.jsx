import React from 'react';
import ChatWindow from '../components/chat/ChatWindow';
import "../styles/ChatPage.css";

const ChatPage = ({ isMobile, onBack }) => {
    return (
        <div className="chat-page-container">
            <ChatWindow isMobile={isMobile} onBack={onBack} />
        </div>
    );
};

export default ChatPage;
