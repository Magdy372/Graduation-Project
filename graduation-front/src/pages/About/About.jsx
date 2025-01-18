import Footer from "../../components/Footer/Footer";
import RegisterNav from "../../components/Navbar/RegisterNav";
import { motion } from "framer-motion";

export const FadeUp = (delay) => {
    return {
      initial: {
        opacity: 0,
        y: 50,
      },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          duration: 0.5,
          delay: delay,
          ease: "easeInOut",
        },
      },
    };
  };
const About = () => {
  return (
    <div>
      <RegisterNav />
      <div className="container min-h-[650px]">
        <motion.div 
         variants={FadeUp(0.6)}
        initial="initial"
        animate="animate"
        className="about-container">
          <header className="about-header">
            <h1 className="text-3xl lg:text-5xl font-bold leading-normal">About Us</h1>
          </header>
            <br/>
          <section className="about-section">
            <p className="about-text text-l font-normal text-red">
              For nearly 40 years, Pathfinder has partnered with the Government of Egypt to advance
              reproductive health in the country. Pathfinder’s USAID-funded OSRA
              (meaning Family) program will build on this long history of partnership
              to work hand-in-hand with a wide array of multisectoral Government of Egypt partners,
              the private sector, civil society partners, and communities to reach OSRA’s goal of improved
              health outcomes among Egyptian families by reinforcing the national family planning and reproductive
              health program.
            </p>
            <br />
            <p className="about-text text-l font-normal text-red">
              Through locally-led interventions, Pathfinder will work to increase women’s and men’s
              access to high quality family planning (FP) information, counseling, contraceptive methods,
              and services delivered by competent providers; enable young people to mature into healthy
              adults by increasing their knowledge of reproductive health; and empower women, men, and couples
              to achieve power-balanced family relationships. OSRA will focus on digital technology integrations to
              improve access to and demand for reproductive health information and services.
            </p>
          </section>
        </motion.div>
      </div>
      <Footer />

    </div>
  );
};

export default About;
