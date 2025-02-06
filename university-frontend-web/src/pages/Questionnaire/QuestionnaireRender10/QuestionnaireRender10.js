import React, { useState, useEffect } from 'react';
import './QuestionnaireRender10.css';

const QuestionnaireRender10 = ({
    importanceOfTuitionFees,  // Current value of importance of tuition fees from the parent
    setImportanceOfTuitionFees,  // Function to update the parent state
    setIsStepValid,  // Function to validate the current step
}) => {
    // Initialize the local state with the prop value, or a default value
    const [localImportanceOfTuitionFees, setLocalImportanceOfTuitionFees] = useState(importanceOfTuitionFees || 'Not important at all');

    // Sync local state with prop if it changes from the parent
    useEffect(() => {
        setLocalImportanceOfTuitionFees(importanceOfTuitionFees);
    }, [importanceOfTuitionFees]);

    const handleOptionChange = (event) => {
        const selectedValue = event.target.value;
        setLocalImportanceOfTuitionFees(selectedValue); // Update local state
        setImportanceOfTuitionFees(selectedValue);  // Update the parent state

        // Validate selection
        if (selectedValue) {
            setIsStepValid(true);  // If an option is selected, mark the step as valid
        }
    };

    // Trigger step validation based on the current local value of tuition fees importance
    useEffect(() => {
        if (localImportanceOfTuitionFees !== '') {
            setIsStepValid(true);  // Mark step valid if an option is selected
        } else {
            setIsStepValid(false);  // Mark step invalid if no option is selected
        }
    }, [localImportanceOfTuitionFees, setIsStepValid]);

    return (
        <>
            <div className='questionnaire-question-rect'>
                <div className='questionnaire-question-text'>
                    How important are the university tuition fees for you?
                </div>
                <div className="checkbox-group-container2">
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="NotImportantAtAll"
                            name="tuitionFeesImportance"
                            className="fancy-checkbox"
                            value="Not important at all"
                            onChange={handleOptionChange}
                            checked={localImportanceOfTuitionFees === "Not important at all"}
                        />
                        <label htmlFor="NotImportantAtAll">Not important at all</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="NotSoImportant"
                            name="tuitionFeesImportance"
                            className="fancy-checkbox"
                            value="Not so important"
                            onChange={handleOptionChange}
                            checked={localImportanceOfTuitionFees === "Not so important"}
                        />
                        <label htmlFor="NotSoImportant">Not so important</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="Neutral"
                            name="tuitionFeesImportance"
                            className="fancy-checkbox"
                            value="Neutral"
                            onChange={handleOptionChange}
                            checked={localImportanceOfTuitionFees === "Neutral"}
                        />
                        <label htmlFor="Neutral">Neutral</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="Important"
                            name="tuitionFeesImportance"
                            className="fancy-checkbox"
                            value="Important"
                            onChange={handleOptionChange}
                            checked={localImportanceOfTuitionFees === "Important"}
                        />
                        <label htmlFor="Important">Important</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="VeryImportant"
                            name="tuitionFeesImportance"
                            className="fancy-checkbox"
                            value="Very important"
                            onChange={handleOptionChange}
                            checked={localImportanceOfTuitionFees === "Very important"}
                        />
                        <label htmlFor="VeryImportant">Very important</label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuestionnaireRender10;
