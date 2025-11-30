import axios from 'axios';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:8000', // Assuming backend runs on this URL
  timeout: 10000,
});

// Add a request interceptor to include auth token
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

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  signup: (userData) => api.post('/users/signup', userData),
  login: (credentials) => api.post('/users/login', credentials),
};

// Posts endpoints
export const postsAPI = {
  createPost: (postData) => api.post('/posts/', postData),
  getPost: (id) => api.get(`/posts/${id}`),
  getAllPosts: (params = {}) => api.get('/posts/', { params }),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
};

// Users endpoints
export const usersAPI = {
  getUser: (id) => api.get(`/users/${id}`),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;