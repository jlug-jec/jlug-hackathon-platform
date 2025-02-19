"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";
import Spotlight from "../ui/Spotlight";
import { downloadBrochure } from "../../lib/utils";

export default function HeroSection({title}) {
  const router = useRouter();
  const words = title.split(" ");

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <Spotlight />
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-4 tracking-tighter">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    whileHover={{
                      scale: 1.1,
                      textShadow: "0 0 8px rgb(255,255,255)",
                    }}
                    transition={{
                      delay: wordIndex * 0.1 + letterIndex * 0.03,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                    className="inline-block text-white relative
                              transition-all duration-200
                              hover:text-transparent hover:bg-clip-text
                              hover:bg-gradient-to-r hover:from-white hover:to-purple-300

                              cursor-default"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <p className="text-xl sm:text-2xl md:text-3xl font-medium text-white/90">
              24-Hour Hackathon | JEC Exclusive
            </p>
            <p className="text-lg sm:text-xl text-white/70">
              Open exclusively for JEC students 
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Button
                variant="ghost"
                className="rounded-xl px-8 py-4 text-lg font-semibold backdrop-blur-md 
                          bg-white/10 hover:bg-white/20 text-white hover:text-slate-200 transition-all duration-300 
                          border border-white/20 hover:border-white/40
                          hover:shadow-[0_0_30px_-12px_rgba(255,255,255,0.4)]"
                onClick={() => router.push("/login")}
              >
                Register Now
                <span className="ml-2">→</span>
              </Button>

              <Button
                variant="ghost"
                className="rounded-xl px-8 py-4 text-lg font-semibold backdrop-blur-md 
                          bg-white/5 hover:bg-white/10 text-white/90 hover:text-slate-200 transition-all duration-300 
                          border border-white/10 hover:border-white/20
                          hover:shadow-[0_0_30px_-12px_rgba(255,255,255,0.3)]"
                onClick={downloadBrochure}
              >
                Download Brochure
                <span className="ml-2">↓</span>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}