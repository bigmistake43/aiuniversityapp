import SkipForNowButton from '../buttons/SkipForNowButton/SkipForNowButton';
import ProgressBar from '../ProgressBar/ProgressBar';
import './QuestionnaireTopbar.css';

const QuestionnaireTopbar = ({
    handleSkip,
    questionnaireStep,
    totalQuestionnaireSteps
}) => {
    return (
        <>
            <div className='topbar flex-row-right-bar'>
                <SkipForNowButton
                    handleSkip={handleSkip}
                />
                <ProgressBar
                    questionnaireStep={questionnaireStep}
                    totalQuestionnaireSteps={totalQuestionnaireSteps}
                />
            </div>
        </>
    );
};

export default QuestionnaireTopbar;