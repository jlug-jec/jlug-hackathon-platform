"use client"

import { useEffect, useRef, useState } from "react"
import {
  Users,
  UserCheck,
  GraduationCap,
  IndianRupee,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react"

const criteria = [
  {
    icon: Users,
    title: "Team Size",
    description:
      "Each team must have a minimum of 3 and a maximum of 6 members (including the Team Leader).",
  },
  {
    icon: UserCheck,
    title: "Gender Diversity",
    description:
      "It is compulsory to have at least one female member in every team. Teams without a female member will not be eligible.",
  },
  {
    icon: GraduationCap,
    title: "Student Participants",
    description:
      "All team members must be currently enrolled students. Participants from any department and any year are welcome.",
  },
  {
    icon: IndianRupee,
    title: "Registration Fee",
    description:
      "A one-time registration fee of Rs. 250 per team is required to confirm your participation.",
  },
  {
    icon: ShieldCheck,
    title: "Original Work",
    description:
      "All projects must be original and built during the hackathon. Pre-built projects or plagiarized code will lead to disqualification.",
  },
  {
    icon: AlertTriangle,
    title: "Code of Conduct",
    description:
      "All participants must adhere to the event's code of conduct. Any form of misconduct will result in immediate disqualification.",
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
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="eligibility"
      ref={sectionRef}
      className="relative z-10 py-24 px-4 lg:px-8"
    >
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
            Please make sure your team meets all the following requirements before registering.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {criteria.map((item, i) => (
            <div
              key={item.title}
              className={`group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_24px_-6px] hover:shadow-primary/15 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Glow line on top */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 transition-colors group-hover:bg-primary/20">
                <item.icon className="h-6 w-6 text-primary" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
