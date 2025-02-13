"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export default function ParticipationDetails() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  // Add this component at the top of the file

  
  // Update the main section return statement
  return (
      <motion.section
        ref={ref}
        className="w-full min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 relative"
        style={{ scale, opacity }}
      >
     
        <motion.div
          className="max-w-5xl w-full bg-black/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-12 
                   border border-white/20 shadow-[0_0_50px_-12px_rgba(255,255,255,0.3)]
                   relative z-10"
          initial="initial"
          animate="animate"
        >
          {/* Rest of the component remains the same */}
        <motion.h2 
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-6 sm:mb-8"
        >
          Who Can Participate?
        </motion.h2>

        <motion.p 
          className="text-lg sm:text-xl lg:text-2xl text-white/80 mb-8 sm:mb-12 text-center"
        >
          CodeKumbh is open only to students of JEC. Participants must be passionate about coding, teamwork, and
          innovation.
        </motion.p>

        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          
        >
          {[
            { title: "Team Size", description: "Each team must consist of 4 to 5 members." },
            { title: "Competition Duration", description: "The hackathon will be 24 hours long." },
            {
              title: "Judging Criteria",
              description: "Projects will be evaluated based on innovation, technical implementation, and impact.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl 
                         border border-white/20 
                         shadow-[0_0_30px_-12px_rgba(255,255,255,0.2)]
                         hover:shadow-[0_0_40px_-12px_rgba(255,255,255,0.4)]
                         hover:bg-white/10 transition-all duration-300 transform hover:scale-102"
              whileHover={{ y: -5, scale: 1.02 }}
              initial="initial"
              animate="animate"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">{item.title}</h3>
              <p className="text-base sm:text-lg text-white/70">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}