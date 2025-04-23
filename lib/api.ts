import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // для Next.js важно использовать NEXT_PUBLIC_
});

export default api;
