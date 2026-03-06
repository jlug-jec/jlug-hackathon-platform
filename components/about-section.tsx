"use client"

import { useEffect, useRef, useState } from "react"
import { Code2, Lightbulb, Trophy, Zap } from "lucide-react"

const features = [
  {
    icon: Code2,
    title: "24 Hours of Coding",
    description: "A day of intense building, shipping, and problem solving with your team.",
  },
  {
    icon: Lightbulb,
    title: "Mentorship",
    description: "Get guidance from industry experts and experienced developers throughout the event.",
  },
  {
    icon: Trophy,
    title: "Amazing Prizes",
    description: "Compete for cash prizes, swag, and exclusive opportunities for winning teams.",
  },
  {
    icon: Zap,
    title: "Networking",
    description: "Connect with fellow developers, recruiters, and tech leaders at the event.",
  },
]

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="relative z-10 py-24 px-4 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div
          className={`text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            About the Event
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            What is CodeKumbh 2.0?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground leading-relaxed">
            CodeKumbh is a 24-hour hackathon where passionate teams come together to
            build innovative solutions. Whether you are a seasoned developer or just starting
            out, this is your chance to shine.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`group rounded-xl border border-border bg-card p-6 transition-all duration-500 hover:border-primary/30 hover:bg-primary/5 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
