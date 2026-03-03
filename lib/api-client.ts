// src/lib/api-client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8083',
  withCredentials: true,
});
// src/lib/api-client.ts

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // 🛑 IN PATHS PAR KABHI RETRY MAT KARO
    const skipPaths = ['/auth/refresh', '/auth/login', '/auth/logout'];
    const isSkipPath = skipPaths.some(path => originalRequest.url?.includes(path));

    if (error.response?.status === 401 && !originalRequest._retry && !isSkipPath) {
      originalRequest._retry = true;
      try {
        // Naya token lene ki koshish
        await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true });
        return apiClient(originalRequest); // Purani request fir se try karo
      } catch (refreshError) {
        // Agar refresh fail ho gaya (401), toh chup-chap error bhej do
        // Taaki AuthContext user ko logout kar sake
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;