import React from 'react';
import { Link } from 'react-router-dom';

const SingleUser = ({user, isCurrentUser}) => {

    return (
        <div className="user-card bg-custom rounded-4">
            <Link
                to={isCurrentUser ? "/profile" : `/user/${user.username}`}
                style={{ textDecoration: 'none' }}
            >
                <img src={user.image} alt={user.username} className="profile-image-2"/>
                <div className="username-text">{isCurrentUser ? "You" : user.username}</div>
            </Link>
        </div>
    );
};

export default SingleUser;
