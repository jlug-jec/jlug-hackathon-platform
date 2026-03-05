"use client"

import { useEffect, useRef, useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is the team size?",
    answer:
      "Each team must have a minimum of 3 members and a maximum of 6 members. It is mandatory to have at least one female candidate in each team.",
  },
  {
    question: "What is the registration fee?",
    answer:
      "The registration fee is Rs. 250 per team (not per person). Payment must be completed during the registration process.",
  },
  {
    question: "Who can participate?",
    answer:
      "CodeKumbh is open only to students of JEC. Participants must be passionate about coding, teamwork, and innovation.",
  },
  {
    question: "What should we bring?",
    answer:
      "Bring your laptops, chargers, and any necessary development tool you might need. We will provide food, beverages, Wi-Fi, and a comfortable workspace.",
  },
  {
    question: "Can I participate alone?",
    answer:
      "No, the minimum team size is 3 members, with a minimum of 1 female member.",
  },
  {
    question: "Will food and refreshments be provided?",
    answer:
      "Yes, food and refreshments will be available during the event. However, additional charges may apply for certain meals.",
  },
]

export function FAQSection() {
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
    <section id="faq" ref={sectionRef} className="relative z-10 py-24 px-4 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div
          className={`text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Got Questions?
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div
          className={`mt-12 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border border-border bg-card px-6 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline hover:text-primary py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
