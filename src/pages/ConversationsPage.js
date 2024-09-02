import React, {useState, useEffect} from 'react';
import mainStore from "../store/mainStore";
import {useNavigate} from "react-router-dom";
import http from "../plugins/http"

const ConversationsPage = () => {
    const {user, setUser, fetchConversationsCount, token, logout} = mainStore();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            logout()
            navigate('/');
            return;
        }

        const fetchConversations = async () => {

            try {
                const res = await http.get(`/conversations/${user.username}`);
                if (res.error) {
                    setError(res.message);
                } else {
                    setConversations(res.conversations);

                    setUser({
                        ...user,
                        conversations: res.conversations,
                    });
                }
            } catch (err) {
                setError("Failed to fetch conversations.");
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [user, setUser, navigate, logout]);


    const handleGoToChat = (conversationId) => {
        navigate(`/chat/${conversationId}`);
    };

    const handleDeleteChat = async (conversationId) => {
        if (window.confirm("Are you sure you want to delete this chat?")) {
            try {
                const res = await http.postAuth(`/deleteConversation/${conversationId}`, {}, token);
                if (res.error) {
                    setError(res.message);
                } else {
                    const updatedConversations = conversations.filter(conv => conv.conversationId !== conversationId);
                    setConversations(updatedConversations);
                    setUser({
                        ...user,
                        conversations: updatedConversations,
                    });
                    fetchConversationsCount();
                }
            } catch (err) {
                setError("Failed to delete the conversation.");
            }
        }
    };

    if (!user) {
        return <div>Please log in to view your conversations.</div>;
    }
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="d-flex flex-column bg-custom rounded-4 p-5 m-3 text-center align-items-center ">
            <h1>Your Conversations</h1>
            {conversations.length === 0 ? (
                <p>No conversations yet.</p>
            ) : (
                <div className="conversation-list d-flex flex-wrap align-items-center justify-content-center">
                    {conversations.map((conv, index) => (
                        <div key={conv._id}
                             className="conversation-card d-flex flex-column justify-content-between align-items-center">
                            <h5>Conversation
                                with: {conv.participants.filter(name => name !== user.username).join(", ")}</h5>
                            <div className="d-flex flex-column">
                                <button className="btn-custom btn-primary btn m-1 p-2"
                                        onClick={() => handleGoToChat(conv.conversationId)}>Go to chat
                                </button>
                                <button className="btn-custom btn-danger btn m-1 p-2"
                                        onClick={() => handleDeleteChat(conv.conversationId)}>Delete Chat
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConversationsPage;

