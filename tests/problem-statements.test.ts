import { describe, expect, it } from "vitest"

import { formatInTimezone, getProblemStatementContext } from "@/lib/problem-statements"

describe("problem statements context", () => {
  it("is already revealed for current event timeline", () => {
    const context = getProblemStatementContext(new Date("2026-03-10T10:00:00+05:30"))
    expect(context.isRevealed).toBe(true)
  })

  it("unlocks after reveal date", () => {
    const context = getProblemStatementContext(new Date("2026-03-21T10:00:00+05:30"))
    expect(context.isRevealed).toBe(true)
  })

  it("formats date for configured timezone", () => {
    const text = formatInTimezone(new Date("2026-03-20T10:00:00+05:30"), "Asia/Kolkata")
    expect(typeof text).toBe("string")
    expect(text.length).toBeGreaterThan(0)
  })

  it("keeps submission disabled before 12 March 2026, 4:00 PM IST", () => {
    const context = getProblemStatementContext(new Date("2026-03-12T15:59:00+05:30"))
    expect(context.isSubmissionStarted).toBe(false)
    expect(context.canSubmit).toBe(false)
  })

  it("opens submission at and after 12 March 2026, 4:00 PM IST", () => {
    const context = getProblemStatementContext(new Date("2026-03-12T16:00:00+05:30"))
    expect(context.isSubmissionStarted).toBe(true)
    expect(context.canSubmit).toBe(true)
  })
})
