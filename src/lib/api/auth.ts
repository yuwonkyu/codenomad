// lib/api/auth.ts
// loginApi 함수 → 로그인 요청을 보내고, 성공 시 accessToken, refreshToken, user 정보를 반환하도록
import instance from './axios';

interface LoginPayload {
  email: string;
  password: string;
}

export const loginApi = async ({ email, password }: LoginPayload) => {
  const response = await instance.post('/auth/login', { email, password });
  return response.data; // accessToken, refreshToken, user 포함됨
};
