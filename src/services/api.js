import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar token a cada solicitud
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (userData) => api.post('/users', userData),
  login: (email, password) => api.post('/users/login', { email, password }),
  verifyEmail: (token) => api.post('/users/verify-email', { token }),
  getProfile: () => api.get('/users/profile/me'),
  updateProfile: (data) => api.put('/users/profile/me', data),
};

export const userService = {
  getAllUsers: (page = 1, limit = 10) => api.get('/users', { params: { page, limit } }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;