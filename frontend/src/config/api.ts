import axios from 'axios'
import { baseURL } from './constants'

const api = axios.create({
    baseURL,
    withCredentials: true,
});

let csrfTokenInternal: string | null = null;

export const injectCsrfToken = (token: string | null) => {
    csrfTokenInternal = token;
};

export const clearCsrfToken = () => {
    delete api.defaults.headers.common['X-CSRF-TOKEN'];
};

api.interceptors.request.use((config) => {
    if (csrfTokenInternal) {
        config.headers['X-CSRF-TOKEN'] = csrfTokenInternal;
    }
    return config;
});

let syncTokenWithContext: ((token: string | null) => void) | null = null;

export const registerTokenSync = (fn: (token: string | null) => void) => {
    syncTokenWithContext = fn;
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const res = await axios.get(`${baseURL}/auth/refresh`, { withCredentials: true });
                const token = res.data.csrfToken;

                if (token && syncTokenWithContext) {
                    syncTokenWithContext(token);
                }

                return api(originalRequest);
            } catch (refreshError) {
                if (syncTokenWithContext) syncTokenWithContext(null);
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api