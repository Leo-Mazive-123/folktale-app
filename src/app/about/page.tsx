"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { FaBookOpen, FaGlobe, FaLightbulb } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 text-gray-900 transition-colors duration-500">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center w-full"
        style={{ backgroundImage: "url('/about-hero.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40"></div>

        <motion.div
          className="relative text-center px-4 sm:px-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
            About Folktales App
          </h1>
          <p className="text-lg md:text-2xl max-w-2xl mx-auto text-gray-200">
            Preserving cultural heritage through the magic of stories.
          </p>
        </motion.div>
      </section>

      {/* Mission & Vision Section */}
      <section className="p-8 max-w-6xl mx-auto mt-24 grid md:grid-cols-2 gap-12 w-full">
        <motion.div
          className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border-l-4 border-green-500 w-full"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <FaBookOpen className="text-green-600" /> Our Mission
          </h2>
          <p className="text-gray-700 leading-relaxed">
            To collect and share folktales from every culture, making them accessible
            to people everywhere while preserving their original charm and wisdom.
          </p>
        </motion.div>

        <motion.div
          className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border-l-4 border-blue-500 w-full"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <FaGlobe className="text-blue-600" /> Our Vision
          </h2>
          <p className="text-gray-700 leading-relaxed">
            To become the go-to platform for folktales, inspiring imagination and
            cultural appreciation for generations to come.
          </p>
        </motion.div>
      </section>

      {/* Core Values Section */}
      <section className="p-8 max-w-6xl mx-auto mt-24 w-full">
        <h2 className="text-4xl font-bold mb-12 text-center">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Cultural Preservation",
              desc: "We honor and preserve the essence of global folktales.",
              icon: <FaBookOpen className="text-amber-500 text-3xl" />,
            },
            {
              title: "Accessibility",
              desc: "Stories should be easily available to everyone, everywhere.",
              icon: <FaGlobe className="text-green-500 text-3xl" />,
            },
            {
              title: "Creativity & Inspiration",
              desc: "Encouraging imagination through the magic of stories.",
              icon: <FaLightbulb className="text-blue-500 text-3xl" />,
            },
          ].map((value) => (
            <motion.div
              key={value.title}
              className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 border-t-4 border-transparent hover:border-amber-400 w-full"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-3">
                {value.icon}
                <h3 className="text-2xl font-semibold">{value.title}</h3>
              </div>
              <p className="text-gray-700">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
