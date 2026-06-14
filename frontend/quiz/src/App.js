import { Routes, Route, Navigate } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import Quizzes from './components/Quizzes';
import QuizDetail from './components/QuizDetail';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access');

  // 🔥 디버그용
  console.log("TOKEN:", token);

  if (!token || token === 'undefined' || token === 'null') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>

      {/* 공개 */}
      <Route path="/login" element={<LoginForm />} />

      {/* 보호 */}
      <Route
        path="/quizzes"
        element={
          <PrivateRoute>
            <Quizzes />
          </PrivateRoute>
        }
      />

      <Route
        path="/quizzes/:id"
        element={
          <PrivateRoute>
            <QuizDetail />
          </PrivateRoute>
        }
      />

      {/* 기본 */}
      <Route path="/" element={<Navigate to="/quizzes" replace />} />

    </Routes>
  );
}

export default App;