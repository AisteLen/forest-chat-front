import React, {useRef, useState} from 'react';
import http from "../plugins/http";
import useStore from "../store/mainStore";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {

    const nameRef = useRef()
    const passRef = useRef()
    const nav = useNavigate()
    const [error, setError] = useState("")
    const {setUser, setToken} = useStore()

    const auth = async () => {
        setError("");
        const user = {
            username: nameRef.current.value.trim(),
            password: passRef.current.value.trim()
        }
        if (!user.username) {
            return setError("Username is required.");
        }
        if (user.username.length < 4 || user.username.length > 20) {
            return setError("Username must be between 4 and 20 characters.");
        }
        if (!user.password) {
            return setError("Password is required.");
        }
        if (user.password.length < 4 || user.password.length > 20) {
            return setError("Password must be between 4 and 20 characters.");
        }

        try {
            const res = await http.post("/login", user);
            if (!res.success) {
                return setError(res.message);
            }

            setUser(res.data.user);
            setToken(res.data.token);

            nav('/profile');
        } catch (error) {
            console.error("Login error", error);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="d-flex flex-column align-items-center p-4 bg-custom m-3 rounded-4 registration m-auto">
            <h1>Login</h1>
            <input
                type="text"
                ref={nameRef}
                placeholder="Username"
                className="form-control mb-3"
            />
            <input
                type="password"
                ref={passRef}
                placeholder="Password"
                className="form-control mb-3"
            />
            {error && <strong className="errorMessage">! {error}</strong>}

            <button onClick={auth} className="btn-custom btn-primary btn m-1 p-2">
                Login
            </button>
        </div>

    );
};

export default LoginPage;