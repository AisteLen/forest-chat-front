import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from "../plugins/http";
import mainStore from "../store/mainStore";

const UserProfilePage = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [messageError, setMessageError] = useState("");
    const { user: loggedInUser, fetchConversationsCount, token } = mainStore();
    const maxMessageLength = 100;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await http.get(`/user/${username}`);
                if (res.error) {
                    setError(res.message);
                } else {
                    setUser(res.data);
                }
            } catch (err) {
                setError("An error occurred while fetching the user.");
            }
        };

        fetchUser();
    }, [username]);

    const handlecretaeConvo = async () => {
        if (!loggedInUser) {
            alert("You need to be logged in to send a message");
            return;
        }

        if (!message.trim()) {
            setMessageError("Message cannot be empty.");
            return;
        }
        setMessageError("");

        const data = {
            sender: loggedInUser.username,
            image: loggedInUser.image,
            message
        };

        try {
            const res = await http.postAuth(`/createOrUpdate/${username}`, data, token);

            if (res.error) {
                setError(res.message);
            } else {
                setMessage("");
                setMessageError("Message sent successfully!");
                fetchConversationsCount();
                navigate(`/chat/${res.data.conversationId}`);
            }
        } catch (error) {
            setError("An error occurred while sending the message.");
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-profile d-flex flex-column bg-custom rounded-4 p-5 m-3 text-center align-items-center">
            <h1>{username}</h1>
            <img src={user.image} alt={user.username} className="profile-image" />
            <div className="d-flex flex-column align-items-center">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    className="form-control mb-2 mt-3 custom-textarea"
                    maxLength={maxMessageLength}
                ></textarea>
                <div className="text-muted mb-2">
                    {message.length}/{maxMessageLength} characters
                </div>
                {messageError && <strong className="errorMessage">! {messageError}</strong>}
                <button className="btn-custom btn-primary btn m-1 p-2" onClick={handlecretaeConvo}>Send message</button>
            </div>
        </div>
    );
};

export default UserProfilePage;
