import axios from 'axios';

const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  }
  return '__VITE_API_BASE_URL__';
};

// Create an Axios instance
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add a request interceptor for things like authentication
apiClient.interceptors.request.use(
  (config) => {
      const token = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.access;
      // check if token is available and not expired
      // if token is expired, regenerate it via aping /auth/refresh-token
      if (token && Date.now() > JSON.parse(atob(token.split('.')[1])).exp * 1000) {
          console.log('Token expired, logout...');
          localStorage.removeItem('auth-storage');
          window.location.href = '/login';
      }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    // For example, you could log the error or show a notification
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
