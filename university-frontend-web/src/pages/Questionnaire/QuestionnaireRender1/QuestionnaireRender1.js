import './QuestionnaireRender1.css';
import { useEffect, useState } from 'react';

const QuestionnaireRender1 = ({
    firstName,
    setFirstName,
    setIsStepValid,
}) => {
    const [error, setError] = useState('');
    const [touched, setTouched] = useState(false);

    const initialFirstName = firstName;

    useEffect(() => {
        setFirstName(initialFirstName);
    }, [initialFirstName, setFirstName]);

    const validateInput = (value) => {
        if (!value.trim()) {
            return 'First name is required.';
        }
        if (!/^[A-Za-z]+$/.test(value)) {
            return 'First name must contain only letters.';
        }
        return '';
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setFirstName(value);
        const validationError = validateInput(value);
        setError(validationError);

        setIsStepValid(!validationError);
    };

    const handleBlur = () => {
        setTouched(true);
        if (!error) {
            setError(validateInput(firstName));
        }
    };

    return (
        <>
            <div className='questionnaire-question-rect'>
                <div className='questionnaire-question-text'>
                    What is your first name?
                </div>
                <input
                    placeholder='Enter your answer'
                    className={`Questionnaire-input ${error && touched ? 'input-error' : ''}`}
                    value={firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {touched && error && (
                    <div className='error-message'>{error}</div>
                )}
            </div>
        </>
    );
};

export default QuestionnaireRender1;
