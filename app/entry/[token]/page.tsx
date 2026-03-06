import Link from "next/link"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ParticleBackground } from "@/components/particle-background"
import { getTeamByAttendanceToken } from "@/lib/db"

export const dynamic = "force-dynamic"

type EntryTokenPageProps = {
  params: Promise<{ token: string }>
}

export default async function EntryTokenPage({ params }: EntryTokenPageProps) {
  const { token } = await params
  const team = await getTeamByAttendanceToken(token)

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <ParticleBackground />
      <Navbar />
      <section className="relative z-10 px-4 pt-28 pb-20 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 md:p-8 text-center">
          {team ? (
            <>
              <p className="text-sm uppercase tracking-widest text-primary">Attendance Token</p>
              <h1 className="mt-3 text-2xl font-bold text-foreground">{team.teamName}</h1>
              <p className="mt-1 font-mono text-sm text-muted-foreground">{team.teamCode}</p>
              <p className="mt-5 text-sm text-muted-foreground">
                This QR token is valid. Show this page/QR to the admin scanner desk at entry.
              </p>
              {team.attendanceMarkedAt ? (
                <p className="mt-3 text-sm text-primary">
                  Attendance already marked on {new Date(team.attendanceMarkedAt).toLocaleString("en-IN")}
                </p>
              ) : (
                <p className="mt-3 text-sm text-foreground">Attendance not marked yet.</p>
              )}
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-foreground">Invalid Entry Token</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                This token does not match any registered team.
              </p>
            </>
          )}

          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Back to Home
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
