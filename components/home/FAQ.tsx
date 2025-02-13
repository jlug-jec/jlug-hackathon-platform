import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqItems = [
  {
    question: "What is KumbhCode?",
    answer:
      "KumbhCode is an exciting hackathon event where participants come together to solve challenges and create innovative solutions within a limited timeframe.",
  },
  {
    question: "Who can participate?",
    answer:
      "KumbhCode is open to students, professionals, and enthusiasts of all skill levels who are passionate about coding and problem-solving.",
  },
  {
    question: "Do I need to have a team?",
    answer:
      "While you can participate as an individual, we encourage forming teams of 2-4 members. Don't worry if you don't have a team; we'll have a team formation session at the beginning of the event.",
  },
  {
    question: "What should I bring?",
    answer:
      "Bring your laptop, charger, and any other devices or tools you might need. We'll provide food, drinks, and a comfortable hacking space.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <div key={index} className="mb-6">
              <button
                className="flex justify-between items-center w-full text-left p-4 border border-white rounded-lg focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-medium">{item.question}</span>
                {openIndex === index ? <ChevronUp /> : <ChevronDown />}
              </button>
              {openIndex === index && (
                <div className="mt-2 p-4 bg-white text-black rounded-lg">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

