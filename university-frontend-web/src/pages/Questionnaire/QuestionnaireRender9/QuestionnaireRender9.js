import React, { useState, useEffect } from 'react';
import './QuestionnaireRender9.css';

const QuestionnaireRender9 = ({
    academicImportance,
    setAcademicImportance,
    setIsStepValid,
}) => {
    const [importanceOfAcademic, setImportanceOfAcademic] = useState(academicImportance || 'Not important at all');

    useEffect(() => {
        // Sync local state with prop if passed in
        setImportanceOfAcademic(academicImportance);
    }, [academicImportance]);

    const handleOptionChange = (event) => {
        const selectedValue = event.target.value;
        setImportanceOfAcademic(selectedValue);
        setAcademicImportance(selectedValue); // Update parent state

        // Validate if an option is selected
        if (selectedValue) {
            setIsStepValid(true);
        }
    };

    // Trigger setIsStepValid based on whether an option is selected
    useEffect(() => {
        if (importanceOfAcademic !== '') {
            setIsStepValid(true);
        } else {
            setIsStepValid(false);
        }
    }, [importanceOfAcademic, setIsStepValid]);

    return (
        <>
            <div className='questionnaire-question-rect'>
                <div className='questionnaire-question-text'>
                    How important is the university’s academic reputation to you when applying?
                </div>
                <div className="checkbox-group-container2">
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="NotImportantAtAll"
                            name="academicImportance"
                            className="fancy-checkbox"
                            value="Not important at all"
                            onChange={handleOptionChange}
                            checked={importanceOfAcademic === "Not important at all"}
                        />
                        <label htmlFor="NotImportantAtAll">Not important at all</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="NotSoImportant"
                            name="academicImportance"
                            className="fancy-checkbox"
                            value="Not so important"
                            onChange={handleOptionChange}
                            checked={importanceOfAcademic === "Not so important"}
                        />
                        <label htmlFor="NotSoImportant">Not so important</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="Neutral"
                            name="academicImportance"
                            className="fancy-checkbox"
                            value="Neutral"
                            onChange={handleOptionChange}
                            checked={importanceOfAcademic === "Neutral"}
                        />
                        <label htmlFor="Neutral">Neutral</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="Important"
                            name="academicImportance"
                            className="fancy-checkbox"
                            value="Important"
                            onChange={handleOptionChange}
                            checked={importanceOfAcademic === "Important"}
                        />
                        <label htmlFor="Important">Important</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="VeryImportant"
                            name="academicImportance"
                            className="fancy-checkbox"
                            value="Very important"
                            onChange={handleOptionChange}
                            checked={importanceOfAcademic === "Very important"}
                        />
                        <label htmlFor="VeryImportant">Very important</label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuestionnaireRender9;
