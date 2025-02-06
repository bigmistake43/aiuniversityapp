import LetsDoItButton from '../../../components/buttons/LetsDoItButton/LetsDoItButton';
import SkipForNowButton from '../../../components/buttons/SkipForNowButton/SkipForNowButton';
import './QuestionnaireRender0.css';

const QuestionnaireRender0 = ({ handleSkip, nextQuestion }) => {
    return (
        <>
            <div className='flex-container'>
                <div className='Questionnaire-text1'>
                    Would you like to fill in a quick questionnaire to <br />
                    personalize your experience?
                </div>
                <div className='Questionnaire-button-group'>
                    <SkipForNowButton
                        handleSkip={handleSkip}
                    />
                    <LetsDoItButton
                        nextQuestion={nextQuestion}
                    />
                </div>
            </div>
        </>
    );
};

export default QuestionnaireRender0;