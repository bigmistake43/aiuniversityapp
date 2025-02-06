import React, { useState, useEffect } from 'react';
import CountryAutoCompleteInput from '../../../components/CountryAutoCompleteInput/CountryAutoCompleteInput';
import './QuestionnaireRender3.css';

const QuestionnaireRender3 = ({
    citizenship,
    setCitizenship,
    setIsStepValid
}) => {
    const [localCitizenship, setLocalCitizenship] = useState(citizenship || "");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setLocalCitizenship(citizenship || "");
    }, [citizenship]);

    const handleCountrySelection = (selectedCountry) => {
        setLocalCitizenship(selectedCountry);
        setCitizenship(selectedCountry);
        setErrorMessage("");
    };

    const handleBlur = () => {
        if (!localCitizenship) {
            setIsStepValid(false);
            setErrorMessage("Please select your citizenship.");
        } else {
            setIsStepValid(true);
        }
    };

    return (
        <>
            <div className='questionnaire-question-rect'>
                <div className='questionnaire-question-text'>
                    What citizenship do you hold? (Necessary for determining <br /> scholarship eligibility)
                </div>
                <CountryAutoCompleteInput
                    value={localCitizenship}
                    onSelect={handleCountrySelection}
                    onBlur={handleBlur}
                    setIsStepValid={setIsStepValid}
                />
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
        </>
    );
};

export default QuestionnaireRender3;
