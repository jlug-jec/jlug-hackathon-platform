import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ParticleBackground } from "@/components/particle-background"
import { RegistrationForm } from "@/components/registration-form"

export const dynamic = "force-dynamic"

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <ParticleBackground />
      <Navbar />
      <RegistrationForm />
      <Footer />
    </main>
  )
}
