"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import FloatingPaths from "../../components/ui/FloatingPath";
import AnimatedStarryBackground from "../../components/ui/AnimatedStarryBackground";
import { FaWhatsapp, FaFileAlt } from "react-icons/fa";

function CountdownTimer() {
  const targetDate = new Date('2025-02-20T00:00:00');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4 text-center my-8">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <motion.div
          key={unit}
          className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-purple-500/20"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            {value}
          </span>
          <p className="text-sm text-gray-400 capitalize">{unit}</p>
        </motion.div>
      ))}
    </div>
  );
}

function EventStatus() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    const submitted = localStorage.getItem('projectSubmitted');
    const team = localStorage.getItem('teamName');
    if (submitted && team) {
      setHasSubmitted(true);
      setTeamName(team);
    }
  }, []);

  if (hasSubmitted) {
    return (
      <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 text-center my-8">
        <h2 className="text-2xl font-bold text-purple-400 mb-2">Project Submitted! 🎉</h2>
        <p className="text-white/80">
          You have already submitted your project for team "{teamName}".
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center my-8">
      <h2 className="text-2xl font-bold text-green-400 mb-2">Hackathon is Live! 🚀</h2>
      <p className="text-white/80">The event has started. Good luck to all participants!</p>
    </div>
  );
}


export default function HackathonPage() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black">
      <FloatingPaths position={0.5} opacity={0.3} />
      <FloatingPaths position={-0.5} opacity={0.3} />
      <AnimatedStarryBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-6xl mx-auto p-8 pt-32 space-y-16"
      >
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 text-transparent bg-clip-text"
        >
          Welcome to CodeKumbh Hackathon
        </motion.h1>

        {/* <CountdownTimer /> */}
        <EventStatus/>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Important Dates card remains same but with white text */}
          <motion.div 
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            whileHover={{ scale: 1.02, borderColor: 'rgba(255, 255, 255, 0.4)' }}
          >
            <h3 className="text-xl font-semibold mb-3 text-white">
              Important Dates
            </h3>
            <ul className="space-y-4 text-white/80">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                Registration Deadline: February 19, 2025
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-pink-500" />
                Event Start: February 20, 2025
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                Final Submission: February 21, 2025
              </li>
            </ul>
          </motion.div>

          <motion.div 
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            whileHover={{ scale: 1.02, borderColor: 'rgba(255, 255, 255, 0.4)' }}
          >
            <h3 className="text-xl font-semibold mb-3 text-white">
              Resources
            </h3>
            <ul className="space-y-4 text-white/80">
              <motion.li whileHover={{ x: 5 }} className="flex items-center gap-3">
                <FaFileAlt className="text-white/60" />
                <a href="/brochure.pdf" target="_blank"
                   className="hover:text-white transition-colors">
                  Download Brochure
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} className="flex items-center gap-3">
                <FaWhatsapp className="text-white/60" />
                <a href={process.env.NEXT_PUBLIC_WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                   className="hover:text-purple-400 transition-colors">
                  Join WhatsApp
                </a>
              </motion.li>
            </ul>
          </motion.div>

          <motion.div 
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20"
            whileHover={{ scale: 1.02, borderColor: 'rgba(168, 85, 247, 0.4)' }}
          >
            <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              Need Help?
            </h3>
            <p className="text-gray-300">
              Join our  WhatsApp group for immediate assistance and updates.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}