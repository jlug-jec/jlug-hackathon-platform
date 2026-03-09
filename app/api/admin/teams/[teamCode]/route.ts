import { NextRequest, NextResponse } from "next/server"

import { getAdminSession } from "@/lib/admin-auth"
import { getTeamCardByCode } from "@/lib/db"
import { AppError } from "@/lib/errors"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ teamCode: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session) {
      throw new AppError("Unauthorized. Please login.", 401)
    }
    
    const { teamCode } = await context.params
    
    if (!teamCode) {
      throw new AppError("Team code is required", 400)
    }
    
    const team = await getTeamCardByCode(teamCode)
    
    if (!team) {
      throw new AppError("Team not found", 404)
    }
    
    return NextResponse.json({ team })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }
    console.error("Error fetching team details:", error)
    return NextResponse.json(
      { error: "Failed to fetch team details" },
      { status: 500 }
    )
  }
}
