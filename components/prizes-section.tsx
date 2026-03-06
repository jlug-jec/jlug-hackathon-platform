"use client"

import { useEffect, useRef, useState } from "react"
import { Trophy, Medal, Award } from "lucide-react"

const prizes = [
  {
    icon: Medal,
    place: "2nd Place",
    prize: "Rs. 5,000",
    color: "text-muted-foreground",
    borderColor: "border-muted-foreground/30",
    bgColor: "bg-muted-foreground/5",
    order: "order-1 md:order-first",
    size: "py-10",
  },
  {
    icon: Trophy,
    place: "1st Place",
    prize: "Rs. 10,000",
    color: "text-primary",
    borderColor: "border-primary/40",
    bgColor: "bg-primary/5",
    order: "order-first md:order-2",
    size: "py-14",
  },
  {
    icon: Award,
    place: "3rd Place",
    prize: "Rs. 3,000",
    color: "text-chart-5",
    borderColor: "border-chart-5/30",
    bgColor: "bg-chart-5/5",
    order: "order-2 md:order-last",
    size: "py-10",
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
            Prizes Worth Fighting For
          </h2>
        </div>

        <div className="mt-16 grid items-end gap-6 sm:grid-cols-3">
          {prizes.map((prize, i) => (
            <div
              key={prize.place}
              className={`${prize.order} rounded-xl border ${prize.borderColor} ${prize.bgColor} px-6 ${prize.size} text-center transition-all duration-600 hover:scale-105 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${prize.bgColor}`}>
                <prize.icon className={`h-8 w-8 ${prize.color}`} />
              </div>
              <h3 className={`text-xl font-bold ${prize.color}`}>{prize.place}</h3>
              <p className="mt-2 text-3xl font-bold text-foreground">{prize.prize}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                + Certificates & Swag
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-muted-foreground text-sm">
          * Prize amounts are indicative. Special category prizes may also be awarded.
        </p>
      </div>
    </section>
  )
}
