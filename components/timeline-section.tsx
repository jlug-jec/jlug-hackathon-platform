"use client"

import { useEffect, useRef, useState } from "react"
import { Clock3, Compass, Sparkles, Swords } from "lucide-react"

type TimelineItem = {
  time: string
  title: string
  description?: string
}

const phases = [
  {
    icon: Compass,
    title: "Phase 1: Prarambh (The Beginning)",
    description:
      "Problem statements open, teams align strategy, and mentors help shape the approach.",
  },
  {
    icon: Sparkles,
    title: "Phase 2: Vichar Manthan (The Ideation)",
    description:
      "Core building sprint with coding, troubleshooting, and guided innovation throughout the day.",
  },
  {
    icon: Swords,
    title: "Phase 3: Mahasangram (The Final Battle)",
    description:
      "Submission, judging, and final presentation of the best solutions before felicitation.",
  },
]

const dayOneTimeline: TimelineItem[] = [
  { time: "8:30 AM", title: "Team Arrival" },
  {
    time: "9:30 AM",
    title: "Registration Desk Opens",
    description: "Food coupon desk (Rs 100), team ID distribution, attendance check 1.",
  },
  {
    time: "10:00 AM onward",
    title: "Opening + Hackathon Kickoff",
    description:
      "Saraswati vandana, faculty welcome, addresses, rule briefing, and club intro followed by start.",
  },
  {
    time: "During event",
    title: "Twist Reveals and Sprint",
    description: "Twists announced via PPT while hacking continues.",
  },
  {
    time: "Midday",
    title: "Lunch (Paid) + Quiz Slot",
    description: "Quiz will be conducted whenever feasible.",
  },
  {
    time: "Later in day",
    title: "Coverage + Attendance Check 2",
    description: "News paper article and photo coverage, followed by second attendance checkpoint.",
  },
  {
    time: "Evening",
    title: "Sponsor Slot + Snacks",
    description: "Sponsored segment and food before day wrap-up.",
  },
]

const dayTwoTimeline: TimelineItem[] = [
  { time: "8:30 AM", title: "Team Arrival" },
  { time: "10:00 AM", title: "Day 2 Restart + Attendance Check" },
  { time: "12:00 PM - 1:00 PM", title: "Submission Window" },
  { time: "After submission", title: "Lunch / Tea" },
  { time: "Post lunch", title: "Judging Round + Evaluation" },
  { time: "Final slot", title: "Felicitation" },
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

        <div className="mt-12 grid gap-5">
          {phases.map((phase, index) => (
            <article
              key={phase.title}
              className={`rounded-2xl border border-border bg-card p-5 transition-all duration-600 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <phase.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{phase.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{phase.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-xl font-semibold text-foreground">Day 1 Schedule</h3>
            <div className="mt-4 space-y-3">
              {dayOneTimeline.map((item, i) => (
                <div
                  key={`${item.time}-${item.title}`}
                  className={`rounded-lg border border-border bg-secondary/30 px-4 py-3 transition-all duration-600 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <p className="inline-flex items-center text-xs font-semibold uppercase tracking-wide text-primary">
                    <Clock3 className="mr-1 h-3.5 w-3.5" />
                    {item.time}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{item.title}</p>
                  {item.description ? (
                    <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-xl font-semibold text-foreground">Day 2 Schedule</h3>
            <div className="mt-4 space-y-3">
              {dayTwoTimeline.map((item, i) => (
                <div
                  key={`${item.time}-${item.title}`}
                  className={`rounded-lg border border-border bg-secondary/30 px-4 py-3 transition-all duration-600 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${i * 80 + 160}ms` }}
                >
                  <p className="inline-flex items-center text-xs font-semibold uppercase tracking-wide text-primary">
                    <Clock3 className="mr-1 h-3.5 w-3.5" />
                    {item.time}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{item.title}</p>
                  {item.description ? (
                    <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
          Submission portal opens at <span className="font-semibold text-foreground">4:00 PM on March 12, 2026</span> and accepts entries within the configured deadline window.
        </div>
      </div>
    </section>
  )
}
