import axios from "axios";
import { useAuthStore } from "@/lib/store/auth";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add cache buster to GET requests
  if (config.method?.toLowerCase() === "get") {
    config.params = { ...config.params, _t: Date.now() };
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(
          "/api/auth/refresh",
          {
            refreshToken,
          }
        );

        useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        // Create a more specific error for failed token refresh
        const authError = new Error(
          "Authentication failed - please login again"
        );
        authError.name = "AuthenticationError";
        return Promise.reject(authError);
      }
    }
    return Promise.reject(error);
  }
);
