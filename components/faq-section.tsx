"use client"

import { useEffect, useRef, useState } from "react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is the team size?",
    answer:
      "Team size must be between 3 and 5 members. One participant must be marked as team leader.",
  },
  {
    question: "What is the registration fee?",
    answer:
      "The registration fee is Rs. 250 per team (not per participant). Payment details are filled after team details.",
  },
  {
    question: "How is attendance marked on event day?",
    answer:
      "After registration, each team gets a unique QR-enabled ID card. Admin scans that QR at entry to mark attendance.",
  },
  {
    question: "When will problem statements be available?",
    answer:
      "Problem statements are controlled by reveal date in the problem statements JSON config. Before reveal, they stay locked on the website.",
  },
  {
    question: "How do we submit our project?",
    answer:
      "Use the submission page with your team code and leader email. Submit GitHub URL, demo video URL, and optional presentation link before deadline.",
  },
  {
    question: "Can we edit submission after first submit?",
    answer:
      "Yes. Teams can resubmit using the same team code and leader email until submission deadline.",
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
      { threshold: 0.1 },
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
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
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
