import './ProgressBar.css';

const ProgressBar = ({ questionnaireStep, totalQuestionnaireSteps }) => {

    const progress = (questionnaireStep / totalQuestionnaireSteps) * 100;

    return (
        <>
            <div className='ProgressBarOutRect'>
                <div>
                    {questionnaireStep} of {totalQuestionnaireSteps} questions
                </div>
                <div
                    style={{
                        width: '227px',
                        height: '10px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '10px',
                        marginTop: '4px',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            width: `${progress}%`,
                            height: '20px',
                            backgroundColor: '#BF6A02',
                            transition: 'width 0.3s ease',
                        }}
                    >
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProgressBar;