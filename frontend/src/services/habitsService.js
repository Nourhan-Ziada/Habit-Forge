import api from "../lib/api";

export const habitsService = {
  async getHabits() {
    try {
      const response = await api.get("/habits");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch habits:", error);
      throw error;
    }
  },
  async getHabitById(habitId) {
    try {
      const response = await api.get(`/habits/${habitId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch habit by ID:", error);
      throw error;
    }
  },

  async createHabit(habitData) {
    try {
      const response = await api.post("/habits", habitData);
      return response.data;
    } catch (error) {
      console.error("Failed to create habit:", error);
      throw error;
    }
  },

  async updateHabit(habitId, habitData) {
    try {
      const response = await api.put(`/habits/${habitId}`, habitData);
      return response.data;
    } catch (error) {
      console.error("Failed to update habit:", error);
      throw error;
    }
  },

  async deleteHabit(habitId) {
    try {
      const response = await api.delete(`/habits/${habitId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete habit:", error);
      throw error;
    }
  },

   async getHabitsWithTodayStatus() {
    try {
      const response = await api.get("/habits/today");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch habits:", error);
      throw error;
    }
  },
async toggleHabitCompletion(entryHabit) {
    try {
      const response = await api.post(`/habits/entries`, entryHabit);
      return response.data;
    } catch (error) {
      console.error("Failed to toggle habit completion:", error);
      throw error;
    }
  },

  async getHabitStats (habitId, from, to) {
    try {
      const response = await api.get(`/habits/${habitId}/stats`, {
        params: {
          from: from.toISOString(),
          to: to.toISOString(),
        },
      });
      console.log("Habit stats fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch habit stats:", error);
      throw error;
    }
  }


};  