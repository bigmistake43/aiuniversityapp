// src/context/ChatContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../services/authService';

// Create context
const ChatContext = createContext();

// Custom hook to use ChatContext
export const useChat = () => useContext(ChatContext);

// ChatProvider component
export const ChatProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    // Fetch user sessions
    useEffect(() => {
        const fetchSessions = async () => {
            setIsLoading(true);  // Start loading when fetching sessions
            try {
                const response = await axiosInstance.get('/chat_sessions/my_sessions/');
                if (response.status === 200) {
                    setSessions(response.data);
                }
            } catch (error) {
                console.error('Error fetching sessions:', error);
            } finally {
                setIsLoading(false);  // Stop loading after fetching
            }
        };
        fetchSessions();
    }, []);

    // Start a new session
    const startChat = async (chatType) => {
        setIsLoading(true);  // Start loading when starting a new chat
        try {
            // Mapping chat types to premade messages
            const premadeMessages = {
                general: "Hello! Help me well today, again!",
                university_finder: "I am looking for universities. Please help me with that.",
                scholarship_finder: "Can you help me find scholarships? What do you need more information from me?",
                document_generator: "I hope you can assist in generating documents for me.",
                course_matching: "Let's find the best course for me.",
                location_info: "Please provide me with information about locations.",
                university_fac_sheet: "I need your help with the university fact sheet.",
            };

            // Get the premade message based on the chat type
            const message = premadeMessages[chatType] || "Welcome to the chat!";

            // Create the session with the specified chat type
            const response = await axiosInstance.post('/chat_sessions/', { chat_type: chatType });
            if (response.status === 201) {
                const newSession = response.data;
                setCurrentSession(newSession);
                setMessages([]); // Clear messages for the new session
                setSessions((prevSessions) => [...prevSessions, newSession]);

                // Add the premade message to the local messages state
                const userMessage = {
                    sender: 'user',
                    message: message,
                    files: [],
                };
                setMessages((prevMessages) => [...prevMessages, userMessage]); // Update state with user's message

                // Send the premade message to the backend
                const formData = new FormData();
                formData.append('message', message);

                const sendResponse = await axiosInstance.post(
                    `/chat_sessions/${newSession.id}/add_message/`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                // If the send message is successful, extract the bot's response
                if (sendResponse.status === 200 && sendResponse.data.messages) {
                    const lastMessage = sendResponse.data.messages.find(
                        (msg) => msg.sender === 'chatbot'
                    );

                    if (lastMessage) {
                        const botMessage = {
                            sender: 'chatbot',
                            message: lastMessage.message || "Sorry, I couldn't generate a response.",
                            files: lastMessage.file_attachments || [],
                        };
                        setMessages((prevMessages) => [...prevMessages, botMessage]);
                    } else {
                        const fallbackMessage = {
                            sender: 'chatbot',
                            message: "Sorry, I couldn't generate a response.",
                            files: [],
                        };
                        setMessages((prevMessages) => [...prevMessages, fallbackMessage]);
                    }
                }
            }
        } catch (error) {
            console.error('Error starting chat session:', error);
        } finally {
            setIsLoading(false);  // Stop loading after starting the chat
        }
    };

    // Load an existing session
    const loadSession = async (sessionId) => {
        setIsLoading(true);  // Start loading when loading a session
        try {
            const response = await axiosInstance.get(`/chat_sessions/${sessionId}/get_messages/`);
            if (response.status === 200) {
                setCurrentSession(sessions.find((session) => session.id === sessionId));
                setMessages([]);
                for(let i = 0; i < response.data.messages.length; i++){
                    const userMessage = {
                        sender: response.data.messages[i].sender,
                        message: response.data.messages[i].message,
                        files: response.data.messages[i].file_attachments
                    }
                    setMessages((prevMessages) => [...prevMessages, userMessage]);
                }
            }
        } catch (error) {
            console.error('Error loading session:', error);
        } finally {
            setIsLoading(false);  // Stop loading after session is loaded
        }
    };

    const sendMessage = async (formData, setProgressCallback) => {
        
        if (currentSession) {
            setIsLoading(true);  // Start loading when sending a message
            try {
                // Add the user message to the messages list optimistically
                const userMessage = {
                    sender: 'user',
                    message: formData.get('message') || '',
                    files: []
                };

                const allFiles = formData.getAll('files') || [];

                const getBase64 = (file) => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result.split(',')[1]);  // Extract base64 part
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });

                const processFiles = async () => {
                    for (let i = 0; i < allFiles.length; i++) {
                        const base64Data = await getBase64(allFiles[i]);
                        const newFiles = {file : base64Data, file_type: allFiles[i].type};
                        userMessage.files.push(newFiles);
                    }
                    console.log(userMessage);
                };

                processFiles();
                setMessages((prevMessages) => [...prevMessages, userMessage]);

                // Send the request to the server
                const response = await axiosInstance.post(
                    `/chat_sessions/${currentSession.id}/add_message/`,
                    formData,
                    {
                        onUploadProgress: (progressEvent) => {
                            const progress = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            if (typeof setProgressCallback === 'function') {
                                setProgressCallback(progress);
                            }
                        },
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                if (response.status === 200) {
                    // Extract the bot's latest response from the messages array
                    const lastMessage = response.data.messages && response.data.messages[response.data.messages.length - 1];

                    if (lastMessage && lastMessage.sender === 'chatbot') {
                        const botMessage = {
                            sender: 'chatbot',
                            message: lastMessage.message || "Sorry, I couldn't generate a response.",
                            files: lastMessage.file_attachments || [],
                        };
                        if(botMessage.files.length) console.log("&&&&&&&&&&&&&&&&&&", botMessage.files[0].file);
                        // Add the bot's response to the chat
                        setMessages((prevMessages) => [...prevMessages, botMessage]);
                    } else {
                        // Fallback for cases where no chatbot message is present
                        const fallbackMessage = {
                            sender: 'chatbot',
                            message: "Sorry, I couldn't generate a response.",
                            files: [],
                        };
                        setMessages((prevMessages) => [...prevMessages, fallbackMessage]);
                    }
                }
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setIsLoading(false);  // Stop loading after sending message
            }
        }
    };

    return (
        <ChatContext.Provider
            value={{
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
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
