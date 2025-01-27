import image from '../assets/images/profile-image.jpg';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
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

const MyProfile = () => {
  return (
    <>
      <Navbar />
      <motion.div 
       initial={{ x: 50, opacity: 0 }} 
       animate={{ x: 0, opacity: 1 }}
       transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
      className="bg-white min-h-screen">
        <div className="w-full max-w-7xl bg-white shadow-2xl rounded-2xl p-12 mx-auto mt-12">
          {/* Header Section */}
          <div className="relative flex items-center space-x-8 border-b pb-8 mb-10">
            <div className="relative w-40 h-40">
              <img
                src={image}
                alt="Avatar"
                className="w-full h-full rounded-xl object-cover border-4 border-blue-500"
              />
              {/* Edit Icon */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl opacity-0 hover:opacity-100 transition">
                <label
                  htmlFor="file-input"
                  className="cursor-pointer text-white flex items-center gap-2"
                >
                </label>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-blue">John Doe</h1>
              <p className="text-red text-lg">
                ryan@rockettheme.com - <span className="text-blue-500">Doctor</span>
              </p>
            </div>
          </div>

          {/* Account Form */}
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-blue">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="ryan"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="ryan@example.com"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-blue">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Doctor"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </form>
        </div>
        <br/>
        <Footer />

      </motion.div>
    </>
  );
};

export default MyProfile;
