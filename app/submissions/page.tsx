import { ExternalLink, FileText, Github, Trophy } from "lucide-react"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ParticleBackground } from "@/components/particle-background"
import { getPublicSubmissions, type PublicSubmission } from "@/lib/db"

export const dynamic = "force-dynamic"

type WinnerDefinition = {
  teamName: string
  matchKeys: string[]
  title: string
  order: number
}

const winnerDefinitions: WinnerDefinition[] = [
  { teamName: "KCMJ", matchKeys: ["KCMJ", "TEAMKCMJ"], title: "1st Place", order: 1 },
  {
    teamName: "TechStorme",
    matchKeys: ["TECHSTORME", "TECHSTORM", "TECHSTROME"],
    title: "2nd Place",
    order: 2,
  },
  {
    teamName: "AGHORI CODERS",
    matchKeys: ["AGHORICODERS", "TEAMAGHORICODERS"],
    title: "Civic Tech Domain Winner",
    order: 3,
  },
  {
    teamName: "Team Eror 404",
    matchKeys: ["ERROR404", "EROR404", "TEAMERROR404", "TEAMEROR404", "ERRORFOURZEROFOUR"],
    title: "Cybersecurity Domain Winner",
    order: 4,
  },
  {
    teamName: "TECH MANTRA",
    matchKeys: ["TECHMANTRA", "TEAMTECHMANTRA"],
    title: "Healthcare Domain Winner",
    order: 5,
  },
  {
    teamName: "SECURE MOTION",
    matchKeys: ["SECUREMOTION", "TEAMSECUREMOTION"],
    title: "SIoT Domain Winner",
    order: 6,
  },
  {
    teamName: "CODE-O-NAUTS",
    matchKeys: ["CODEONAUTS", "CODENAUTS", "TEAMCODEONAUTS"],
    title: "AR/VR Domain Winner",
    order: 7,
  },
  {
    teamName: "The Code Matrix",
    matchKeys: ["CODEMATRIX", "TEAMCODEMATRIX", "CODEMATRIXX"],
    title: "Open Innovation Domain Winner",
    order: 8,
  },
]

function normalizeTeamName(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "")
}

function isWithinOneEdit(a: string, b: string): boolean {
  const lenA = a.length
  const lenB = b.length

  if (Math.abs(lenA - lenB) > 1) {
    return false
  }

  let i = 0
  let j = 0
  let edits = 0

  while (i < lenA && j < lenB) {
    if (a[i] === b[j]) {
      i += 1
      j += 1
      continue
    }

    edits += 1
    if (edits > 1) {
      return false
    }

    if (lenA > lenB) {
      i += 1
    } else if (lenB > lenA) {
      j += 1
    } else {
      i += 1
      j += 1
    }
  }

  if (i < lenA || j < lenB) {
    edits += 1
  }

  return edits <= 1
}

function findWinnerByTeamName(teamName: string): WinnerDefinition | null {
  const normalized = normalizeTeamName(teamName)

  for (const winner of winnerDefinitions) {
    const normalizedKeys = winner.matchKeys.map((key) => normalizeTeamName(key))

    if (normalizedKeys.some((key) => key === normalized)) {
      return winner
    }

    // Allow close variants like "TEAMERROR404" or "CODEMATRIX25" while preventing broad false matches.
    if (
      normalizedKeys.some(
        (key) => key.length >= 6 && (normalized.includes(key) || key.includes(normalized)),
      )
    ) {
      return winner
    }

    // Catch small typos like ERROR vs EROR without making matching too broad.
    if (
      normalizedKeys.some(
        (key) => key.length >= 6 && normalized.length >= 6 && isWithinOneEdit(normalized, key),
      )
    ) {
      return winner
    }
  }

  return null
}

