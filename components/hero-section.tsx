"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowDown, Calendar, MapPin, Users } from "lucide-react"

import { Button } from "@/components/ui/button"

const words = ["Innovate", "Create", "Build", "Compete", "Conquer"]

const eventDates = process.env.NEXT_PUBLIC_EVENT_DATES || "Dates will be announced shortly"
const eventVenue = process.env.NEXT_PUBLIC_EVENT_VENUE || "JEC Campus, Jabalpur"

export function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-20">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />

      <div
        className={`relative z-10 mx-auto max-w-5xl text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Registration Open
        </div>

        <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
          Code.{" "}
          <span className="relative inline-block">
            <span key={currentWord} className="inline-block text-primary animate-fade-in-up">
              {words[currentWord]}
            </span>
          </span>
          .
          <br />
          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
            CodeKumbh 2.0
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed md:text-xl">
          Build real projects in a high-energy hackathon with your team. Register, complete UPI
          fee payment, get your QR-enabled team card, and submit before the deadline.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-secondary-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{eventDates}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-secondary-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{eventVenue}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-secondary-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span>Teams of 3-5</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base px-8 py-6"
            >
              Register Your Team
            </Button>
          </Link>
          <Link href="/submit">
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-secondary font-semibold text-base px-8 py-6"
            >
              Submit Project
            </Button>
          </Link>
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/#about"
            className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </Link>
        </div>
      </div>
    </section>
  )
}
