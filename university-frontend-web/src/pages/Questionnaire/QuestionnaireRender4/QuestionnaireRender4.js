import { useState, useEffect } from 'react';
import './QuestionnaireRender4.css';

const QuestionnaireRender4 = ({
    gradePointAverage,
    setGradePointAverage,
    setIsStepValid,
}) => {
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [gpaError, setGpaError] = useState('');

    const [gpa, setGpa] = useState(gradePointAverage);

    useEffect(() => {
        setGpa(gradePointAverage);
    }, [gradePointAverage]);

    const handleCheckboxChange = (event) => {
        setIsCheckboxChecked(event.target.checked);
    };

    const handleGpaChange = (e) => {
        const value = e.target.value;
        setGpa(value);

        if (value === '' || isNaN(value)) {
            setGpaError('Please enter a valid number.');
        } else if (parseFloat(value) < 0.0 || parseFloat(value) > 10.0) {
            setGpaError('GPA must be between 0.0 and 10.0.');
        } else {
            setGpaError('');
        }

        setIsStepValid(value !== '' && !isNaN(value) && parseFloat(value) >= 0.0 && parseFloat(value) <= 10.0);

        setGradePointAverage(value);
    };

    return (
        <>
            <div className='questionnaire-question-rect'>
                <div className='questionnaire-question-text'>
                    What is your current Grade Point Average?
                </div>
                <input
                    placeholder='Enter your answer'
                    className={`Questionnaire-input ${isCheckboxChecked ? 'disabled-input' : ''}`}
                    disabled={isCheckboxChecked}
                    value={gpa}
                    onChange={handleGpaChange}
                />
                {gpaError && <div className="error-message">{gpaError}</div>}

                <div
                    className="checkbox-group-container1"
                    style={{
                        backgroundColor: "black",
                        border: "none",
                        justifyContent: "flex-start",
                        textAlign: "left",
                        flexDirection: "row",
                    }}
                >
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="cool-checkbox"
                            className="fancy-checkbox"
                            checked={isCheckboxChecked}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="cool-checkbox">My school doesn’t use the GPA system</label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuestionnaireRender4;
