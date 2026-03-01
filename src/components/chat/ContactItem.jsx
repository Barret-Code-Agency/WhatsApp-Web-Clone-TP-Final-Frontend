import React from 'react';
import './ContactItem.css';

const ContactItem = ({ name, lastMessage, time, unreadCount }) => {
    return (
        <div className="contact-item">
            <div className="contact-avatar">
                {name.charAt(0)}
            </div>
            <div className="contact-info">
                <div className="contact-header-row">
                    <span className="contact-name">{name}</span>
                    <span className="contact-time">{time}</span>
                </div>
                <div className="contact-message-row">
                    <span className="contact-last-message">{lastMessage}</span>
                    {unreadCount > 0 && (
                        <span className="unread-badge">{unreadCount}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactItem;