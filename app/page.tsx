import { ParticleBackground } from "@/components/particle-background"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { TimelineSection } from "@/components/timeline-section"
import { EligibilitySection } from "@/components/eligibility-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { PrizesSection } from "@/components/prizes-section"
import { RegistrationStepsSection } from "@/components/registration-steps-section"
import { ProblemStatementsSection } from "@/components/problem-statements-section"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <ParticleBackground />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <TimelineSection />
      <PrizesSection/>
      <RegistrationStepsSection />
      <ProblemStatementsSection />
      <EligibilitySection />
      <FAQSection />
      <Footer />
    </main>
  )
}
