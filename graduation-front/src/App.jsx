import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import Banner from "./components/Banner/Banner";
import Sponsers from "./components/Sponsers/Sponsers";
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register/Register";
import Courses from "./pages/Courses/Courses";

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
        </Routes>
      </Router>
    </main>
  );
};

export default App;
