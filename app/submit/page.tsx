import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ParticleBackground } from "@/components/particle-background"
import { SubmissionForm } from "@/components/submission-form"
import { formatInTimezone, getProblemStatementContext } from "@/lib/problem-statements"

export const dynamic = "force-dynamic"

export default function SubmitPage() {
  const context = getProblemStatementContext()
  const submissionStartText = formatInTimezone(context.submissionStartsAt, context.timezone)
  const deadlineText = formatInTimezone(context.submissionDeadline, context.timezone)

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <ParticleBackground />
      <Navbar />
      <SubmissionForm
        canSubmit={context.canSubmit}
        isSubmissionStarted={context.isSubmissionStarted}
        submissionStartText={submissionStartText}
        deadlineText={deadlineText}
      />
      <Footer />
    </main>
  )
}
