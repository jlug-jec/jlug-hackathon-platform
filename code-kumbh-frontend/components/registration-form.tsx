"use client"

import { useState, useEffect, useRef } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  Plus,
  Trash2,
  User,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  Users,
  CreditCard,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react"
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

const departments = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Electrical",
  "Mechanical",
  "Civil",
  "Chemical",
  "Biotechnology",
  "Other",
]

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"]

const genders = ["Male", "Female", "Other"]

const memberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  email: z.string().email("Enter a valid email address"),
  department: z.string().min(1, "Select a department"),
  year: z.string().min(1, "Select a year"),
  gender: z.string().min(1, "Select gender"),
})

const formSchema = z
  .object({
    teamName: z
      .string()
      .min(3, "Team name must be at least 3 characters")
      .max(30, "Team name must be under 30 characters"),
    leader: memberSchema,
    members: z
      .array(memberSchema)
      .min(2, "You need at least 2 additional members (3 total including leader)")
      .max(5, "Maximum 5 additional members (6 total including leader)"),
  })
  .refine(
    (data) => {
      const allGenders = [data.leader.gender, ...data.members.map((m) => m.gender)]
      return allGenders.includes("Female")
    },
    {
      message: "At least one female candidate is required in the team",
      path: ["members"],
    }
  )

type FormValues = z.infer<typeof formSchema>

type FormStep = "details" | "payment" | "success"

