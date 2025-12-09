import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================
// AUTH SERVICES
// ============================================================

export const authService = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  getProfile: () =>
    api.get('/auth/profile'),
};

// ============================================================
// TASK SERVICES
// ============================================================

export const taskService = {
  createTask: (title, description) =>
    api.post('/tasks', { title, description }),

  getAllTasks: () =>
    api.get('/tasks'),

  getTaskById: (taskId) =>
    api.get(`/tasks/${taskId}`),

  updateTask: (taskId, title, description, completed) =>
    api.put(`/tasks/${taskId}`, { title, description, completed }),

  deleteTask: (taskId) =>
    api.delete(`/tasks/${taskId}`),

  toggleTask: (taskId) =>
    api.patch(`/tasks/${taskId}/toggle`),
};

export default api;
