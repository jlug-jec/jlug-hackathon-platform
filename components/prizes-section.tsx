"use client"

import { useEffect, useRef, useState } from "react"
import { Award, Coffee, Gift, IndianRupee } from "lucide-react"

const prizes = [
  {
    icon: IndianRupee,
    title: "Cash Prizes",
    description: "Top-performing teams will receive cash prizes.",
  },
  {
    icon: Gift,
    title: "Swags",
    description: "Exclusive event swags for standout participants.",
  },
  {
    icon: Coffee,
    title: "Food & Beverages",
    description: "Meals, snacks, and beverages during the hackathon.",
  },
  {
    icon: Award,
    title: "Recognition",
    description: "Certificates and stage recognition for winners.",
  },
]

export function PrizesSection() {
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
    <section id="prizes" ref={sectionRef} className="relative z-10 py-24 px-4 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div
          className={`text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Rewards
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Rewards for Every Hustle
          </h2>
        </div>

        <div className="mt-16 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {prizes.map((prize, i) => (
            <div
              key={prize.title}
              className={`rounded-xl border border-border bg-card px-6 py-8 text-center transition-all duration-600 hover:border-primary/40 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <prize.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{prize.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{prize.description}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-muted-foreground text-sm">
          Final reward categories may include additional sponsor specials.
        </p>
      </div>
    </section>
  )
}
