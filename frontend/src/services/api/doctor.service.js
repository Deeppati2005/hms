import api from "./config";

export const doctorService = {
  getAllDoctors: async () => {
    try {
      const response = await api.get("/doctors");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch doctors");
    }
  },

  getDoctorById: async (id) => {
    try {
      const response = await api.get(`/doctors/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch doctor");
    }
  },

  updateDoctorProfile: async (id, data) => {
    try {
      const response = await api.put(`/doctors/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to update doctor profile");
    }
  },

  getDoctorAppointments: async (id) => {
    try {
      const response = await api.get(`/doctors/${id}/appointments`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch appointments");
    }
  },

  updateAppointmentStatus: async (appointmentId, data) => {
    try {
      const response = await api.put(
        `/doctors/appointments/${appointmentId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to update appointment");
    }
  },
};