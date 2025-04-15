import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import {
  doctorService,
  appointmentService,
  authService,
} from "../../services/api";
import toast from "react-hot-toast";
import { Calendar, Clock, User, Phone, Mail, Award } from "lucide-react";

function Dashboard() {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalPatients: 0,
  });
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userData = await authService.checkAuth();
        setUsername(userData.username);
        setName(userData.name);

        const appointments = await appointmentService.getAppointments();
        const doctorAppointments = appointments.filter(
          (a) => a.doctorUsername === userData.username
        );

        const today = new Date().toISOString().split("T")[0];

        setStats({
          todayAppointments: doctorAppointments.filter((a) => a.date === today)
            .length,
          pendingAppointments: doctorAppointments.filter(
            (a) => a.status === "pending"
          ).length,
          totalPatients: new Set(
            doctorAppointments.map((a) => a.patientUsername)
          ).size,
        });
      } catch (error) {
        toast.error("Failed to fetch dashboard data");
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Welcome, Dr. {name}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Today's Appointments
          </h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {stats.todayAppointments}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Pending Appointments
          </h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {stats.pendingAppointments}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Total Patients
          </h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {stats.totalPatients}
          </p>
        </div>
      </div>
    </div>
  );
}

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userData = await authService.checkAuth();
        setUsername(userData.username);

        const data = await appointmentService.getAppointments();
        // Filter appointments for the logged-in doctor
        setAppointments(
          data.filter(
            (appointment) => appointment.doctorUsername === userData.username
          )
        );
      } catch (error) {
        toast.error("Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusChange = async (appointment, newStatus) => {
    try {
      const updatedAppointment = {
        ...appointment,
        status: newStatus,
        date: appointment.date,
        time: appointment.time,
        doctorUsername: username,
        patientUsername: appointment.patientUsername,
      };

      await appointmentService.updateAppointment(
        appointment.id,
        updatedAppointment
      );

      setAppointments(
        appointments.map((app) =>
          app.id === appointment.id ? { ...app, status: newStatus } : app
        )
      );

      toast.success(
        `Appointment ${
          newStatus === "completed"
            ? "marked as complete"
            : status === "confirmed"
            ? "confirmed"
            : "cancelled"
        }`
      );
    } catch (error) {
      toast.error("Failed to update appointment status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
    }
  };

  const filteredAppointments = appointments
    .filter((appointment) => {
      if (filter === "all") return true;
      return appointment.status === filter;
    })
    .filter((appointment) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        appointment.patientUsername?.toLowerCase().includes(searchLower) ||
        appointment.date?.toLowerCase().includes(searchLower) ||
        appointment.time?.toLowerCase().includes(searchLower) ||
        appointment.status?.toLowerCase().includes(searchLower)
      );
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Appointments
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Patient Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {appointment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {appointment.patientUsername}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {appointment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {appointment.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {appointment.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(appointment, "confirmed")
                          }
                          className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-2"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(appointment, "cancelled")
                          }
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {appointment.status === "confirmed" && (
                      <button
                        onClick={() =>
                          handleStatusChange(appointment, "completed")
                        }
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      >
                        Mark Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Profile() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    specialty: "",
    experience: "",
    securityQuestion: "",
    securityAnswer: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);

  const securityQuestions = [
    "What was your first pet's name?",
    "In which city were you born?",
    "What is your mother's maiden name?",
    "What was your first car?",
    "What is your favorite book?",
  ];

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const userData = await authService.checkAuth();
        setFormData({
          username: userData.username,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          specialty: userData.specialty,
          experience: userData.experience,
          securityQuestion: userData.securityQuestion,
          securityAnswer: userData.securityAnswer,
          password: "", // Initialize password as empty
        });
      } catch (error) {
        toast.error("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await doctorService.updateDoctorProfile(formData.username, formData);
      toast.success("Profile updated successfully");

      // Update local storage with new user data
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Personal Information
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Username Field (Readonly) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  readOnly
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 cursor-not-allowed text-gray-700 dark:text-gray-300"
                />
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                  required
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                  required
                />
              </div>

              {/* Specialty Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Specialty
                </label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) =>
                    setFormData({ ...formData, specialty: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                  required
                />
              </div>

              {/* Experience Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Experience (years)
                </label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                  required
                />
              </div>

              {/* Security Question Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Security Question
                </label>
                <select
                  value={formData.securityQuestion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      securityQuestion: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                  required
                >
                  {securityQuestions.map((question, index) => (
                    <option key={index} value={question}>
                      {question}
                    </option>
                  ))}
                </select>
              </div>

              {/* Security Answer Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Security Answer
                </label>
                <input
                  type="text"
                  value={formData.securityAnswer}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      securityAnswer: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                  required
                />
              </div>

              {/* New Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function DoctorDashboard() {
  return (
    <DashboardLayout role="doctor">
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </DashboardLayout>
  );
}

export default DoctorDashboard;
