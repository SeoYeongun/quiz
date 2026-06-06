import React from 'react';
import useAuth from '../hooks/useAuth';

const ProtectedComponent = () => {
  const { token } = useAuth();

  if (!token) {
    return <div>로그인이 필요합니다.</div>;
  }

  return <div>환영합니다! 이 페이지는 로그인한 사용자만 볼 수 있습니다
.</div>;
};

export default ProtectedComponent;