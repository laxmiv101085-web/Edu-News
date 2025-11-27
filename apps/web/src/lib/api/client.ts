import axios from "axios";
import Router from "next/router";

const api = axios.create({
  // Force relative paths to ensure we use the local Next.js API routes
  baseURL: '',
  // baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('firebase_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default api;




