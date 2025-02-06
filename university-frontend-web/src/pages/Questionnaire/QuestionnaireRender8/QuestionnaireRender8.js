import React, { useState, useEffect } from 'react';
import './QuestionnaireRender8.css';

const QuestionnaireRender8 = ({
    wantFinancialAid,
    setWantFinancialAid,
    setIsStepValid,
}) => {
    const [financial_aid, setFinancial_aid] = useState(wantFinancialAid); // Initialize state with the prop value

    // Effect to call setWantFinancialAid when financial_aid changes
    useEffect(() => {
        setWantFinancialAid(financial_aid);
        setIsStepValid(financial_aid !== null); // Valid if an option is selected
    }, [financial_aid, setWantFinancialAid, setIsStepValid]);

    const handleOptionChange = (event) => {
        const value = event.target.value === 'YES';
        setFinancial_aid(value);
    };

    return (
        <>
            <div className='questionnaire-question-rect'>
                <div className='questionnaire-question-text'>
                    Are you interested in financial aid?
                </div>
                <div className="checkbox-group-container2">
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="YES"
                            name="financial_aid"
                            className="fancy-checkbox"
                            value="YES"
                            onChange={handleOptionChange}
                            checked={financial_aid === true}
                        />
                        <label htmlFor="YES">Yes</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="radio"
                            id="No"
                            name="financial_aid"
                            className="fancy-checkbox"
                            value="NO"
                            onChange={handleOptionChange}
                            checked={financial_aid === false}
                        />
                        <label htmlFor="No">No</label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuestionnaireRender8;
