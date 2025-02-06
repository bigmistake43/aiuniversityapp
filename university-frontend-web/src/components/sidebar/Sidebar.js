import "./Sidebar.css";
import logo from "../../assets/images/logo.png";
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import React, { useContext, useState } from "react";
import { NavLink } from 'react-router-dom';
import { useChat } from "../../context/ChatContext";

const Sidebar = () => {
    const {
        sessions,
        currentSession,
        messages,
        messageInput,
        setMessageInput,
        startChat,
        loadSession,
        sendMessage,
    } = useChat(); // Get chat data from context

    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // A single state to control which dropdown is open
    const [openDropdown, setOpenDropdown] = useState(null); // null means no dropdown is open

    const handleLogout = () => {
        logoutUser();
        navigate('/landingpage');
    };

    const handleToggleDropdown = (dropdownName) => {
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName); // Toggle dropdown visibility
    };

    return (
        <div className="sidebar">
            <div className='sidebar-header'>
                <div className="dash-logo-div">
                    <img className='dash-logo-img' src={logo} alt="Logo" />
                </div>
                <button className='newchat-button-sidebar' onClick={() => handleToggleDropdown('newChat')}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 1V9" stroke="white" strokeWidth="1.14286" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M1 5H9" stroke="white" strokeWidth="1.14286" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>New Chat</div>
                </button>
                {openDropdown === 'newChat' && (
                    <div className="dropdown">
                        {['general', 'university_finder', 'scholarship_finder', 'document_generator', 'course_matching', 'location_info', 'university_fac_sheet'].map(type => (
                            <button key={type} onClick={() => startChat(type)} className="dropdown-item">
                                {type}
                            </button>
                        ))}
                    </div>
                )}

                <nav className='nav'>
                    <ul className='navlists'>
                        <NavLink to='' className='navlist'>
                            <div className='icon-text-navlist'>
                                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 14.6663V7.99967H9V14.6663M1 5.99967L7 1.33301L13 5.99967V13.333C13 13.6866 12.8595 14.0258 12.6095 14.2758C12.3594 14.5259 12.0203 14.6663 11.6667 14.6663H2.33333C1.97971 14.6663 1.64057 14.5259 1.39052 14.2758C1.14048 14.0258 1 13.6866 1 13.333V5.99967Z" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div>Home</div>
                            </div>
                        </NavLink>
                        <NavLink to='mysaved' className='navlist'>
                            <div className='icon-text-navlist'>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.3333 13V7.66667H3.66667V13M3.66667 1V4.33333H9M11.6667 13H2.33333C1.97971 13 1.64057 12.8595 1.39052 12.6095C1.14048 12.3594 1 12.0203 1 11.6667V2.33333C1 1.97971 1.14048 1.64057 1.39052 1.39052C1.64057 1.14048 1.97971 1 2.33333 1H9.66667L13 4.33333V11.6667C13 12.0203 12.8595 12.3594 12.6095 12.6095C12.3594 12.8595 12.0203 13 11.6667 13Z" stroke="#6B6B6C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div>My Saved</div>
                            </div>
                            <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.45 1.59375L7.37505 5.66875C6.8938 6.15 6.1063 6.15 5.62505 5.66875L1.55005 1.59375" stroke="white" strokeWidth="1.40417" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </NavLink>
                        <NavLink to='fullservice' className='navlist'>
                            <div className='icon-text-navlist'>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.3333 13V7.66667H3.66667V13M3.66667 1V4.33333H9M11.6667 13H2.33333C1.97971 13 1.64057 12.8595 1.39052 12.6095C1.14048 12.3594 1 12.0203 1 11.6667V2.33333C1 1.97971 1.14048 1.64057 1.39052 1.39052C1.64057 1.14048 1.97971 1 2.33333 1H9.66667L13 4.33333V11.6667C13 12.0203 12.8595 12.3594 12.6095 12.6095C12.3594 12.8595 12.0203 13 11.6667 13Z" stroke="#6B6B6C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div>Full Service</div>
                            </div>
                        </NavLink>
                        <NavLink to='' className='navlist' onClick={() => handleToggleDropdown('myChats')}>
                            <div className='icon-text-navlist'>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.3333 13V7.66667H3.66667V13M3.66667 1V4.33333H9M11.6667 13H2.33333C1.97971 13 1.64057 12.8595 1.39052 12.6095C1.14048 12.3594 1 12.0203 1 11.6667V2.33333C1 1.97971 1.14048 1.64057 1.39052 1.39052C1.64057 1.14048 1.97971 1 2.33333 1H9.66667L13 4.33333V11.6667C13 12.0203 12.8595 12.3594 12.6095 12.6095C12.3594 12.8595 12.0203 13 11.6667 13Z" stroke="#6B6B6C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div>My Chats</div>
                            </div>
                            <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.45 1.59375L7.37505 5.66875C6.8938 6.15 6.1063 6.15 5.62505 5.66875L1.55005 1.59375" stroke="white" strokeWidth="1.40417" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </NavLink>
                        {openDropdown === 'myChats' && (
                            <div className="dropdown">
                                {sessions && sessions.length > 0 ? (
                                    sessions.map((session) => (
                                        <button key={session.id} onClick={() => loadSession(session.id)} className="dropdown-item">
                                            {session.chat_type} (Started: {new Date(session.created_at).toLocaleString()})
                                        </button>
                                    ))
                                ) : (
                                    <div className="dropdown-item">No chats available</div>
                                )}
                            </div>
                        )}
                        <NavLink to='applicationhub' className='navlist'>
                            <div className='icon-text-navlist'>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.3333 13V7.66667H3.66667V13M3.66667 1V4.33333H9M11.6667 13H2.33333C1.97971 13 1.64057 12.8595 1.39052 12.6095C1.14048 12.3594 1 12.0203 1 11.6667V2.33333C1 1.97971 1.14048 1.64057 1.39052 1.39052C1.64057 1.14048 1.97971 1 2.33333 1H9.66667L13 4.33333V11.6667C13 12.0203 12.8595 12.3594 12.6095 12.6095C12.3594 12.8595 12.0203 13 11.6667 13Z" stroke="#6B6B6C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div>Application Hub</div>
                            </div>
                            <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.45 1.59375L7.37505 5.66875C6.8938 6.15 6.1063 6.15 5.62505 5.66875L1.55005 1.59375" stroke="white" strokeWidth="1.40417" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </NavLink>
                    </ul>
                </nav>
            </div>

            <div className="sidebar-footer">
                <div className='breakline'></div>
                <button onClick={() => navigate('/subscription')} className='sidebar-footer-button'>
                    <div>My Subscription</div>
                </button>
                <button onClick={() => navigate('/profile')} className='sidebar-footer-button'>
                    <div>Profile</div>
                </button>
                <button onClick={handleLogout} className='sidebar-footer-button'>
                    <div>Logout</div>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
