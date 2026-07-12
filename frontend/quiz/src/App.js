import { Route, Routes } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import ProfilePage from './components/ProfilePage';
import QuestionCreate from './components/QuestionCreate';
import QuestionEdit from './components/QuestionEdit';
import QuestionList from "./components/QuestionList";
import QuestionSolve from "./components/QuestionSolve";
import SignupForm from './components/SignupForm';
import UserRanking from "./components/UserRanking";
import PostRanking from "./components/PostRanking";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/quizzes" element={<QuestionList />} />
      <Route path="/solve/:id" element={<QuestionSolve />} />
      <Route path="/questions" element={<QuestionCreate />} />
      <Route path="/solve/:id/reports" element={<reportQuestion />} />
      <Route path="/questions/:id/edit" element={<QuestionEdit />} />
      <Route path="/rankings/users" element={<UserRanking />} />
      <Route path="/rankings/posts" element={<PostRanking />} />
    </Routes>
  );
}

export default App;