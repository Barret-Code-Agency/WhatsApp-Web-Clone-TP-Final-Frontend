
import React from 'react';

const NavIconButton = ({ onClick, isActive, children }) => (
    <button
        onClick={onClick}
        className={`nav-icon-button${isActive ? ' is-active' : ''}`}
    >
        {children}
    </button>
);

export default NavIconButton;
