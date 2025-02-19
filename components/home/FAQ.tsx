import {  useScroll, useTransform, motion} from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useRef, useState } from "react"
import { faqItems } from "../../lib/constants"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
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
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-8 sm:mb-12" 
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.div className="space-y-4" >
          {faqItems.map((item, index) => (
            <motion.div key={index} >
              <button
                className="flex justify-between items-center w-full text-left p-4 sm:p-6 
                           bg-white/5 backdrop-blur-lg rounded-xl
                           border border-white/20 
                           hover:bg-white/10 transition-all duration-300
                           focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg sm:text-xl font-medium text-white">{item.question}</span>
                {openIndex === index ? 
                  <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-white/70" /> : 
                  <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white/70" />
                }
              </button>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: openIndex === index ? "auto" : 0, 
                  opacity: openIndex === index ? 1 : 0 
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-4 sm:p-6 bg-white/5 backdrop-blur-lg rounded-xl mt-2
                              border border-white/10">
                  <p className="text-base sm:text-lg text-white/80">{item.answer}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}