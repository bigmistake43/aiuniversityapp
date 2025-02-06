import React, { useEffect } from "react";
import "./QuestionnaireRender6.css";

const QuestionnaireRender6 = ({
    interestedStudy,
    setInterestedStudy,
    setIsStepValid,
}) => {
    // This effect will run whenever the interestedStudy value changes
    useEffect(() => {
        // Set step validity based on the interestedStudy value
        if (interestedStudy !== "") {
            setIsStepValid(true);
        } else {
            setIsStepValid(false);
        }
    }, [interestedStudy, setIsStepValid]);

    // Handle textarea change
    const handleTextChange = (event) => {
        // If the checkbox is not checked, update interestedStudy with the text
        if (!document.getElementById("cool-checkbox").checked) {
            setInterestedStudy(event.target.value);
        }
    };

    // Handle checkbox change
    const handleCheckboxChange = (event) => {
        // If checked, set interestedStudy to "I don’t know" and disable textarea
        if (event.target.checked) {
            setInterestedStudy("I don’t know");
        } else {
            // If unchecked, clear "I don’t know" and allow textarea to be updated
            setInterestedStudy("");
        }
    };

    return (
        <>
            <div className='questionnaire-question-rect'>
                <div className='questionnaire-question-text'>
                    What would you like to study?
                </div>
                <textarea
                    placeholder="Enter your answer"
                    className="Questionnaire-textarea"
                    value={interestedStudy}
                    onChange={handleTextChange}
                    disabled={interestedStudy === "I don’t know"}
                />
                <div className="checkbox-group-container1"
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
                            checked={interestedStudy === "I don’t know"}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="cool-checkbox">I don’t know</label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuestionnaireRender6;
