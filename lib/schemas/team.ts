import { z } from "zod";

export const TeamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number (should start with 6-9 and be 10 digits)"),
  enrollment: z.string().min(12, "Invalid enrollment number (should be 12 digits)").max(12, "Invalid enrollment number (should be 12 digits)")
});

export const TeamFormSchema = z.object({
  teamName: z.string().min(1, "Team name is required"),
  teamLeader: TeamMemberSchema,
  teamMembers: z.array(TeamMemberSchema)
    .min(3, "Minimum 3 team members required")
    .max(4, "Maximum 4 team members allowed")
});

export type TeamFormData = z.infer<typeof TeamFormSchema>;