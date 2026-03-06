"use client"

import { useEffect, useRef, useState } from "react"
import {
  GraduationCap,
  IndianRupee,
  ShieldCheck,
  Timer,
  UserCheck,
  Users,
} from "lucide-react"

const criteria = [
  {
    icon: Users,
    title: "Team Size",
    description:
      "Each team must have a minimum of 3 and maximum of 6 participants including the team leader.",
  },
  {
    icon: UserCheck,
    title: "Team Leader",
    description:
      "Every team must declare one team leader. Leader email is required later for project submission.",
  },
  {
    icon: GraduationCap,
    title: "Student Participants",
    description:
      "All participants should be valid student participants as per institute/event norms.",
  },
  {
    icon: IndianRupee,
    title: "Registration Fee",
    description: "A fee of Rs. 250 per team is mandatory to confirm the registration.",
  },
  {
    icon: ShieldCheck,
    title: "Original Work",
    description:
      "Projects must be original and developed during the event timeline. Plagiarism leads to disqualification.",
  },
  {
    icon: Timer,
    title: "Submission Deadline",
    description:
      "Teams must submit GitHub and demo video links before the configured deadline in the portal.",
  },
]

export function EligibilitySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="eligibility" ref={sectionRef} className="relative z-10 py-24 px-4 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div
          className={`text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Who Can Participate?
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Eligibility Criteria
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Please ensure your team meets all requirements before registration.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {criteria.map((item, index) => (
            <div
              key={item.title}
              className={`group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_24px_-6px] hover:shadow-primary/15 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 transition-colors group-hover:bg-primary/20">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
