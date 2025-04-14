import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  Home,
  Calendar,
  Users,
  User,
  Settings,
  Activity,
} from "lucide-react";
import { authService } from "../services/api";
import toast from "react-hot-toast";
import { ThemeToggle } from "./ThemeToggle";

function DashboardLayout({ children, role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const menuItems = {
    patient: [
      { icon: Home, label: "Dashboard", path: "/patient" },
      { icon: Calendar, label: "Appointments", path: "/patient/appointments" },
      { icon: Users, label: "Doctors", path: "/patient/doctors" },
      { icon: User, label: "Profile", path: "/patient/profile" },
    ],
    doctor: [
      { icon: Home, label: "Dashboard", path: "/doctor" },
      { icon: Calendar, label: "Appointments", path: "/doctor/appointments" },
      { icon: User, label: "Profile", path: "/doctor/profile" },
    ],
    admin: [
      { icon: Home, label: "Dashboard", path: "/admin" },
      { icon: Users, label: "Doctors", path: "/admin/doctors" },
      { icon: Users, label: "Patients", path: "/admin/patients" },
      { icon: Calendar, label: "Appointments", path: "/admin/appointments" },
      { icon: Settings, label: "Settings", path: "/admin/settings" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 bg-indigo-600 dark:bg-indigo-900">
            <span className="text-xl font-bold text-white">
              {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
            </span>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems[role].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">{children}</div>
    </div>
  );
}

export default DashboardLayout;
