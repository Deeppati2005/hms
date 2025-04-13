import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { appointmentService } from '../../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalPatients: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const appointments = await appointmentService.getAppointments();
      const today = new Date().toISOString().split('T')[0];
      
      setStats({
        todayAppointments: appointments.filter(a => a.date === today).length,
        pendingAppointments: appointments.filter(a => a.status === 'pending').length,
        totalPatients: new Set(appointments.map(a => a.patientName)).size,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Today's Appointments</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{stats.todayAppointments}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Pending Appointments</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{stats.pendingAppointments}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Patients</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{stats.totalPatients}</p>
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

  const handleStatusChange = async (appointmentId, newStatus) => {
    // Mock status update - replace with actual API call
    setAppointments(appointments.map(app =>
      app.id === appointmentId ? { ...app, status: newStatus } : app
    ));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Manage Appointments</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{appointment.patientName}</p>
                  <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
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
      </Routes>
    </DashboardLayout>
  );
}

export default DoctorDashboard;