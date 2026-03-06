const TEAM_CODE_REGEX = /^CK26-[A-Z0-9]{6}$/
const TOKEN_REGEX = /^[a-f0-9]{24,64}$/i

export type AttendanceLookup =
  | { kind: "token"; value: string }
  | { kind: "teamCode"; value: string }

export function parseAttendancePayload(raw: string): AttendanceLookup | null {
  const input = raw.trim()
  if (!input) return null

  const fromStructured = parseStructuredPayload(input)
  if (fromStructured) return fromStructured

  const fromUrl = parseUrlPayload(input)
  if (fromUrl) return fromUrl

  if (TEAM_CODE_REGEX.test(input.toUpperCase())) {
    return { kind: "teamCode", value: input.toUpperCase() }
  }

  if (TOKEN_REGEX.test(input)) {
    return { kind: "token", value: input.toLowerCase() }
  }

  return null
}

export function buildAttendancePayload(token: string): string {
  return `codekumbh26:entry:${token}`
}

function parseStructuredPayload(input: string): AttendanceLookup | null {
  if (!input.startsWith("codekumbh26:entry:")) {
    return null
  }

  const token = input.split(":").at(-1)?.trim() ?? ""
  if (!token || !TOKEN_REGEX.test(token)) {
    return null
  }

  return { kind: "token", value: token.toLowerCase() }
}

function parseUrlPayload(input: string): AttendanceLookup | null {
  try {
    const parsed = new URL(input, "https://codekumbh.local")
    const queryToken = parsed.searchParams.get("token")
    if (queryToken && TOKEN_REGEX.test(queryToken)) {
      return { kind: "token", value: queryToken.toLowerCase() }
    }

    const parts = parsed.pathname.split("/").filter(Boolean)
    const entryIndex = parts.findIndex((part) => part === "entry")
    const token = entryIndex >= 0 ? parts[entryIndex + 1] : undefined
    if (token && TOKEN_REGEX.test(token)) {
      return { kind: "token", value: token.toLowerCase() }
    }
  } catch {
    return null
  }

  return null
}
