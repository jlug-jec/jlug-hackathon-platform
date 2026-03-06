import { describe, expect, it } from "vitest"

import { formatInTimezone, getProblemStatementContext } from "@/lib/problem-statements"

describe("problem statements context", () => {
  it("stays locked before reveal date", () => {
    const context = getProblemStatementContext(new Date("2026-03-10T10:00:00+05:30"))
    expect(context.isRevealed).toBe(false)
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
})
