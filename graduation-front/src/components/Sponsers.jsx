import { motion } from 'framer-motion';

// Import images directly
import AC4HLogo from '../assets/logos/AC4H Logo.png';
import PathfinderLogo from '../assets/logos/Pathfinder Logo.png';
import USAIDLogo from '../assets/logos/USAID Logo.png';
import miuLogo from '../assets/logos/miu.png';  

const SlideLeft = (delay) => ({
  initial: { opacity: 0, x: 50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay, ease: "easeInOut" },
  },
});

const Sponsers = () => {
  return (
    <section className="bg-white py-14">
      <h1 className="text-4xl font-bold text-center pb-10 text-red">Our Sponsors</h1>
      
      {/* Sponsor Logos */}
      <div className="flex justify-center items-center gap-12 flex-wrap">
        {/* Sponsor 1 */}
        <motion.img
          src={AC4HLogo}
          alt="AC4H Logo"
          className="w-[200px] h-[200px] object-contain"
          loading="lazy"
          variants={SlideLeft(0.5)}
          initial="initial"
          whileInView="animate"
          whileHover={{ scale: 1.2 }}  // Consistent zoom
          viewport={{ once: true }}
        />

        {/* Sponsor 2 */}
        <motion.img
          src={PathfinderLogo}
          alt="Pathfinder Logo"
          className="w-[200px] h-[200px] object-contain"
          loading="lazy"
          variants={SlideLeft(0.7)}
          initial="initial"
          whileInView="animate"
          whileHover={{ scale: 1.2 }}  // Consistent zoom
          viewport={{ once: true }}
        />

        {/* Sponsor 3 */}
        <motion.img
          src={USAIDLogo}
          alt="USAID Logo"
          className="w-[200px] h-[200px] object-contain"
          loading="lazy"
          variants={SlideLeft(0.9)}
          initial="initial"
          whileInView="animate"
          whileHover={{ scale: 1.2 }}  // Consistent zoom
          viewport={{ once: true }}
        />

        {/* Sponsor 4 */}
        <motion.img
          src={miuLogo}
          alt="MIU Logo"
          className="w-[200px] h-[200px] object-contain"
          loading="lazy"
          variants={SlideLeft(1.1)}
          initial="initial"
          whileInView="animate"
          whileHover={{ scale: 1.2 }}  // Consistent zoom
          viewport={{ once: true }}
        />
      </div>
    </section>
  );
};

export default Sponsers;
