import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirm, setPassword_confirm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password_confirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      await axios.post('http://localhost:8000/api/users/register/', {
        username,
        password,
        password_confirm
      });
      navigate('/login'); // 회원가입 성공 시 로그인 페이지로 이동
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={password_confirm}
          onChange={(e) => setPassword_confirm(e.target.value)}
        />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default SignupForm;