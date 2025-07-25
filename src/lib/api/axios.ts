import { useAuthStore } from '@/store/useAuthStore';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
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
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
    if (error.response) {
      const { status } = error.response;
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
      const refreshToken = useAuthStore.getState().refreshToken;
      const accessToken = useAuthStore.getState().accessToken;
      const setAccessToken = useAuthStore.getState().setAccessToken;
      const setRefreshToken = useAuthStore.getState().setRefreshToken;
      if (status === 401 && refreshToken && !originalRequest._retry) {
        try {
          // 1. 토큰 재발급
          const res = await refreshAccessToken(refreshToken);
          setAccessToken(res.accessToken);
          setRefreshToken(res.refreshToken);

          // 2. Authorization 헤더를 새 토큰으로 바꿔줌
          if (originalRequest && accessToken) {
            // 이 부분은 아래처럼 그냥 주셔도 될 거 같아요
            originalRequest._retry = true;

            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${accessToken}`,
            };
            // 3. 같은 요청을 다시 보냄 (재귀 아님)
            return instance(originalRequest);
          }
        } catch (err) {
          // 리프레시 토큰도 만료 시 로그아웃 등 추가 처리
          console.error('토큰 재발급 실패, 로그아웃 처리');
        }
      }
    }
    return Promise.reject(error);
  },
);

export default instance;
