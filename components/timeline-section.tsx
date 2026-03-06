"use client"

import { useEffect, useRef, useState } from "react"
import { Clock, Flag, Rocket, PartyPopper, Code, Presentation } from "lucide-react"

const timeline = [
  {
    icon: Flag,
    time: "Day 1 - 9:00 AM",
    title: "Opening Ceremony",
    description: "Kick-off, team registration, rules and theme reveal.",
  },
  {
    icon: Code,
    time: "Day 1 - 10:00 AM",
    title: "Hacking Begins",
    description: "Start building! Mentors available for guidance.",
  },
  {
    icon: Clock,
    time: "Day 1 - 8:00 PM",
    title: "Checkpoint 1",
    description: "Progress review and dinner break.",
  },
  {
    icon: Rocket,
    time: "Day 2 - 10:00 AM",
    title: "Checkpoint 2",
    description: "Mid-hackathon review and mentor sessions.",
  },
  {
    icon: Presentation,
    time: "Day 2 - 4:00 PM",
    title: "Submissions Close",
    description: "Final code push. Prepare your presentations.",
  },
  {
    icon: PartyPopper,
    time: "Day 2 - 6:00 PM",
    title: "Demos & Awards",
    description: "Team presentations, judging, and prize distribution.",
  },
]

export function TimelineSection() {
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
    <section id="timeline" ref={sectionRef} className="relative z-10 py-24 px-4 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div
          className={`text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Schedule
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Event Timeline
          </h2>
        </div>

        <div className="relative mt-16">
          {/* Central line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />

          <div className="flex flex-col gap-12">
            {timeline.map((item, i) => (
              <div
                key={item.title}
                className={`relative flex items-start gap-6 md:gap-0 transition-all duration-600 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                } ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {/* Content */}
                <div className={`flex-1 md:pr-12 ${i % 2 !== 0 ? "md:pr-0 md:pl-12" : ""}`}>
                  <div
                    className={`rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30 ${
                      i % 2 === 0 ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <span className="text-xs font-mono text-primary">{item.time}</span>
                    <h3 className="mt-1 text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>

                {/* Circle on the line */}
                <div className="absolute left-6 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background md:left-1/2">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>

                {/* Spacer for the other side */}
                <div className="hidden flex-1 md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