function formatDateTimeIst(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Invalid date"
  }

  return `${date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })} IST`
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace(/^\//, "")
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v")
      if (v) return `https://www.youtube.com/embed/${v}`
      const shorts = u.pathname.match(/\/shorts\/([^/?&#]+)/)
      if (shorts?.[1]) return `https://www.youtube.com/embed/${shorts[1]}`
    }
    return null
  } catch {
    return null
  }
}

export default async function SubmissionsPage() {
  let submissions: PublicSubmission[] = []
  let loadError: string | null = null

  try {
    submissions = await getPublicSubmissions()
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Unable to load submissions right now."
  }

  const winnerSubmissions = submissions
    .map((item) => {
      const winner = findWinnerByTeamName(item.teamName)
      if (!winner) return null
      return { item, winner }
    })
    .filter((entry): entry is { item: PublicSubmission; winner: WinnerDefinition } => entry !== null)
    .sort((a, b) => a.winner.order - b.winner.order)

  const winnerSubmissionByOrder = new Map(
    winnerSubmissions.map((entry) => [entry.winner.order, entry.item] as const),
  )

  const pinnedTeamCodes = new Set(winnerSubmissions.map((entry) => entry.item.teamCode))
  const otherSubmissions = submissions.filter((item) => !pinnedTeamCodes.has(item.teamCode))

  const renderSubmissionCard = (item: PublicSubmission, winnerTitle?: string) => {
    const embedUrl = getYouTubeEmbedUrl(item.videoUrl)

    return (
      <article
        key={item.teamCode}
        className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
      >
        {embedUrl ? (
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe
              src={embedUrl}
              title={`${item.teamName} demo video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        ) : (
          <a
            href={item.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-44 items-center justify-center gap-2 bg-secondary/60 text-sm font-medium text-primary transition-colors hover:bg-secondary/80"
          >
            <ExternalLink className="h-4 w-4" />
            Watch Demo Video
          </a>
        )}

        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h2 className="text-lg font-semibold leading-tight text-foreground">{item.teamName}</h2>
            <div className="flex flex-wrap justify-end gap-1.5">
              {winnerTitle && (
                <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
                  <Trophy className="h-3 w-3" />
                  {winnerTitle}
                </span>
              )}
              <span className="shrink-0 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {item.teamCode}
              </span>
            </div>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">Submitted {formatDateTimeIst(item.updatedAt)}</p>

          {item.remarks && (
            <p className="mt-3 rounded-lg border border-border bg-secondary/40 px-3 py-2.5 text-sm leading-relaxed text-muted-foreground">
              {item.remarks}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={item.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary/70"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub Repo
            </a>
            {!embedUrl && (
              <a
                href={item.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary/70"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Demo Video
              </a>
            )}
            {item.presentationUrl && (
              <a
                href={item.presentationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary/70"
              >
                <FileText className="h-3.5 w-3.5" />
                Presentation
              </a>
            )}
          </div>
        </div>
      </article>
    )
  }

  const renderWinnerPlaceholderCard = (winner: WinnerDefinition) => {
    return (
      <article
        key={winner.order}
        className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        <div className="flex h-44 items-center justify-center bg-secondary/50 text-sm text-muted-foreground">
          Submission links not available
        </div>
        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h2 className="text-lg font-semibold leading-tight text-foreground">{winner.teamName}</h2>
            <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
              <Trophy className="h-3 w-3" />
              {winner.title}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Winner listed by organizers.</p>
        </div>
      </article>
    )
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <ParticleBackground />
      <Navbar />
      <section className="relative z-10 px-4 pt-28 pb-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Team Submissions</h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Explore the projects built by teams during CodeKumbh 2.0.
            </p>
          </div>

          {loadError ? (
            <div className="mt-10 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {loadError}
            </div>
          ) : submissions.length === 0 ? (
            <div className="mt-10 rounded-xl border border-border bg-card px-5 py-8 text-center text-muted-foreground">
              No submissions yet.
            </div>
          ) : (
            <>
              <div className="mt-10">
                <div className="mb-4 flex items-center gap-2 text-amber-300">
                  <Trophy className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Winner Projects</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {winnerDefinitions
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((winner) => {
                      const matchedSubmission = winnerSubmissionByOrder.get(winner.order)
                      return matchedSubmission
                        ? renderSubmissionCard(matchedSubmission, winner.title)
                        : renderWinnerPlaceholderCard(winner)
                    })}
                </div>
              </div>

              {otherSubmissions.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-semibold text-foreground">All Submissions</h2>
                  <div className="mt-4 grid gap-6 md:grid-cols-2">
                    {otherSubmissions.map((item) => renderSubmissionCard(item))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
