import { useAuthStore } from '@/store/useAuthStore';
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
      const { status, data } = error.response;
      const refreshToken = useAuthStore.getState().refreshToken;
      const clearAuthStore = useAuthStore.getState().clearAuthStore;
      const setAccessToken = useAuthStore.getState().setAccessToken;
      const setRefreshToken = useAuthStore.getState().setRefreshToken;
      const accessToken = useAuthStore.getState().accessToken;
      console.error(`🩺 API Error ${status}:`, data);

      console.log('토큰 재발급:', accessToken, refreshToken);
      if (status === 401 && refreshToken !== null) {
        try {
          const res = await refreshAccessToken(refreshToken);
          setAccessToken(res.accessToken);
          setRefreshToken(res.refreshToken);
          console.log('재발급:', res.accessToken, res.refreshToken);
        } catch (err) {
          console.error('토큰 재발급 실패, 로그아웃 처리');
          clearAuthStore();
          useAuthStore.persist.clearStorage();
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
