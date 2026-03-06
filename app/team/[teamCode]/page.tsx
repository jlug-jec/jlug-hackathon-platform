import { notFound } from "next/navigation"
import QRCode from "qrcode"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ParticleBackground } from "@/components/particle-background"
import { TeamIdCard } from "@/components/team-id-card"
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
          <TeamIdCard team={team} qrDataUrl={qrDataUrl} qrPayload={qrPayload} />
        </div>
      </section>
      <Footer />
    </main>
  )
}
