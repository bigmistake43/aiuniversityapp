import React, { useState, useEffect } from 'react';
import './QuestionnaireRender5.css';

const QuestionnaireRender5 = ({
    interestedDegree,
    setInterestedDegree,
    setIsStepValid,
}) => {
    const [selectedOptions, setSelectedOptions] = useState({
        undergraduate: false,
        graduate: false,
        doctoral: false,
        other: false,
    });

    // Update the state based on the initial interestedDegree
    useEffect(() => {
        if (interestedDegree) {
            setSelectedOptions({
                undergraduate: interestedDegree.includes('undergraduate'),
                graduate: interestedDegree.includes('graduate'),
                doctoral: interestedDegree.includes('doctoral'),
                other: interestedDegree.includes('other'),
            });
        }
    }, [interestedDegree]);

    const handleCheckboxChange = (event) => {
        const { id, checked } = event.target;
        setSelectedOptions((prevState) => {
            const updatedOptions = { ...prevState, [id]: checked };

            // Update interestedDegree state when any checkbox is checked/unchecked
            let updatedDegree = [];
            for (let key in updatedOptions) {
                if (updatedOptions[key]) {
                    updatedDegree.push(key);
                }
            }
            setInterestedDegree(updatedDegree);

            // Validate if at least one option is selected
            setIsStepValid(updatedDegree.length > 0);

            return updatedOptions;
        });
    };

    return (
        <>
            <div className='questionnaire-question-rect'>
                <div className='questionnaire-question-text'>
                    What level of degree are you interested in?
                </div>
                <div className="checkbox-group-container2">
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="undergraduate"
                            className="fancy-checkbox"
                            checked={selectedOptions.undergraduate}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="undergraduate">Undergraduate / Bachelor’s</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="graduate"
                            className="fancy-checkbox"
                            checked={selectedOptions.graduate}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="graduate">Graduate / Master’s</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="doctoral"
                            className="fancy-checkbox"
                            checked={selectedOptions.doctoral}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="doctoral">Doctoral Degree</label>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="other"
                            className="fancy-checkbox"
                            checked={selectedOptions.other}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="other">Other</label>
                        {selectedOptions.other && (
                            <input
                                type="text"
                                placeholder="Enter a response"
                                style={{
                                    fontSize: "12px",
                                    border: "none",
                                    outline: "none",
                                    backgroundColor: "White",
                                    padding: "3px",
                                    borderRadius: "5px",
                                    marginLeft: "20px",
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuestionnaireRender5;