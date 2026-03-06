import Link from "next/link"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ParticleBackground } from "@/components/particle-background"
import { getPublicSubmissions } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function SubmissionsPage() {
  let submissions: Awaited<ReturnType<typeof getPublicSubmissions>> = []
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
              Public feed of projects submitted before deadline.
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
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {submissions.map((item) => (
                <article key={item.teamCode} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-foreground">{item.teamName}</h2>
                    <span className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {item.teamCode}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Updated: {new Date(item.updatedAt).toLocaleString("en-IN")}
                  </p>
                  <div className="mt-4 space-y-2 text-sm">
                    <Link
                      href={item.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-primary hover:underline"
                    >
                      GitHub Repository
                    </Link>
                    <Link
                      href={item.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-primary hover:underline"
                    >
                      Demo Video
                    </Link>
                    {item.presentationUrl && (
                      <Link
                        href={item.presentationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-primary hover:underline"
                      >
                        Presentation
                      </Link>
                    )}
                  </div>
                  {item.remarks && (
                    <p className="mt-4 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
                      {item.remarks}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
