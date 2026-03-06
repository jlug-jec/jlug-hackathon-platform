import "server-only"

import { createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const ADMIN_COOKIE_NAME = "codekumbh_admin_session"
const SESSION_TTL_MS = 12 * 60 * 60 * 1000

export type AdminSession = {
  username: string
  expiresAt: number
}

export function getAdminCookieName(): string {
  return ADMIN_COOKIE_NAME
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  }
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  const expectedUsername = (process.env.ADMIN_USERNAME || "admin").trim().toLowerCase()
  const expectedPassword = process.env.ADMIN_PASSWORD || "change-me"

  return (
    safeCompare(username.trim().toLowerCase(), expectedUsername) &&
    safeCompare(password, expectedPassword)
  )
}

export function createAdminSessionToken(username: string): string {
  const secret = getSessionSecret()
  const expiresAt = Date.now() + SESSION_TTL_MS
  const encodedUser = Buffer.from(username.trim().toLowerCase()).toString("base64url")
  const payload = `${encodedUser}.${expiresAt}`
  const signature = sign(payload, secret)
  return `${payload}.${signature}`
}

export function verifyAdminSessionToken(token?: string | null): AdminSession | null {
  if (!token) return null
  const secret = getSessionSecret()
  const [encodedUser, rawExpiry, signature] = token.split(".")
  if (!encodedUser || !rawExpiry || !signature) return null

  const payload = `${encodedUser}.${rawExpiry}`
  const expected = sign(payload, secret)
  if (!safeCompare(signature, expected)) return null

  const expiresAt = Number(rawExpiry)
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return null

  try {
    const username = Buffer.from(encodedUser, "base64url").toString("utf8")
    if (!username) return null
    return { username, expiresAt }
  } catch {
    return null
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  return verifyAdminSessionToken(token)
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (!session) {
    redirect("/admin/login")
  }
  return session
}

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "dev-only-change-this-secret"
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex")
}

function safeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }
  return timingSafeEqual(leftBuffer, rightBuffer)
}
