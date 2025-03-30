import { IoIosArrowForward } from 'react-icons/io';
import { motion } from "framer-motion";

// Import images directly
import Navbar from './Navbar';
import backgroundPic from './../assets/images/map.jpg'
import OSRA from '../assets/images/OSRA.jpg';
import { useNavigate } from "react-router-dom";
import africa from "../assets/images/africa-removebg-preview.png";
// Define motion variants
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

const Hero = () => {

  const navigate = useNavigate();


  return (
    <section className="bg-light overflow-hidden relative">
      <img 
      className="absolute top-0 left-0 w-full h-full object-cover " 
      src={backgroundPic} 
      alt="background" 
      />

      <Navbar />
 
      {/* Main Hero Section */}
      <div className="container grid grid-cols-1 md:grid-cols-2 min-h-[650px] items-center">
        
        {/* Left Content */}
        <div className="flex flex-col justify-center py-14 md:py-0 relative">
          <div className="text-center md:text-left space-y-8 lg:max-w-[450px]">
            {/* Title */}
            <motion.h1 
  variants={FadeUp(0.6)}
  initial="initial"
  animate="animate"
  className="text-4xl lg:text-5xl font-bold leading-normal space-y-4"
>
  Advance Your Medical Career with Expert-Led Courses
  <p className="text-red text-lg font-normal mt-4">
    Join our membership program platform designed exclusively for medical students and professionals.
  </p>
</motion.h1>

            {/* Call-to-Action Button */}
            <motion.div
              variants={FadeUp(0.8)}
              initial="initial"
              animate="animate"
              className="flex justify-center md:justify-start">
              <button 
              onClick={() => navigate("/login")}
              className="primary-btn flex items-center gap-2 group hover:shadow-lg transition-transform duration-300">
                Get Started
                <IoIosArrowForward className="text-xl group-hover:translate-x-2 group-hover:-rotate-45 duration-300" />
              </button>
            </motion.div>
          </div>
        </div>
        
        <div className="flex justify-center items-center relative">
  <motion.img
    initial={{ x: 50, opacity: 0 }} 
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
    src={OSRA}
    alt="OSRA with Africa shape"
    className="w-[600px] h-[600px] object-cover"
    style={{
      maskImage: `url(${africa})`,
      WebkitMaskImage: `url(${africa})`,
      maskSize: 'cover',
      WebkitMaskSize: 'cover',
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
      maskPosition: 'center',
      WebkitMaskPosition: 'center',
    }}
  />
</div>


      </div>
    </section>
  );
};

export default Hero;
