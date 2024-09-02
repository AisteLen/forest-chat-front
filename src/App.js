import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import React from 'react';

import Toolbar from './components/Toolbar';
import IndexPage from "./pages/IndexPage.js";
import LoginPage from "./pages/LoginPage.js";
import RegisterPage from "./pages/RegisterPage.js";
import ProfilePage from "./pages/ProfilePage.js";
import AllUsersPage from "./pages/AllUsersPage";
import UserProfilePage from "./pages/UserProfilePage";
import ConversationsPage from "./pages/ConversationsPage.js";
import ChatPage from "./pages/ChatPage";

function App() {
    return (
        <div className="container">

            <BrowserRouter>
                <Toolbar/>

                    <Routes>
                        <Route path="/" element={<IndexPage/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/register" element={<RegisterPage/>}/>
                        <Route path="/profile" element={<ProfilePage/>}/>
                        <Route path="/allUsers" element={<AllUsersPage/>}/>
                        <Route path="/user/:username" element={<UserProfilePage/>}/>
                        <Route path="/conversations" element={<ConversationsPage/>}/>
                        <Route path="/chat/:conversationId" element={<ChatPage/>}/>

                    </Routes>

            </BrowserRouter>
        </div>
    );
}

export default App;
