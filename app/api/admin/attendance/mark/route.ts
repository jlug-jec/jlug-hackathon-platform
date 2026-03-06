import { NextRequest, NextResponse } from "next/server"

import { handleApiError } from "@/lib/api"
import { getAdminCookieName, verifyAdminSessionToken } from "@/lib/admin-auth"
import { markAttendanceFromPayload } from "@/lib/db"
import { AppError } from "@/lib/errors"
import { attendanceMarkSchema } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(getAdminCookieName())?.value

    const session = verifyAdminSessionToken(token)
    if (!session) {
      throw new AppError("Admin session expired. Please login again.", 401)
    }

    const payload = await request.json()
    const parsed = attendanceMarkSchema.parse(payload)
    const result = await markAttendanceFromPayload(parsed.payload, session.username, parsed.day)

    return NextResponse.json({
      message: result.alreadyMarked
        ? `Attendance for ${result.day.toUpperCase()} was already marked for this team.`
        : "Attendance marked successfully.",
      result,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
