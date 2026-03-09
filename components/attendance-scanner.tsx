"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { BrowserQRCodeReader, type IScannerControls } from "@zxing/browser"
import { Camera, ExternalLink, Loader2, LogOut, QrCode, RefreshCw, User, Mail, Phone, GraduationCap, Calendar, Users } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

type AttendanceDay = "day1" | "day2"

type TeamMember = {
  id: string
  role: "leader" | "member"
  name: string
  email: string
  phone: string
  department: string
  year: string
  gender: string
}

type TeamDetails = {
  id: string
  teamCode: string
  teamName: string
  paymentStatus: string
  paymentSubmittedAt: string
  attendanceDay1MarkedAt: string | null
  attendanceDay2MarkedAt: string | null
  createdAt: string
  members: TeamMember[]
  submission: {
    githubUrl: string
    videoUrl: string
    presentationUrl: string | null
    remarks: string | null
    submittedAt: string
    updatedAt: string
  } | null
}

type DashboardOverview = {
  teamCode: string
  teamName: string
  memberCount: number
  paymentStatus: string
  attendanceDay1MarkedAt: string | null
  attendanceDay2MarkedAt: string | null
  hasSubmission: boolean
  submissionUpdatedAt: string | null
  githubUrl: string | null
  videoUrl: string | null
  presentationUrl: string | null
  createdAt: string
}

type RecentEntry = {
  teamCode: string
  teamName: string
  day: AttendanceDay
  markedAt: string
  markedBy: string | null
}

type ScannerProps = {
  initialTotalTeams: number
  initialDay1AttendedTeams: number
  initialDay1PendingTeams: number
  initialDay2AttendedTeams: number
  initialDay2PendingTeams: number
  initialRecentEntries: RecentEntry[]
  initialTeamOverview: DashboardOverview[]
  adminUsername: string
}

type MarkAttendanceResult = {
  day: AttendanceDay
  teamCode: string
  teamName: string
  memberCount: number
  alreadyMarked: boolean
  markedAt: string
  markedBy: string | null
}

