"use client"

import Link from "next/link"
import { useRef, useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { toPng } from "html-to-image"
import { toast } from "sonner"

import type { TeamCardData } from "@/lib/db"

type TeamIdCardProps = {
  team: TeamCardData
  qrDataUrl: string
  qrPayload: string
}

export function TeamIdCard({ team, qrDataUrl, qrPayload }: TeamIdCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadCardPng = async () => {
    if (!cardRef.current || isDownloading) return

    setIsDownloading(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#040912",
      })

      const anchor = document.createElement("a")
      anchor.href = dataUrl
      anchor.download = `${team.teamCode}-team-card.png`
      anchor.click()
      toast.success("Team card PNG downloaded.")
    } catch {
      toast.error("Could not generate PNG. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <>
      <div ref={cardRef} className="rounded-2xl border border-primary/30 bg-card p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary">CodeKumbh Team ID</p>
            <h1 className="mt-2 text-2xl font-bold text-foreground">{team.teamName}</h1>
            <p className="mt-1 font-mono text-sm text-muted-foreground">{team.teamCode}</p>
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <p>
                Day 1 attendance:{" "}
                {team.attendanceDay1MarkedAt
                  ? new Date(team.attendanceDay1MarkedAt).toLocaleString("en-IN")
                  : "Pending"}
              </p>
              <p>
                Day 2 attendance:{" "}
                {team.attendanceDay2MarkedAt
                  ? new Date(team.attendanceDay2MarkedAt).toLocaleString("en-IN")
                  : "Pending"}
              </p>
            </div>
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
                    {member.department} - {member.year} - {member.gender}
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
            <p className="mt-2 max-w-full break-all rounded-md border border-border bg-secondary/50 p-2 text-left text-[11px] leading-relaxed font-mono text-muted-foreground whitespace-normal">
              {qrPayload}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {/* <Link
          href="/submit"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Submit Project
        </Link> */}
        <button
          type="button"
          onClick={downloadCardPng}
          className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </>
          )}
        </button>
      </div>
    </>
  )
}
