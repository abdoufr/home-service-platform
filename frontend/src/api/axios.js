import axios from 'axios';

// Base URLs pour les microservices
const AUTH_BASE_URL = process.env.REACT_APP_AUTH_URL || 'http://localhost:8001/api/auth';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8002/api';

// Instance Auth
const authAPI = axios.create({
    baseURL: AUTH_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Instance API métier
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Intercepteur — injecter le token JWT
const addAuthInterceptor = (instance) => {
    instance.interceptors.request.use(
        (config) => {
            const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
            if (tokens.access) {
                config.headers.Authorization = `Bearer ${tokens.access}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
                    const response = await authAPI.post('/token/refresh/', {
                        refresh: tokens.refresh,
                    });
                    const newTokens = {
                        ...tokens,
                        access: response.data.access,
                    };
                    localStorage.setItem('tokens', JSON.stringify(newTokens));
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                    return instance(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('tokens');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
};

addAuthInterceptor(api);
addAuthInterceptor(authAPI);

export { authAPI, api };
export default api;