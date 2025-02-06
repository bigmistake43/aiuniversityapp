import React, { useState, useEffect, useRef } from 'react';
import TopNavbar from '../../components/topnavbar/TopNavbar.js';
import './LandingPage.css';
import Footer from '../../components/footer/Footer.js';
import axiosInstance from '../../services/authService.js';

const LandingPage = () => {
    const [text, setText] = useState('');
    const [fileName, setFileName] = useState('');
    const [messages, setMessages] = useState([]);
    const authTokens = JSON.parse(localStorage.getItem('authTokens')) || {};
    const messagesEndRef = useRef(null);

    const [showLoginPopup, setShowLoginPopup] = useState(false);


    const handleFileInputClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleFileChange = (event) => {
        const fileInput = event.target;
        const selectedFile = fileInput.files[0];
        setFileName(selectedFile ? selectedFile.name : 'No file selected');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendText();
        }
    };

    const handleSendText = async () => {
        if (!text.trim()) return;
        const newMessage = { text, isSentByUser: true };
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        try {
            const response = await axiosInstance.post('/send_text_before_login/', { message: text });
            const botMessage = { text: response.data.reply, isSentByUser: false };
            if (messages.length + 1 >= 3) {
                setShowLoginPopup(true);
            } else {
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            }
            setText('');

        } catch (error) {
            console.error('Error sending text:', error.response?.data || error.message);
        }
    };

    // Scroll to the bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            <TopNavbar showLoginPopup={showLoginPopup} setShowLoginPopup={setShowLoginPopup} />
            <div className="landingPage">
                <div className="landingPage-container">
                    {messages.length === 0 ? (
                        <div className="landingPage-heroSection">
                            <div style={{ fontSize: '48px', fontWeight: '900', lineHeight: '48px' }}>
                                Welcome to Your University Application Companion
                            </div>
                            <div
                                style={{
                                    fontSize: '48px',
                                    color: '#CBC0C0',
                                    fontWeight: '300',
                                    lineHeight: '48px',
                                    marginTop: '26px',
                                }}
                            >
                                Find your ideal university in seconds!
                            </div>
                            <div
                                style={{
                                    fontSize: '16px',
                                    fontWeight: '300',
                                    color: '#CBC0C0',
                                    lineHeight: '24px',
                                    marginTop: '42px',
                                }}
                            >
                                Discover, Compare, and Decide: The Advanced Platform to Help You Make Informed <br />
                                Decisions About Your University Applications
                            </div>
                        </div>
                    ) : (
                        <div className="landingPage-chatContainer">
                            <div className="messages">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`message ${message.isSentByUser ? 'sent' : 'received'}`}
                                    >
                                        {message.text}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                    )}

                    <div
                        className="fixed-input-bar"
                        style={{
                            transform: messages.length === 0 ? 'translate(-50%, 0px)' : 'translate(-50%, 150px)',
                            transition: 'transform 1s ease', // Adding the transition for smooth movement
                        }}
                    >
                        <div className="search-bar search-text-bar">
                            <div className='search-text'>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="search-input"
                                    placeholder="Find your dream university in secondes!"
                                />
                            </div> 
                            <svg className="sending-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="#E6A000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="search-bar search-file-bar">
                            <svg className="attaching-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleFileInputClick}>
                                <rect width="20" height="20" fill="#434343" />
                                <path
                                    d="M17.8666 9.20835L10.2082 16.8667C9.27005 17.8049 7.99757 18.332 6.67075 18.332C5.34393 18.332 4.07145 17.8049 3.13325 16.8667C2.19505 15.9285 1.66797 14.656 1.66797 13.3292C1.66797 12.0024 2.19505 10.7299 3.13325 9.79168L10.7916 2.13335C11.4171 1.50788 12.2654 1.15649 13.1499 1.15649C14.0345 1.15649 14.8828 1.50788 15.5082 2.13335C16.1337 2.75882 16.4851 3.60713 16.4851 4.49168C16.4851 5.37623 16.1337 6.22455 15.5082 6.85001L7.84158 14.5083C7.52885 14.8211 7.10469 14.9968 6.66242 14.9968C6.22014 14.9968 5.79598 14.8211 5.48325 14.5083C5.17051 14.1956 4.99482 13.7715 4.99482 13.3292C4.99482 12.8869 5.17051 12.4627 5.48325 12.15L12.5582 5.08335"
                                    stroke="#E6A000"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <input
                                type="file"
                                id="fileInput"
                                className="file-input"
                                multiple
                                hidden
                                accept="image/*, .pdf, .docx"
                                onChange={handleFileChange}
                            />
                            <div className="file-name-display">{fileName}</div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LandingPage;
