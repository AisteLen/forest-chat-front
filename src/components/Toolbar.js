import React, {useState, useEffect} from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import useStore from "../store/mainStore";

const Toolbar = () => {
    const {user, logout, conversationsCount, fetchConversationsCount} = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [activePath, setActivePath] = useState(location.pathname)

    useEffect(() => {
        if (user) {
            fetchConversationsCount();

            const intervalId = setInterval(() => {
                fetchConversationsCount(); // Poll for conversation count every X seconds
            }, 1000); // Polling interval

            return () => clearInterval(intervalId);
        }
    }, [user, fetchConversationsCount]);

    useEffect(() => {
        setActivePath(location.pathname);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getLinkClass = (path) => {
        return activePath === path ? 'nav-link active' : 'nav-link';
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light toolbar bg-custom rounded-4 p-2 m-3">
            <div className="container-fluid">
                <img className="d-none d-md-block"
                     src="https://png.pngtree.com/png-vector/20231214/ourmid/pngtree-tree-isolated-on-white-background-png-image_11310355.png"
                     height="100" alt="logo"/>

                {user && (<button className="navbar-toggler m-2" type="button" data-bs-toggle="collapse"
                                  data-bs-target="#navbarNav"
                                  aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>)}

                {!user && (<div className="navbar-nav loginRegister">
                        <div className="nav-item item-padding">
                            <Link className={getLinkClass('/login')} to="/login">
                                Login
                            </Link>
                        </div>
                        <div className="nav-item item-padding">
                            <Link className={getLinkClass('/register')} to="/register">
                                Register
                            </Link>
                        </div>
                    </div>
                )}

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav m-2">
                        <li className="nav-item">
                            {user && (
                                <Link className={getLinkClass('/profile')} to="/profile">
                                    Profile
                                </Link>
                            )}
                        </li>
                        <li className="nav-item">
                            {user && (
                                <Link className={getLinkClass('/allUsers')} to="/allUsers">
                                    All Users
                                </Link>
                            )}
                        </li>
                        <li className="nav-item">
                            {user && (
                                <Link className={getLinkClass('/conversations')} to="/conversations">
                                    Conversations ({conversationsCount})
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
                {user && <div className="d-flex ms-auto align-items-end">
                    <span className="m-1 d-none d-sm-flex ">Logged in as: {user.username}</span>
                    <button className="btn m-1 btn-primary p-2" onClick={handleLogout}>Logout</button>
                </div>
                }
            </div>
        </nav>
    );
};

export default Toolbar;
