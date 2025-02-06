import './SkipForNowButton.css';

const SkipForNowButton = ({handleSkip}) => {
    
    return (
        <>
            <button className='Questionnaire-button button-grey' onClick={handleSkip}>
                <div>
                    Skip for now
                </div>
            </button>
        </>
    );
};

export default SkipForNowButton