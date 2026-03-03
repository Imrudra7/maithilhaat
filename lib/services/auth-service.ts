// src/lib/services/auth-service.ts
import apiClient from '../api-client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse
} from '@/types/auth';

export const authService = {
  // 1. Register Method
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  // 2. Login Method (Backend Cookies set karega)
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  // 3. Logout Method (Backend Cookies clear karega aur Redis blacklist)
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout', {});
  },

  // 4. Refresh Method (Manually call karne ki zarurat nahi, Interceptor handle karega)
  refresh: async (): Promise<void> => {
    await apiClient.post('/auth/refresh', {});
  },

  getCurrentUser: async (): Promise<any> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
};