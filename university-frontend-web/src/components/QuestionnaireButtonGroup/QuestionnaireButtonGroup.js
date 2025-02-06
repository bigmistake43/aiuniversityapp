import NextButton from '../buttons/NextButton/NextButton';
import PrevButton from '../buttons/PrevButton/PrevButton';
import './QuestionnaireButtonGroup.css';

const QuestionnaireButtonGroup = ({ prevQuestion, nextQuestion, isStepValid }) => {
    return (
        <div className='Questionnaire-button-group'
            style={{
                marginTop: '90px',
            }}
        >
            <PrevButton
                prevQuestion={prevQuestion}
            />
            <NextButton
                nextQuestion={nextQuestion}
                disabled={!isStepValid}
            />
        </div>
    );
};

export default QuestionnaireButtonGroup;
