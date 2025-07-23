import instance from './axios';
import axios from 'axios';

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
  const res = await instance.post('/auth/login', { email, password });
  return res.data;
};

export const signupApi = async (data: SignupPayload) => {
  const res = await instance.post('/users', data);
  return res.data;
};

export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('리프레시 토큰이 없습니다');
  }

  const res = await axios.post(
    '/auth/tokens',
    {},
    {
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    },
  );

  const { accessToken, refreshToken: newRefreshToken } = res.data;

  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', newRefreshToken);

  return accessToken;
};
