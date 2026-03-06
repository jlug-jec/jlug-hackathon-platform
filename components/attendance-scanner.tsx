"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { BrowserQRCodeReader, type IScannerControls } from "@zxing/browser"
import { Camera, Loader2, LogOut, QrCode, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type DashboardOverview = {
  teamCode: string
  teamName: string
  memberCount: number
  paymentStatus: string
  attendanceMarkedAt: string | null
  createdAt: string
}

type RecentEntry = {
  teamCode: string
  teamName: string
  markedAt: string
  markedBy: string | null
}

type ScannerProps = {
  initialTotalTeams: number
  initialAttendedTeams: number
  initialPendingTeams: number
  initialRecentEntries: RecentEntry[]
  initialTeamOverview: DashboardOverview[]
  adminUsername: string
}

type MarkAttendanceResult = {
  teamCode: string
  teamName: string
  memberCount: number
  alreadyMarked: boolean
  markedAt: string
  markedBy: string | null
}

export function AttendanceScanner({
  initialTotalTeams,
  initialAttendedTeams,
  initialPendingTeams,
  initialRecentEntries,
  initialTeamOverview,
  adminUsername,
}: ScannerProps) {
  const [recentEntries, setRecentEntries] = useState<RecentEntry[]>(initialRecentEntries)
  const [teamOverview, setTeamOverview] = useState<DashboardOverview[]>(initialTeamOverview)
  const [attendedTeams, setAttendedTeams] = useState(initialAttendedTeams)
  const [pendingTeams, setPendingTeams] = useState(initialPendingTeams)
  const [manualValue, setManualValue] = useState("")
  const [lastResult, setLastResult] = useState<MarkAttendanceResult | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [cameraLoading, setCameraLoading] = useState(true)
  const [isMarking, setIsMarking] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const controlsRef = useRef<IScannerControls | null>(null)
  const lastPayloadRef = useRef<{ value: string; at: number }>({ value: "", at: 0 })
  const isMarkingRef = useRef(false)

  const applyMarkResult = useCallback((result: MarkAttendanceResult) => {
    setLastResult(result)
    setRecentEntries((current) => {
      const next = [
        {
          teamCode: result.teamCode,
          teamName: result.teamName,
          markedAt: result.markedAt,
          markedBy: result.markedBy,
        },
        ...current.filter((entry) => entry.teamCode !== result.teamCode),
      ]
      return next.slice(0, 20)
    })

    setTeamOverview((current) =>
      current.map((team) =>
        team.teamCode === result.teamCode
          ? { ...team, attendanceMarkedAt: result.markedAt }
          : team,
      ),
    )

    if (!result.alreadyMarked) {
      setAttendedTeams((count) => count + 1)
      setPendingTeams((count) => Math.max(0, count - 1))
    }
  }, [])

  const markAttendance = useCallback(
    async (payload: string) => {
      const value = payload.trim()
      if (!value) return

      const now = Date.now()
      if (lastPayloadRef.current.value === value && now - lastPayloadRef.current.at < 2500) {
        return
      }

      if (isMarkingRef.current) return

      lastPayloadRef.current = { value, at: now }
      setIsMarking(true)
      isMarkingRef.current = true

      try {
        const response = await fetch("/api/admin/attendance/mark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload: value }),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data?.error || "Unable to mark attendance.")
        }

        applyMarkResult(data.result as MarkAttendanceResult)
        setManualValue("")
        toast.success(data.message || "Attendance marked.")
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to mark attendance.")
      } finally {
        setIsMarking(false)
        isMarkingRef.current = false
      }
    },
    [applyMarkResult],
  )

  const startScanner = useCallback(async () => {
    if (!videoRef.current) return

    setCameraError(null)
    setCameraLoading(true)

    try {
      const reader = new BrowserQRCodeReader(undefined, {
        delayBetweenScanAttempts: 250,
      })

      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result) => {
          if (result) {
            void markAttendance(result.getText())
          }
        },
      )

      controlsRef.current = controls
    } catch (error) {
      setCameraError(
        error instanceof Error
          ? error.message
          : "Could not access camera. Use manual entry as fallback.",
      )
    } finally {
      setCameraLoading(false)
    }
  }, [markAttendance])

  useEffect(() => {
    void startScanner()
    return () => {
      controlsRef.current?.stop()
    }
  }, [startScanner])

  const refreshScanner = async () => {
    controlsRef.current?.stop()
    await startScanner()
  }

  const logout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      window.location.href = "/admin/login"
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <section className="relative z-10 px-4 pt-28 pb-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Attendance Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Logged in as {adminUsername}</p>
          </div>
          <Button variant="outline" onClick={logout} disabled={isLoggingOut}>
            {isLoggingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </>
            )}
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <MetricCard label="Registered Teams" value={initialTotalTeams} />
          <MetricCard label="Attendance Marked" value={attendedTeams} />
          <MetricCard label="Pending Entry" value={pendingTeams} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[420px_1fr]">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">QR Scanner</h2>
              <Button size="sm" variant="ghost" onClick={refreshScanner}>
                <RefreshCw className="mr-1 h-4 w-4" />
                Restart
              </Button>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-border bg-black/20">
              <video ref={videoRef} className="aspect-video w-full object-cover" muted playsInline />
            </div>

            <div className="mt-3 min-h-5 text-xs text-muted-foreground">
              {cameraLoading ? (
                <span className="inline-flex items-center">
                  <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                  Starting camera...
                </span>
              ) : cameraError ? (
                <span className="text-destructive">{cameraError}</span>
              ) : (
                <span className="inline-flex items-center">
                  <Camera className="mr-1 h-3.5 w-3.5" />
                  Scan team QR directly
                </span>
              )}
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold text-foreground">Manual Scan Fallback</p>
              <div className="mt-2 flex gap-2">
                <Input
                  value={manualValue}
                  onChange={(event) => setManualValue(event.target.value)}
                  placeholder="Paste QR content / token / team code"
                  className="bg-input border-border text-foreground"
                />
                <Button onClick={() => void markAttendance(manualValue)} disabled={isMarking}>
                  {isMarking ? <Loader2 className="h-4 w-4 animate-spin" /> : <QrCode className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {lastResult && (
              <div className="mt-5 rounded-lg border border-border bg-secondary/40 p-3 text-sm">
                <p className="font-semibold text-foreground">
                  {lastResult.teamCode} - {lastResult.teamName}
                </p>
                <p className="mt-1 text-muted-foreground">
                  {lastResult.alreadyMarked ? "Already marked at" : "Marked at"}{" "}
                  {new Date(lastResult.markedAt).toLocaleString("en-IN")}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold text-foreground">Recent Entries</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="px-3 py-2">Team</th>
                      <th className="px-3 py-2">Marked At</th>
                      <th className="px-3 py-2">By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEntries.length === 0 ? (
                      <tr>
                        <td className="px-3 py-4 text-muted-foreground" colSpan={3}>
                          No attendance marked yet.
                        </td>
                      </tr>
                    ) : (
                      recentEntries.map((entry) => (
                        <tr key={`${entry.teamCode}-${entry.markedAt}`} className="border-t border-border">
                          <td className="px-3 py-2">
                            <p className="font-semibold text-foreground">{entry.teamCode}</p>
                            <p className="text-xs text-muted-foreground">{entry.teamName}</p>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {new Date(entry.markedAt).toLocaleString("en-IN")}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{entry.markedBy || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold text-foreground">Registered Teams</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="px-3 py-2">Team</th>
                      <th className="px-3 py-2">Members</th>
                      <th className="px-3 py-2">Payment</th>
                      <th className="px-3 py-2">Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamOverview.map((team) => (
                      <tr key={team.teamCode} className="border-t border-border">
                        <td className="px-3 py-2">
                          <p className="font-semibold text-foreground">{team.teamCode}</p>
                          <p className="text-xs text-muted-foreground">{team.teamName}</p>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{team.memberCount}</td>
                        <td className="px-3 py-2 text-muted-foreground capitalize">{team.paymentStatus}</td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {team.attendanceMarkedAt
                            ? new Date(team.attendanceMarkedAt).toLocaleTimeString("en-IN")
                            : "Pending"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
    </div>
  )
}
