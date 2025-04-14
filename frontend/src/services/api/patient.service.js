import api from "./config";

export const patientService = {
  getPatientById: async (id) => {
    try {
      const response = await api.get(`/patients/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch patient");
    }
  },

  updatePatientProfile: async (id, data) => {
    try {
      const response = await api.put(`/patients/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to update patient profile");
    }
  },

  getPatientAppointments: async (id) => {
    try {
      const response = await api.get(`/patients/${id}/appointments`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch appointments");
    }
  },

  createAppointment: async (appointmentData) => {
    try {
      const response = await api.post(
        `/patients/appointments`,
        appointmentData
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to create appointment");
    }
  },

  cancelAppointment: async (appointmentId) => {
    try {
      const response = await api.delete(
        `/patients/appointments/${appointmentId}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to cancel appointment");
    }
  },
};