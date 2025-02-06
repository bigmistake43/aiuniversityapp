import "./Home.css";
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from "../../../services/authService";

const Home = () => {

    const [text, setText] = useState("");
    const [fileName, setFileName] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const [showDashboardButtonGroup, setShowDashboardButtonGroup] = useState(true);

    const handleFileInputClick = () => {
        document.getElementById("fileInput").click();
    };

    const handleFileChange = (event) => {
        const fileInput = event.target;
        const selectedFile = fileInput.files[0];
        setFileName(selectedFile ? selectedFile.name : "No file selected");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendText();
        }
    };

    const handleSendText = async () => {
        if (!text.trim()) return;

        const newMessage = { text, isSentByUser: true };
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        try {
            setShowDashboardButtonGroup(false);
            const response = await axiosInstance.post(
                "send_text_after_login/",
                {
                    message: text,
                }
            );

            const botMessage = { text: response.data.reply, isSentByUser: false };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
            setText("");
        } catch (error) {
            console.error("Error sending text:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleUniversityFinderClick = async () => {
        try {
            setShowDashboardButtonGroup(false);
            // Sending the request when the button is clicked
            const response = await axiosInstance.post(
                "university_finder_message/", {} 
            );

            const botMessage = { text: response.data.reply, isSentByUser: false };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error sending request:", error.response?.data || error.message);
        }
    };

    const handleSaveUniversityFactSheetClick = async () => {
        try {
            setShowDashboardButtonGroup(false);
            // Sending the request when the button is clicked
            const response = await axiosInstance.post(
                "Save_University_Fact_Sheet/",
                {}
            );

            const botMessage = { text: response.data.reply, isSentByUser: false };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error sending request:", error.response?.data || error.message);
        }
    };

    return (
        <>
            <div className='main-center-input'>
                {messages.length === 0 ? (
                    <div className="landingPage-heroSection">
                        <h1 className='main-title-dashboard'>Find Your Dream University</h1>
                    </div>
                ) : (
                    <div className="landingPage-chatContainer">
                        <div className="homepage-massages">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`message ${message.isSentByUser ? 'sent' : 'received'}`}
                                >
                                    {message.isSentByUser ? (
                                        message.text
                                    ) : (
                                        <>
                                            <div dangerouslySetInnerHTML={{ __html: message.text }} />
                                            <div
                                                className='dashboard-buttonGroup'
                                            >
                                                <button className='dashboard-main-button' onClick={handleUniversityFinderClick}>
                                                    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M20.875 20.875L16.3437 16.3437M18.7917 10.4583C18.7917 15.0607 15.0607 18.7917 10.4583 18.7917C5.85596 18.7917 2.125 15.0607 2.125 10.4583C2.125 5.85596 5.85596 2.125 10.4583 2.125C15.0607 2.125 18.7917 5.85596 18.7917 10.4583Z" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <div>University Finder</div>
                                                </button>
                                                <button className='dashboard-main-button' onClick={handleSaveUniversityFactSheetClick}>
                                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M13.1667 16.5V9.83333H4.83333V16.5M4.83333 1.5V5.66667H11.5M14.8333 16.5H3.16667C2.72464 16.5 2.30072 16.3244 1.98816 16.0118C1.67559 15.6993 1.5 15.2754 1.5 14.8333V3.16667C1.5 2.72464 1.67559 2.30072 1.98816 1.98816C2.30072 1.67559 2.72464 1.5 3.16667 1.5H12.3333L16.5 5.66667V14.8333C16.5 15.2754 16.3244 15.6993 16.0118 16.0118C15.6993 16.3244 15.2754 16.5 14.8333 16.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <div>Save University Fact Sheet</div>
                                                </button>
                                                <button className='dashboard-main-button'>
                                                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1.33333 16.2503C1.33333 15.6978 1.55282 15.1679 1.94352 14.7772C2.33422 14.3865 2.86413 14.167 3.41666 14.167H14.6667M1.33333 16.2503C1.33333 16.8029 1.55282 17.3328 1.94352 17.7235C2.33422 18.1142 2.86413 18.3337 3.41666 18.3337H14.6667V1.66699H3.41666C2.86413 1.66699 2.33422 1.88649 1.94352 2.27719C1.55282 2.66789 1.33333 3.19779 1.33333 3.75033V16.2503Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <div>AI Course Matching</div>
                                                </button>
                                                <button className='dashboard-main-button'>
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M10 13.3337V10.0003M10 6.66699H10.0084M18.3334 10.0003C18.3334 14.6027 14.6024 18.3337 10 18.3337C5.39765 18.3337 1.66669 14.6027 1.66669 10.0003C1.66669 5.39795 5.39765 1.66699 10 1.66699C14.6024 1.66699 18.3334 5.39795 18.3334 10.0003Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <div>Scholarship Info</div>
                                                </button>
                                                <button className='dashboard-main-button'>
                                                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9.66666 1.66699H2.99999C2.55797 1.66699 2.13404 1.84259 1.82148 2.15515C1.50892 2.46771 1.33333 2.89163 1.33333 3.33366V16.667C1.33333 17.109 1.50892 17.5329 1.82148 17.8455C2.13404 18.1581 2.55797 18.3337 2.99999 18.3337H13C13.442 18.3337 13.8659 18.1581 14.1785 17.8455C14.4911 17.5329 14.6667 17.109 14.6667 16.667V6.66699M9.66666 1.66699L14.6667 6.66699M9.66666 1.66699L9.66666 6.66699H14.6667M11.3333 10.8337H4.66666M11.3333 14.167H4.66666M6.33333 7.50033H4.66666" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <div>Document Generator</div>
                                                </button>
                                                <button className='dashboard-main-button'>
                                                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M16.1875 7.70801C16.1875 13.1038 9.25 17.7288 9.25 17.7288C9.25 17.7288 2.3125 13.1038 2.3125 7.70801C2.3125 5.86807 3.04341 4.10349 4.34445 2.80245C5.64548 1.50142 7.41006 0.770508 9.25 0.770508C11.0899 0.770508 12.8545 1.50142 14.1556 2.80245C15.4566 4.10349 16.1875 5.86807 16.1875 7.70801Z" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M9.25 10.0205C10.5272 10.0205 11.5625 8.98517 11.5625 7.70801C11.5625 6.43085 10.5272 5.39551 9.25 5.39551C7.97284 5.39551 6.9375 6.43085 6.9375 7.70801C6.9375 8.98517 7.97284 10.0205 9.25 10.0205Z" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <div>Location Info</div>
                                                </button>
                                            </div>
                                        </>

                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                )}
                <div
                    className="landingPage-searchChattingBar"
                    style={{
                        transform: messages.length === 0 ? 'translate(-50%, 0px)' : 'translate(-50%, 230px)',
                        transition: 'transform 1s ease', // Adding the transition for smooth movement
                    }}
                >
                    <div className='landingpage-search-bar landingpage-search-text-bar'>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="search-input"
                            placeholder="Find your dream university in secondes!"
                        />
                        <svg className='sending-icon' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="#E6A000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className='landingpage-search-bar landingpage-search-file-bar'>
                        <svg
                            className='attaching-icon'
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={handleFileInputClick}
                        >
                            <rect width="20" height="20" fill="#434343" />
                            <path d="M17.8666 9.20835L10.2082 16.8667C9.27005 17.8049 7.99757 18.332 6.67075 18.332C5.34393 18.332 4.07145 17.8049 3.13325 16.8667C2.19505 15.9285 1.66797 14.656 1.66797 13.3292C1.66797 12.0024 2.19505 10.7299 3.13325 9.79168L10.7916 2.13335C11.4171 1.50788 12.2654 1.15649 13.1499 1.15649C14.0345 1.15649 14.8828 1.50788 15.5082 2.13335C16.1337 2.75882 16.4851 3.60713 16.4851 4.49168C16.4851 5.37623 16.1337 6.22455 15.5082 6.85001L7.84158 14.5083C7.52885 14.8211 7.10469 14.9968 6.66242 14.9968C6.22014 14.9968 5.79598 14.8211 5.48325 14.5083C5.17051 14.1956 4.99482 13.7715 4.99482 13.3292C4.99482 12.8869 5.17051 12.4627 5.48325 12.15L12.5582 5.08335" stroke="#E6A000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <input
                            type='file'
                            id="fileInput"
                            className='file-input'
                            multiple
                            hidden
                            accept='image/*, .pdf, .docx'
                            onChange={handleFileChange}
                        />
                        <div className="file-name-display">{fileName}</div>
                    </div>
                </div>
                {showDashboardButtonGroup && (
                    <div
                        className='dashboard-buttonGroup'
                    >
                        <button className='dashboard-main-button' onClick={handleUniversityFinderClick}>
                            <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.875 20.875L16.3437 16.3437M18.7917 10.4583C18.7917 15.0607 15.0607 18.7917 10.4583 18.7917C5.85596 18.7917 2.125 15.0607 2.125 10.4583C2.125 5.85596 5.85596 2.125 10.4583 2.125C15.0607 2.125 18.7917 5.85596 18.7917 10.4583Z" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div>University Finder</div>
                        </button>
                        <button className='dashboard-main-button' onClick={handleSaveUniversityFactSheetClick}>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.1667 16.5V9.83333H4.83333V16.5M4.83333 1.5V5.66667H11.5M14.8333 16.5H3.16667C2.72464 16.5 2.30072 16.3244 1.98816 16.0118C1.67559 15.6993 1.5 15.2754 1.5 14.8333V3.16667C1.5 2.72464 1.67559 2.30072 1.98816 1.98816C2.30072 1.67559 2.72464 1.5 3.16667 1.5H12.3333L16.5 5.66667V14.8333C16.5 15.2754 16.3244 15.6993 16.0118 16.0118C15.6993 16.3244 15.2754 16.5 14.8333 16.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div>Save University Fact Sheet</div>
                        </button>
                        <button className='dashboard-main-button'>
                            <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.33333 16.2503C1.33333 15.6978 1.55282 15.1679 1.94352 14.7772C2.33422 14.3865 2.86413 14.167 3.41666 14.167H14.6667M1.33333 16.2503C1.33333 16.8029 1.55282 17.3328 1.94352 17.7235C2.33422 18.1142 2.86413 18.3337 3.41666 18.3337H14.6667V1.66699H3.41666C2.86413 1.66699 2.33422 1.88649 1.94352 2.27719C1.55282 2.66789 1.33333 3.19779 1.33333 3.75033V16.2503Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div>AI Course Matching</div>
                        </button>
                        <button className='dashboard-main-button'>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 13.3337V10.0003M10 6.66699H10.0084M18.3334 10.0003C18.3334 14.6027 14.6024 18.3337 10 18.3337C5.39765 18.3337 1.66669 14.6027 1.66669 10.0003C1.66669 5.39795 5.39765 1.66699 10 1.66699C14.6024 1.66699 18.3334 5.39795 18.3334 10.0003Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div>Scholarship Info</div>
                        </button>
                        <button className='dashboard-main-button'>
                            <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.66666 1.66699H2.99999C2.55797 1.66699 2.13404 1.84259 1.82148 2.15515C1.50892 2.46771 1.33333 2.89163 1.33333 3.33366V16.667C1.33333 17.109 1.50892 17.5329 1.82148 17.8455C2.13404 18.1581 2.55797 18.3337 2.99999 18.3337H13C13.442 18.3337 13.8659 18.1581 14.1785 17.8455C14.4911 17.5329 14.6667 17.109 14.6667 16.667V6.66699M9.66666 1.66699L14.6667 6.66699M9.66666 1.66699L9.66666 6.66699H14.6667M11.3333 10.8337H4.66666M11.3333 14.167H4.66666M6.33333 7.50033H4.66666" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div>Document Generator</div>
                        </button>
                        <button className='dashboard-main-button'>
                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.1875 7.70801C16.1875 13.1038 9.25 17.7288 9.25 17.7288C9.25 17.7288 2.3125 13.1038 2.3125 7.70801C2.3125 5.86807 3.04341 4.10349 4.34445 2.80245C5.64548 1.50142 7.41006 0.770508 9.25 0.770508C11.0899 0.770508 12.8545 1.50142 14.1556 2.80245C15.4566 4.10349 16.1875 5.86807 16.1875 7.70801Z" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9.25 10.0205C10.5272 10.0205 11.5625 8.98517 11.5625 7.70801C11.5625 6.43085 10.5272 5.39551 9.25 5.39551C7.97284 5.39551 6.9375 6.43085 6.9375 7.70801C6.9375 8.98517 7.97284 10.0205 9.25 10.0205Z" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div>Location Info</div>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Home;