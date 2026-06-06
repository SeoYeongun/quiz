import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import ProtectedComponent from './components/ProtectedComponent';
import SignupForm from './components/SignupForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/protected" element={<ProtectedComponent />} />
        <Route path="/register" element={<SignupForm />} />
      </Routes>
    </Router>
  );
}

export default App;