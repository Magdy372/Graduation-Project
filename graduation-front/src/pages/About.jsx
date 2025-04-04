import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export const FadeUp = (delay) => {
  return {
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, duration: 0.5, delay, ease: "easeInOut" },
    },
  };
};

const About = () => {
  return (
    <div>
      <Navbar />

      {/* Wrapper for the red title bar and white content section */}
        <div className="container p-6 w-[70%] mx-auto">
          <motion.div
            className="bg-red text-white p-10 rounded-t-lg w-[70%] mx-auto"
            variants={FadeUp(0.1)}
            initial="initial"
            animate="animate"
          >
            <motion.h1 className="text-3xl font-bold mb-4 text-center" variants={FadeUp(0.2)}>
              About Us
            </motion.h1>
          </motion.div>

        {/* White Section Container with Rounded Bottom Corners */}
        <motion.div
          variants={FadeUp(0.6)}
          initial="initial"
          animate="animate"
          className="bg-white shadow-xl rounded-b-lg p-6 w-[70%] mx-auto"
        >
          <section className="text-lg text-blue space-y-6">
            <p>
              For nearly 40 years, Pathfinder has partnered with the Government of Egypt to advance reproductive health in the country. 
              Pathfinder’s USAID-funded OSRA (meaning Family) program will build on this long history of partnership to work hand-in-hand 
              with a wide array of multisectoral Government of Egypt partners, the private sector, civil society partners, and communities 
              to reach OSRA’s goal of improved health outcomes among Egyptian families by reinforcing the national family planning and 
              reproductive health program.
            </p>

            <p>
              Through locally-led interventions, Pathfinder will work to increase women’s and men’s access to high-quality family planning 
              (FP) information, counseling, contraceptive methods, and services delivered by competent providers. It will enable young people 
              to mature into healthy adults by increasing their knowledge of reproductive health and empower women, men, and couples to 
              achieve power-balanced family relationships. OSRA will focus on digital technology integrations to improve access to and demand 
              for reproductive health information and services.
            </p>
          </section>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
