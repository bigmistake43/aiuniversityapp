import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';
import NotFoundPageLogo from '../../assets/images/notfoundlogo.png';

const NotFoundPage = () => {
    return (
        <>
            <div className="not-found-container">
                <img src={NotFoundPageLogo} />
                <p className='notfound-big-text'>"Oops! The page you're looking for couldn't be found."</p>
                <p className='notfound-small-text'>Let's get you back on track</p>
                <Link to="/" className="home-link">Go Home</Link>
            </div>
        </>
    );
};

export default NotFoundPage;