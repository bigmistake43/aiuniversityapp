import React, { useState, useEffect } from 'react';
import './AiCourseMatchingForm.css'; // Import the CSS file
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
});

// Axios interceptor for handling token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            const authTokens = JSON.parse(localStorage.getItem("authTokens")) || {};
            const refreshToken = authTokens?.refresh;

            if (refreshToken) {
                try {
                    const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
                        refresh: refreshToken,
                    });
                    const newTokens = response.data;
                    localStorage.setItem("authTokens", JSON.stringify(newTokens));
                    error.config.headers["Authorization"] = `Bearer ${newTokens.access}`;
                    return axiosInstance.request(error.config); // Retry the original request
                } catch (refreshError) {
                    console.error("Failed to refresh token:", refreshError.response?.data || refreshError.message);
                    localStorage.removeItem("authTokens");
                    window.location.href = "/landingpage"; // Redirect to login
                    // setShowLoginPopup(true);
                }
            } else {
                localStorage.removeItem("authTokens");
                window.location.href = "/landingpage"; // Redirect to login
                // setShowLoginPopup(true);
            }
        }
        return Promise.reject(error);
    }
);

const AiCourseMatchingForm = () => {
    const [fieldOfInterest, setFieldOfInterest] = useState('');
    const [careerGoal, setCareerGoal] = useState('');
    const [educationLevel, setEducationLevel] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false); // To handle loading state

    const navigate = useNavigate(); // Initialize navigate

    const getAuthToken = () => {
        const authTokens = JSON.parse(localStorage.getItem('authTokens') || '{}');
        return authTokens.access || null;
    };

    const decodeToken = (token) => {
        return token ? JSON.parse(atob(token.split('.')[1])) : null;
    };

    const isTokenExpired = (token) => {
        const decoded = decodeToken(token);
        return decoded ? decoded.exp * 1000 < Date.now() : true; // Check expiration time
    };

    const isRefreshTokenExpired = (refreshToken) => {
        const decoded = decodeToken(refreshToken);
        return decoded ? decoded.exp * 1000 < Date.now() : true;
    };

    const refreshAuthToken = async () => {
        const authTokens = JSON.parse(localStorage.getItem('authTokens') || '{}');
        const refreshToken = authTokens.refresh || null;

        if (refreshToken && !isRefreshTokenExpired(refreshToken)) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh: refreshToken });
                const newTokens = response.data;
                localStorage.setItem('authTokens', JSON.stringify(newTokens));
                return newTokens.access; // Return new access token
            } catch (error) {
                console.error('Failed to refresh token:', error.response?.data || error.message);
                localStorage.removeItem('authTokens');
                window.location.href = '/login'; // Redirect to login if refresh fails
            }
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validate inputs
        if (!fieldOfInterest || !careerGoal || !educationLevel) {
            setResponseMessage('Please fill out all fields to get personalized course recommendations.');
            setIsError(true);
            return;
        }
    
        setLoading(true); // Show loading message while fetching data
    
        // Get the token
        let token = getAuthToken();
    
        if (!token || isTokenExpired(token)) {
            token = await refreshAuthToken();
            if (!token) {
                setResponseMessage('Session expired. Please log in again.');
                setIsError(true);
                setLoading(false);
                return;
            }
        }
    
        // Extract email from the token payload
        const decodedToken = decodeToken(token); // Decode JWT
        const userEmail = decodedToken?.email || "Ivan@gmail.com"; // Get the email from the token
    
        // Prepare data to send to the backend
        const formData = {
            email: userEmail, // Use email extracted from token
            field_of_interest: fieldOfInterest,
            career_goal: careerGoal,
            education_level: educationLevel,
        };
    
        // Send the request with the current token
        try {
            const response = await axiosInstance.post('aiCourseMatching/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            // Save recommendations in localStorage
            localStorage.setItem('courseRecommendations', JSON.stringify(response.data.recommendations));
    
            // Navigate to the recommendations page
            setResponseMessage('Redirecting to course recommendations...');
            setIsError(false);
            setLoading(false);
            
            // Redirect to the course recommendations page
            navigate('/show_ai_course_matching');
        } catch (error) {
            console.error('Error submitting data:', error);
            setResponseMessage('An error occurred while processing your request. Please try again later.');
            setIsError(true);
        } finally {
            setLoading(false); // Hide loading message once request completes
        }
    };

    return (
        <div className='ai_course_matching_container'>
            <div className="container">
                <h1 className="heading">AI Course Matching</h1>
                <p className="introText">Welcome to our AI-powered course matching service! Tell us about your academic interests and career goals, and we will help you discover the perfect courses to match.</p>
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label htmlFor="field_of_interest" className="label">Field of Interest:</label>
                        <input
                            type="text"
                            id="field_of_interest"
                            value={fieldOfInterest}
                            onChange={(e) => setFieldOfInterest(e.target.value)}
                            className="input"
                            placeholder="E.g., AI, Data Science, Marketing"
                        />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="career_goal" className="label">Career Goal:</label>
                        <input
                            type="text"
                            id="career_goal"
                            value={careerGoal}
                            onChange={(e) => setCareerGoal(e.target.value)}
                            className="input"
                            placeholder="E.g., Data Scientist, Marketing Manager"
                        />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="education_level" className="label">Education Level:</label>
                        <input
                            type="text"
                            id="education_level"
                            value={educationLevel}
                            onChange={(e) => setEducationLevel(e.target.value)}
                            className="input"
                            placeholder="E.g., High School, Undergraduate, Graduate"
                        />
                    </div>
                    <button type="submit" className="button" disabled={loading}>
                        {loading ? 'Finding Courses...' : 'Get Course Recommendations'}
                    </button>
                </form>

                {responseMessage && (
                    <div className={isError ? "errorMessage" : "successMessage"}>
                        {responseMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiCourseMatchingForm;
