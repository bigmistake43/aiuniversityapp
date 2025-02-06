import React, { useState, useEffect } from 'react';
import './QuestionnaireRender11.css';

const QuestionnaireRender11 = ({
    importanceOfSocialCulturalFactor,  // Prop from the parent component
    setImportanceOfSocialCulturalFactor,  // Function to update the parent state
    setIsStepValid,  // Function to validate the step
}) => {
    // Initialize local state with the current value of importanceOfSocialCulturalFactor from props or default value
    const [localImportanceOfSocialCulturalFactor, setLocalImportanceOfSocialCulturalFactor] = useState(importanceOfSocialCulturalFactor || 'Not important at all');

    // Sync local state with prop if it changes from the parent
    useEffect(() => {
        setLocalImportanceOfSocialCulturalFactor(importanceOfSocialCulturalFactor);
    }, [importanceOfSocialCulturalFactor]);

    // Handle change when an option is selected
    const handleOptionChange = (event) => {
        const selectedValue = event.target.value;
        setLocalImportanceOfSocialCulturalFactor(selectedValue); // Update local state
        setImportanceOfSocialCulturalFactor(selectedValue);  // Update parent state

        // Trigger validation if an option is selected
        if (selectedValue) {
            setIsStepValid(true);  // Mark step as valid if an option is selected
        }
    };

    // Trigger step validation based on the current local value
    useEffect(() => {
        if (localImportanceOfSocialCulturalFactor !== '') {
            setIsStepValid(true);  // Mark step valid if an option is selected
        } else {
            setIsStepValid(false);  // Mark step invalid if no option is selected
        }
    }, [localImportanceOfSocialCulturalFactor, setIsStepValid]);

    return (
        <>
            <div className='questionnaire-question-rect'>
                <div className='questionnaire-question-text'>
                    How important is the social/cultural factor when selecting a university?
                </div>
                <div className="checkbox-group-container2">
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="NotImportantAtAll"
                            name="socialCulturalImportance"
                            className="fancy-checkbox"
                            value="Not important at all"
                            onChange={handleOptionChange}
                            checked={localImportanceOfSocialCulturalFactor === "Not important at all"}
                        />
                        <label htmlFor="NotImportantAtAll">Not important at all</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="NotSoImportant"
                            name="socialCulturalImportance"
                            className="fancy-checkbox"
                            value="Not so important"
                            onChange={handleOptionChange}
                            checked={localImportanceOfSocialCulturalFactor === "Not so important"}
                        />
                        <label htmlFor="NotSoImportant">Not so important</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="Neutral"
                            name="socialCulturalImportance"
                            className="fancy-checkbox"
                            value="Neutral"
                            onChange={handleOptionChange}
                            checked={localImportanceOfSocialCulturalFactor === "Neutral"}
                        />
                        <label htmlFor="Neutral">Neutral</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="Important"
                            name="socialCulturalImportance"
                            className="fancy-checkbox"
                            value="Important"
                            onChange={handleOptionChange}
                            checked={localImportanceOfSocialCulturalFactor === "Important"}
                        />
                        <label htmlFor="Important">Important</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="VeryImportant"
                            name="socialCulturalImportance"
                            className="fancy-checkbox"
                            value="Very important"
                            onChange={handleOptionChange}
                            checked={localImportanceOfSocialCulturalFactor === "Very important"}
                        />
                        <label htmlFor="VeryImportant">Very important</label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuestionnaireRender11;
