import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import Banner from "./components/Banner/Banner";
import Sponsers from "./components/Sponsers/Sponsers";
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register/Register";

const App = () => {
  return (
    <main className="overflow-x-hidden bg-white text-blue">
      {/* Wrap everything with Router */}
      <Router>
        <Routes>
          {/* Define the Home route */}
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

          {/* Register page */}
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
