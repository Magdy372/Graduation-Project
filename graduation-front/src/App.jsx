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
import AdminRegister from "./pages/AdminRegister";
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
import CoursePage from "./pages/CoursePage";
import AddVideo from "./pages/AddVideo";
import EditCourse from "./pages/EditCourse";
import AddQuiz from './pages/AddQuiz';
import AddQuestions from './pages/AddQuestion';
import Feedback from './pages/Feedback';
import Report from './pages/Report';
import Chatbot from "./pages/chatbot";
import ApprovedDoctors from "./pages/ApprovedDoctors";
import ApprovedPharmacists from "./pages/ApprovedPharmacists";
import ContactUs from "./pages/ContactUs";
import Messages from "./pages/Messages";
import ManageQuizzes from "./pages/ManageQuizzes";
import ViewQuiz from "./pages/ViewQuiz";
import EditQuiz from "./pages/EditQuiz";




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
                <Chatbot />
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
          <Route path="/coursePage" element={<CoursePage />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/contact" element={<ContactUs />} />
          {/* <Route path="/addvideo" element={<AddVideo />} /> */}
          {/* <Route path="/editCourse" element={<EditCourse />} /> */}
          {/* <Route path="/quizzes/:quizId/add-questions" element={<AddQuestions />} /> */}



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
              path="Messages"
              element={
                <ProtectedRoute
                  element={<Messages />}
                  requiredRole="Admin"
                  redirectTo="/Messages"
                />
              }
            />

            <Route
              path="Report"
              element={
                <ProtectedRoute
                  element={<Report />}
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
              path="ApprovedDoctors"
              element={
                <ProtectedRoute
                  element={<ApprovedDoctors />}
                  requiredRole="Admin"
                  redirectTo="/login"
                />
              }
            />
            <Route
              path="ApprovedPharmacists"
              element={
                <ProtectedRoute
                  element={<ApprovedPharmacists />}
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
            <Route
              path="editCourse"
              element={
                <ProtectedRoute
                  element={<EditCourse />}
                  requiredRole="Admin"
                  redirectTo="/login"
                />
              }
            />
            <Route
              path="addvideo"
              element={
                <ProtectedRoute
                  element={<AddVideo />}
                  requiredRole="Admin"
                  redirectTo="/login"
                />
              }
            />
            <Route
              path="quizzes/:quizId/add-questions"
              element={
                <ProtectedRoute
                  element={<AddQuestions />}
                  requiredRole="Admin"
                  redirectTo="/login"
                />
              }
            />
            <Route
              path="AdminRegister"
              element={
                <ProtectedRoute
                  element={<AdminRegister />}
                  requiredRole="Admin"
                  redirectTo="/login"
                />
              }
            />

            <Route
              path="add-quiz"
              element={
                <ProtectedRoute
                  element={<AddQuiz />}
                  requiredRole="Admin"
                  redirectTo="/login"
                />
              }
            />
            <Route
              path="manage-quizzes/:courseId"
              element={
                <ProtectedRoute
                  element={<ManageQuizzes />}
                  requiredRole="Admin"
                  redirectTo="/login"
                />
              }
            />
            <Route
              path="view-quiz/:quizId"
              element={
                <ProtectedRoute
                  element={<ViewQuiz />}
                  requiredRole="Admin"
                  redirectTo="/login"
                />
              }
            />
            <Route
              path="edit-quiz/:quizId"
              element={
                <ProtectedRoute
                  element={<EditQuiz />}
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
