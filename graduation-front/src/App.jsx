import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";  // Make sure this is imported

// Import your pages and components
import Hero from "./components/Hero";
import Services from "./components/Services";
import Banner from "./components/Banner";
import Sponsers from "./components/Sponsers";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import About from "./pages/About";
import MyCourses from "./pages/MyCourses";
import MyProfile from "./pages/MyProfile";
import CourseDesc from "./pages/CourseDesc";
import DashboardPage from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Pharmacists from "./pages/Pharmacists";
import ViewCourses from "./pages/ViewCourses";
import UploadCourse from "./pages/UploadCourse";
import AdminProfile from "./pages/AdminProfile";
import Login from "./pages/Login";
import Layout from "./pages/layout";

// Public Routes
const App = () => {
  return (
    <main className="overflow-x-hidden bg-white text-blue">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Services />
                <Banner />
                <Sponsers />
                <Footer />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/courseDesc" element={<CourseDesc />} />
          <Route path="/myCourses" element={<MyCourses />} />
          <Route path="/myProfile" element={<MyProfile />} />

          {/* Protected Routes */}
          <Route path="/layout" element={<Layout />}>
            {/* Protected Routes for Admin */}
            <Route
              index
              element={
                <ProtectedRoute
                  element={<DashboardPage />}
                  requiredRole="Admin"
                  redirectTo="/login"
                />
              }
            />
            <Route
              path="analytics"
              element={
                <ProtectedRoute
                  element={<h1 className="title">التحليلات البيانية</h1>}
                  requiredRole="Admin"
                  redirectTo="/login"
                />
              }
            />
            <Route
              path="reports"
              element={
                <ProtectedRoute
                  element={<h1 className="title">التقارير</h1>}
                  requiredRole="Admin"
                  redirectTo="/login"
                />
              }
            />
            <Route
              path="Doctors"
              element={
                <ProtectedRoute
                  element={<Doctors />}
                  requiredRole="Admin"
                  redirectTo="/login"
                />
              }
            />
            <Route
              path="Pharmacists"
              element={
                <ProtectedRoute
                  element={<Pharmacists />}
                  requiredRole="Admin"
                  redirectTo="/login"
                />
              }
            />
            <Route
              path="ViewCourses"
              element={
                <ProtectedRoute
                  element={<ViewCourses />}
                  requiredRole="Admin"
                  redirectTo="/login"
                />
              }
            />
            <Route
              path="UploadCourse"
              element={
                <ProtectedRoute
                  element={<UploadCourse />}
                  requiredRole="Admin"
                  redirectTo="/login"
                />
              }
            />
            <Route
              path="AdminProfile"
              element={
                <ProtectedRoute
                  element={<AdminProfile />}
                  requiredRole="Admin"
                  redirectTo="/login"
                />
              }
            />
          </Route>
        </Routes>
      </Router>
    </main>
  );
};

export default App;
