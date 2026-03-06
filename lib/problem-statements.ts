import problemStatements from "@/data/problem-statements.json"

export type ProblemStatementItem = {
  id: string
  title: string
  description: string
  tags: string[]
  sponsor?: string
}

export type ProblemStatementContext = {
  title: string
  timezone: string
  revealAt: Date
  submissionStartsAt: Date
  submissionDeadline: Date
  isRevealed: boolean
  isSubmissionStarted: boolean
  isSubmissionOpen: boolean
  canSubmit: boolean
  items: ProblemStatementItem[]
}

function parseIsoDate(value: string, label: string): Date {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid ${label} in problem-statements.json: ${value}`)
  }
  return parsed
}

export function getProblemStatementContext(now = new Date()): ProblemStatementContext {
  const revealAt = parseIsoDate(problemStatements.revealAt, "revealAt")
  const submissionStartsAt = parseIsoDate(
    problemStatements.submissionStartsAt,
    "submissionStartsAt",
  )
  const submissionDeadline = parseIsoDate(
    problemStatements.submissionDeadline,
    "submissionDeadline",
  )
  const isSubmissionStarted = now >= submissionStartsAt
  const isSubmissionOpen = now <= submissionDeadline
  const canSubmit = isSubmissionStarted && isSubmissionOpen

  return {
    title: problemStatements.title,
    timezone: problemStatements.timezone || "Asia/Kolkata",
    revealAt,
    submissionStartsAt,
    submissionDeadline,
    isRevealed: now >= revealAt,
    isSubmissionStarted,
    isSubmissionOpen,
    canSubmit,
    items: problemStatements.items,
  }
}

export function formatInTimezone(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: timezone,
  }).format(date)
}
