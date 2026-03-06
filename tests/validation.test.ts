import { describe, expect, it } from "vitest"

import { registrationSchema } from "@/lib/validation"

const tinyPngDataUrl =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAgMBgMlc3QAAAABJRU5ErkJggg=="

function buildRegistrationPayload() {
  return {
    teamName: "Debug Ninjas",
    leader: {
      name: "Alex Leader",
      email: "alex@example.com",
      phone: "9876543210",
      department: "Computer Science",
      year: "3rd Year",
    },
    members: [
      {
        name: "Member One",
        email: "member1@example.com",
        phone: "9876543211",
        department: "Computer Science",
        year: "3rd Year",
      },
      {
        name: "Member Two",
        email: "member2@example.com",
        phone: "9876543212",
        department: "Information Technology",
        year: "2nd Year",
      },
    ],
    payment: {
      transactionId: "TID123456",
      payerName: "Alex Leader",
      upiId: "alex@upi",
      notes: "Paid via UPI",
      paymentScreenshotDataUrl: tinyPngDataUrl,
    },
  }
}

describe("registrationSchema", () => {
  it("accepts valid payload including mandatory screenshot", () => {
    const result = registrationSchema.safeParse(buildRegistrationPayload())
    expect(result.success).toBe(true)
  })

  it("rejects missing screenshot", () => {
    const payload = buildRegistrationPayload()
    payload.payment.paymentScreenshotDataUrl = ""
    const result = registrationSchema.safeParse(payload)

    expect(result.success).toBe(false)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      expect(errors.payment?.[0]).toContain("Payment screenshot")
    }
  })

  it("rejects invalid screenshot format", () => {
    const payload = buildRegistrationPayload()
    payload.payment.paymentScreenshotDataUrl = "data:text/plain;base64,Zm9v"
    const result = registrationSchema.safeParse(payload)
    expect(result.success).toBe(false)
  })
})