export function AttendanceScanner({
  initialTotalTeams,
  initialDay1AttendedTeams,
  initialDay1PendingTeams,
  initialDay2AttendedTeams,
  initialDay2PendingTeams,
  initialRecentEntries,
  initialTeamOverview,
  adminUsername,
}: ScannerProps) {
  const [recentEntries, setRecentEntries] = useState<RecentEntry[]>(initialRecentEntries)
  const [teamOverview, setTeamOverview] = useState<DashboardOverview[]>(initialTeamOverview)
  const [day1AttendedTeams, setDay1AttendedTeams] = useState(initialDay1AttendedTeams)
  const [day1PendingTeams, setDay1PendingTeams] = useState(initialDay1PendingTeams)
  const [day2AttendedTeams, setDay2AttendedTeams] = useState(initialDay2AttendedTeams)
  const [day2PendingTeams, setDay2PendingTeams] = useState(initialDay2PendingTeams)
  const [selectedDay, setSelectedDay] = useState<AttendanceDay>("day1")
  const [manualValue, setManualValue] = useState("")
  const [lastResult, setLastResult] = useState<MarkAttendanceResult | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [cameraLoading, setCameraLoading] = useState(true)
  const [isMarking, setIsMarking] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<TeamDetails | null>(null)
  const [isLoadingTeamDetails, setIsLoadingTeamDetails] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const controlsRef = useRef<IScannerControls | null>(null)
  const lastPayloadRef = useRef<{ value: string; day: AttendanceDay; at: number }>({
    value: "",
    day: "day1",
    at: 0,
  })
  const isMarkingRef = useRef(false)

  const applyMarkResult = useCallback((result: MarkAttendanceResult) => {
    setLastResult(result)
    setRecentEntries((current) => {
      const next = [
        {
          teamCode: result.teamCode,
          teamName: result.teamName,
          day: result.day,
          markedAt: result.markedAt,
          markedBy: result.markedBy,
        },
        ...current.filter(
          (entry) =>
            !(entry.teamCode === result.teamCode && entry.day === result.day),
        ),
      ]
      return next.slice(0, 20)
    })

    setTeamOverview((current) =>
      current.map((team) => {
        if (team.teamCode !== result.teamCode) return team
        if (result.day === "day1") {
          return { ...team, attendanceDay1MarkedAt: result.markedAt }
        }
        return { ...team, attendanceDay2MarkedAt: result.markedAt }
      }),
    )

    if (!result.alreadyMarked) {
      if (result.day === "day1") {
        setDay1AttendedTeams((count) => count + 1)
        setDay1PendingTeams((count) => Math.max(0, count - 1))
      } else {
        setDay2AttendedTeams((count) => count + 1)
        setDay2PendingTeams((count) => Math.max(0, count - 1))
      }
    }
  }, [])

  const markAttendance = useCallback(
    async (payload: string) => {
      const value = payload.trim()
      if (!value) return

      const now = Date.now()
      if (
        lastPayloadRef.current.value === value &&
        lastPayloadRef.current.day === selectedDay &&
        now - lastPayloadRef.current.at < 2500
      ) {
        return
      }

      if (isMarkingRef.current) return

      lastPayloadRef.current = { value, day: selectedDay, at: now }
      setIsMarking(true)
      isMarkingRef.current = true

      try {
        const response = await fetch("/api/admin/attendance/mark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload: value, day: selectedDay }),
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
    [applyMarkResult, selectedDay],
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

  const fetchTeamDetails = async (teamCode: string) => {
    setIsLoadingTeamDetails(true)
    try {
      const response = await fetch(`/api/admin/teams/${teamCode}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data?.error || "Failed to fetch team details")
      }
      
      console.log("Team details fetched:", data.team)
      setSelectedTeam(data.team)
      setDialogOpen(true)
    } catch (error) {
      console.error("Error fetching team details:", error)
      toast.error(error instanceof Error ? error.message : "Failed to fetch team details")
    } finally {
      setIsLoadingTeamDetails(false)
    }
  }

  const handleTeamClick = (teamCode: string) => {
    void fetchTeamDetails(teamCode)
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

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard label="Registered Teams" value={initialTotalTeams} />
          <MetricCard label="Day 1 Marked" value={day1AttendedTeams} />
          <MetricCard label="Day 1 Pending" value={day1PendingTeams} />
          <MetricCard label="Day 2 Marked" value={day2AttendedTeams} />
          <MetricCard label="Day 2 Pending" value={day2PendingTeams} />
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

            <div className="mt-4">
              <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                Attendance Slot
              </p>
              <Select value={selectedDay} onValueChange={(value) => setSelectedDay(value as AttendanceDay)}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="day1">Day 1</SelectItem>
                  <SelectItem value="day2">Day 2</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-2 text-xs text-muted-foreground">
                Selected day applies to both camera scan and manual entry.
              </p>
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
                  {isMarking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <QrCode className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {lastResult && (
              <div className="mt-5 rounded-lg border border-border bg-secondary/40 p-3 text-sm">
                <p className="font-semibold text-foreground">
                  {lastResult.teamCode} - {lastResult.teamName}
                </p>
                <p className="mt-1 text-muted-foreground">
                  {dayLabel(lastResult.day)}:{" "}
                  {lastResult.alreadyMarked ? "already marked at" : "marked at"}{" "}
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
                      <th className="px-3 py-2">Day</th>
                      <th className="px-3 py-2">Marked At</th>
                      <th className="px-3 py-2">By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEntries.length === 0 ? (
                      <tr>
                        <td className="px-3 py-4 text-muted-foreground" colSpan={4}>
                          No attendance marked yet.
                        </td>
                      </tr>
                    ) : (
                      recentEntries.map((entry) => (
                        <tr
                          key={`${entry.teamCode}-${entry.day}-${entry.markedAt}`}
                          className="border-t border-border"
                        >
                          <td className="px-3 py-2">
                            <p className="font-semibold text-foreground">{entry.teamCode}</p>
                            <p className="text-xs text-muted-foreground">{entry.teamName}</p>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{dayLabel(entry.day)}</td>
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
                      <th className="px-3 py-2">Day 1</th>
                      <th className="px-3 py-2">Day 2</th>
                      <th className="px-3 py-2">Submission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamOverview.map((team) => (
                      <tr
                        key={team.teamCode}
                        className="border-t border-border cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => handleTeamClick(team.teamCode)}
                      >
                        <td className="px-3 py-2">
                          <p className="font-semibold text-foreground">{team.teamCode}</p>
                          <p className="text-xs text-muted-foreground">{team.teamName}</p>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{team.memberCount}</td>
                        <td className="px-3 py-2 text-muted-foreground capitalize">{team.paymentStatus}</td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {formatAttendanceTime(team.attendanceDay1MarkedAt)}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {formatAttendanceTime(team.attendanceDay2MarkedAt)}
                        </td>
                        <td className="px-3 py-2">
                          {team.hasSubmission ? (
                            <div className="flex flex-wrap gap-2">
                              <a
                                href={team.githubUrl || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center rounded-md border border-border px-2 py-1 text-xs text-primary hover:border-primary/40"
                              >
                                GitHub
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                              <a
                                href={team.videoUrl || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center rounded-md border border-border px-2 py-1 text-xs text-primary hover:border-primary/40"
                              >
                                Video
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                              {team.presentationUrl ? (
                                <a
                                  href={team.presentationUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center rounded-md border border-border px-2 py-1 text-xs text-primary hover:border-primary/40"
                                >
                                  PPT
                                  <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                              ) : null}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Not submitted</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Team Details</DialogTitle>
              <DialogDescription>
                View complete information about the team and its members
              </DialogDescription>
            </DialogHeader>

            {isLoadingTeamDetails ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : selectedTeam ? (
              <div className="space-y-6">
                {/* Team Info */}
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Team Information</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Team Code</p>
                      <p className="text-sm font-semibold text-foreground mt-1">{selectedTeam.teamCode}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Team Name</p>
                      <p className="text-sm font-semibold text-foreground mt-1">{selectedTeam.teamName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Payment Status</p>
                      <Badge variant={selectedTeam.paymentStatus === "approved" ? "default" : "secondary"} className="mt-1">
                        {selectedTeam.paymentStatus}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Registered On</p>
                      <p className="text-sm text-foreground mt-1">
                        {new Date(selectedTeam.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Day 1 Attendance</p>
                      <p className="text-sm text-foreground mt-1">
                        {formatAttendanceTime(selectedTeam.attendanceDay1MarkedAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Day 2 Attendance</p>
                      <p className="text-sm text-foreground mt-1">
                        {formatAttendanceTime(selectedTeam.attendanceDay2MarkedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Team Members ({selectedTeam.members.length})
                  </h3>
                  <div className="space-y-4">
                    {selectedTeam.members.map((member, index) => (
                      <div
                        key={member.id}
                        className="rounded-lg border border-border bg-secondary/20 p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {member.name}
                            </h4>
                            <Badge variant={member.role === "leader" ? "default" : "outline"} className="mt-1">
                              {member.role === "leader" ? "Team Leader" : "Member"}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span className="break-all">{member.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{member.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <GraduationCap className="h-4 w-4" />
                            <span>{member.department}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{member.year} Year • {member.gender}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submission Details */}
                {selectedTeam.submission && (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Submission Details</h3>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={selectedTeam.submission.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-md border border-border px-3 py-2 text-sm text-primary hover:bg-accent transition-colors"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          GitHub Repository
                        </a>
                        <a
                          href={selectedTeam.submission.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-md border border-border px-3 py-2 text-sm text-primary hover:bg-accent transition-colors"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Video Demo
                        </a>
                        {selectedTeam.submission.presentationUrl && (
                          <a
                            href={selectedTeam.submission.presentationUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-md border border-border px-3 py-2 text-sm text-primary hover:bg-accent transition-colors"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Presentation
                          </a>
                        )}
                      </div>
                      {selectedTeam.submission.remarks && (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Remarks</p>
                          <p className="text-sm text-foreground mt-1">{selectedTeam.submission.remarks}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Submitted on {new Date(selectedTeam.submission.submittedAt).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
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

function formatAttendanceTime(value: string | null): string {
  if (!value) return "Pending"
  return new Date(value).toLocaleString("en-IN")
}

function dayLabel(day: AttendanceDay): string {
  return day === "day1" ? "Day 1" : "Day 2"
}
