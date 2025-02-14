import { useScroll } from "framer-motion"
import { useRef } from "react"
import ParticipationDetails from "./ParticipationDetails"
import Facilities from "./Facilities"
import Perks from "./Perks"
import RegistrationDetails from "./RegisterationDetails"
import FAQ from "./FAQ"
import FloatingPaths from "../ui/FloatingPath"
import AnimatedStarryBackground from "../ui/AnimatedStarryBackground"

export default function MainSection() {
    const containerRef = useRef<HTMLDivElement>(null)

    return (
      <div ref={containerRef} className="relative w-full min-h-screen overflow-hidden bg-black ">
         <FloatingPaths position={0.5} opacity={0.3} />
        <FloatingPaths position={-0.5} opacity={0.3} />
        <AnimatedStarryBackground/>
        {/* <HeroBackground scrollYProgress={scrollYProgress} /> */}
        <div className="relative z-10 space-y-16 p-8 pt-32">
          <ParticipationDetails />
          <Facilities />
          <Perks />
          <RegistrationDetails />
          <FAQ />
        </div>
      </div>
    )
  }