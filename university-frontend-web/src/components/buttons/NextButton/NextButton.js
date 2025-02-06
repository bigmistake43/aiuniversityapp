import './NextButton.css';

const NextButton = ({ nextQuestion, disabled }) => {
    return (
        <>
            <button
                className='Questionnaire-button button-yellow'
                onClick={nextQuestion}
                disabled={disabled}
            >
                <div>
                    Next
                </div>
            </button>
        </>
    );
};

export default NextButton;