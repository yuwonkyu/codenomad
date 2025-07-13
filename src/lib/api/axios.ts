// Axios 인스턴스
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // 쿠키를 사용하지 않음 ,,cors에러 나길래 확인하니깐 api 서버에서 쿠키를 사용하지 않도록 설정되어 있어서 false로 설정
});

export default instance;
