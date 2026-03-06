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
  submissionDeadline: Date
  isRevealed: boolean
  isSubmissionOpen: boolean
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
  const submissionDeadline = parseIsoDate(
    problemStatements.submissionDeadline,
    "submissionDeadline",
  )

  return {
    title: problemStatements.title,
    timezone: problemStatements.timezone || "Asia/Kolkata",
    revealAt,
    submissionDeadline,
    isRevealed: now >= revealAt,
    isSubmissionOpen: now <= submissionDeadline,
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
