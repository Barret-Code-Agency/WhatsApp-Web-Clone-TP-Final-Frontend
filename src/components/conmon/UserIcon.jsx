import React from 'react';
import avatarDefault from '/images/avatar.avif';

const UserAvatarButton = ({ userPhotoUrl, onClick }) => {
    return (
        <button onClick={onClick} className="nav-icon-button">
            <img
                alt="User Profile"
                src={userPhotoUrl || avatarDefault}
                className="user-avatar-img"
            />
        </button>
    );
};
export default UserAvatarButton;