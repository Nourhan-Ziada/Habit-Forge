import api from "../lib/api";

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post("/auth/login", { email, password });
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  async register(email, password) {
    try {
      const response = await api.post("/auth/register", { email, password });
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  async logout() {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      throw error;
    }
  },
};

