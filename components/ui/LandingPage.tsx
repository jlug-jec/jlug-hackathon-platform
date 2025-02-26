"use client";

import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import MainSection from "../home/MainSection";
import StarryBackground from "./StarryBackground";
import FloatingPaths from "./FloatingPath";
import HeroSection from "../home/HeroSection";



export function LandingPage({ title = "CodeKumbh" }: { title?: string }) {
  return (
    <div className="relative bg-black">
      {/* Event Status Banner */}
      <div className="bg-gradient-to-r from-red-500/20 via-red-900/20 to-red-500/20 border-b border-red-500/20 py-2">
        <p className="text-center text-red-400 font-medium">
          ⚠️ This event has concluded. Thank you for your interest!
        </p>
      </div>

      <div className="relative min-h-screen w-full flex flex-col items-center justify-center">
        <StarryBackground />
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="max-w-4xl mx-auto"
          >
            <HeroSection title={title} />
          </motion.div>
        </div>
      </div>
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-purple-900/20 via-black to-purple-900/20 py-4 border-t border-b border-purple-500/20">
        <motion.div 
          animate={{
            x: [0, -1000],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex whitespace-nowrap"
        >
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-2xl font-bold text-white/70 mx-8">
              24 HOURS HACKATHON
              <span className="text-purple-400/70 mx-4">•</span>
            </span>
          ))}
        </motion.div>
      </div>


      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative"
      >
        <MainSection />
      </motion.div>

      {/* <div className="fixed bottom-6 right-6 space-y-4 z-[999]">
        <motion.a
          href={process.env.NEXT_PUBLIC_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center px-4 mr-2 py-2 rounded-full 
            bg-gradient-to-r from-purple-900/80 to-black/90
            text-white text-lg font-semibold 
            shadow-lg hover:shadow-xl 
            transition-all duration-300 
            border border-purple-500/30
            backdrop-blur-md
            hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]"
        >
          <FaWhatsapp className="mr-2 text-xl text-purple-300" /> WhatsApp
        </motion.a>
      </div> */}
    </div>
  );
}

// Correct Export Example
export default LandingPage;
