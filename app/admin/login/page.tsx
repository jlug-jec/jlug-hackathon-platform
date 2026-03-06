import { redirect } from "next/navigation"

import { AdminLoginForm } from "@/components/admin-login-form"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ParticleBackground } from "@/components/particle-background"
import { getAdminSession } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export default async function AdminLoginPage() {
  const session = await getAdminSession()
  if (session) {
    redirect("/admin/attendance")
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <ParticleBackground />
      <Navbar />
      <section className="relative z-10 px-4 pt-28 pb-20 lg:px-8">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 md:p-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Attendance scanner access is restricted to event coordinators.
          </p>
          <AdminLoginForm />
        </div>
      </section>
      <Footer />
    </main>
  )
}
