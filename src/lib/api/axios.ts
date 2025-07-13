//Axios 인스턴스
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://sp-globalnomad-api.vercel.app/15-5/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
