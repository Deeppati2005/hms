import api from "./config";

export const appointmentService = {
  getAppointments: async () => {
    try {
      const response = await api.get("/appointments");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch appointments");
    }
  },

  getAppointmentById: async (id) => {
    try {
      const response = await api.get(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch appointment");
    }
  },

  createAppointment: async (appointmentData) => {
    try {
      const response = await api.post(`/appointments`, appointmentData);
      return response.data;
    } catch (error) {
      throw new Error("Failed to create appointment");
    }
  },

  updateAppointment: async (id, data) => {
    try {
      const response = await api.put(`/appointments/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to update appointment");
    }
  },

  deleteAppointment: async (id) => {
    try {
      const response = await api.delete(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to delete appointment");
    }
  },

  getAvailableSlots: async () => {
    try {
      const response = await api.get("/appointments/available-slots");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch available slots");
    }
  },
};