// lib/api/auth.ts
// loginApi 함수 → 로그인 요청을 보내고, 성공 시 accessToken, refreshToken, user 정보를 반환하도록
// signupApi 함수 → 회원가입 요청을 보내고, 성공 시 사용자 정보를 반환
import instance from './axios';

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  email: string;
  password: string;
  nickname: string;
}

export const loginApi = async ({ email, password }: LoginPayload) => {
  const response = await instance.post('/auth/login', { email, password });
  return response.data; // accessToken, refreshToken, user 포함됨
};

export const signupApi = async (data: SignupPayload) => {
  const response = await instance.post('/15-5/users', data);
  return response.data;
};
