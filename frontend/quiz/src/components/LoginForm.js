import React, { useState } from 'react';
import axios from 'axios';  // 🔥 필수


const LoginForm = () => {
  const [username, setUsername] = useState('');  // 🔥 여기 있어야 함
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8000/api/users/login/',
        {
          username,   // 🔥 state에서 가져오는 값
          password,
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      localStorage.setItem('access', response.data.token);
      
      alert('로그인 성공!');

      } catch (err) {
        console.log(err);
        alert('로그인 실패!');
      }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
      />

      <button type="submit">로그인</button>
    </form>
  );
};

export default LoginForm;