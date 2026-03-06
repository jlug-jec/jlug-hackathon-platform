"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, Loader2, Send } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submissionSchema, type SubmissionInput } from "@/lib/validation"

type SubmissionFormProps = {
  canSubmit: boolean
  isSubmissionStarted: boolean
  submissionStartText: string
  deadlineText: string
}

type SubmissionResponse = {
  teamCode: string
  teamName: string
  message: string
}

export function SubmissionForm({
  canSubmit,
  isSubmissionStarted,
  submissionStartText,
  deadlineText,
}: SubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<SubmissionResponse | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmissionInput>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      teamCode: "",
      leaderEmail: "",
      githubUrl: "",
      videoUrl: "",
      presentationUrl: "",
      remarks: "",
    },
  })

  const onSubmit = async (values: SubmissionInput) => {
    if (!canSubmit) {
      toast.error(
        isSubmissionStarted
          ? "Submission window is closed."
          : "Submission has not started yet.",
      )
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || "Submission failed.")
      }

      setResult({
        teamCode: data.teamCode,
        teamName: data.teamName,
        message: data.message,
      })
      toast.success(data.message || "Submission successful.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Submission failed.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative z-10 py-24 px-4 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <h1 className="text-3xl font-bold text-foreground">Project Submission</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Use team code and team leader email to submit or update your project links.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Submission starts:{" "}
            <span className="font-semibold text-foreground">{submissionStartText}</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Deadline: <span className="font-semibold text-foreground">{deadlineText}</span>
          </p>

          {!canSubmit && (
            <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {isSubmissionStarted
                ? "Submission window is currently closed."
                : `Submission will open at ${submissionStartText}.`}
            </div>
          )}

          {result && (
            <div className="mt-5 rounded-lg border border-primary/30 bg-primary/10 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{result.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {result.teamCode} - {result.teamName}
                  </p>
                </div>
              </div>
              <Link
                href="/submissions"
                className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
              >
                View public submissions
              </Link>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label className="mb-2 block text-sm text-foreground">Team Code</Label>
              <Input
                placeholder="CK26-XXXXXX"
                {...register("teamCode")}
                className="bg-input border-border text-foreground"
              />
              {errors.teamCode && <p className="mt-1 text-xs text-destructive">{errors.teamCode.message}</p>}
            </div>

            <div>
              <Label className="mb-2 block text-sm text-foreground">Team Leader Email</Label>
              <Input
                type="email"
                placeholder="leader@example.com"
                {...register("leaderEmail")}
                className="bg-input border-border text-foreground"
              />
              {errors.leaderEmail && (
                <p className="mt-1 text-xs text-destructive">{errors.leaderEmail.message}</p>
              )}
            </div>

            <div>
              <Label className="mb-2 block text-sm text-foreground">GitHub Repository URL</Label>
              <Input
                placeholder="https://github.com/..."
                {...register("githubUrl")}
                className="bg-input border-border text-foreground"
              />
              {errors.githubUrl && (
                <p className="mt-1 text-xs text-destructive">{errors.githubUrl.message}</p>
              )}
            </div>

            <div>
              <Label className="mb-2 block text-sm text-foreground">Demo Video URL</Label>
              <Input
                placeholder="https://youtube.com/..."
                {...register("videoUrl")}
                className="bg-input border-border text-foreground"
              />
              {errors.videoUrl && <p className="mt-1 text-xs text-destructive">{errors.videoUrl.message}</p>}
            </div>

            <div>
              <Label className="mb-2 block text-sm text-foreground">
                Presentation URL (Optional)
              </Label>
              <Input
                placeholder="https://docs.google.com/presentation/..."
                {...register("presentationUrl")}
                className="bg-input border-border text-foreground"
              />
              {errors.presentationUrl && (
                <p className="mt-1 text-xs text-destructive">{errors.presentationUrl.message}</p>
              )}
            </div>

            <div>
              <Label className="mb-2 block text-sm text-foreground">Remarks (Optional)</Label>
              <Textarea
                rows={4}
                placeholder="Any note for judges"
                {...register("remarks")}
                className="bg-input border-border text-foreground"
              />
              {errors.remarks && <p className="mt-1 text-xs text-destructive">{errors.remarks.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting || !canSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Project
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
