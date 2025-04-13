import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  Users,
  ShieldCheck,
  Clock,
  Award,
  Phone,
  LogIn,
  UserPlus,
} from "lucide-react";

function LandingPage() {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openRoleModal = (type) => {
    setModalType(type);
    setShowRoleModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowRoleModal(false);
    document.body.style.overflow = "unset";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeModal}
          ></div>
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-auto transform transition-all">
              <div className="p-8">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
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
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                  {modalType === "signin" ? "Sign In" : "Sign Up"} as
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <Link
                    to={`/${
                      modalType === "signin" ? "login" : "register"
                    }/patient`}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-blue-500"
                    onClick={closeModal}
                  >
                    <div className="bg-blue-50 dark:bg-blue-900/50 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Patient
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Schedule appointments and manage your healthcare
                    </p>
                  </Link>

                  <Link
                    to={`/${
                      modalType === "signin" ? "login" : "register"
                    }/doctor`}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-green-500"
                    onClick={closeModal}
                  >
                    <div className="bg-green-50 dark:bg-green-900/50 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-green-100 dark:group-hover:bg-green-900">
                      <Stethoscope className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Doctor
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Manage patients and appointments
                    </p>
                  </Link>

                  <Link
                    to={`/${
                      modalType === "signin" ? "login" : "register"
                    }/admin`}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-purple-500"
                    onClick={closeModal}
                  >
                    <div className="bg-purple-50 dark:bg-purple-900/50 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-purple-100 dark:group-hover:bg-purple-900">
                      <ShieldCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Admin
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Manage system and monitor operations
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Navigation */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-800 dark:from-blue-900 dark:to-indigo-950 h-[600px]">
        <nav className="absolute w-full bg-transparent z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              <div className="flex items-center">
                <Stethoscope className="h-8 w-8 text-white" />
                <span className="ml-2 text-xl font-bold text-white">
                  MediCare Plus
                </span>
              </div>
              <div className="flex items-center space-x-8">
                <div className="hidden md:flex space-x-6 items-center">
                  <button
                    onClick={() => scrollToSection("about")}
                    className="text-white hover:text-blue-200 transition-colors"
                  >
                    About
                  </button>
                  <button
                    onClick={() => scrollToSection("services")}
                    className="text-white hover:text-blue-200 transition-colors"
                  >
                    Services
                  </button>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="text-white hover:text-blue-200 transition-colors"
                  >
                    Contact
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => openRoleModal("signin")}
                    className="flex items-center text-white hover:text-blue-200 transition-colors"
                  >
                    <LogIn className="h-5 w-5 mr-1" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => openRoleModal("signup")}
                    className="flex items-center bg-white text-blue-600 dark:bg-gray-800 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <UserPlus className="h-5 w-5 mr-1" />
                    <span>Sign Up</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>

        <div className="relative max-w-7xl mx-auto pt-32 px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-6">
              Your Health, Our Priority
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              MediCare Plus brings world-class healthcare to your fingertips.
              With over 20 years of excellence, we combine cutting-edge
              technology with compassionate care.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => openRoleModal("signup")}
                className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              >
                Book Appointment
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              About Us
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              MediCare Plus is a leading healthcare provider committed to
              delivering exceptional medical services. Our state-of-the-art
              facilities and dedicated team of healthcare professionals ensure
              that you receive the highest quality of care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                50+
              </div>
              <div className="mt-2 text-gray-600 dark:text-gray-400">
                Specialist Doctors
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                10k+
              </div>
              <div className="mt-2 text-gray-600 dark:text-gray-400">
                Happy Patients
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                15+
              </div>
              <div className="mt-2 text-gray-600 dark:text-gray-400">
                Years Experience
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                24/7
              </div>
              <div className="mt-2 text-gray-600 dark:text-gray-400">
                Emergency Care
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Our Services
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Comprehensive healthcare solutions for you and your family
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <Clock className="h-12 w-12 text-blue-500 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                24/7 Emergency Care
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Round-the-clock emergency medical services with rapid response
                teams.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <Award className="h-12 w-12 text-green-500 dark:text-green-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Specialized Treatment
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Expert care across multiple specialties with latest medical
                technologies.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <Phone className="h-12 w-12 text-purple-500 dark:text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Online Consultations
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Virtual consultations with experienced healthcare professionals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Type Section */}
      <div className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Access Your Portal
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Seamless healthcare management for all users
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Link
              to="/login/patient"
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl shadow-md p-8 hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <Users className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                For Patients
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Schedule appointments, access medical records, and consult with
                doctors online
              </p>
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                Login as Patient →
              </span>
            </Link>

            <Link
              to="/login/doctor"
              className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 rounded-xl shadow-md p-8 hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <Stethoscope className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                For Doctors
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Manage appointments, patient records, and provide virtual
                consultations
              </p>
              <span className="text-green-600 dark:text-green-400 font-medium">
                Login as Doctor →
              </span>
            </Link>

            <Link
              to="/login/admin"
              className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50 rounded-xl shadow-md p-8 hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <ShieldCheck className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                For Admins
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Monitor system operations, manage users, and analyze healthcare
                metrics
              </p>
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                Login as Admin →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Contact Us
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              We're here to help you 24/7
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Phone className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Emergency
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                +1 (555) 123-4567
              </p>
            </div>
            <div>
              <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Working Hours
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                24/7 for Emergency
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Mon-Sat: 8AM - 8PM for Regular Appointments
              </p>
            </div>
            <div>
              <Award className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Location
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                123 Healthcare Avenue
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Medical District, NY 10001
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Stethoscope className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">MediCare Plus</span>
              </div>
              <p className="text-gray-400">
                Providing world-class healthcare services with compassion and
                excellence.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => scrollToSection("services")}
                    className="hover:text-white"
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="hover:text-white"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="hover:text-white"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Emergency Care</li>
                <li>Online Consultation</li>
                <li>Specialized Treatment</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Facebook</li>
                <li>Twitter</li>
                <li>LinkedIn</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2024 MediCare Plus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
