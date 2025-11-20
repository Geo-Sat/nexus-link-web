import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "__VITE_API_BASE_URL__",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add a request interceptor for things like authentication
apiClient.interceptors.request.use(
  (config) => {
      const token = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.access;
      console.log('Token:', token);
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
