import axios, { AxiosError } from 'axios';
import { env } from '../config/env';

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error: AxiosError) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    console.error('API Error Response:', error.response?.data || error.message);
    
    // We could trigger global toasts or generic fallbacks here if we wanted
    // For now, simply reject the promise to let the specific service or hook handle it
    return Promise.reject(error);
  }
);

export default api;
