import React, {useRef, useState} from 'react';
import http from "../plugins/http";
import {useNavigate} from "react-router-dom";

const RegisterPage = () => {

    const nameRef = useRef()
    const pass1Ref = useRef()
    const pass2Ref = useRef()
    const nav = useNavigate()
    const [error, setError] = useState("")

    const auth = async () => {
        setError("");

        const username = nameRef.current.value.trim();
        const password1 = pass1Ref.current.value.trim();
        const password2 = pass2Ref.current.value.trim();

        if (!username) {
            return setError("Username is required.");
        }
        if (username.length < 4 || username.length > 20) {
            return setError("Username must be between 4 and 20 characters.");
        }
        if (!password1 || !password2) {
            return setError("Both password fields are required.");
        }
        if (password1.length < 4 || password1.length > 20) {
            return setError("Password must be between 4 and 20 characters.");
        }
        if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*_+])[A-Za-z\d!@#$%^&*_+]{4,20}$/.test(password1)) {
            return setError("Password must include at least one uppercase letter and one special symbol (!@#$%^&*_+).");
        }
        if (password1 !== password2) {
            return setError("Passwords do not match.");
        }

        const user = {
            username,
            pass1: password1,
            pass2: password2
        };
        try {
            const res = await http.post("/register", user);

            if (!res.success) {
                return setError(res.message);
            } else {
                nav('/login');
            }

        } catch (error) {
            console.error('Registration error:', error);
            setError('An unexpected error occurred. Please try again.');
        }
    }

    return (
        <div className="d-flex flex-column align-items-center p-4 bg-custom m-3 rounded-4 registration m-auto">
            <h1>Registration form</h1>
            <input
                type="text"
                ref={nameRef}
                placeholder="Username"
                className="form-control mb-3"
            />
            <input
                type="password"
                ref={pass1Ref}
                placeholder="Password"
                className="form-control mb-3"
            />
            <input
                type="password"
                ref={pass2Ref}
                placeholder="Confirm Password"
                className="form-control mb-3"
            />
            {error && <strong className="errorMessage">! {error}</strong>}

            <button onClick={auth} className="btn-custom btn-primary btn m-1 p-2">
                Register
            </button>
        </div>

    );
};

export default RegisterPage;