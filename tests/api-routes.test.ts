import { beforeEach, describe, expect, it, vi } from "vitest"

const createTeamRegistrationMock = vi.fn()
const submitProjectMock = vi.fn()
const getProblemStatementContextMock = vi.fn()
const formatInTimezoneMock = vi.fn()

vi.mock("@/lib/db", () => ({
  createTeamRegistration: createTeamRegistrationMock,
  submitProject: submitProjectMock,
}))

vi.mock("@/lib/problem-statements", () => ({
  getProblemStatementContext: getProblemStatementContextMock,
  formatInTimezone: formatInTimezoneMock,
}))

const tinyPngDataUrl =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAgMBgMlc3QAAAABJRU5ErkJggg=="

const validRegistrationPayload = {
  teamName: "Route Testers",
  leader: {
    name: "Leader User",
    email: "leader@team.dev",
    phone: "9876543210",
    department: "Computer Science",
    year: "3rd Year",
  },
  members: [
    {
      name: "Member One",
      email: "member1@team.dev",
      phone: "9876543211",
      department: "Computer Science",
      year: "2nd Year",
    },
    {
      name: "Member Two",
      email: "member2@team.dev",
      phone: "9876543212",
      department: "Information Technology",
      year: "1st Year",
    },
  ],
  payment: {
    transactionId: "TXN123456",
    payerName: "Leader User",
    upiId: "leader@upi",
    notes: "",
    paymentScreenshotDataUrl: tinyPngDataUrl,
  },
}

describe("API routes", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("register route returns 201 for valid payload", async () => {
    createTeamRegistrationMock.mockResolvedValue({
      teamCode: "CK26-AB12CD",
      teamName: "Route Testers",
      createdAt: "2026-03-06T00:00:00.000Z",
    })

    const { POST } = await import("@/app/api/register/route")
    const request = new Request("http://localhost/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validRegistrationPayload),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(body.teamCode).toBe("CK26-AB12CD")
    expect(createTeamRegistrationMock).toHaveBeenCalledTimes(1)
  })

  it("register route returns 400 for invalid payload", async () => {
    const { POST } = await import("@/app/api/register/route")
    const request = new Request("http://localhost/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName: "A" }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it("submissions route returns 403 when deadline is over", async () => {
    getProblemStatementContextMock.mockReturnValue({
      timezone: "Asia/Kolkata",
      submissionDeadline: new Date("2026-03-01T00:00:00+05:30"),
      isSubmissionOpen: false,
    })
    formatInTimezoneMock.mockReturnValue("Saturday, March 1, 2026 at 12:00 am")

    const { POST } = await import("@/app/api/submissions/route")
    const request = new Request("http://localhost/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamCode: "CK26-AB12CD",
        leaderEmail: "leader@team.dev",
        githubUrl: "https://github.com/example/repo",
        videoUrl: "https://youtu.be/demo",
        presentationUrl: "",
        remarks: "",
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(403)
    expect(submitProjectMock).not.toHaveBeenCalled()
  })
})
