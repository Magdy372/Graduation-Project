import { GrUserExpert } from "react-icons/gr";
import { MdOutlineAccessTime } from "react-icons/md";
import { FaBookReader } from "react-icons/fa";
import { FadeUp } from "../components/Hero";
import { motion } from "framer-motion";
import backgroundPic from "./../assets/images/map1.jpg";

// Import additional images
import BannerPng from "../assets/images/banner.webp";
import ExtraImg1 from "../assets/images/img1.jpg";
import ExtraImg2 from "../assets/images/img2.jpg";

const Banner = () => {
  return (
    <section className="bg-white overflow-hidden relative">
      <img
        className="absolute top-0 right-0 w-1/2 h-full object-cover rotate-90 "
        src={backgroundPic}
        alt="background"
      />

      <div className="container py-14 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-8 space-y-6 md:space-y-0">
        {/* Banner Image with Direct Import */}
        <div className="flex justify-center items-center relative">
          {/* Main Image */}
          <motion.img
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            src={BannerPng}
            alt="Banner"
            className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] object-cover rounded-full drop-shadow-lg border-4 border-white z-10"
          />

          {/* Additional Image 1 (Left) */}
          {/* <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            src={ExtraImg1}
            alt="Extra 1"
            className="absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 object-cover rounded-full border-4 border-white shadow-md z-0"
          /> */}

          {/* Additional Image 2 (Right) */}
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            src={ExtraImg2}
            alt="Extra 2"
            className="absolute  top-0 right-0 w-40 h-40 md:w-60 md:h-60 object-cover rounded-full border-4 border-white shadow-md z-10"
          />
        </div>

        {/* Banner Text */}
        <div className="flex flex-col justify-center z-10">
          <div className="text-center md:text-left space-y-12">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold !leading-snug"
            >
              The World&apos;s Membership program for private family planning providers
            </motion.h1>

            {/* Features */}
            <div className="flex flex-col gap-6">
              <motion.div
                variants={FadeUp(0.2)}
                initial="initial"
                whileInView={"animate"}
                whileHover={{ scale: 1.2 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-xl hover:bg-white hover:shadow-2xl"
              >
                <FaBookReader className="text-2xl text-red" />
                <p className="text-lg text-red">10,000+ Courses</p>
              </motion.div>
              <motion.div
                variants={FadeUp(0.4)}
                initial="initial"
                whileInView={"animate"}
                whileHover={{ scale: 1.2 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-xl hover:bg-white hover:shadow-2xl"
              >
                <GrUserExpert className="text-2xl text-red" />
                <p className="text-lg text-red">Expert Instruction</p>
              </motion.div>
              <motion.div
                variants={FadeUp(0.6)}
                initial="initial"
                whileInView={"animate"}
                whileHover={{ scale: 1.2 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-xl hover:bg-white hover:shadow-2xl"
              >
                <MdOutlineAccessTime className="text-2xl text-red" />
                <p className="text-lg text-red">Lifetime Access</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;