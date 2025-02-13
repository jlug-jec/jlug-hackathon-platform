import { CalendarDays } from "lucide-react"

const scheduleItems = [
  { time: "9:00 AM", event: "Opening Ceremony" },
  { time: "10:00 AM", event: "Hacking Begins" },
  { time: "1:00 PM", event: "Lunch Break" },
  { time: "6:00 PM", event: "Dinner" },
  { time: "12:00 AM", event: "Midnight Snack" },
  { time: "9:00 AM", event: "Hacking Ends" },
  { time: "11:00 AM", event: "Presentations" },
  { time: "1:00 PM", event: "Awards Ceremony" },
]

export default function Schedule() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Schedule</h2>
        <div className="max-w-3xl mx-auto">
          {scheduleItems.map((item, index) => (
            <div key={index} className="flex items-center mb-8 group">
              <div className="w-24 text-right mr-8">
                <span className="text-sm font-semibold">{item.time}</span>
              </div>
              <div className="flex-grow border-t-2 border-black border-dashed transition-all duration-300 group-hover:border-solid"></div>
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center mx-4 transition-transform duration-300 group-hover:scale-110">
                <CalendarDays size={16} />
              </div>
              <div className="flex-grow border-t-2 border-black border-dashed transition-all duration-300 group-hover:border-solid"></div>
              <div className="w-48 ml-8">
                <span className="text-lg font-medium">{item.event}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

