import { z } from "zod"

export const departmentOptions = [
  "Computer Science Engineering",
  "Information Technology",
  "Artificial Intelligence and Data Science",
  "Mechatronics",
  "Electronics and Telecommunication Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Industrial and Production Engineering",
] as const

export const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"] as const
export const genderOptions = ["Male", "Female"] as const

const phoneRegex = /^[6-9]\d{9}$/
const teamCodeRegex = /^CK26-[A-Z0-9]{6}$/

const requiredText = (maxLength: number) =>
  z
    .string()
    .trim()
    .min(1, "This field is required.")
    .max(maxLength, `Must be shorter than ${maxLength} characters.`)

export const memberSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(80),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Enter a valid 10-digit phone number."),
  department: requiredText(120),
  year: requiredText(40),
  gender: z
    .string()
    .trim()
    .refine(
      (value) => genderOptions.includes(value as (typeof genderOptions)[number]),
      "Please select a valid gender.",
    ),
})

const teamCoreSchema = z.object({
  teamName: z
    .string()
    .trim()
    .min(3, "Team name must be at least 3 characters.")
    .max(80, "Team name must be at most 80 characters."),
  leader: memberSchema,
  members: z
    .array(memberSchema)
    .min(2, "At least 2 members are required (3 including leader).")
    .max(4, "Maximum 4 members are allowed here (5 including leader)."),
})

export const paymentSchema = z.object({
  transactionId: z
    .string()
    .trim()
    .min(4, "Transaction ID is required.")
    .max(120, "Transaction ID is too long."),
  payerName: z
    .string()
    .trim()
    .min(2, "Payer name is required.")
    .max(120, "Payer name is too long."),
  upiId: z
    .string()
    .trim()
    .max(120, "UPI ID is too long.")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .trim()
    .max(300, "Notes must be shorter than 300 characters.")
    .optional()
    .or(z.literal("")),
  paymentScreenshotDataUrl: z
    .string()
    .trim()
    .min(1, "Payment screenshot is required.")
    .max(7_000_000, "Payment screenshot is too large.")
    .refine(
      (value) => /^data:image\/[a-zA-Z0-9.+-]+;base64,[a-zA-Z0-9+/=]+$/.test(value),
      "Upload a valid image screenshot.",
    ),
})

export const teamDetailsSchema = teamCoreSchema.superRefine((data, ctx) => {
  validateUniqueParticipants(data, ctx)
})

export const registrationSchema = teamCoreSchema.extend({
  payment: paymentSchema,
}).superRefine((data, ctx) => {
  validateUniqueParticipants(data, ctx)
})

const optionalUrl = z
  .union([z.literal(""), z.string().trim().url("Please provide a valid URL.")])
  .transform((value) => (value === "" ? undefined : value))

export const submissionSchema = z.object({
  teamCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(teamCodeRegex, "Team code must look like CK26-XXXXXX."),
  leaderEmail: z.string().trim().email("Enter the team leader email."),
  githubUrl: z.string().trim().url("Enter a valid GitHub repository URL."),
  videoUrl: z.string().trim().url("Enter a valid demo video URL."),
  presentationUrl: optionalUrl,
  remarks: z
    .union([z.literal(""), z.string().trim().max(1000, "Remarks are too long.")])
    .transform((value) => (value === "" ? undefined : value)),
})

export const adminLoginSchema = z.object({
  username: z.string().trim().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
})

export const attendanceMarkSchema = z.object({
  payload: z
    .string()
    .trim()
    .min(1, "QR value is required.")
    .max(2048, "Invalid QR value."),
  day: z.enum(["day1", "day2"], {
    errorMap: () => ({ message: "Select attendance day." }),
  }),
})

export type MemberInput = z.infer<typeof memberSchema>
export type TeamDetailsInput = z.infer<typeof teamDetailsSchema>
export type PaymentInput = z.infer<typeof paymentSchema>
export type RegistrationInput = z.infer<typeof registrationSchema>
export type SubmissionInput = z.infer<typeof submissionSchema>
export type AdminLoginInput = z.infer<typeof adminLoginSchema>
export type AttendanceDay = z.infer<typeof attendanceMarkSchema>["day"]

function validateUniqueParticipants(
  data: {
    leader: { email: string; phone: string; gender: string }
    members: Array<{ email: string; phone: string; gender: string }>
  },
  ctx: z.RefinementCtx,
) {
  const allMembers = [data.leader, ...data.members]
  const emailSet = new Set<string>()
  const phoneSet = new Set<string>()
  for (const [index, participant] of allMembers.entries()) {
    const emailKey = participant.email.toLowerCase()
    if (emailSet.has(emailKey)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each participant email must be unique.",
        path: index === 0 ? ["leader", "email"] : ["members", index - 1, "email"],
      })
    }
    emailSet.add(emailKey)

    if (phoneSet.has(participant.phone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each participant phone number must be unique.",
        path: index === 0 ? ["leader", "phone"] : ["members", index - 1, "phone"],
      })
    }
    phoneSet.add(participant.phone)
  }
}
