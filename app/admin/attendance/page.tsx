import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ParticleBackground } from "@/components/particle-background"
import { AttendanceScanner } from "@/components/attendance-scanner"
import { requireAdminSession } from "@/lib/admin-auth"
import { getAttendanceDashboardData } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function AdminAttendancePage() {
  const session = await requireAdminSession()
  const dashboard = await getAttendanceDashboardData()

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <ParticleBackground />
      <Navbar />
      <AttendanceScanner
        initialTotalTeams={dashboard.totalTeams}
        initialDay1AttendedTeams={dashboard.day1AttendedTeams}
        initialDay1PendingTeams={dashboard.day1PendingTeams}
        initialDay2AttendedTeams={dashboard.day2AttendedTeams}
        initialDay2PendingTeams={dashboard.day2PendingTeams}
        initialRecentEntries={dashboard.recentEntries}
        initialTeamOverview={dashboard.teamOverview}
        adminUsername={session.username}
      />
      <Footer />
    </main>
  )
}
