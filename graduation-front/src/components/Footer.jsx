import { motion } from "framer-motion";

// Import images directly
import MOHLogo from "../assets/logos/MOH Logo.png";
import AC4HLogo from "../assets/logos/AC4H Logo.png";
import PathfinderLogo from "../assets/logos/Pathfinder Logo.png";
import USAIDLogo from "../assets/logos/USAID Logo.png";
import miuLogo from '../assets/logos/miu.png'

const Footer = () => {
  return (
    <footer className="py-20 bg-[#f7f7f7] mt-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="container"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 md:gap-4">
          {/* First section - Logo and Description */}
          <div className="space-y-4 max-w-[300px]">
            <img
              src={MOHLogo}
              alt="MOH Logo"
              className="w-32 h-32 object-contain"
            />
            <p className="text-dark2">
            OSRA program works on improving the operational systems and capacity of service providers emphasizing family planning in an integrated way in the comprehensive care package at the primary care level. 
            </p>
          </div>

          {/* Second section */}
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-4">
              <h1 className="text-xl font-bold">Links</h1>
              <div className="text-dark2">
                <ul className="space-y-2 text-m">
                  <li className="cursor-pointer hover:text-red duration-200">
                    Home
                  </li>
                  <li className="cursor-pointer hover:text-red duration-200">
                    Services
                  </li>
                  <li className="cursor-pointer hover:text-red duration-200">
                    About
                  </li>
                  <li className="cursor-pointer hover:text-red duration-200">
                    Contact
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Third section - Our Sponsors */}
          <div className="space-y-4 max-w-[300px]">
            <h1 className="text-xl font-bold">Our Sponsors</h1>
            <div className="flex space-x-6 py-3">
              <img
                src={AC4HLogo}
                alt="Sponsor 1"
                className="w-20 h-25 object-contain"
              />
              <img
                src={PathfinderLogo}
                alt="Sponsor 2"
                className="w-32 h-32 object-contain"
              />
              <img
                src={USAIDLogo}
                alt="Sponsor 3"
                className="w-28 h-32 object-contain"
              />
              <img
                src={miuLogo}
                alt="Sponsor 4"
                className="w-28 h-32 object-contain"
              />

            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
