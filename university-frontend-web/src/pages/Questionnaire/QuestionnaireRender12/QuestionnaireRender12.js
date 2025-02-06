import React, { useState, useEffect } from 'react';
import './QuestionnaireRender12.css';

const QuestionnaireRender12 = ({
    tuitionBudget,
    setTuitionBudget,
    setIsStepValid,
}) => {
    // Effect to validate the step based on tuitionBudget selection
    useEffect(() => {
        if (tuitionBudget) {
            setIsStepValid(true);
        } else {
            setIsStepValid(false);
        }
    }, [tuitionBudget, setIsStepValid]);

    const handleOptionChange = (event) => {
        setTuitionBudget(event.target.value);
    };

    return (
        <>
            <div className='questionnaire-question-rect'>
                <div className='questionnaire-question-text'>
                    What is your maximum annual budget that you can spend on tuition costs?
                </div>
                <div className="checkbox-group-container2">
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="Under$5000"
                            name="tuitionBudget"
                            className="fancy-checkbox"
                            value="Under $5000"
                            onChange={handleOptionChange}
                            checked={tuitionBudget === "Under $5000"}
                        />
                        <label htmlFor="Under$5000">Under $5000</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="$5000-$10,000"
                            name="tuitionBudget"
                            className="fancy-checkbox"
                            value="$5000-$10,000"
                            onChange={handleOptionChange}
                            checked={tuitionBudget === "$5000-$10,000"}
                        />
                        <label htmlFor="$5000-$10,000">$5000-$10,000</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="$10,000-$20,000"
                            name="tuitionBudget"
                            className="fancy-checkbox"
                            value="$10,000-$20,000"
                            onChange={handleOptionChange}
                            checked={tuitionBudget === "$10,000-$20,000"}
                        />
                        <label htmlFor="$10,000-$20,000">$10,000-$20,000</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="Over$20000"
                            name="tuitionBudget"
                            className="fancy-checkbox"
                            value="Over $20,000"
                            onChange={handleOptionChange}
                            checked={tuitionBudget === "Over $20,000"}
                        />
                        <label htmlFor="Over$20000">Over $20,000</label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuestionnaireRender12;
