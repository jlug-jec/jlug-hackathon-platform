import { NextResponse } from "next/server"

import { handleApiError } from "@/lib/api"
import { createTeamRegistration } from "@/lib/db"
import { registrationSchema } from "@/lib/validation"

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const parsed = registrationSchema.parse(payload)
    const registration = await createTeamRegistration(parsed)

    return NextResponse.json(
      {
        message: "Registration successful.",
        teamCode: registration.teamCode,
        teamName: registration.teamName,
        createdAt: registration.createdAt,
        idCardPath: `/team/${registration.teamCode}`,
      },
      { status: 201 },
    )
  } catch (error) {
    return handleApiError(error)
  }
}
