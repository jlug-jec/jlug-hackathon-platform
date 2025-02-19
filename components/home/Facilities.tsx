import { useScroll, useTransform, motion, stagger } from "framer-motion"
import { useRef } from "react"
import { facilities } from "../../lib/constants"

export default function Facilities() {
  
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "end start"],
    })
  
    const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1])
    const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])
  
    return (
      <motion.section 
        ref={ref} 
        className="w-full min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16"
        style={{ scale, opacity }}
      >
        <motion.div
          className="max-w-6xl w-full bg-black/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-12 
                     border border-white/20 shadow-[0_0_50px_-12px_rgba(255,255,255,0.3)]"
          initial="initial"
          animate="animate"
        >
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-8 sm:mb-12" 
          >
            Facilities Provided
          </motion.h2>
  
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" 
          >
            {facilities.map((facility, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-lg p-4 sm:p-6 rounded-2xl 
                           border border-white/20 
                           shadow-[0_0_30px_-12px_rgba(255,255,255,0.2)]
                           hover:shadow-[0_0_40px_-12px_rgba(255,255,255,0.4)]
                           hover:bg-white/10 transition-all duration-300
                           flex items-center gap-4"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="p-2 sm:p-3 bg-white/10 rounded-full text-white/80">
                  {facility.icon}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                    {facility.title}
                  </h3>
                  <p className="text-sm sm:text-base text-white/70">
                    {facility.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>
    )
}