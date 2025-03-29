import React, { Suspense } from "react";
import { motion } from "framer-motion";
import backgroundPic from './../assets/images/map1.jpg'

// Dynamically import icons
const FaStethoscope = React.lazy(() => import("react-icons/fa6").then((mod) => ({ default: mod.FaStethoscope })));
const FaCapsules = React.lazy(() => import("react-icons/fa6").then((mod) => ({ default: mod.FaCapsules })));
const FaMicroscope = React.lazy(() => import("react-icons/fa6").then((mod) => ({ default: mod.FaMicroscope })));
const FaSyringe = React.lazy(() => import("react-icons/fa6").then((mod) => ({ default: mod.FaSyringe })));
const TbHeartRateMonitor = React.lazy(() => import("react-icons/tb").then((mod) => ({ default: mod.TbHeartRateMonitor })));
const FaHandshake = React.lazy(() => import("react-icons/fa").then((mod) => ({ default: mod.FaHandshake })));

const ServicesData = [
  {
    id: 1,
    title: "Clinical Practice",
    link: "#",
    icon: <FaStethoscope />,
    delay: 0.2,
  },
  {
    id: 2,
    title: "Pharmacology and Therapeutics",
    link: "#",
    icon: <FaCapsules />,
    delay: 0.3,
  },
  {
    id: 3,
    title: "Research and Evidence-Based Medicine",
    link: "#",
    icon: <FaMicroscope />,
    delay: 0.4,
  },
  {
    id: 4,
    title: "Public Health and Preventive Medicine",
    link: "#",
    icon: <FaSyringe />,
    delay: 0.5,
  },
  {
    id: 5,
    title: "Technology in Medicine and Pharmacy",
    link: "#",
    icon: <TbHeartRateMonitor />,
    delay: 0.6,
  },
  {
    id: 6,
    title: "Professional Development and Ethics",
    link: "#",
    icon: <FaHandshake />,
    delay: 0.7,
  },
];

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

const Services = () => {
  return (
    <section className="bg-white overflow-hidden relative">

      <div className="container pb-14 pt-16">
        <h1 className="text-4xl font-bold text-left pb-10 text-red text-center mb-10">Services we provide</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
          {ServicesData.map((service) => (
            <motion.div
              key={service.id}
              variants={SlideLeft(service.delay)}
              initial="initial"
              whileInView="animate"
              whileHover={{ scale: 1.3 }} // Increased scale to 2x for a bigger zoom effect
              viewport={{ once: true }}
              className="bg-white rounded-2xl flex flex-col gap-4 items-center justify-center p-4 py-7 shadow-xl hover:bg-white hover:shadow-2xl"
              >
              <Suspense fallback={<div className="text-4xl mb-4">Loading...</div>}>
                <div className="text-4xl mb-4">{service.icon}</div>
              </Suspense>
              <h1 className="text-lg font-semibold text-center px-3">{service.title}</h1>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
