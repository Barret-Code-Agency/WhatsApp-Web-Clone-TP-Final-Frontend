import React from 'react';

const ArchiveIcon = ({ isActive, onClick, color = "var(--wa-icons)" }) => (
    <button
        onClick={onClick}
        className={`nav-icon-button ${isActive ? 'is-active' : ''}`}
    >
        <svg viewBox="0 0 24 24" height="24" width="24">
            <path
                fill={isActive ? "var(--wa-green)" : color}
            />
        </svg>
    </button>
);
export default ArchiveIcon;