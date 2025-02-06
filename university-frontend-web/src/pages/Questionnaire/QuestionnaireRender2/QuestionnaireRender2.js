import React, { useState } from 'react';
import './QuestionnaireRender2.css';

const QuestionnaireRender2 = ({ email, setEmail, setIsStepValid }) => {
    const [inputValue, setInputValue] = useState(email);
    const [errorMessage, setErrorMessage] = useState(""); // State for the error message

    // Function to validate email format
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    // Handle input change
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setErrorMessage(""); // Clear error message when the user starts typing
    };

    // Handle blur event for validation
    const handleBlur = () => {
        const isValid = validateEmail(inputValue);
        if (isValid) {
            setEmail(inputValue);
            setIsStepValid(true);  // Set step valid if email is valid
        } else {
            setIsStepValid(false); // Set step invalid if email is invalid
            setErrorMessage("Please enter a valid email address.");  // Set the error message
        }
    };

    return (
        <>
            <div className="questionnaire-question-rect">
                <div className="questionnaire-question-text">
                    What is your email?
                </div>
                <input
                    type="email"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter your answer"
                    className="Questionnaire-input"
                />
                {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Show error message */}
            </div>
        </>
    );
};

export default QuestionnaireRender2;
