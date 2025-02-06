import React from 'react';
import LandingPage from './pages/landingpage/LandingPage';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Dashboard from './pages/dashboard/Dashboard';
import Home from './pages/dashboard/home/Home.js';
import ApplicationHub from './pages/dashboard/applicationhub/ApplicationHub.js';
import FullService from './pages/dashboard/fullservice/FullService.js';
import MyChat from './pages/dashboard/mychat/MyChat.js';
import MySaved from './pages/dashboard/mysaved/MySaved.js';
import Questionnaire from './pages/Questionnaire/Questionnaire.js';
import SaveUniversityFacSheet from './pages/SaveUniversityFacSheet/SaveUniversityFacSheet.js';
import ShowUniversityFacSheet from './pages/ShowUniversityFacSheet/ShowUniversityFacSheet.js';
import AiCourseMatchingForm from './pages/dashboard/AiCourseMatchingForm/AiCourseMatchingForm.js';
import ShowAIRecommendations from './pages/dashboard/ShowAIRecommendations/ShowAIRecommendations.js';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.js';
import { NavigationProvider } from './context/NavigationContext.js';
import ChatView from './pages/ChatView/ChatView.js';
import { ChatProvider } from './context/ChatContext.js';

function App() {
  return (
    <div className="App">
      <Router>
        <ToastContainer />
        <NavigationProvider>
          <AuthProvider>
            <Routes>
              <Route
                path='/'
                element={
                  <ProtectedRoute>
                    <ChatProvider>
                      <Dashboard />
                    </ChatProvider>
                  </ProtectedRoute>
                }
              >
                {/* <Route path="" element={<Home />} /> */}
                <Route path="" element={<ChatView />} />
                <Route path="mysaved" element={<ApplicationHub />} />
                <Route path="fullservice" element={<FullService />} />
                <Route path="mychats" element={<MyChat />} />
                <Route path="applicationhub" element={<MySaved />} />
              </Route>
              <Route path='/landingpage' element={<LandingPage />} />
              <Route path='/questionnaire' element={<Questionnaire />} />
              <Route path='/save_university_facsheet' element={<SaveUniversityFacSheet />} />
              <Route path='/show_university_facsheet' element={<ShowUniversityFacSheet />} />
              <Route path='*' element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </NavigationProvider>
      </Router>
    </div>
  );
}

export default App;
