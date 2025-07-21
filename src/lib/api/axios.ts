import axios, { AxiosError } from 'axios';
import { refreshAccessToken } from './auth';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('request interceptor error');
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (err) {
        console.error('토큰 재발급 실패, 로그아웃 처리');
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    if (error.response) {
      const { status, data, statusText } = error.response;
      console.error(`🩺 API Error ${status}:`, data);
    }

    return Promise.reject(error);
  },
);

export default instance;
