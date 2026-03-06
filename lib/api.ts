import { NextResponse } from "next/server"
import { ZodError } from "zod"

import { AppError } from "@/lib/errors"

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        details: error.flatten(),
      },
      { status: 400 },
    )
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      { error: "Invalid JSON payload. Please check your request body." },
      { status: 400 },
    )
  }

  console.error(error)
  return NextResponse.json(
    { error: "Something went wrong. Please try again in a moment." },
    { status: 500 },
  )
}
