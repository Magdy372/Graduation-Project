import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { jwtDecode } from "jwt-decode";
import { validateLoginForm } from "../utils/validationUtils";
import loginPic from "../assets/images/reg.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const accessToken = localStorage.getItem("access_token");
    
    if (isAuthenticated && accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        if (decodedToken.roles.includes("Admin")) {
          window.location.replace("/layout/ViewCourses");
        } else {
          window.location.replace("/");
        }
      } catch (error) {
        // If token is invalid, clear the authentication state
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("isAuthenticated");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");
    setIsLoading(true);

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
        // Handle structured error response
        if (data.errors) {
          // Set field-specific errors
          if (data.errors.email) setEmailError(data.errors.email);
          if (data.errors.password) setPasswordError(data.errors.password);
          if (data.errors.general) setError(data.errors.general);
        } else {
          // Fallback for unexpected error format
          setError(data.message || "An unexpected error occurred. Please try again.");
        }
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
      <div className="flex-grow flex justify-center mt-10">
        <div className=" ml-5 mr-5 w-full flex bg-white rounded-3xl shadow-lg overflow-hidden h-[500px]">
          {/* Left Side - Image with Overlay */}
          <div className="relative w-1/2 h-full">
            <img 
              src={loginPic}
              alt="Login Background" 
              className="w-full h-full object-cover rounded-l-3xl"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-l-3xl"></div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-1/2 p-8 flex items-center justify-center h-full">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
              className="w-full max-w-md"
            >
              <h2 className="text-3xl font-bold text-red mb-6 text-center">Login</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>  
                <div>
                  <label htmlFor="email" className="text-lg font-medium text-blue block mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white-300 text-red text-lg border-b-2 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
                    disabled={isLoading}
                  />
                  {emailError && <p className="text-red text-m">{emailError}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="text-lg font-medium text-blue block mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white text-red text-lg border-b-2 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
                    disabled={isLoading}
                  />
                  {passwordError && <p className="text-red text-m">{passwordError}</p>}
                </div>

                {error && <p className="text-red text-m">{error}</p>}

                <button
                  className={`w-full text-l bg-red text-white text-center py-3 px-5 rounded-md 
                    ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue transition duration-300"}`}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
                <h2 className="text-m text-center">
                  Don't have an account?     
                  <a href="/register" className="text-red underline">Register here</a>
                </h2>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;