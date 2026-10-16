// frontend/src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL:         '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method?.toUpperCase()} → ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ← ${response.config.url}`);
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    const status  = error.response?.status;

    console.error(`❌ Error ${status}: ${message}`);

    // Only redirect on 401 if NOT already on public pages
    if (status === 401) {
      const path = window.location.pathname;
      const publicPaths = [
        '/',
        '/register',
        '/forgot-password',
        '/unauthorized',
      ];

      // Check if on login page (dynamic path)
      const isLoginPage = path.startsWith('/login');
      const isPublicPage = publicPaths.includes(path);

      if (!isLoginPage && !isPublicPage) {
        window.location.href = '/';
      }
    }

    return Promise.reject({ message, status });
  }
);

export default api;