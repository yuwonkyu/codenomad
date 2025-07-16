// Axios 인스턴스
import axios from 'axios';
import type { AxiosError } from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // 쿠키를 사용하지 않음 ,,cors에러 나길래 확인하니깐 api 서버에서 쿠키를 사용하지 않도록 설정되어 있어서 false로 설정
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
  (res) => {
    return res;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status, data, statusText } = error.response;

      console.error(`🩺 API Error ${status}:`, data);

      throw new Response(JSON.stringify(data), { status, statusText });
    }
  },
);

export default instance;
