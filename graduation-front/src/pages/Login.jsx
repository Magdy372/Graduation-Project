import Footer from "../components/Footer";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

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

const Login = () => {
  return (
    <div>
      <Navbar />
      <br />
      <div className="flex items-center justify-center mt-10 px-4">
        <motion.div 
          initial={{ x: 50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
          className="w-full max-w-md bg-light rounded-xl shadow-md py-12 px-8"
        >
          <h2 className="text-[30px] font-bold text-red mb-6 text-center">
            Login
          </h2>
          <form className="flex flex-col space-y-4" encType="multipart/form-data">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="text-m font-medium text-blue mb-2 block"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                className="bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="pass"
                className="text-m font-medium text-blue mb-2 block"
              >
                Password
              </label>
              <input
                id="pass"
                name="pass"
                type="password"
                className="bg-white-300 text-red border-b-2 border-red-500 rounded-none p-2 w-full focus:bg-gray-100 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              className="text-l bg-red text-white text-center py-3 px-5 rounded-md cursor-pointer hover:bg-blue transition duration-300 w-full"
              type="submit"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
      <br />
      <Footer />
    </div>
  );
};

export default Login;