import api from "./config";

export const authService = {
  login: async (role, credentials) => {
    try {
      // Validate required fields
      if (!credentials.username || !credentials.password) {
        throw new Error("Username and password are required");
      }

      // For doctors, first check their status
      if (role === "doctor") {
        const statusCheck = await api.post("/doctors/check-status", {
          username: credentials.username,
        });

        if (!statusCheck.data.approved) {
          if (statusCheck.data.status === "pending") {
            throw new Error(
              "Your account is pending approval. Please wait for admin verification."
            );
          } else if (statusCheck.data.status === "rejected") {
            throw new Error(
              "Your account has been rejected. Please contact administration."
            );
          }
        }
      }

      // Call the appropriate login endpoint based on role
      const response = await api.post(`/${role}s/login`, {
        username: credentials.username,
        password: credentials.password,
      });

      // Check if we got a valid user back
      if (!response.data) {
        throw new Error("Invalid credentials");
      }

      // Store user data in localStorage
      const userData = {
        ...response.data,
        role: role,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userRole", role);

      return userData;
    } catch (error) {
      localStorage.clear();
      if (error.response?.status === 401) {
        throw new Error("Invalid username or password");
      }
      throw error;
    }
  },

  register: async (role, userData) => {
    try {
      let response;
      if (role === "doctor") {
        response = await api.post("/doctors/register", {
          ...userData,
          status: "pending", // Set initial status as pending for doctors
        });
      } else if (role === "patient") {
        response = await api.post("/patients/register", userData);
      } else {
        throw new Error("Invalid role for registration");
      }
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error("Username already exists");
      }
      throw new Error("Registration failed");
    }
  },

  checkUsernameAvailability: async (username, role) => {
    try {
      const response = await api.get(`/${role}s/check-username/${username}`);
      return response.data.available;
    } catch (error) {
      throw new Error("Username availability check failed");
    }
  },

  resetPassword: async (formData) => {
    try {
      // Check if all required fields are provided
      if (
        !formData.username ||
        !formData.securityAnswer ||
        !formData.newPassword
      ) {
        throw new Error("All fields are required");
      }

      // Prepare reset data
      const resetData = {
        username: formData.username,
        securityAnswer: formData.securityAnswer,
        newPassword: formData.newPassword,
      };

      // Call the reset-password endpoint
      const response = await api.post(
        `/${formData.role}s/reset-password`,
        resetData
      );

      // Handle response messages
      if (response.data === "Invalid security answer") {
        throw new Error("Invalid security answer. Please try again.");
      } else if (response.data === "User not found") {
        throw new Error("User not found. Please check your username.");
      } else if (response.data !== "Password reset successfully") {
        throw new Error("Password reset failed. Please try again.");
      }

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data || error.message || "Password reset failed"
      );
    }
  },

  logout: async () => {
    try {
      const userRole = localStorage.getItem("userRole");
      await api.post(`/${userRole}s/logout`);
      localStorage.clear();
    } catch (error) {
      localStorage.clear();
      throw new Error("Logout failed");
    }
  },

  checkAuth: async () => {
    try {
      const userRole = localStorage.getItem("userRole");
      const userData = localStorage.getItem("user");

      if (!userRole || !userData) {
        throw new Error("No authentication data found");
      }

      // For doctors, verify their status is still approved
      if (userRole === "doctor") {
        const parsedUserData = JSON.parse(userData);
        const statusCheck = await api.post("/doctors/check-status", {
          username: parsedUserData.username,
        });

        if (!statusCheck.data.approved) {
          throw new Error("Account no longer approved");
        }
      }

      return JSON.parse(userData);
    } catch (error) {
      localStorage.clear();
      throw new Error("Authentication failed");
    }
  },
};