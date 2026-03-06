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
      gender: "Male",
    },
    members: [
      {
        name: "Member One",
        email: "member1@example.com",
        phone: "9876543211",
        department: "Computer Science",
        year: "3rd Year",
        gender: "Female",
      },
      {
        name: "Member Two",
        email: "member2@example.com",
        phone: "9876543212",
        department: "Information Technology",
        year: "2nd Year",
        gender: "Male",
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

  it("rejects teams without both genders", () => {
    const payload = buildRegistrationPayload()
    payload.leader.gender = "Male"
    payload.members[0].gender = "Male"
    payload.members[1].gender = "Male"
    const result = registrationSchema.safeParse(payload)
    expect(result.success).toBe(false)
  })

  it("rejects more than 5 participants total", () => {
    const payload = buildRegistrationPayload()
    payload.members.push(
      {
        name: "Member Three",
        email: "member3@example.com",
        phone: "9876543213",
        department: "Mechanical Engineering",
        year: "2nd Year",
        gender: "Female",
      },
      {
        name: "Member Four",
        email: "member4@example.com",
        phone: "9876543214",
        department: "Civil Engineering",
        year: "1st Year",
        gender: "Male",
      },
      {
        name: "Member Five",
        email: "member5@example.com",
        phone: "9876543215",
        department: "Information Technology",
        year: "1st Year",
        gender: "Female",
      },
    )
    const result = registrationSchema.safeParse(payload)
    expect(result.success).toBe(false)
  })
})
