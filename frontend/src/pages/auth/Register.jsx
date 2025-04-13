import React, { useState } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { Stethoscope } from "lucide-react";
import { authService } from "../../services/api";
import toast from "react-hot-toast";

const securityQuestions = [
  "What was your first pet's name?",
  "In which city were you born?",
  "What is your mother's maiden name?",
  "What was your first car?",
  "What is your favorite book?",
];

function Register() {
  const { role } = useParams();
  const navigate = useNavigate();

  // Redirect if trying to access admin registration
  if (role === "admin") {
    return <Navigate to="/login/admin" />;
  }

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    securityQuestion: securityQuestions[0],
    securityAnswer: "",
    ...(role === "doctor" && {
      specialty: "",
      experience: "",
      status: "pending", // Set initial status for doctors
    }),
  });
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  // Debounce timer for username check
  let usernameCheckTimer;

  const checkUsername = async (username) => {
    if (!username) {
      setUsernameError("");
      return;
    }

    setIsCheckingUsername(true);
    try {
      const isAvailable = await authService.checkUsernameAvailability(
        username,
        role
      );
      if (isAvailable) {
        setUsernameError(""); // Username is available
      } else {
        setUsernameError(
          "This username is already taken. Please choose another."
        );
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameError(
        "Unable to check username availability. Please try again later."
      );
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleUsernameChange = (e) => {
    const username = e.target.value;
    setFormData({ ...formData, username });

    // Clear previous timer
    clearTimeout(usernameCheckTimer);

    // Set new timer to check username after user stops typing
    usernameCheckTimer = setTimeout(() => {
      checkUsername(username);
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (usernameError) {
      toast.error("Please choose a different username");
      return;
    }

    setLoading(true);
    try {
      await authService.register(role, formData);
      if (role === "doctor") {
        toast.success(
          "Registration successful! Please wait for admin approval before logging in."
        );
      } else {
        toast.success("Registration successful! Please login.");
      }
      navigate(`/login/${role}`);
    } catch (error) {
      if (error.response?.data?.message === "Username already exists") {
        setUsernameError(
          "This username is already taken. Please choose another."
        );
        toast.error("Username already exists. Please choose another.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Stethoscope className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Register as {role.charAt(0).toUpperCase() + role.slice(1)}
        </h2>
        {role === "doctor" && (
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Note: Your account will need admin approval before you can log in
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <div className="mt-1 relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    usernameError ? "border-red-300" : "border-gray-300"
                  } dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
                  value={formData.username}
                  onChange={handleUsernameChange}
                />
                {isCheckingUsername && (
                  <div className="absolute right-2 top-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                  </div>
                )}
              </div>
              {usernameError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {usernameError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {role === "doctor" ? "Doctor Name" : "Patient Name"}
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {role === "doctor" ? "Doctor Email" : "Patient Email"}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {role === "doctor" ? "Doctor Password" : "Patient Password"}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {role === "doctor" ? "Doctor Phone No" : "Patient Phone No"}
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            {role === "doctor" && (
              <>
                <div>
                  <label
                    htmlFor="specialty"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Doctor Specialty
                  </label>
                  <div className="mt-1">
                    <input
                      id="specialty"
                      name="specialty"
                      type="text"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      value={formData.specialty}
                      onChange={(e) =>
                        setFormData({ ...formData, specialty: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Doctor Experience (years)
                  </label>
                  <div className="mt-1">
                    <input
                      id="experience"
                      name="experience"
                      type="number"
                      required
                      min="0"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="securityQuestion"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Security Question
              </label>
              <div className="mt-1">
                <select
                  id="securityQuestion"
                  name="securityQuestion"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  value={formData.securityQuestion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      securityQuestion: e.target.value,
                    })
                  }
                >
                  {securityQuestions.map((question, index) => (
                    <option key={index} value={question}>
                      {question}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="securityAnswer"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Security Answer
              </label>
              <div className="mt-1">
                <input
                  id="securityAnswer"
                  name="securityAnswer"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  value={formData.securityAnswer}
                  onChange={(e) =>
                    setFormData({ ...formData, securityAnswer: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || isCheckingUsername || usernameError}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to={`/login/${role}`}
                    className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                  >
                    Sign in
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
