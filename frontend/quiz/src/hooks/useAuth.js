import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // 예시: token을 localStorage에서 가져옴

  useEffect(() => {
    if (!token) {
      navigate('/login'); // token이 없으면 로그인 페이지로 이동
    }
  }, [token, navigate]);

  return { token };
};

export default useAuth;