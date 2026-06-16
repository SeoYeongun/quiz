import { Routes, Route, Navigate } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import QuestionList from "./components/QuestionList";
import QuestionSolve from "./components/QuestionSolve";
import ProfilePage from './components/ProfilePage';
import SignupForm from './components/SignupForm';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/quizzes" element={<QuestionList />} />
      <Route path="/solve/:id" element={<QuestionSolve />} />
    </Routes>
  );
}

export default App;