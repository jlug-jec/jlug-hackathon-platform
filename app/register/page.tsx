import Link from "next/link"
import { CheckCircle2, Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ParticleBackground } from "@/components/particle-background"

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <ParticleBackground />
      <Navbar />
      <section className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
          </div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
            <CheckCircle2 className="h-4 w-4" />
            Event Concluded
          </div>
          <h1 className="mt-4 text-4xl font-bold text-foreground sm:text-5xl">
            CodeKumbh 2.0 Has Wrapped Up
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Thank you to all participants for making CodeKumbh 2.0 an incredible experience.
            Registration is now closed.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Browse the amazing projects built by teams during the hackathon.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/submissions">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
              >
                View All Submissions
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="font-semibold px-8">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
