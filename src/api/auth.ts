import apiClient from './client';
import type { LoginRequest, LoginResponse } from '../types';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  getStoredToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  getStoredUser: () => {
    const user = localStorage.getItem('auth_user');
    return user ? JSON.parse(user) : null;
  },
};
