import { CircleDollarSign, ClipboardList, QrCode, Send, UserCheck } from "lucide-react"

const steps = [
  {
    icon: ClipboardList,
    title: "1. Team Registration",
    description:
      "Register with team name, leader details, and 2-5 member details (3-6 total participants).",
  },
  {
    icon: CircleDollarSign,
    title: "2. UPI Fee Payment",
    description:
      "Pay Rs. 250 per team using the shared UPI QR. Add UPI transaction details to complete registration.",
  },
  {
    icon: QrCode,
    title: "3. Team ID Card + QR",
    description:
      "Instantly receive your team code and QR-enabled ID card for event-day entry verification.",
  },
  {
    icon: UserCheck,
    title: "4. Entry Attendance",
    description:
      "At venue entry, admin scans your team QR and attendance gets marked automatically in dashboard.",
  },
  {
    icon: Send,
    title: "5. Project Submission",
    description:
      "Before deadline, submit your GitHub and demo video links using your team code and leader email.",
  },
]

const rules = [
  "Team size must be between 3 and 6 members.",
  "Each team must have exactly one team leader.",
  "Registration is confirmed only after payment details are submitted.",
  "Bring valid student ID for all participants at entry.",
  "Project submission after deadline is not accepted.",
]

export function RegistrationStepsSection() {
  return (
    <section id="process" className="relative z-10 py-24 px-4 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Event Flow
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Registration to Final Submission
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
            This year the complete flow is fully online: registration, payment details, team QR card,
            attendance marking, and final project submission.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-card p-6 md:p-8">
          <h3 className="text-xl font-semibold text-foreground">Rules & Instructions</h3>
          <div className="mt-4 grid gap-3">
            {rules.map((rule) => (
              <div key={rule} className="rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm">
                {rule}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
