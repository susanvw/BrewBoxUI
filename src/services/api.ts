import axios from 'axios';
export interface ApiError {
  error?: string;
  message?: string;
  details?: string[];
}

const apiUrl = import.meta.env.VITE_APP_API_URL;
export const api = axios.create({
  baseURL: `${apiUrl}`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('jwtToken');
  if (!token) return false;
  return true;
};
