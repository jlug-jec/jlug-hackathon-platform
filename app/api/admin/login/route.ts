import { NextResponse } from "next/server"

import { handleApiError } from "@/lib/api"
import {
  createAdminSessionToken,
  getAdminCookieName,
  getAdminCookieOptions,
  verifyAdminCredentials,
} from "@/lib/admin-auth"
import { AppError } from "@/lib/errors"
import { adminLoginSchema } from "@/lib/validation"

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const parsed = adminLoginSchema.parse(payload)
    const isValid = verifyAdminCredentials(parsed.username, parsed.password)

    if (!isValid) {
      throw new AppError("Invalid admin credentials.", 401)
    }

    const token = createAdminSessionToken(parsed.username)
    const response = NextResponse.json({
      message: "Admin login successful.",
      redirectTo: "/admin/attendance",
    })
    response.cookies.set(getAdminCookieName(), token, getAdminCookieOptions())
    return response
  } catch (error) {
    return handleApiError(error)
  }
}
