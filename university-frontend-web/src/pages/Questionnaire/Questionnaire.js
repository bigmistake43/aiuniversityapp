import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/authService';
import Footer from '../../components/footer/Footer';
import TopNavbar from '../../components/topnavbar/TopNavbar';
import './Questionnaire.css';
import QuestionnaireTopbar from '../../components/QuestionnaireTopbar/QuestionnaireTopbar';
import { useEffect, useState } from 'react';
import QuestionnaireRender0 from './QuestionnaireRender0/QuestionnaireRender0';
import QuestionnaireRender1 from './QuestionnaireRender1/QuestionnaireRender1';
import QuestionnaireButtonGroup from '../../components/QuestionnaireButtonGroup/QuestionnaireButtonGroup';
import QuestionnaireRender2 from './QuestionnaireRender2/QuestionnaireRender2';
import QuestionnaireRender3 from './QuestionnaireRender3/QuestionnaireRender3';
import QuestionnaireRender4 from './QuestionnaireRender4/QuestionnaireRender4';
import QuestionnaireRender5 from './QuestionnaireRender5/QuestionnaireRender5';
import QuestionnaireRender6 from './QuestionnaireRender6/QuestionnaireRender6';
import QuestionnaireRender7 from './QuestionnaireRender7/QuestionnaireRender7';
import QuestionnaireRender8 from './QuestionnaireRender8/QuestionnaireRender8';
import QuestionnaireRender9 from './QuestionnaireRender9/QuestionnaireRender9';
import QuestionnaireRender10 from './QuestionnaireRender10/QuestionnaireRender10';
import QuestionnaireRender11 from './QuestionnaireRender11/QuestionnaireRender11';
import QuestionnaireRender12 from './QuestionnaireRender12/QuestionnaireRender12';
import QuestionnaireRender13 from './QuestionnaireRender13/QuestionnaireRender13';

