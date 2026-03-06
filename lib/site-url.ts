export function getSiteBaseUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)

  const fallback = "http://localhost:3000"
  const value = configured?.trim() || fallback
  return value.endsWith("/") ? value.slice(0, -1) : value
}
