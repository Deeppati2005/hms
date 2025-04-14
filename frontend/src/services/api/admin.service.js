import api from "./config";

export const adminService = {
  getAllDoctors: async () => {
    try {
      const response = await api.get("/admins/doctors");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch doctors");
    }
  },

  updateDoctorStatus: async (id, statusData) => {
    try {
      const response = await api.put(
        `/admins/doctors/${id}/status`,
        statusData
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to update doctor status");
    }
  },

  getAllPatients: async () => {
    try {
      const response = await api.get("/admins/patients");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch patients");
    }
  },

  deletePatient: async (username) => {
    try {
      const response = await api.delete(`/admins/patients/${username}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to delete patient");
    }
  },

  getAllAppointments: async () => {
    try {
      const response = await api.get("/admins/appointments");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch appointments");
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/admins/profile", profileData);
      return response.data;
    } catch (error) {
      throw new Error("Failed to update profile");
    }
  },
};