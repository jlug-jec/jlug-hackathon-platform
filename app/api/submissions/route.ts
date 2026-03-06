import { NextResponse } from "next/server"

import { handleApiError } from "@/lib/api"
import { AppError } from "@/lib/errors"
import { formatInTimezone, getProblemStatementContext } from "@/lib/problem-statements"
import { submitProject } from "@/lib/db"
import { submissionSchema } from "@/lib/validation"

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const parsed = submissionSchema.parse(payload)

    const context = getProblemStatementContext()
    if (!context.isSubmissionStarted) {
      const startText = formatInTimezone(context.submissionStartsAt, context.timezone)
      throw new AppError(
        `Submission has not started yet. It opens at ${startText} (${context.timezone}).`,
        403,
      )
    }

    if (!context.isSubmissionOpen) {
      const deadlineText = formatInTimezone(context.submissionDeadline, context.timezone)
      throw new AppError(
        `Submission window is closed. Deadline was ${deadlineText} (${context.timezone}).`,
        403,
      )
    }

    const result = await submitProject(parsed)
    return NextResponse.json({
      message: result.created
        ? "Submission received successfully."
        : "Submission updated successfully.",
      teamCode: result.teamCode,
      teamName: result.teamName,
      submission: result.submission,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
