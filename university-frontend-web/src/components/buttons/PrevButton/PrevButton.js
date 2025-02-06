import './PrevButton.css';

const PrevButton = ({ prevQuestion}) => {
    return (
        <>
            <button className='Questionnaire-button button-grey' onClick={prevQuestion}>
                <div>
                    Prev
                </div>
            </button>
        </>
    );
};

export default PrevButton;