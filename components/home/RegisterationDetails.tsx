import { MainRegistrationSteps } from "@/lib/constants"
import { useScroll, useTransform, motion } from "framer-motion"
import { useRef } from "react"

export default function RegistrationDetails() {

  
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
          className="max-w-4xl w-full bg-black/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-12 
                     border border-white/20 shadow-[0_0_50px_-12px_rgba(255,255,255,0.3)]"
          initial="initial"
          animate="animate"
        >
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-4" 
          >
            How to Register?
          </motion.h2>
  
          <motion.p 
            className="text-lg sm:text-xl lg:text-2xl text-white/80 mb-8 sm:mb-12 text-center" 
          >
            Ready to be part of Code-Kumbh? Follow these steps to register:
          </motion.p>
  
          <motion.div className="space-y-4 sm:space-y-6">
            {MainRegistrationSteps.map((step, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl 
                           border border-white/20 
                           shadow-[0_0_30px_-12px_rgba(255,255,255,0.2)]
                           hover:shadow-[0_0_40px_-12px_rgba(255,255,255,0.4)]
                           hover:bg-white/10 transition-all duration-300 
                           flex items-center gap-6"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 
                               bg-white/10 border border-white/20 rounded-full 
                               flex items-center justify-center 
                               text-white text-xl sm:text-2xl font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-base sm:text-lg text-white/70">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>
    )
}