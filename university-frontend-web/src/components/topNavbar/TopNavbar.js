import './TopNavbar.css';
import logo from '../../assets/images/logo.png';
import React, { useContext } from 'react';
import { useState } from 'react';
import Login from '../login/Login';
import Signin from '../signin/Signin';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const TopNavbar = ({ showLoginPopup, setShowLoginPopup}) => {
    const navigate = useNavigate();
    const [showSigninPopup, setShowSigninPopup] = useState(false);
    const {user} = useContext(AuthContext);

    const handleLoginClick = () => {
        setShowLoginPopup(true);
    };

    const handleGetStartedClick = () => {
        setShowSigninPopup(true);
        setShowLoginPopup(false);
    }

    const closeLoginPopup = () => {
        setShowLoginPopup(false);
    };

    const closeSigninPopup = () => {
        setShowSigninPopup(false);
    };

    return (
        <>
            <div className="topNavbar">
                <button className='logo-button' onClick={() => { navigate('/') }}>
                    <div className='logo-div'>
                        <img src={logo} alt="Logo" className='logo-image' />
                    </div>
                </button>
                {!user && (
                    <div className='topNavbar-button-group'>
                        <button className='topNavbar-button login-button' onClick={handleLoginClick}>
                            Login
                        </button>
                        <button className='topNavbar-button getstarted-button' onClick={handleGetStartedClick}>
                            <p>Get Started</p>
                        </button>
                    </div>
                )}  
            </div>
            {showLoginPopup && (
                <div className="login-popup-overlay">
                    <div
                        className="login-popup-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='logo-div logo-center'>
                            <img src={logo} alt="Logo" className='logo-image' />
                        </div>
                        <button className="close-button" onClick={closeLoginPopup}>
                            &times;
                        </button>
                        <Login
                            setShowSigninPopup={setShowSigninPopup}
                            setShowLoginPopup={setShowLoginPopup}
                        />
                    </div>
                </div>
            )}
            {!showLoginPopup && showSigninPopup && (
                <div className="login-popup-overlay">
                    <div
                        className="login-popup-content"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
                    >
                        <button className="close-button" onClick={closeSigninPopup}>
                            &times;
                        </button>
                        <Signin
                            setShowSigninPopup={setShowSigninPopup}
                            setShowLoginPopup={setShowLoginPopup}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default TopNavbar;