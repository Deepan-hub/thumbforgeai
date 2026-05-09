import axios from 'axios';

const getBaseURL = () => {
    // Use env variable if set (recommended for production)
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // Fallback for local development
    return 'http://localhost:3000';
};

const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true
});

export default api;