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

interface ReloadAccessTokenType {
  accessToken: string;
  refreshToken: string;
}

export const loginApi = async ({ email, password }: LoginPayload) => {
  const res = await instance.post('/auth/login', { email, password });
  return res.data;
};

export const signupApi = async (data: SignupPayload) => {
  const res = await instance.post('/users', data);
  return res.data;
};

export const refreshAccessToken = async (token: string): Promise<ReloadAccessTokenType> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/tokens`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};
