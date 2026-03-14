import { ExternalLink, FileText, Github, Trophy } from "lucide-react"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ParticleBackground } from "@/components/particle-background"
import { getPublicSubmissions, type PublicSubmission } from "@/lib/db"

export const dynamic = "force-dynamic"

type WinnerDefinition = {
  teamName: string
  title: string
  order: number
}

const winnerDefinitions: WinnerDefinition[] = [
  { teamName: "KCMJ", title: "1st Place", order: 1 },
  { teamName: "Tech Strome", title: "2nd Place", order: 2 },
  { teamName: "AGHORI CODERS", title: "Civic Tech Domain Winner", order: 3 },
  { teamName: "ERROR 404", title: "Cybersecurity Domain Winner", order: 4 },
  { teamName: "TECH MANTRA", title: "Healthcare Domain Winner", order: 5 },
  { teamName: "SECURE MOTION", title: "SIoT Domain Winner", order: 6 },
  { teamName: "CODE-O-NAUTS", title: "AR/VR Domain Winner", order: 7 },
  { teamName: "CODE MATRIX", title: "Open Innovation Domain Winner", order: 8 },
]

function normalizeTeamName(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "")
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

  const winnerMap = new Map(
    winnerDefinitions.map((winner) => [normalizeTeamName(winner.teamName), winner] as const),
  )

  const winnerSubmissions = submissions
    .map((item) => {
      const winner = winnerMap.get(normalizeTeamName(item.teamName))
      if (!winner) return null
      return { item, winner }
    })
    .filter((entry): entry is { item: PublicSubmission; winner: WinnerDefinition } => entry !== null)
    .sort((a, b) => a.winner.order - b.winner.order)

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
              {winnerSubmissions.length > 0 && (
                <div className="mt-10">
                  <div className="mb-4 flex items-center gap-2 text-amber-300">
                    <Trophy className="h-5 w-5" />
                    <h2 className="text-xl font-semibold">Winner Projects</h2>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {winnerSubmissions.map(({ item, winner }) => renderSubmissionCard(item, winner.title))}
                  </div>
                </div>
              )}

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
