import { useScroll, useTransform, motion, stagger} from "framer-motion"
import { useRef } from "react"
import { perks } from "@/lib/constants"

export default function Perks() {
  
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
          className="max-w-5xl w-full bg-black/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-12 
                     border border-white/20 shadow-[0_0_50px_-12px_rgba(255,255,255,0.3)]"
          initial="initial"
          animate="animate"
        >
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-8 sm:mb-12" 
            
          >
            Perks of Participating
          </motion.h2>
  
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" 
          >
            {perks.map((perk, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl 
                           border border-white/20 
                           shadow-[0_0_30px_-12px_rgba(255,255,255,0.2)]
                           hover:shadow-[0_0_40px_-12px_rgba(255,255,255,0.4)]
                           hover:bg-white/10 transition-all duration-300"
                
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <span className="text-2xl mb-3 block">✨</span>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  {perk.title}
                </h3>
                <p className="text-sm sm:text-base text-white/70">
                  {perk.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>
    )
}