import './LetsDoItButton.css';

const LetsDoItButton = ({nextQuestion}) => {
    return (
        <>
            <button className='Questionnaire-button button-yellow' onClick={nextQuestion}>
                <div>
                    Yes, let's do it!
                </div>
            </button>
        </>
    );
};

export default LetsDoItButton;