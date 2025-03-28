import { useState } from "react";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { jwtDecode } from "jwt-decode";
import { validateLoginForm } from "../utils/validationUtils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");
    setIsLoading(true);

    // Validate form before making API call
    const validationErrors = validateLoginForm(email, password);
    
    if (validationErrors.email || validationErrors.password) {
      setEmailError(validationErrors.email);
      setPasswordError(validationErrors.password);
      setIsLoading(false);
      return;
    }
  
    const payload = {
      email: email.trim(),
      password: password.trim(),
    };
  
    try {
      const response = await fetch("http://localhost:8089/api/v1/auth/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Handle successful login
        localStorage.setItem("access_token", data.accessToken);
        localStorage.setItem("refresh_token", data.refreshToken);
        localStorage.setItem("isAuthenticated", "true");
  
        const decodedToken = jwtDecode(data.accessToken);
        if (decodedToken.roles.includes("Admin")) {
          window.location.replace("/layout/ViewCourses");
        } else {
          window.location.replace("/");
        }
      } else {
        if (data.email) setEmailError(data.email);
        if (data.password) setPasswordError(data.password);
        if (data.message) setError(data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
          className="w-full max-w-md bg-light rounded-xl shadow-md p-8"
        >
          <h2 className="text-3xl font-bold text-red mb-6 text-center">Login</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>  
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="text-m font-medium text-blue block mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white-300 text-red border-b-2 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
                disabled={isLoading}
              />
              {emailError && <p className="text-red text-xs">{emailError}</p>}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="text-m font-medium text-blue block mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white text-red border-b-2 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
                disabled={isLoading}
              />
              {passwordError && <p className="text-red text-xs">{passwordError}</p>}
            </div>

            {/* General Error Message */}
            {error && (
                <p className="text-red text-sm">{error}</p>
            )}

            {/* Submit Button */}
            <button
              className={`w-full text-l bg-red text-white text-center py-3 px-5 rounded-md 
                ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue transition duration-300"}`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
