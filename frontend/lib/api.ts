import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

// Use environment variable to determine API base URL
// During transition, use NEXT_PUBLIC_API_BASE_URL from .env.local
// For Vercel production, this should be empty for relative URLs
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Update the URL to include the /api prefix for Vercel deployment
    // Only add /api if we're using relative URLs or localhost (for development)
    if (!BASE_URL.includes('://') || BASE_URL.includes('localhost') || BASE_URL.includes('127.0.0.1')) {
      if (!config.url?.startsWith('/api')) {
        config.url = `/api${config.url}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, remove it
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // Redirect to login page (handled by the calling component)
    }
    return Promise.reject(error);
  }
);

// Authentication API functions
export const authApi = {
  register: (userData: { email: string; password: string; firstName?: string; lastName?: string }) =>
    apiClient.post('/auth/register', userData),

  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login', credentials),

  logout: () =>
    apiClient.post('/auth/logout'),

  verify: () =>
    apiClient.get('/auth/verify'),
};

// Task API functions
export const taskApi = {
  getAll: (params?: { status?: string; priority?: string; limit?: number; offset?: number }) =>
    apiClient.get('/tasks', { params }),

  getById: (taskId: string) =>
    apiClient.get(`/tasks/${taskId}`),

  create: (taskData: { title: string; description?: string; status?: string; priority?: string; dueDate?: string }) =>
    apiClient.post('/tasks', taskData),

  update: (taskId: string, taskData: { title?: string; description?: string; status?: string; priority?: string; dueDate?: string }) =>
    apiClient.put(`/tasks/${taskId}`, taskData),

  partialUpdate: (taskId: string, taskData: Partial<{ title?: string; description?: string; status?: string; priority?: string; dueDate?: string }>) =>
    apiClient.patch(`/tasks/${taskId}`, taskData),

  delete: (taskId: string) =>
    apiClient.delete(`/tasks/${taskId}`),
};

// Generic API function for custom requests
export const makeRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return apiClient({
    method,
    url: endpoint,
    data,
    ...config,
  });
};

export default apiClient;
