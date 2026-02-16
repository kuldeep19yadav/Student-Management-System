import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

// Attach JWT token to every outgoing request
export const setAuthToken = (token) => {
  api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

export default api;
