import { motion } from 'framer-motion';

// Import images directly
import AC4HLogo from '../assets/logos/AC4H Logo.png';
import PathfinderLogo from '../assets/logos/Pathfinder Logo.png';
import USAIDLogo from '../assets/logos/USAID Logo.png';
import miuLogo from '../assets/logos/miu.png';  

const SlideLeft = (delay) => {
  return {
    initial: {
      opacity: 0,
      x: 50,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        delay: delay,
        ease: "easeInOut",
      },
    },
  };
};

const Sponsers = () => {
  return (
    <section className="bg-white">
      <div className="container pb-14 pt-16">
        <h1 className="text-4xl font-bold text-center pb-10">Our Sponsors</h1>
        <div className="flex justify-center items-center space-x-12">
          {/* Sponsor 1 */}
          <motion.div
            variants={SlideLeft(0.5)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="bg-[#f4f4f4] rounded-2xl flex flex-col gap-4 items-center justify-center p-4 py-7 hover:bg-white hover:scale-110 duration-300 hover:shadow-2xl"
          >
            <img
              src={AC4HLogo}  // Direct import usage
              alt="Sponsor 1"
              className="w-[200px] h-[200px] object-contain"
              loading="lazy"
            />
          </motion.div>

          {/* Sponsor 2 */}
          <motion.div
            variants={SlideLeft(0.7)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="bg-[#f4f4f4] rounded-2xl flex flex-col gap-4 items-center justify-center p-4 py-7 hover:bg-white hover:scale-110 duration-300 hover:shadow-2xl"
          >
            <img
              src={PathfinderLogo}  // Direct import usage
              alt="Sponsor 2"
              className="w-[200px] h-[200px] object-contain"
              loading="lazy"
            />
          </motion.div>

          {/* Sponsor 3 */}
          <motion.div
            variants={SlideLeft(0.9)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="bg-[#f4f4f4] rounded-2xl flex flex-col gap-4 items-center justify-center p-4 py-7 hover:bg-white hover:scale-110 duration-300 hover:shadow-2xl"
          >
            <img
              src={USAIDLogo}  // Direct import usage
              alt="Sponsor 3"
              className="w-[200px] h-[200px] object-contain"
              loading="lazy"
            />
          </motion.div>

          {/* Sponsor 4 */}
          <motion.div
            variants={SlideLeft(1.1)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="bg-[#f4f4f4] rounded-2xl flex flex-col gap-4 items-center justify-center p-4 py-7 hover:bg-white hover:scale-110 duration-300 hover:shadow-2xl"
          >
            <img
              src={miuLogo}  // Direct import usage
              alt="Sponsor 4"
              className="w-[200px] h-[200px] object-contain"
              loading="lazy"
            />
          </motion.div>          
        </div>
      </div>
    </section>
  );
};

export default Sponsers;
