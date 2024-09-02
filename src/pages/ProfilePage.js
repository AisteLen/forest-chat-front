import React, { useRef, useState, useEffect} from 'react';
import mainStore from "../store/mainStore";
import http from "../plugins/http";
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const {user, setUser, token} = mainStore();
    const imageRef = useRef();
    const [errorImg, setErrorImg] = useState("");
    const usernameRef = useRef();
    const [errorUsername, setErrorUsername] = useState("");
    const currentPassRef = useRef();
    const newPassRef = useRef();
    const [errorPassValidate, setErrorPassValidate] = useState("");
    const [errorPass, setErrorPass] = useState("");
    const [isNewPassVisible, setIsNewPassVisible] = useState(false);
    const navigate = useNavigate();


    const updatePicture = async () => {
        const newImage = imageRef.current.value.trim();
        if (!newImage) {
            setErrorImg("Image URL cannot be empty.");
            return;
        }

        const data = {
            userId: user.id,
            newImage: newImage,
        };

        const res = await http.postAuth("/updateImage", data, token);

        if (res.error) {
            setErrorImg(res.message);
        } else {
            imageRef.current.value = "";
            setErrorImg("");
            setUser(res.data);
        }
    };

    const updateUsername = async () => {
        const newUsername = usernameRef.current.value.trim();
        if (!newUsername) {
            setErrorUsername("Username cannot be empty.");
            return;
        }

        const data = {
            userId: user.id,
            username: newUsername,
        };

        const res = await http.postAuth("/updateUsername", data, token);

        if (res.error) {
            setErrorUsername(res.message);
        } else {
            setErrorUsername("Username changed successfully");
            usernameRef.current.value = "";
            setUser(res.data);
        }
    };

    const validateCurrentPassword = async () => {

        const currentPassword = currentPassRef.current.value.trim();
        if (!currentPassword) {
            setErrorPassValidate("Current password cannot be empty.");
            return;
        }

        const data = {
            userId: user.id,
            currentPass: currentPassword,
        };

        const res = await http.postAuth("/validatePassword", data, token);

        if (!res.success) {
            return setErrorPassValidate(res.message);
        }
        setErrorPassValidate("");
        setIsNewPassVisible(true);
    };

    const updatePass = async () => {
        const newPass = newPassRef.current.value.trim();
        const currentPass = currentPassRef.current.value.trim();

        if (!currentPass) {
            return setErrorPass("Current password is required.");
        }

        if (!newPass) {
            return setErrorPass("New password is required.");
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*_+])[A-Za-z\d!@#$%^&*_+]{4,20}$/;
        if (!passwordRegex.test(newPass)) {
            return setErrorPass(
                "Password must be between 4 and 20 characters, include at least one uppercase letter, and one special symbol (!@#$%^&*_+)."
            );
        }

        if (newPass === currentPass) {
            return setErrorPass("New password cannot be the same as the current password.");
        }

        const data = {
            userId: user.id,
            newPass,
        };

        try {
            const res = await http.postAuth("/updatePass", data, token);

            if (res.error) {
                return setErrorPass(res.message);
            }

            setErrorPass("");
            setErrorPassValidate("Password updated successfully.");
            currentPassRef.current.value = "";
            newPassRef.current.value = "";
            setIsNewPassVisible(false);
        } catch (error) {
            setErrorPass("An error occurred while updating the password.");
        }

    };

    useEffect(() => {
        if (!user) {
            navigate('/'); // Redirect to home if user is not defined
        }
    }, [user, navigate]);

    if (!user) {
        return null; // Render nothing or a loading state until user is defined
    }

    return (
        <div className="profile p-5 bg-custom rounded-4 p-5 m-3 d-flex flex-column align-items-center">
            <h1 className="mb-4">Your Profile:</h1>
            <div className="d-md-flex align-items-center">
                <div className="m-4">
                    <img className="profile-image" src={user.image} alt="user"/>
                </div>
                <div>
                    <h5>Change image:</h5>
                    <input type="text" ref={imageRef} placeholder="Image URL" className="form-control mb-3"/>
                    <div>
                        {errorImg && <strong className="errorMessage">!  {errorImg}</strong>}
                    </div>
                    <button className="btn-custom btn-primary btn m-1 p-2" onClick={updatePicture}>Change</button>

                    <h5>Change username ({user.username}):</h5>
                    <input type="text" ref={usernameRef} placeholder="New username" className="form-control mb-3"/>
                    <div>
                        {errorUsername && <strong className="errorMessage">! {errorUsername}</strong>}
                    </div>
                    <button className="btn-custom btn-primary btn m-1 p-2" onClick={updateUsername}>Change</button>


                    <h5>Change password:</h5>
                    <input type="password" ref={currentPassRef} placeholder="Current password"
                           className="form-control mb-3"/>
                    <div>
                        {errorPassValidate && <strong className="errorMessage">! {errorPassValidate}</strong>}
                    </div>
                    <button className="btn-custom btn-primary btn m-1 p-2" onClick={validateCurrentPassword}>Change
                    </button>


                    {isNewPassVisible && (
                        <>
                            <input type="password" ref={newPassRef} placeholder="Enter new password"
                                   className="form-control mb-3 mt-3"/>
                                {errorPass && <div className="errorMessage">! {errorPass}</div>}
                            <button className="btn-custom btn-primary btn m-1 p-2" onClick={updatePass}>Confirm</button>

                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
