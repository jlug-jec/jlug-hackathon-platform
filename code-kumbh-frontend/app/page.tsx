import { ParticleBackground } from "@/components/particle-background"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { TimelineSection } from "@/components/timeline-section"
import { EligibilitySection } from "@/components/eligibility-section"
import { FAQSection } from "@/components/faq-section"
import { RegistrationForm } from "@/components/registration-form"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <ParticleBackground />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <TimelineSection />
      <EligibilitySection />
      <FAQSection />
      <RegistrationForm />
      <Footer />
    </main>
  )
}
