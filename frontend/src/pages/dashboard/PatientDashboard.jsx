import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { doctorService, appointmentService } from "../../services/api";
import toast from "react-hot-toast";

function Dashboard() {
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalAppointments: 0,
    availableDoctors: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const appointments = await appointmentService.getAppointments();
      const doctors = await doctorService.getAllDoctors();

      setStats({
        upcomingAppointments: appointments.filter(
          (a) => new Date(a.date) > new Date()
        ).length,
        totalAppointments: appointments.length,
        availableDoctors: doctors.filter((d) => d.status === "approved").length,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Patient Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Upcoming Appointments
          </h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {stats.upcomingAppointments}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Total Appointments
          </h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {stats.totalAppointments}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Available Doctors
          </h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {stats.availableDoctors}
          </p>
        </div>
      </div>
    </div>
  );
}

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    };

    fetchAppointments();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        My Appointments
      </h1>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {appointment.doctorName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {appointment.date} at {appointment.time}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    appointment.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                      : appointment.status === "confirmed"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      const data = await doctorService.getAllDoctors();
      // Only show approved doctors
      setDoctors(data.filter((doctor) => doctor.status === "approved"));
    };

    fetchDoctors();
  }, []);

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select both date and time");
      return;
    }

    try {
      await appointmentService.createAppointment({
        doctorId: selectedDoctor.id,
        date: selectedDate,
        time: selectedTime,
      });
      toast.success("Appointment booked successfully!");
      setShowBookingModal(false);
      setSelectedDoctor(null);
      setSelectedDate("");
      setSelectedTime("");
    } catch (error) {
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  // Get available time slots for the selected date
  const getTimeSlots = () => {
    const slots = [];
    for (let i = 9; i <= 17; i++) {
      slots.push(`${i}:00`);
      if (i !== 17) slots.push(`${i}:30`);
    }
    return slots;
  };

  // Get minimum date (today) for date picker
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Available Doctors
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {doctor.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {doctor.specialty}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Experience: {doctor.experience} years
            </p>
            <button
              onClick={() => {
                setSelectedDoctor(doctor);
                setShowBookingModal(true);
              }}
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowBookingModal(false)}
          ></div>
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all p-6">
              <button
                onClick={() => setShowBookingModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Book Appointment with Dr. {selectedDoctor.name}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Date
                  </label>
                  <input
                    type="date"
                    min={getMinDate()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select a time slot</option>
                    {getTimeSlots().map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleBookAppointment}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PatientDashboard() {
  return (
    <DashboardLayout role="patient">
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="doctors" element={<Doctors />} />
      </Routes>
    </DashboardLayout>
  );
}

export default PatientDashboard;
