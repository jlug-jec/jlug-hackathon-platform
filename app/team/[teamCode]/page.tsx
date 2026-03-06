import Link from "next/link"
import { notFound } from "next/navigation"
import QRCode from "qrcode"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ParticleBackground } from "@/components/particle-background"
import { buildAttendancePayload } from "@/lib/attendance"
import { getTeamCardByCode } from "@/lib/db"
import { getSiteBaseUrl } from "@/lib/site-url"

export const dynamic = "force-dynamic"

type TeamCardPageProps = {
  params: Promise<{ teamCode: string }>
}

export default async function TeamCardPage({ params }: TeamCardPageProps) {
  const { teamCode } = await params
  const team = await getTeamCardByCode(teamCode)
  if (!team) {
    notFound()
  }

  const attendanceUrl = `${getSiteBaseUrl()}/entry/${team.attendanceToken}`
  const qrPayload = buildAttendancePayload(team.attendanceToken)
  const qrDataUrl = await QRCode.toDataURL(attendanceUrl, {
    margin: 1,
    width: 320,
    errorCorrectionLevel: "M",
  })

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <ParticleBackground />
      <Navbar />
      <section className="relative z-10 px-4 pt-28 pb-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-primary/30 bg-card p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-primary">CodeKumbh Team ID</p>
                <h1 className="mt-2 text-2xl font-bold text-foreground">{team.teamName}</h1>
                <p className="mt-1 font-mono text-sm text-muted-foreground">{team.teamCode}</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
                Created on {new Date(team.createdAt).toLocaleString("en-IN")}
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[1fr_280px]">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Team Members
                </h2>
                <div className="mt-3 space-y-2">
                  {team.members.map((member) => (
                    <div
                      key={member.id}
                      className="rounded-lg border border-border bg-secondary/30 px-3 py-2"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {member.name}{" "}
                        {member.role === "leader" ? (
                          <span className="text-xs text-primary">(Leader)</span>
                        ) : null}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.department} - {member.year}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.email} | {member.phone}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background/30 p-4 text-center">
                <img
                  src={qrDataUrl}
                  alt={`Attendance QR for ${team.teamCode}`}
                  className="mx-auto h-52 w-52 rounded-lg border border-border bg-white p-2"
                />
                <p className="mt-3 text-xs text-muted-foreground">
                  Show this QR at entry desk for attendance marking.
                </p>
                <p className="mt-2 rounded-md border border-border bg-secondary/50 p-2 text-[11px] font-mono text-muted-foreground">
                  {qrPayload}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/submit"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Submit Project
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
