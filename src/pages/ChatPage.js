import React, {useEffect, useState, useRef} from 'react';
import {useParams} from 'react-router-dom';
import http from "../plugins/http";
import mainStore from "../store/mainStore";
import 'react-perfect-scrollbar/dist/css/styles.css';

const ChatPage = () => {
    const {conversationId} = useParams();
    const [conversation, setConversation] = useState(null);
    const {user: loggedInUser, fetchConversationsCount, token} = mainStore();
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const maxMessageLength = 500;
    const [messageError, setMessageError] = useState("");
    const [conversationDeleted, setConversationDeleted] = useState(false);
    const chatMessagesRef = useRef(null);

    useEffect(() => {

        const fetchConversation = async () => {

            try {
                const res = await http.get(`/chat/${conversationId}`);
                if (res.error || !res.data) {
                    if (res.status === 404) {
                        setError("Conversation not found. It might have been deleted.");
                    } else {
                        setError("Failed to load conversation.");
                    }
                    setConversationDeleted(true);
                } else {
                    setConversation(res.data);
                }
            } catch (err) {
                setError("Failed to load conversation.");
            } finally {
                setLoading(false);
            }
        };

        if (!conversationDeleted) {
            fetchConversation();
            fetchConversationsCount();
        }

    }, [conversationId, fetchConversationsCount, conversationDeleted])

    useEffect(() => {
        // Scroll to the bottom when the conversation or messages change
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [conversation]);

    const handleSendMessage = async () => {
        if (conversationDeleted) return;

        if (!newMessage.trim()) {
            setMessageError("Message cannot be empty.");
            return;
        }
        if (newMessage.length > maxMessageLength) {
            setMessageError(`Message cannot exceed ${maxMessageLength} characters.`);
            return;
        }

        setMessageError("");

        const username = conversation.participants.find(p => p !== loggedInUser.username);

        const data = {
            sender: loggedInUser.username,
            image: loggedInUser.image,
            message: newMessage.trim(),
        };

        try {
            const checkRes = await http.get(`/chat/${conversationId}`);
            if (checkRes.error || !checkRes.data) {
                setConversationDeleted(true);
                setError("This conversation has been deleted.");
                return;
            }

            const res = await http.postAuth(`/createOrUpdate/${username}`, data, token);

            if (res.error) {
                alert(res.message);
            } else {
                setConversation(prev => ({
                    ...prev,
                    messages: [...prev.messages, {
                        sender: loggedInUser.username,
                        senderImage: loggedInUser.image,
                        content: newMessage.trim(),
                        timestamp: new Date().toISOString(),
                        likes: []
                    }]
                }));
                setNewMessage("");
            }
        } catch (error) {
            alert("Failed to send message.");
        }
    };

    const handleLikeMessage = async (messageId) => {
        if (conversationDeleted) return;

        try {
            // Check if the conversation still exists before attempting to like the message
            const checkRes = await http.get(`/chat/${conversationId}`);
            if (checkRes.error || !checkRes.data) {
                setConversationDeleted(true);
                setError("This conversation has been deleted.");
                return; // Prevent further execution if the conversation is deleted
            }

            const res = await http.postAuth(`/addLike`, {
                conversationId,
                messageId,
                username: loggedInUser.username
            }, token);

            if (res.error) {
                setError(res.message);
            } else {
                setConversation(prev => ({
                    ...prev,
                    messages: prev.messages.map(msg =>
                        msg._id === messageId ? { ...msg, likes: res.data.likes } : msg
                    )
                }));
            }
        } catch (error) {
            setError("Failed to like message.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <h5 className="errorMessage bg-custom rounded-4 p-5 m-3">! {error}</h5>;
    }

    if (!conversation) {
        return <div className="errorMessage bg-custom rounded-4 p-5 m-3">Conversation not found</div>;
    }

    return (
        <div className="d-flex flex-column bg-custom rounded-4 p-5 m-3 text-center align-items-center chat-card">
            <h1>Chat with {conversation.participants.filter(p => p !== loggedInUser.username).join(", ")}</h1>
            <div className="chat-messages px-md-5"  ref={chatMessagesRef}>
                {conversation.messages.map((msg, index) => {

                    // Format the timestamp to Lithuanian format
                    const formattedTimestamp = new Intl.DateTimeFormat('lt-LT', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    }).format(new Date(msg.timestamp));

                    return (
                        <div key={index}
                             className={`message ${msg.sender === loggedInUser.username ? 'sent' : 'received'}`}>
                            <img src={msg.senderImage} alt={msg.sender} className="profile-image-3"/>
                            <div className="text-card">
                                <p><strong>{msg.sender === loggedInUser.username ? "You": `${msg.sender}`}:</strong> {msg.content}</p>
                                <small>{formattedTimestamp}</small>
                            </div>
                            <div className="btn-like">
                                {msg.sender !== loggedInUser.username && !msg.likes.includes(loggedInUser.username) && (
                                    <button onClick={() => handleLikeMessage(msg._id)} className="add-like">👍
                                        <span className="tooltip-text">Like message</span>
                                    </button>
                                )}
                                {msg.sender !== loggedInUser.username && msg.likes.includes(loggedInUser.username) && (
                                    <button className="btn-thumb d-none">👍</button>
                                )}
                                <div className="btn-thumb">{msg.likes.length < 1 ? "" : "👍"}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="send-message">
            <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="form-control mb-3 custom-textarea"
                maxLength={maxMessageLength}
            ></textarea>
                <div className="text-muted mb-2">
                    {newMessage.length}/{maxMessageLength} characters
                </div>
                {messageError && <div className="errorMessage">! {messageError}</div>}
                <button className="btn-custom btn-primary btn m-1 p-2" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatPage;
