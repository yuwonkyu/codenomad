//로그인 상태 복원 컴포넌트(새로고침이나 페이지 이동해도)
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';

const RestoreAuth = () => {
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (user && accessToken && refreshToken) {
      setAuth(JSON.parse(user), accessToken, refreshToken);
    }
  }, [setAuth]);

  return null;
};

export default RestoreAuth;
