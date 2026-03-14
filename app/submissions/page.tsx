import { ExternalLink, FileText, Github } from "lucide-react"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ParticleBackground } from "@/components/particle-background"
import { getPublicSubmissions, type PublicSubmission } from "@/lib/db"

export const dynamic = "force-dynamic"

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
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {submissions.map((item) => {
                const embedUrl = getYouTubeEmbedUrl(item.videoUrl)
                return (
                  <article
                    key={item.teamCode}
                    className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                  >
                    {/* Video embed or fallback banner */}
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

                    {/* Card content */}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h2 className="text-lg font-semibold leading-tight text-foreground">
                          {item.teamName}
                        </h2>
                        <span className="shrink-0 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                          {item.teamCode}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Submitted {new Date(item.updatedAt).toLocaleString("en-IN")}
                      </p>

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
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