export function RegistrationForm() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [step, setStep] = useState<FormStep>("details")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.05 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      leader: {
        name: "",
        phone: "",
        email: "",
        department: "",
        year: "",
        gender: "",
      },
      members: [
        { name: "", phone: "", email: "", department: "", year: "", gender: "" },
        { name: "", phone: "", email: "", department: "", year: "", gender: "" },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  })

  const watchedMembers = watch("members")

  const addMember = () => {
    if (fields.length < 5) {
      append({ name: "", phone: "", email: "", department: "", year: "", gender: "" })
      toast.success("Member added", { description: `Member ${fields.length + 2} added to the team.` })
    } else {
      toast.error("Maximum reached", { description: "A team can have at most 6 members (including the leader)." })
    }
  }

  const removeMember = (index: number) => {
    if (fields.length > 2) {
      remove(index)
      toast.info("Member removed")
    } else {
      toast.error("Minimum required", { description: "A team must have at least 3 members (including the leader)." })
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2500))
    setIsProcessing(false)
    setStep("success")
    toast.success("Payment successful!", {
      description: "Your team has been registered for CodeKumbh 2.0",
    })
  }

  const onSubmit = async (data: FormValues) => {
    const allGenders = [data.leader.gender, ...data.members.map((m) => m.gender)]
    if (!allGenders.includes("Female")) {
      toast.error("Gender requirement not met", {
        description: "At least one female candidate is required in each team.",
      })
      return
    }
    toast.success("Details verified!", {
      description: "Proceeding to payment...",
    })
    setStep("payment")
  }

  const onError = () => {
    toast.error("Please fix the errors", {
      description: "Some fields are missing or invalid. Please review the form.",
    })
  }

  if (step === "success") {
    return (
      <section id="register" ref={sectionRef} className="relative z-10 py-24 px-4 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-primary/30 bg-card p-8 text-center md:p-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Registration Complete!</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Your team has been successfully registered for CodeKumbh 2.0
              A confirmation email will be sent to the team leader shortly.
            </p>
            <div className="mt-6 rounded-lg border border-border bg-secondary p-4">
              <p className="text-sm text-muted-foreground">Transaction ID</p>
              <p className="mt-1 font-mono text-sm text-foreground">
                HF26-{Math.random().toString(36).substring(2, 10).toUpperCase()}
              </p>
            </div>
            <Button
              className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setStep("details")
                window.location.reload()
              }}
            >
              Register Another Team
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (step === "payment") {
    return (
      <section id="register" ref={sectionRef} className="relative z-10 py-24 px-4 lg:px-8">
        <div className="mx-auto max-w-lg">
          <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <CreditCard className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Complete Payment</h2>
              <p className="mt-2 text-muted-foreground">Registration fee for CodeKumbh 2.0</p>
            </div>

            <div className="mt-8 rounded-lg border border-border bg-secondary p-5">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Registration Fee</span>
                <span className="text-xl font-bold text-foreground">Rs. 250</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="text-muted-foreground text-sm">Team</span>
                <span className="text-sm text-foreground">{watch("teamName")}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Members</span>
                <span className="text-sm text-foreground">{watchedMembers.length + 1}</span>
              </div>
            </div>

            {/* Simulated card form */}
            <div className="mt-6 flex flex-col gap-4">
              <div>
                <Label className="text-foreground mb-2 block text-sm">Card Number</Label>
                <Input
                  placeholder="4242 4242 4242 4242"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground mb-2 block text-sm">Expiry</Label>
                  <Input
                    placeholder="MM/YY"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground font-mono"
                  />
                </div>
                <div>
                  <Label className="text-foreground mb-2 block text-sm">CVC</Label>
                  <Input
                    placeholder="123"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground font-mono"
                  />
                </div>
              </div>
            </div>

            <Button
              className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 text-base"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Pay Rs. 250"
              )}
            </Button>

            <button
              className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setStep("details")}
            >
              Go back to edit details
            </button>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              This is a demo payment form. Connect Stripe for real payments.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="register" ref={sectionRef} className="relative z-10 py-24 px-4 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div
          className={`text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Join Now
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Register Your Team
          </h2>
          <p className="mt-4 text-muted-foreground">
            Registration fee: <span className="font-semibold text-primary">Rs. 250</span> per
            team | Teams of 3-6 members | At least 1 female member required
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className={`mt-12 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Team Name */}
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Users className="h-5 w-5 text-primary" />
              Team Information
            </h3>
            <div className="mt-4">
              <Label htmlFor="teamName" className="text-foreground text-sm mb-2 block">
                Team Name
              </Label>
              <Input
                id="teamName"
                placeholder="Enter your team name"
                {...register("teamName")}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
              {errors.teamName && (
                <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                  <AlertCircle className="h-3 w-3" /> {errors.teamName.message}
                </p>
              )}
            </div>
          </div>

          {/* Team Leader */}
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-8">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <User className="h-5 w-5 text-primary" />
              Team Leader Details
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-foreground text-sm mb-2 block">
                  <User className="mr-1 inline h-3 w-3" /> Full Name
                </Label>
                <Input
                  placeholder="Enter your full name"
                  {...register("leader.name")}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
                {errors.leader?.name && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-3 w-3" /> {errors.leader.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-foreground text-sm mb-2 block">
                  <Phone className="mr-1 inline h-3 w-3" /> Phone Number
                </Label>
                <Input
                  placeholder="Enter your phone number"
                  {...register("leader.phone")}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
                {errors.leader?.phone && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-3 w-3" /> {errors.leader.phone.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-foreground text-sm mb-2 block">
                  <Mail className="mr-1 inline h-3 w-3" /> Email Address
                </Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...register("leader.email")}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
                {errors.leader?.email && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-3 w-3" /> {errors.leader.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-foreground text-sm mb-2 block">Gender</Label>
                <Select
                  onValueChange={(val) => setValue("leader.gender", val, { shouldValidate: true })}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {genders.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.leader?.gender && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-3 w-3" /> {errors.leader.gender.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-foreground text-sm mb-2 block">
                  <GraduationCap className="mr-1 inline h-3 w-3" /> Department
                </Label>
                <Select
                  onValueChange={(val) => setValue("leader.department", val, { shouldValidate: true })}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.leader?.department && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-3 w-3" /> {errors.leader.department.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-foreground text-sm mb-2 block">
                  <Calendar className="mr-1 inline h-3 w-3" /> Year
                </Label>
                <Select
                  onValueChange={(val) => setValue("leader.year", val, { shouldValidate: true })}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.leader?.year && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-3 w-3" /> {errors.leader.year.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Users className="h-5 w-5 text-primary" />
                Team Members ({fields.length + 1}/6)
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMember}
                disabled={fields.length >= 5}
                className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
              >
                <Plus className="mr-1 h-4 w-4" /> Add Member
              </Button>
            </div>

            {/* Female requirement warning */}
            {errors.members?.root && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {errors.members.root.message}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-xl border border-border bg-secondary/50 p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-primary">
                      Member {index + 2}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMember(index)}
                      disabled={fields.length <= 2}
                      className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove member {index + 2}</span>
                    </Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="text-foreground text-sm mb-2 block">Full Name</Label>
                      <Input
                        placeholder="Enter member's full name"
                        {...register(`members.${index}.name`)}
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                      />
                      {errors.members?.[index]?.name && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                          <AlertCircle className="h-3 w-3" />{" "}
                          {errors.members[index].name?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-foreground text-sm mb-2 block">Phone Number</Label>
                      <Input
                        placeholder="ENter member's phone number"
                        {...register(`members.${index}.phone`)}
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                      />
                      {errors.members?.[index]?.phone && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                          <AlertCircle className="h-3 w-3" />{" "}
                          {errors.members[index].phone?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-foreground text-sm mb-2 block">Email Address</Label>
                      <Input
                        type="email"
                        placeholder="Enter member's email"
                        {...register(`members.${index}.email`)}
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                      />
                      {errors.members?.[index]?.email && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                          <AlertCircle className="h-3 w-3" />{" "}
                          {errors.members[index].email?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-foreground text-sm mb-2 block">Gender</Label>
                      <Select
                        onValueChange={(val) =>
                          setValue(`members.${index}.gender`, val, { shouldValidate: true })
                        }
                      >
                        <SelectTrigger className="bg-input border-border text-foreground">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {genders.map((g) => (
                            <SelectItem key={g} value={g}>
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.members?.[index]?.gender && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                          <AlertCircle className="h-3 w-3" />{" "}
                          {errors.members[index].gender?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-foreground text-sm mb-2 block">Department</Label>
                      <Select
                        onValueChange={(val) =>
                          setValue(`members.${index}.department`, val, { shouldValidate: true })
                        }
                      >
                        <SelectTrigger className="bg-input border-border text-foreground">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {departments.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.members?.[index]?.department && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                          <AlertCircle className="h-3 w-3" />{" "}
                          {errors.members[index].department?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-foreground text-sm mb-2 block">Year</Label>
                      <Select
                        onValueChange={(val) =>
                          setValue(`members.${index}.year`, val, { shouldValidate: true })
                        }
                      >
                        <SelectTrigger className="bg-input border-border text-foreground">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {years.map((y) => (
                            <SelectItem key={y} value={y}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.members?.[index]?.year && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                          <AlertCircle className="h-3 w-3" />{" "}
                          {errors.members[index].year?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <Button
              type="submit"
              size="lg"
              className="w-full max-w-md bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 text-base"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Proceed to Payment - Rs. 250
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              By registering, you agree to the hackathon rules and code of conduct.
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}
