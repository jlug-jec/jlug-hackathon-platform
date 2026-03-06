"use client"

import { useState, type ChangeEvent } from "react"
import Link from "next/link"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Loader2,
  Mail,
  Phone,
  Plus,
  Trash2,
  User,
  Users,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { departmentOptions, paymentSchema, teamDetailsSchema, yearOptions } from "@/lib/validation"
import type { PaymentInput, TeamDetailsInput } from "@/lib/validation"

type FormStep = "details" | "payment" | "success"

type RegistrationResponse = {
  teamCode: string
  teamName: string
  idCardPath: string
}

const registrationFee = Number(process.env.NEXT_PUBLIC_REGISTRATION_FEE || 250)
const upiQrImage = process.env.NEXT_PUBLIC_UPI_QR_IMAGE || "/image.png"
const organizerUpiId = process.env.NEXT_PUBLIC_UPI_ID || "your-upi-id@bank"
const maxScreenshotBytes = 5 * 1024 * 1024

const emptyMember = {
  name: "",
  phone: "",
  email: "",
  department: "",
  year: "",
}

export function RegistrationForm() {
  const [step, setStep] = useState<FormStep>("details")
  const [teamDraft, setTeamDraft] = useState<TeamDetailsInput | null>(null)
  const [registration, setRegistration] = useState<RegistrationResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [payment, setPayment] = useState<PaymentInput>({
    transactionId: "",
    payerName: "",
    upiId: "",
    notes: "",
    paymentScreenshotDataUrl: "",
  })
  const [paymentScreenshotName, setPaymentScreenshotName] = useState("")
  const [paymentErrors, setPaymentErrors] = useState<Partial<Record<keyof PaymentInput, string>>>(
    {},
  )

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamDetailsInput>({
    resolver: zodResolver(teamDetailsSchema),
    defaultValues: {
      teamName: "",
      leader: { ...emptyMember },
      members: [{ ...emptyMember }, { ...emptyMember }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  })

  const onDetailsSubmit = (values: TeamDetailsInput) => {
    setTeamDraft(values)
    setStep("payment")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const onDetailsError = () => {
    toast.error("Please fix the highlighted fields.")
  }

  const addMember = () => {
    if (fields.length >= 5) {
      toast.error("Maximum team size reached (6 including leader).")
      return
    }
    append({ ...emptyMember })
  }

  const removeMember = (index: number) => {
    if (fields.length <= 2) {
      toast.error("At least 2 members are required (3 including leader).")
      return
    }
    remove(index)
  }

  const submitRegistration = async () => {
    if (!teamDraft) {
      setStep("details")
      return
    }

    const parsedPayment = paymentSchema.safeParse(payment)
    if (!parsedPayment.success) {
      const nextErrors: Partial<Record<keyof PaymentInput, string>> = {}
      for (const issue of parsedPayment.error.issues) {
        const key = issue.path[0] as keyof PaymentInput
        if (!nextErrors[key]) nextErrors[key] = issue.message
      }
      setPaymentErrors(nextErrors)
      toast.error("Please fix payment details.")
      return
    }

    setPaymentErrors({})
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...teamDraft,
          payment: parsedPayment.data,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || "Registration failed.")
      }

      setRegistration({
        teamCode: data.teamCode,
        teamName: data.teamName,
        idCardPath: data.idCardPath,
      })
      setStep("success")
      toast.success("Registration completed.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleScreenshotChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setPayment((current) => ({ ...current, paymentScreenshotDataUrl: "" }))
      setPaymentScreenshotName("")
      return
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Upload an image file for payment screenshot.")
      event.target.value = ""
      setPayment((current) => ({ ...current, paymentScreenshotDataUrl: "" }))
      setPaymentScreenshotName("")
      return
    }

    if (file.size > maxScreenshotBytes) {
      toast.error("Payment screenshot must be under 5MB.")
      event.target.value = ""
      setPayment((current) => ({ ...current, paymentScreenshotDataUrl: "" }))
      setPaymentScreenshotName("")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      setPayment((current) => ({ ...current, paymentScreenshotDataUrl: result }))
      setPaymentScreenshotName(file.name)
      setPaymentErrors((current) => ({ ...current, paymentScreenshotDataUrl: undefined }))
    }
    reader.onerror = () => {
      toast.error("Could not read screenshot file. Please try a different image.")
      setPayment((current) => ({ ...current, paymentScreenshotDataUrl: "" }))
      setPaymentScreenshotName("")
    }
    reader.readAsDataURL(file)
  }

  if (step === "success" && registration) {
    return (
      <section className="relative z-10 py-24 px-4 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-primary/30 bg-card p-8 text-center md:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Team Registered Successfully</h1>
          <p className="mt-4 text-muted-foreground">
            Your team code is generated. Keep it safe for project submission and attendance.
          </p>
          <div className="mt-6 rounded-lg border border-border bg-secondary p-4">
            <p className="text-sm text-muted-foreground">Team Code</p>
            <p className="mt-1 font-mono text-xl text-foreground">{registration.teamCode}</p>
            <p className="mt-1 text-xs text-muted-foreground">{registration.teamName}</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={registration.idCardPath}
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Open Team ID Card
            </Link>
            <Link
              href="/submit"
              className="inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              Go to Submission
            </Link>
          </div>
        </div>
      </section>
    )
  }

  if (step === "payment" && teamDraft) {
    return (
      <section className="relative z-10 py-24 px-4 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 md:p-8">
          <h1 className="text-2xl font-bold text-foreground">UPI Payment Details</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Pay <span className="font-semibold text-foreground">Rs. {registrationFee}</span> per
            team, then fill transaction details below.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-secondary/40 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Pay To UPI</p>
              <p className="mt-1 font-mono text-sm text-foreground">{organizerUpiId}</p>
              <img
                src={upiQrImage}
                alt="UPI QR Code"
                className="mt-4 aspect-square w-full rounded-lg border border-border object-cover"
              />
              <p className="mt-3 text-xs text-muted-foreground">
                Scan this QR and pay exact amount before submitting this form.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="mb-2 block text-sm text-foreground">UPI Transaction ID</Label>
                <Input
                  value={payment.transactionId}
                  onChange={(event) =>
                    setPayment((current) => ({ ...current, transactionId: event.target.value }))
                  }
                  placeholder="e.g. 408835591234"
                  className="bg-input border-border text-foreground"
                />
                {paymentErrors.transactionId && (
                  <FieldError message={paymentErrors.transactionId} />
                )}
              </div>

              <div>
                <Label className="mb-2 block text-sm text-foreground">Payer Name</Label>
                <Input
                  value={payment.payerName}
                  onChange={(event) =>
                    setPayment((current) => ({ ...current, payerName: event.target.value }))
                  }
                  placeholder="Name used in UPI payment"
                  className="bg-input border-border text-foreground"
                />
                {paymentErrors.payerName && <FieldError message={paymentErrors.payerName} />}
              </div>

              <div>
                <Label className="mb-2 block text-sm text-foreground">Payer UPI ID (Optional)</Label>
                <Input
                  value={payment.upiId || ""}
                  onChange={(event) =>
                    setPayment((current) => ({ ...current, upiId: event.target.value }))
                  }
                  placeholder="name@bank"
                  className="bg-input border-border text-foreground"
                />
                {paymentErrors.upiId && <FieldError message={paymentErrors.upiId} />}
              </div>

              <div>
                <Label className="mb-2 block text-sm text-foreground">Notes (Optional)</Label>
                <Textarea
                  value={payment.notes || ""}
                  onChange={(event) =>
                    setPayment((current) => ({ ...current, notes: event.target.value }))
                  }
                  rows={4}
                  placeholder="Any additional payment reference"
                  className="bg-input border-border text-foreground"
                />
                {paymentErrors.notes && <FieldError message={paymentErrors.notes} />}
              </div>

              <div>
                <Label className="mb-2 block text-sm text-foreground">
                  Payment Screenshot <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleScreenshotChange}
                  className="bg-input border-border text-foreground"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Mandatory. Upload transaction screenshot (max 5MB).
                </p>
                {paymentScreenshotName ? (
                  <p className="mt-1 text-xs text-primary">Selected: {paymentScreenshotName}</p>
                ) : null}
                {paymentErrors.paymentScreenshotDataUrl && (
                  <FieldError message={paymentErrors.paymentScreenshotDataUrl} />
                )}
                {payment.paymentScreenshotDataUrl ? (
                  <img
                    src={payment.paymentScreenshotDataUrl}
                    alt="Payment screenshot preview"
                    className="mt-3 max-h-48 rounded-md border border-border object-contain"
                  />
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={submitRegistration}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => setStep("details")}>
              Back to Team Details
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative z-10 py-24 px-4 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Step 1 of 2
          </span>
          <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">Team Registration</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Add leader and member details first, then proceed to payment confirmation.
          </p>
        </div>

        <form onSubmit={handleSubmit(onDetailsSubmit, onDetailsError)} className="mt-10 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Users className="h-5 w-5 text-primary" />
              Team Information
            </h2>
            <div className="mt-4">
              <Label htmlFor="teamName" className="mb-2 block text-sm text-foreground">
                Team Name
              </Label>
              <Input
                id="teamName"
                placeholder="Enter your team name"
                {...register("teamName")}
                className="bg-input border-border text-foreground"
              />
              {errors.teamName && <FieldError message={errors.teamName.message} />}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <User className="h-5 w-5 text-primary" />
              Team Leader
            </h2>
            <ParticipantFields prefix="leader" register={register} control={control} errors={errors} />
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Users className="h-5 w-5 text-primary" />
                Team Members ({fields.length + 1}/6)
              </h2>
              <Button type="button" variant="outline" onClick={addMember}>
                <Plus className="mr-1 h-4 w-4" />
                Add Member
              </Button>
            </div>

            <div className="mt-6 space-y-5">
              {fields.map((field, index) => (
                <div key={field.id} className="rounded-xl border border-border bg-secondary/40 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">Member {index + 2}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeMember(index)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <ParticipantFields
                    prefix={`members.${index}`}
                    register={register}
                    control={control}
                    errors={errors}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button
              type="submit"
              size="lg"
              className="w-full max-w-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Proceed to Payment
            </Button>
            <p className="text-xs text-muted-foreground">
              Fee: Rs. {registrationFee} per team. Team size: 3 to 6 participants.
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}

type ParticipantFieldsProps = {
  prefix: "leader" | `members.${number}`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any
}

function ParticipantFields({ prefix, register, control, errors }: ParticipantFieldsProps) {
  const currentErrors = getNestedErrors(errors, prefix)

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <div>
        <Label className="mb-2 block text-sm text-foreground">
          <User className="mr-1 inline h-3.5 w-3.5" />
          Full Name
        </Label>
        <Input
          placeholder="Full name"
          {...register(`${prefix}.name`)}
          className="bg-input border-border text-foreground"
        />
        {currentErrors.name && <FieldError message={currentErrors.name?.message} />}
      </div>

      <div>
        <Label className="mb-2 block text-sm text-foreground">
          <Phone className="mr-1 inline h-3.5 w-3.5" />
          Phone
        </Label>
        <Input
          placeholder="10-digit phone number"
          {...register(`${prefix}.phone`)}
          className="bg-input border-border text-foreground"
        />
        {currentErrors.phone && <FieldError message={currentErrors.phone?.message} />}
      </div>

      <div>
        <Label className="mb-2 block text-sm text-foreground">
          <Mail className="mr-1 inline h-3.5 w-3.5" />
          Email
        </Label>
        <Input
          type="email"
          placeholder="Email address"
          {...register(`${prefix}.email`)}
          className="bg-input border-border text-foreground"
        />
        {currentErrors.email && <FieldError message={currentErrors.email?.message} />}
      </div>

      <div>
        <Label className="mb-2 block text-sm text-foreground">Department</Label>
        <Controller
          name={`${prefix}.department`}
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {departmentOptions.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {currentErrors.department && <FieldError message={currentErrors.department?.message} />}
      </div>

      <div className="sm:col-span-2">
        <Label className="mb-2 block text-sm text-foreground">Year</Label>
        <Controller
          name={`${prefix}.year`}
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {currentErrors.year && <FieldError message={currentErrors.year?.message} />}
      </div>
    </div>
  )
}

function getNestedErrors(
  errors: Record<string, unknown>,
  prefix: string,
): Record<string, { message?: string }> {
  const result = prefix
    .split(".")
    .reduce<unknown>((acc, key) => (acc as Record<string, unknown> | undefined)?.[key], errors)

  return (result as Record<string, { message?: string }>) || {}
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null

  return (
    <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
      <AlertCircle className="h-3.5 w-3.5" />
      {message}
    </p>
  )
}