const Questionnaire = () => {
    const [isStepValid, setIsStepValid] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [citizenship, setCitizenship] = useState('');
    const [gradePointAverage, setGradePointAverage] = useState('');
    const [interestedDegree, setInterestedDegree] = useState('');
    const [interestedStudy, setInterestedStudy] = useState('');
    const [country, setCountry] = useState('');
    const [wantFinancialAid, setWantFinancialAid] = useState('');
    const [academicImportance, setAcademicImportance] = useState('');
    const [importanceOfTuitionFees, setImportanceOfTuitionFees] = useState('');
    const [importanceOfSocialCulturalFactor, setImportanceOfSocialCulturalFactor] = useState('');
    const [tuitionBudget, setTuitionBudget] = useState('');

    const navigate = useNavigate();
    const handleSkip = () => {
        navigate('/');
    };

    const [questionnaireStep, setQuestionnaireStep] = useState(0);
    const totalQuestionnaireSteps = 13;

    // Correct token retrieval from localStorage
    const authTokens = JSON.parse(localStorage.getItem('authTokens') || '{}');
    const token = authTokens.access || null;

    const submitQuestionnaire = async () => {
        const questionnaireData = {
            firstName,
            email,
            citizenship,
            gradePointAverage,
            interestedDegree,
            interestedStudy,
            country,
            wantFinancialAid,
            academicImportance,
            importanceOfTuitionFees,
            importanceOfSocialCulturalFactor,
            tuitionBudget,
        };
    
        try {
            const response = await axiosInstance.post('/questionnaire/', questionnaireData)
    
            if (response.status === 201) {
                console.log('Questionnaire submitted successfully!');
                navigate('/');
            } else {
                console.error('Failed to submit questionnaire:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting questionnaire:', error);
        }
    };
    

    const nextQuestion = () => {
        if (questionnaireStep < totalQuestionnaireSteps) {
            setQuestionnaireStep((prevStep) => prevStep + 1);
        } else if (questionnaireStep === totalQuestionnaireSteps) {
            submitQuestionnaire();
        }
    };

    const prevQuestion = () => {
        if (questionnaireStep > 0) {
            setQuestionnaireStep((prevStep) => prevStep - 1);
        }
    };

    const renderContent = () => {
        switch (questionnaireStep) {
            case 0:
                return (
                    <QuestionnaireRender0
                        handleSkip={handleSkip}
                        nextQuestion={nextQuestion}
                    />
                );
            case 1:
                return (
                    <QuestionnaireRender1
                        firstName={firstName}
                        setFirstName={setFirstName}
                        setIsStepValid={setIsStepValid}
                    />
                );
            case 2:
                return (
                    <QuestionnaireRender2
                        email={email}
                        setEmail={setEmail}
                        setIsStepValid={setIsStepValid}
                    />
                );
            case 3:
                return (
                    <QuestionnaireRender3
                        citizenship={citizenship}
                        setCitizenship={setCitizenship}
                        setIsStepValid={setIsStepValid}
                    />
                );
            case 4:
                return (
                    <QuestionnaireRender4
                        gradePointAverage={gradePointAverage}
                        setGradePointAverage={setGradePointAverage}
                        setIsStepValid={setIsStepValid}
                    />
                );
            case 5:
                return (
                    <QuestionnaireRender5
                        interestedDegree={interestedDegree}
                        setInterestedDegree={setInterestedDegree}
                        setIsStepValid={setIsStepValid}
                    />
                );
            case 6:
                return (
                    <QuestionnaireRender6
                        interestedStudy={interestedStudy}
                        setInterestedStudy={setInterestedStudy}
                        setIsStepValid={setIsStepValid}
                    />
                );
            case 7:
                return (
                    <QuestionnaireRender7
                        country={country}
                        setCountry={setCountry}
                        setIsStepValid={setIsStepValid}
                    />
                );
            case 8:
                return (
                    <QuestionnaireRender8
                        wantFinancialAid={wantFinancialAid}
                        setWantFinancialAid={setWantFinancialAid}
                        setIsStepValid={setIsStepValid}
                    />
                );
            case 9:
                return (
                    <QuestionnaireRender9
                        academicImportance={academicImportance}
                        setAcademicImportance={setAcademicImportance}
                        setIsStepValid={setIsStepValid}
                    />
                );
            case 10:
                return (
                    <QuestionnaireRender10
                        importanceOfTuitionFees={importanceOfTuitionFees}
                        setImportanceOfTuitionFees={setImportanceOfTuitionFees}
                        setIsStepValid={setIsStepValid}
                    />
                );
            case 11:
                return (
                    <QuestionnaireRender11
                        importanceOfSocialCulturalFactor={importanceOfSocialCulturalFactor}
                        setImportanceOfSocialCulturalFactor={setImportanceOfSocialCulturalFactor}
                        setIsStepValid={setIsStepValid}
                    />
                );
            case 12:
                return (
                    <QuestionnaireRender12
                        tuitionBudget={tuitionBudget}
                        setTuitionBudget={setTuitionBudget}
                        setIsStepValid={setIsStepValid}
                    />
                );
            case 13:
                return <QuestionnaireRender13 />;
            default:
                return <div>Unknown step {questionnaireStep}</div>;
        }
    };

    useEffect(() => {
        console.log('Current Step:', questionnaireStep);
    }, [questionnaireStep]);

    return (
        <>
            <TopNavbar />
            {questionnaireStep !== 0 && (
                <QuestionnaireTopbar
                    handleSkip={handleSkip}
                    questionnaireStep={questionnaireStep}
                    totalQuestionnaireSteps={totalQuestionnaireSteps}
                />
            )}
            <div className="flex-container">
                {renderContent()}
                {questionnaireStep !== 0 && (
                    <QuestionnaireButtonGroup
                        prevQuestion={prevQuestion}
                        nextQuestion={nextQuestion}
                        isStepValid={isStepValid}
                    />
                )}
            </div>
            <Footer />
        </>
    );
};

export default Questionnaire;
