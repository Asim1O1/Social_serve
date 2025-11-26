import axios from "axios";

export const apiPublic = axios.create({
  baseURL: import.meta.env.VITE_BE,
});

export const api = axios.create({
  baseURL: import.meta.env.VITE_BE,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh-token");
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
