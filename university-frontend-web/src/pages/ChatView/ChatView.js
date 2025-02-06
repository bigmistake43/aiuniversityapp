import React, { useEffect, useState, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import './ChatView.css';
import logo from '../../assets/images/logo.png';

const ChatView = () => {
    const {
        sessions,
        currentSession,
        messages,
        setMessages,
        messageInput,
        setMessageInput,
        startChat,
        loadSession,
        sendMessage,
        isLoading,
        setIsLoading,
    } = useChat();

    const [fileName, setFileName] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (sessions.length > 0 && !currentSession) {
            loadSession(sessions[0].id);
        }
    }, [sessions, currentSession, loadSession]);

    useEffect(() => {
        return () => {
            uploadedFiles.forEach((file) => URL.revokeObjectURL(file));
            messages.forEach((msg) =>
                msg.files?.forEach((file) => URL.revokeObjectURL(file))
            );
        };
    }, [uploadedFiles, messages]);

    const handleSendMessage = async () => {
        if (messageInput.trim() || uploadedFiles.length > 0) {
            const formData = new FormData();
            formData.append('message', messageInput);
            uploadedFiles.forEach((file) => formData.append('files', file));

            // Clear input and files before sending
            setMessageInput('');
            setUploadedFiles([]);
            setIsLoading(true); // Start loading animation

            try {
                await sendMessage(formData, (progress) => {
                    console.log(`Upload progress: ${progress}%`);
                });
            } finally {
                setIsLoading(false); // Stop loading animation
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.shiftKey) return;
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            const textarea = textareaRef.current;
            textarea.select();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            document.execCommand('undo');
        }
        if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
            e.preventDefault();
            document.execCommand('redo');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'Backspace') {
            e.preventDefault();
            const textarea = textareaRef.current;
            const cursorPosition = textarea.selectionStart;
            const textBeforeCursor = messageInput.slice(0, cursorPosition);
            const textAfterCursor = messageInput.slice(cursorPosition);
            const lastSpaceIndex = textBeforeCursor.lastIndexOf(' ');
            const newText =
                lastSpaceIndex > -1
                    ? textBeforeCursor.slice(0, lastSpaceIndex) + textAfterCursor
                    : textAfterCursor;
            setMessageInput(newText);
        }
        if (e.key === 'Tab') {
            e.preventDefault();
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newValue = messageInput.slice(0, start) + '\t' + messageInput.slice(end);
            setMessageInput(newValue);
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 1;
            }, 0);
        }
    };

    const handleInputChange = (e) => {
        setMessageInput(e.target.value);
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;

        if (textarea.scrollHeight > 150) {
            textarea.style.height = '150px';
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files).filter((file) =>
            ['image/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].some((type) =>
                file.type.startsWith(type)
            )
        );

        if (files.length !== e.target.files.length) {
            alert('Some files were not valid and were skipped.');
        }

        setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
        setFileName(files.map((file) => file.name).join(', '));
    };

    const handleFileInputClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleRemoveFile = (fileToRemove) => {
        setUploadedFiles((prevFiles) =>
            prevFiles.filter((file) => file !== fileToRemove)
        );
    };

    const renderFilePreviews = () => {
        return uploadedFiles.map((file, index) => {
            if (!(file instanceof Blob || file instanceof File)) {
                console.warn('Invalid file skipped:', file);
                return null;
            }

            const fileURL = URL.createObjectURL(file);
            const isImage = file.type.startsWith('image/');
            return (
                <div key={index} className="uploaded-file">
                    <div className="file-preview-container">
                        {isImage ? (
                            <img
                                src={fileURL}
                                alt="Preview"
                                className="file-preview"
                                style={{ maxWidth: '500px', maxHeight: '500px' }}
                            />
                        ) : (
                            <span className="file-name">{file.name}</span>
                        )}
                        <button
                            className="remove-file-button"
                            onClick={() => handleRemoveFile(file)}
                        >
                            X
                        </button>
                    </div>
                </div>
            );
        });
    };

    const renderMessages = () => (
        <div className="message-container">
            {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                    <div className="message-text">
                        <div
                            dangerouslySetInnerHTML={{ __html: msg.message }}
                        />
                    </div>
                    {msg.files.map((file, idx) => {
                        // if(!(file.file instanceof Blob || file.file instanceof File)) {
                        //     console.warn('Invalid file in message skipped:', file.file);
                        //     return null;
                        // }
                        const isImage = file.file_type && file.file_type.startsWith('image/');
                        return isImage ? (
                            <div key={idx} className="message-file-preview">
                                <img
                                    src={`data:image/jpeg;base64,${file.file}`}
                                    className="image-preview"
                                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                                    alt="Preview"
                                />
                            </div>
                        ) : null;
                    })}
                </div>
            ))}
        </div>
    );

    return (
        <div className="chat-view">
            <div className="chat-window">
                {isLoading && (
                    <div className="loading-overlay">
                        <div className="spinner">
                            <div></div>
                        </div>
                        <div className="sparkles">
                            {Array(100)
                                .fill(0)
                                .map((_, i) => (
                                    <div
                                        key={i}
                                        className="sparkle"
                                        style={{
                                            top: `${Math.random() * 100}%`,
                                            left: `${Math.random() * 100}%`,
                                            animationDelay: `${Math.random() * 2}s`,
                                        }}
                                    ></div>
                                ))}
                        </div>
                        <div className="typing-text">
                            We are trying to make a perfect answer for you, just a minute
                        </div>
                        <div className="hover-images">
                            {Array(10)
                                .fill(0)
                                .map((_, i) => (
                                    <img
                                        key={i}
                                        src={logo}
                                        alt="floating icon"
                                        className="hover-image"
                                        style={{
                                            top: `${Math.random() * 100}%`,
                                            left: `${Math.random() * 100}%`,
                                            animationDelay: `${Math.random() * 3}s`,
                                        }}
                                    />
                                ))}
                        </div>
                    </div>
                )}
                {currentSession ? (
                    <>
                        <div className="chat-window-text">
                            Welcome to  <span className="chat-type">{currentSession.chat_type.replace('_', ' ').toUpperCase()}</span>  Chatting Room
                        </div>
                        {renderMessages()}
                        <form className="message-input-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="input-container">
                                <div className="landingpage-search-bar landingpage-search-text-bar">
                                    <div className={`uploaded-files-wrapper ${uploadedFiles.length > 0 ? 'show' : ''}`}>
                                        {renderFilePreviews()}
                                    </div>
                                    <textarea
                                        ref={textareaRef}
                                        value={messageInput}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        className="search-input"
                                        placeholder="Type your message here..."
                                        rows={1}
                                        style={{ resize: 'none', overflow: 'hidden' }}
                                    />
                                    <svg
                                        className="sending-icon"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        onClick={handleSendMessage}
                                    >
                                        <path
                                            d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                                            stroke="#E6A000"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>

                                <div className="landingpage-search-bar landingpage-search-file-bar">
                                    <svg
                                        className="attaching-icon"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        onClick={handleFileInputClick}
                                    >
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
                                </div>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="no-session">
                        <h3>Select or Start a Chat</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatView;
