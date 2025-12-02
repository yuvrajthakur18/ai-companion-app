import React, { useState } from "react";
import { login, register } from "../services/api";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // "" = none, "success" or "error"

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleLogin = async () => {
    try {
      await login(username, password);
      onLogin();
    } catch (err) {
      showMessage("Login failed. Please check your credentials.", "error");
    }
  };

  const handleRegister = async () => {
    try {
      await register(username, password);
      showMessage("Registered successfully! You can now log in.", "success");
      setIsRegister(false); // Switch to login after register
    } catch (err) {
      showMessage("Registration failed. Username may already exist.", "error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isRegister ? handleRegister() : handleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8">
        {/* Split Layout: Full screen flex for image + form */}
        <div className="flex flex-col md:flex-row md:space-x-8 md:max-w-4xl mx-auto">
          {/* Left: Image Section */}
          <div className="md:w-1/2 flex-shrink-0 hidden md:flex items-center justify-center">
            <img
              className="h-48 w-full object-cover rounded-lg shadow-lg"
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
              alt="AI Companion Illustration"
            />
          </div>

          {/* Right: Form Section */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <div className="w-full mx-auto">
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                {isRegister ? "Join the AI Companion Hub" : "Welcome Back"}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                {isRegister
                  ? "Create your account to start building companions."
                  : "Sign in to your account"}
              </p>

              {/* Notification */}
              {message.text && (
                <div
                  className={`mt-4 p-4 rounded-md shadow-sm ${
                    message.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <input
                      type="text"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                  >
                    {isRegister ? "Register" : "Login"}
                  </button>
                </div>

                <div className="text-sm text-center">
                  <button
                    type="button"
                    onClick={() => setIsRegister(!isRegister)}
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200"
                  >
                    {isRegister
                      ? "Already have an account? Login"
                      : "Don't have an account? Register"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
