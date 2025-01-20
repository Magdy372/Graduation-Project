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
// import Navbar from "./components/Navbar";
import Layout from "./pages/layout";
import DashboardPage from "./pages/Dashboard";
import UploadCourse from "./pages/UploadCourse";

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
          <Route path="/courses" element={<Courses />}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/myCourses" element={<MyCourses/>}/>
          <Route path="/myProfile" element ={<MyProfile/>}/>
          <Route path="/coursePage" element={<CoursePage/>}/>
          <Route path="/courseDesc" element={<CourseDesc/>}/>
          <Route path="/layout" element={<Layout />}>
            {/* Default route (index) */}
            <Route index element={<DashboardPage />} />
            <Route path="analytics" element={<h1 className="title"> التحليلات البيانية</h1>} />
            <Route path="reports" element={<h1 className="title"> التقارير</h1>} />
            <Route path="Doctors" element={<h1 className="title">الأطباء</h1>} />
            <Route path="Pharmacists" element={<h1 className="title">الصيادلة </h1>} />
            <Route path="Admins" element={<h1 className="title">المشرفين</h1>} />
            <Route path="courses" element={<h1 className="title">الدورات التدريبية</h1>} />
            <Route path="UploadCourse" element={<UploadCourse/>} />
            <Route path="settings" element={<h1 className="title">إعدادات</h1>} />
          </Route>
        </Routes>
      </Router>
    </main>
  );
};

export default App;
