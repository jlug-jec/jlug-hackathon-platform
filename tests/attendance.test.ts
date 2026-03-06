import { describe, expect, it } from "vitest"

import { parseAttendancePayload } from "@/lib/attendance"

describe("parseAttendancePayload", () => {
  it("parses structured token payload", () => {
    const token = "abcdefabcdefabcdefabcdef"
    const parsed = parseAttendancePayload(`codekumbh26:entry:${token}`)
    expect(parsed).toEqual({ kind: "token", value: token })
  })

  it("parses token from URL query", () => {
    const token = "1234567890abcdef12345678"
    const parsed = parseAttendancePayload(`https://example.com/entry?token=${token}`)
    expect(parsed).toEqual({ kind: "token", value: token })
  })

  it("parses team code fallback", () => {
    const parsed = parseAttendancePayload("ck26-ab12cd")
    expect(parsed).toEqual({ kind: "teamCode", value: "CK26-AB12CD" })
  })

  it("returns null for invalid payload", () => {
    expect(parseAttendancePayload("not-a-valid-payload")).toBeNull()
  })
})
