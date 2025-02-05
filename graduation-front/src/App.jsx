import Hero from "./components/Hero";
import Services from "./components/Services";
import Banner from "./components/Banner";
import Sponsers from "./components/Sponsers";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import About from "./pages/About";
import CourseDesc from "./pages/CourseDesc";
import MyCourses from "./pages/MyCourses";
import MyProfile from "./pages/MyProfile";
import CoursePage from "./pages/CoursePage";
import Layout from "./pages/layout";
import DashboardPage from "./pages/Dashboard";
import UploadCourse from "./pages/UploadCourse";
import Pharmacists from "./pages/Pharmacists";
import Doctors from "./pages/Doctors";
import ViewCourses from "./pages/ViewCourses";
import AdminProfile from "./pages/AdminProfile";
import Login from "./pages/Login";
import EditCourse from "./pages/EditCourse";
import AddVideo from "./pages/AddVideo";
import ExamPage from "./pages/ExamPage";

const App = () => {
  return (
    <main className="overflow-x-hidden bg-white text-blue">
      <Router>
        <Routes>
          {/* Home route */}
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

          {/* Register route */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/myCourses" element={<MyCourses />} />
          <Route path="/myProfile" element={<MyProfile />} />
          <Route path="/coursePage" element={<CoursePage />} />
          <Route path="/courseDesc" element={<CourseDesc />} />
          <Route path="/editCourse" element={<EditCourse />} />
          <Route path="/addvideo" element={<AddVideo />} />
          <Route path="/exam" element={<ExamPage/>}/>

          <Route path="/layout" element={<Layout />}>
            {/* Default route (index) */}
            <Route index element={<DashboardPage />} />
            <Route path="analytics" element={<h1 className="title"> التحليلات البيانية</h1>} />
            <Route path="reports" element={<h1 className="title"> التقارير</h1>} />
            <Route path="Doctors" element={<Doctors />} />
            <Route path="Pharmacists" element={<Pharmacists />} />
            <Route path="ViewCourses" element={<ViewCourses />} />
            <Route path="UploadCourse" element={<UploadCourse />} />
            <Route path="AdminProfile" element={<AdminProfile />} />
          </Route>
        </Routes>
      </Router>
    </main>
  );
};

export default App;