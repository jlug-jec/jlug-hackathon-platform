import "server-only"

import { randomBytes } from "crypto"
import postgres, { type Sql } from "postgres"

import { parseAttendancePayload } from "@/lib/attendance"
import { AppError } from "@/lib/errors"
import type { AttendanceDay, RegistrationInput, SubmissionInput } from "@/lib/validation"

type DatabaseTeamRow = {
  id: string
  team_code: string
  team_name: string
  attendance_token: string
  payment_status: string
  payment_submitted_at: Date | string
  attendance_marked_at: Date | string | null
  attendance_marked_by: string | null
  attendance_day1_marked_at: Date | string | null
  attendance_day1_marked_by: string | null
  attendance_day2_marked_at: Date | string | null
  attendance_day2_marked_by: string | null
  created_at: Date | string
}

type DatabaseMemberRow = {
  id: string
  role: "leader" | "member"
  full_name: string
  email: string
  phone: string
  department: string
  year: string
  gender: string
}

type DatabaseSubmissionRow = {
  github_url: string
  video_url: string
  presentation_url: string | null
  remarks: string | null
  submitted_at: Date | string
  updated_at: Date | string
}

export type TeamMember = {
  id: string
  role: "leader" | "member"
  name: string
  email: string
  phone: string
  department: string
  year: string
  gender: string
}

export type TeamSubmission = {
  githubUrl: string
  videoUrl: string
  presentationUrl: string | null
  remarks: string | null
  submittedAt: string
  updatedAt: string
}

export type TeamCardData = {
  id: string
  teamCode: string
  teamName: string
  attendanceToken: string
  paymentStatus: string
  paymentSubmittedAt: string
  attendanceMarkedAt: string | null
  attendanceMarkedBy: string | null
  attendanceDay1MarkedAt: string | null
  attendanceDay1MarkedBy: string | null
  attendanceDay2MarkedAt: string | null
  attendanceDay2MarkedBy: string | null
  createdAt: string
  members: TeamMember[]
  submission: TeamSubmission | null
}

export type PublicSubmission = {
  teamCode: string
  teamName: string
  githubUrl: string
  videoUrl: string
  presentationUrl: string | null
  remarks: string | null
  submittedAt: string
  updatedAt: string
}

export type AttendanceDashboardData = {
  totalTeams: number
  day1AttendedTeams: number
  day1PendingTeams: number
  day2AttendedTeams: number
  day2PendingTeams: number
  recentEntries: Array<{
    teamCode: string
    teamName: string
    day: AttendanceDay
    markedAt: string
    markedBy: string | null
  }>
  teamOverview: Array<{
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
  }>
}

export type AttendanceMarkResult = {
  day: AttendanceDay
  teamCode: string
  teamName: string
  memberCount: number
  alreadyMarked: boolean
  markedAt: string
  markedBy: string | null
}

type PostgresErrorLike = {
  code?: string
  constraint?: string
}

let client: Sql | null = null
let initPromise: Promise<void> | null = null

const TEAM_CODE_PREFIX = "CK26"
const TEAM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

function getSqlClient(): Sql {
  const databaseUrl = process.env.DATABASE_URL?.trim()
  if (!databaseUrl) {
    throw new AppError(
      "DATABASE_URL is missing. Add your Neon Postgres connection string in environment variables.",
      500,
    )
  }

  if (!client) {
    client = postgres(databaseUrl, {
      ssl: "require",
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
    })
  }

  return client
}

async function ensureDatabaseReady(): Promise<Sql> {
  if (!initPromise) {
    initPromise = initializeSchema()
  }
  await initPromise
  return getSqlClient()
}

async function initializeSchema(): Promise<void> {
  const sql = getSqlClient()

  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`

  await sql`
    CREATE TABLE IF NOT EXISTS teams (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      team_code VARCHAR(24) NOT NULL UNIQUE,
      team_name VARCHAR(120) NOT NULL UNIQUE,
      attendance_token VARCHAR(128) NOT NULL UNIQUE,
      upi_transaction_id VARCHAR(120) NOT NULL,
      upi_payer_name VARCHAR(120) NOT NULL,
      upi_id VARCHAR(120),
      payment_notes TEXT,
      payment_screenshot_data TEXT NOT NULL,
      payment_screenshot_content_type VARCHAR(80) NOT NULL,
      payment_status VARCHAR(20) NOT NULL DEFAULT 'submitted',
      payment_submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      attendance_marked_at TIMESTAMPTZ,
      attendance_marked_by VARCHAR(120),
      attendance_day1_marked_at TIMESTAMPTZ,
      attendance_day1_marked_by VARCHAR(120),
      attendance_day2_marked_at TIMESTAMPTZ,
      attendance_day2_marked_by VARCHAR(120),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `

  await sql`
    ALTER TABLE teams
    ADD COLUMN IF NOT EXISTS payment_screenshot_data TEXT;
  `

  await sql`
    ALTER TABLE teams
    ADD COLUMN IF NOT EXISTS payment_screenshot_content_type VARCHAR(80);
  `

  await sql`
    ALTER TABLE teams
    ADD COLUMN IF NOT EXISTS attendance_day1_marked_at TIMESTAMPTZ;
  `

  await sql`
    ALTER TABLE teams
    ADD COLUMN IF NOT EXISTS attendance_day1_marked_by VARCHAR(120);
  `

  await sql`
    ALTER TABLE teams
    ADD COLUMN IF NOT EXISTS attendance_day2_marked_at TIMESTAMPTZ;
  `

  await sql`
    ALTER TABLE teams
    ADD COLUMN IF NOT EXISTS attendance_day2_marked_by VARCHAR(120);
  `

  await sql`
    UPDATE teams
    SET
      attendance_day1_marked_at = COALESCE(attendance_day1_marked_at, attendance_marked_at),
      attendance_day1_marked_by = COALESCE(attendance_day1_marked_by, attendance_marked_by)
    WHERE attendance_marked_at IS NOT NULL
  `

  await sql`
    CREATE TABLE IF NOT EXISTS team_members (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      role VARCHAR(16) NOT NULL CHECK (role IN ('leader', 'member')),
      full_name VARCHAR(120) NOT NULL,
      email VARCHAR(120) NOT NULL,
      phone VARCHAR(24) NOT NULL,
      department VARCHAR(120) NOT NULL,
      year VARCHAR(40) NOT NULL,
      gender VARCHAR(16) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(team_id, email),
      UNIQUE(team_id, phone)
    );
  `

  await sql`
    ALTER TABLE team_members
    ADD COLUMN IF NOT EXISTS gender VARCHAR(16);
  `

  await sql`
    UPDATE team_members
    SET gender = 'Male'
    WHERE gender IS NULL;
  `

  await sql`
    ALTER TABLE team_members
    ALTER COLUMN gender SET DEFAULT 'Male';
  `

  await sql`
    ALTER TABLE team_members
    ALTER COLUMN gender SET NOT NULL;
  `

  await sql`
    CREATE TABLE IF NOT EXISTS submissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      team_id UUID NOT NULL UNIQUE REFERENCES teams(id) ON DELETE CASCADE,
      github_url TEXT NOT NULL,
      video_url TEXT NOT NULL,
      presentation_url TEXT,
      remarks TEXT,
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `

  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS team_members_email_unique_idx
    ON team_members (LOWER(email));
  `

  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS team_members_phone_unique_idx
    ON team_members (phone);
  `
}

export async function createTeamRegistration(input: RegistrationInput) {
  const sql = await ensureDatabaseReady()
  const screenshot = parsePaymentScreenshot(input.payment.paymentScreenshotDataUrl)

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const teamCode = generateTeamCode()
    const attendanceToken = randomBytes(18).toString("hex")

    try {
      const created = await sql.begin(async (tx: any) => {
        const [team] = await tx<DatabaseTeamRow[]>`
          INSERT INTO teams (
            team_code,
            team_name,
            attendance_token,
            upi_transaction_id,
            upi_payer_name,
            upi_id,
            payment_notes,
            payment_screenshot_data,
            payment_screenshot_content_type,
            payment_status,
            payment_submitted_at,
            updated_at
          )
          VALUES (
            ${teamCode},
            ${input.teamName.trim()},
            ${attendanceToken},
            ${input.payment.transactionId.trim()},
            ${input.payment.payerName.trim()},
            ${normalizeNullable(input.payment.upiId)},
            ${normalizeNullable(input.payment.notes)},
            ${screenshot.dataUrl},
            ${screenshot.contentType},
            'submitted',
            NOW(),
            NOW()
          )
          RETURNING
            id,
            team_code,
            team_name,
            attendance_token,
            payment_status,
            payment_submitted_at,
            attendance_marked_at,
            attendance_marked_by,
            attendance_day1_marked_at,
            attendance_day1_marked_by,
            attendance_day2_marked_at,
            attendance_day2_marked_by,
            created_at
        `

        const participantRows = [
          {
            team_id: team.id,
            role: "leader",
            full_name: input.leader.name.trim(),
            email: input.leader.email.trim().toLowerCase(),
            phone: input.leader.phone.trim(),
            department: input.leader.department.trim(),
            year: input.leader.year.trim(),
            gender: input.leader.gender.trim(),
          },
          ...input.members.map((member) => ({
            team_id: team.id,
            role: "member",
            full_name: member.name.trim(),
            email: member.email.trim().toLowerCase(),
            phone: member.phone.trim(),
            department: member.department.trim(),
            year: member.year.trim(),
            gender: member.gender.trim(),
          })),
        ]

        await tx`
          INSERT INTO team_members ${tx(
            participantRows,
            "team_id",
            "role",
            "full_name",
            "email",
            "phone",
            "department",
            "year",
            "gender",
          )}
        `

        return team
      })

      return {
        teamCode: created.team_code,
        teamName: created.team_name,
        attendanceToken: created.attendance_token,
        createdAt: toIso(created.created_at),
      }
    } catch (error) {
      const pgError = error as PostgresErrorLike
      if (
        pgError.code === "23505" &&
        (pgError.constraint === "teams_team_code_key" ||
          pgError.constraint === "teams_attendance_token_key")
      ) {
        continue
      }
      throw mapDatabaseError(error)
    }
  }

  throw new AppError("Could not generate a unique team code. Please retry registration.", 500)
}

export async function getTeamCardByCode(teamCode: string): Promise<TeamCardData | null> {
  const sql = await ensureDatabaseReady()
  const normalizedCode = normalizeTeamCode(teamCode)

  const [team] = await sql<DatabaseTeamRow[]>`
    SELECT
      id,
      team_code,
      team_name,
      attendance_token,
      payment_status,
      payment_submitted_at,
      attendance_marked_at,
      attendance_marked_by,
      attendance_day1_marked_at,
      attendance_day1_marked_by,
      attendance_day2_marked_at,
      attendance_day2_marked_by,
      created_at
    FROM teams
    WHERE team_code = ${normalizedCode}
    LIMIT 1
  `

  if (!team) {
    return null
  }

  const members = await sql<DatabaseMemberRow[]>`
    SELECT id, role, full_name, email, phone, department, year, gender
    FROM team_members
    WHERE team_id = ${team.id}
    ORDER BY CASE WHEN role = 'leader' THEN 0 ELSE 1 END, full_name ASC
  `

  const [submission] = await sql<DatabaseSubmissionRow[]>`
    SELECT github_url, video_url, presentation_url, remarks, submitted_at, updated_at
    FROM submissions
    WHERE team_id = ${team.id}
    LIMIT 1
  `

  return {
    id: team.id,
    teamCode: team.team_code,
    teamName: team.team_name,
    attendanceToken: team.attendance_token,
    paymentStatus: team.payment_status,
    paymentSubmittedAt: toIso(team.payment_submitted_at),
    attendanceMarkedAt: toIsoNullable(team.attendance_marked_at),
    attendanceMarkedBy: team.attendance_marked_by,
    attendanceDay1MarkedAt: toIsoNullable(team.attendance_day1_marked_at),
    attendanceDay1MarkedBy: team.attendance_day1_marked_by,
    attendanceDay2MarkedAt: toIsoNullable(team.attendance_day2_marked_at),
    attendanceDay2MarkedBy: team.attendance_day2_marked_by,
    createdAt: toIso(team.created_at),
    members: members.map((member) => ({
      id: member.id,
      role: member.role,
      name: member.full_name,
      email: member.email,
      phone: member.phone,
      department: member.department,
      year: member.year,
      gender: member.gender,
    })),
    submission: submission ? mapSubmissionRow(submission) : null,
  }
}

export async function getTeamByAttendanceToken(token: string) {
  const sql = await ensureDatabaseReady()
  const [team] = await sql<DatabaseTeamRow[]>`
    SELECT
      id,
      team_code,
      team_name,
      attendance_token,
      payment_status,
      payment_submitted_at,
      attendance_marked_at,
      attendance_marked_by,
      attendance_day1_marked_at,
      attendance_day1_marked_by,
      attendance_day2_marked_at,
      attendance_day2_marked_by,
      created_at
    FROM teams
    WHERE attendance_token = ${token.trim().toLowerCase()}
    LIMIT 1
  `

  if (!team) return null

  const [memberCount] = await sql<{ member_count: number }[]>`
    SELECT COUNT(*)::int AS member_count
    FROM team_members
    WHERE team_id = ${team.id}
  `

  return {
    teamCode: team.team_code,
    teamName: team.team_name,
    memberCount: memberCount?.member_count ?? 0,
    attendanceMarkedAt: toIsoNullable(team.attendance_marked_at),
    attendanceDay1MarkedAt: toIsoNullable(team.attendance_day1_marked_at),
    attendanceDay2MarkedAt: toIsoNullable(team.attendance_day2_marked_at),
  }
}

export async function submitProject(input: SubmissionInput) {
  const sql = await ensureDatabaseReady()
  const normalizedCode = normalizeTeamCode(input.teamCode)
  const normalizedLeaderEmail = input.leaderEmail.trim().toLowerCase()

  const [team] = await sql<{ id: string; team_code: string; team_name: string }[]>`
    SELECT t.id, t.team_code, t.team_name
    FROM teams t
    INNER JOIN team_members m ON m.team_id = t.id
    WHERE t.team_code = ${normalizedCode}
      AND m.role = 'leader'
      AND LOWER(m.email) = ${normalizedLeaderEmail}
    LIMIT 1
  `

  if (!team) {
    throw new AppError("Team code and leader email do not match any registration.", 404)
  }

  const existing = await sql<{ id: string }[]>`
    SELECT id FROM submissions WHERE team_id = ${team.id} LIMIT 1
  `
  const created = existing.length === 0

  await sql`
    INSERT INTO submissions (
      team_id,
      github_url,
      video_url,
      presentation_url,
      remarks,
      submitted_at,
      updated_at
    )
    VALUES (
      ${team.id},
      ${input.githubUrl.trim()},
      ${input.videoUrl.trim()},
      ${normalizeNullable(input.presentationUrl)},
      ${normalizeNullable(input.remarks)},
      NOW(),
      NOW()
    )
    ON CONFLICT (team_id)
    DO UPDATE SET
      github_url = EXCLUDED.github_url,
      video_url = EXCLUDED.video_url,
      presentation_url = EXCLUDED.presentation_url,
      remarks = EXCLUDED.remarks,
      updated_at = NOW()
  `

  const [submission] = await sql<DatabaseSubmissionRow[]>`
    SELECT github_url, video_url, presentation_url, remarks, submitted_at, updated_at
    FROM submissions
    WHERE team_id = ${team.id}
    LIMIT 1
  `

  return {
    created,
    teamCode: team.team_code,
    teamName: team.team_name,
    submission: mapSubmissionRow(submission),
  }
}

export async function getPublicSubmissions(): Promise<PublicSubmission[]> {
  const sql = await ensureDatabaseReady()
  const rows = await sql<
    Array<{
      team_code: string
      team_name: string
      github_url: string
      video_url: string
      presentation_url: string | null
      remarks: string | null
      submitted_at: Date | string
      updated_at: Date | string
    }>
  >`
    SELECT
      t.team_code,
      t.team_name,
      s.github_url,
      s.video_url,
      s.presentation_url,
      s.remarks,
      s.submitted_at,
      s.updated_at
    FROM submissions s
    INNER JOIN teams t ON t.id = s.team_id
    ORDER BY s.updated_at DESC
  `

  return rows.map((row) => ({
    teamCode: row.team_code,
    teamName: row.team_name,
    githubUrl: row.github_url,
    videoUrl: row.video_url,
    presentationUrl: row.presentation_url,
    remarks: row.remarks,
    submittedAt: toIso(row.submitted_at),
    updatedAt: toIso(row.updated_at),
  }))
}

export async function getAttendanceDashboardData(): Promise<AttendanceDashboardData> {
  const sql = await ensureDatabaseReady()

  const [summary] = await sql<
    { total_teams: number; day1_attended_teams: number; day2_attended_teams: number }[]
  >`
    SELECT
      COUNT(*)::int AS total_teams,
      COUNT(attendance_day1_marked_at)::int AS day1_attended_teams,
      COUNT(attendance_day2_marked_at)::int AS day2_attended_teams
    FROM teams
  `

  const recentEntries = await sql<
    Array<{
      team_code: string
      team_name: string
      marked_day: AttendanceDay
      marked_at: Date | string
      marked_by: string | null
    }>
  >`
    SELECT
      team_code,
      team_name,
      marked_day,
      marked_at,
      marked_by
    FROM (
      SELECT
        team_code,
        team_name,
        'day1'::text AS marked_day,
        attendance_day1_marked_at AS marked_at,
        attendance_day1_marked_by AS marked_by
      FROM teams
      WHERE attendance_day1_marked_at IS NOT NULL

      UNION ALL

      SELECT
        team_code,
        team_name,
        'day2'::text AS marked_day,
        attendance_day2_marked_at AS marked_at,
        attendance_day2_marked_by AS marked_by
      FROM teams
      WHERE attendance_day2_marked_at IS NOT NULL
    ) attendance_events
    ORDER BY marked_at DESC
    LIMIT 20
  `

  const teamOverview = await sql<
    Array<{
      team_code: string
      team_name: string
      payment_status: string
      attendance_day1_marked_at: Date | string | null
      attendance_day2_marked_at: Date | string | null
      created_at: Date | string
      member_count: number
      github_url: string | null
      video_url: string | null
      presentation_url: string | null
      submission_updated_at: Date | string | null
    }>
  >`
    SELECT
      t.team_code,
      t.team_name,
      t.payment_status,
      t.attendance_day1_marked_at,
      t.attendance_day2_marked_at,
      t.created_at,
      COUNT(m.id)::int AS member_count,
      s.github_url,
      s.video_url,
      s.presentation_url,
      s.updated_at AS submission_updated_at
    FROM teams t
    LEFT JOIN team_members m ON m.team_id = t.id
    LEFT JOIN submissions s ON s.team_id = t.id
    GROUP BY
      t.id,
      s.github_url,
      s.video_url,
      s.presentation_url,
      s.updated_at
    ORDER BY t.created_at DESC
    LIMIT 300
  `

  const totalTeams = summary?.total_teams ?? 0
  const day1AttendedTeams = summary?.day1_attended_teams ?? 0
  const day2AttendedTeams = summary?.day2_attended_teams ?? 0

  return {
    totalTeams,
    day1AttendedTeams,
    day1PendingTeams: totalTeams - day1AttendedTeams,
    day2AttendedTeams,
    day2PendingTeams: totalTeams - day2AttendedTeams,
    recentEntries: recentEntries.map((row) => ({
      teamCode: row.team_code,
      teamName: row.team_name,
      day: row.marked_day,
      markedAt: toIso(row.marked_at),
      markedBy: row.marked_by,
    })),
    teamOverview: teamOverview.map((row) => ({
      teamCode: row.team_code,
      teamName: row.team_name,
      memberCount: row.member_count,
      paymentStatus: row.payment_status,
      attendanceDay1MarkedAt: toIsoNullable(row.attendance_day1_marked_at),
      attendanceDay2MarkedAt: toIsoNullable(row.attendance_day2_marked_at),
      hasSubmission: Boolean(row.github_url && row.video_url),
      submissionUpdatedAt: toIsoNullable(row.submission_updated_at),
      githubUrl: row.github_url,
      videoUrl: row.video_url,
      presentationUrl: row.presentation_url,
      createdAt: toIso(row.created_at),
    })),
  }
}

export async function markAttendanceFromPayload(
  payload: string,
  markedBy: string,
  day: AttendanceDay,
): Promise<AttendanceMarkResult> {
  const sql = await ensureDatabaseReady()
  const lookup = parseAttendancePayload(payload)

  if (!lookup) {
    throw new AppError("Invalid QR payload. Please scan a valid CodeKumbh team QR.", 400)
  }

  const [team] =
    lookup.kind === "token"
      ? await sql<DatabaseTeamRow[]>`
          SELECT
            id,
            team_code,
            team_name,
            attendance_token,
            payment_status,
            payment_submitted_at,
            attendance_marked_at,
            attendance_marked_by,
            attendance_day1_marked_at,
            attendance_day1_marked_by,
            attendance_day2_marked_at,
            attendance_day2_marked_by,
            created_at
          FROM teams
          WHERE attendance_token = ${lookup.value}
          LIMIT 1
        `
      : await sql<DatabaseTeamRow[]>`
          SELECT
            id,
            team_code,
            team_name,
            attendance_token,
            payment_status,
            payment_submitted_at,
            attendance_marked_at,
            attendance_marked_by,
            attendance_day1_marked_at,
            attendance_day1_marked_by,
            attendance_day2_marked_at,
            attendance_day2_marked_by,
            created_at
          FROM teams
          WHERE team_code = ${lookup.value}
          LIMIT 1
        `

  if (!team) {
    throw new AppError("No team found for this QR value.", 404)
  }

  const [memberCount] = await sql<{ member_count: number }[]>`
    SELECT COUNT(*)::int AS member_count
    FROM team_members
    WHERE team_id = ${team.id}
  `

  const selectedMarkedAt =
    day === "day1" ? team.attendance_day1_marked_at : team.attendance_day2_marked_at
  const selectedMarkedBy =
    day === "day1" ? team.attendance_day1_marked_by : team.attendance_day2_marked_by

  if (selectedMarkedAt) {
    return {
      day,
      teamCode: team.team_code,
      teamName: team.team_name,
      memberCount: memberCount?.member_count ?? 0,
      alreadyMarked: true,
      markedAt: toIso(selectedMarkedAt),
      markedBy: selectedMarkedBy,
    }
  }

  const normalizedMarker = markedBy.trim().toLowerCase()
  if (day === "day1") {
    const [updated] = await sql<
      {
        attendance_day1_marked_at: Date | string
        attendance_day1_marked_by: string | null
      }[]
    >`
      UPDATE teams
      SET
        attendance_day1_marked_at = NOW(),
        attendance_day1_marked_by = ${normalizedMarker},
        attendance_marked_at = COALESCE(attendance_marked_at, NOW()),
        attendance_marked_by = COALESCE(attendance_marked_by, ${normalizedMarker}),
        updated_at = NOW()
      WHERE id = ${team.id}
        AND attendance_day1_marked_at IS NULL
      RETURNING attendance_day1_marked_at, attendance_day1_marked_by
    `

    if (!updated) {
      const [latest] = await sql<
        {
          attendance_day1_marked_at: Date | string | null
          attendance_day1_marked_by: string | null
        }[]
      >`
        SELECT attendance_day1_marked_at, attendance_day1_marked_by
        FROM teams
        WHERE id = ${team.id}
        LIMIT 1
      `

      if (!latest?.attendance_day1_marked_at) {
        throw new AppError("Attendance could not be marked. Please retry.", 500)
      }

      return {
        day,
        teamCode: team.team_code,
        teamName: team.team_name,
        memberCount: memberCount?.member_count ?? 0,
        alreadyMarked: true,
        markedAt: toIso(latest.attendance_day1_marked_at),
        markedBy: latest.attendance_day1_marked_by,
      }
    }

    return {
      day,
      teamCode: team.team_code,
      teamName: team.team_name,
      memberCount: memberCount?.member_count ?? 0,
      alreadyMarked: false,
      markedAt: toIso(updated.attendance_day1_marked_at),
      markedBy: updated.attendance_day1_marked_by,
    }
  }

  const [updated] = await sql<
    {
      attendance_day2_marked_at: Date | string
      attendance_day2_marked_by: string | null
    }[]
  >`
    UPDATE teams
    SET
      attendance_day2_marked_at = NOW(),
      attendance_day2_marked_by = ${normalizedMarker},
      attendance_marked_at = COALESCE(attendance_marked_at, NOW()),
      attendance_marked_by = COALESCE(attendance_marked_by, ${normalizedMarker}),
      updated_at = NOW()
    WHERE id = ${team.id}
      AND attendance_day2_marked_at IS NULL
    RETURNING attendance_day2_marked_at, attendance_day2_marked_by
  `

  if (!updated) {
    const [latest] = await sql<
      {
        attendance_day2_marked_at: Date | string | null
        attendance_day2_marked_by: string | null
      }[]
    >`
      SELECT attendance_day2_marked_at, attendance_day2_marked_by
      FROM teams
      WHERE id = ${team.id}
      LIMIT 1
    `

    if (!latest?.attendance_day2_marked_at) {
      throw new AppError("Attendance could not be marked. Please retry.", 500)
    }

    return {
      day,
      teamCode: team.team_code,
      teamName: team.team_name,
      memberCount: memberCount?.member_count ?? 0,
      alreadyMarked: true,
      markedAt: toIso(latest.attendance_day2_marked_at),
      markedBy: latest.attendance_day2_marked_by,
    }
  }

  return {
    day,
    teamCode: team.team_code,
    teamName: team.team_name,
    memberCount: memberCount?.member_count ?? 0,
    alreadyMarked: false,
    markedAt: toIso(updated.attendance_day2_marked_at),
    markedBy: updated.attendance_day2_marked_by,
  }
}

function mapSubmissionRow(row: DatabaseSubmissionRow): TeamSubmission {
  return {
    githubUrl: row.github_url,
    videoUrl: row.video_url,
    presentationUrl: row.presentation_url,
    remarks: row.remarks,
    submittedAt: toIso(row.submitted_at),
    updatedAt: toIso(row.updated_at),
  }
}

function mapDatabaseError(error: unknown): AppError {
  if (error instanceof AppError) return error

  const pgError = error as PostgresErrorLike
  if (pgError.code === "23505") {
    switch (pgError.constraint) {
      case "teams_team_name_key":
        return new AppError("This team name is already registered.", 409)
      case "team_members_email_unique_idx":
        return new AppError(
          "One or more participant emails are already used in another team.",
          409,
        )
      case "team_members_phone_unique_idx":
        return new AppError(
          "One or more participant phone numbers are already used in another team.",
          409,
        )
      default:
        return new AppError("Duplicate entry found. Please verify team details.", 409)
    }
  }

  return new AppError("Database request failed. Please retry in a moment.", 500)
}

function normalizeNullable(input?: string): string | null {
  const value = input?.trim()
  return value ? value : null
}

function normalizeTeamCode(value: string): string {
  return value.trim().toUpperCase()
}

function toIso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString()
}

function toIsoNullable(value: Date | string | null): string | null {
  if (!value) return null
  return toIso(value)
}

function parsePaymentScreenshot(dataUrl: string): {
  dataUrl: string
  contentType: string
} {
  const trimmed = dataUrl.trim()
  const match = trimmed.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([a-zA-Z0-9+/=]+)$/)
  if (!match) {
    throw new AppError("Invalid payment screenshot format.", 400)
  }

  const contentType = match[1].toLowerCase()
  if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(contentType)) {
    throw new AppError("Unsupported screenshot type. Use PNG, JPG, or WEBP.", 400)
  }

  let buffer: Buffer
  try {
    buffer = Buffer.from(match[2], "base64")
  } catch {
    throw new AppError("Invalid screenshot encoding.", 400)
  }

  if (buffer.length === 0) {
    throw new AppError("Payment screenshot is empty.", 400)
  }

  if (buffer.length > 5 * 1024 * 1024) {
    throw new AppError("Payment screenshot must be under 5MB.", 400)
  }

  return {
    dataUrl: trimmed,
    contentType,
  }
}

function generateTeamCode(): string {
  let suffix = ""
  for (let i = 0; i < 6; i += 1) {
    const index = Math.floor(Math.random() * TEAM_CODE_CHARS.length)
    suffix += TEAM_CODE_CHARS[index]
  }
  return `${TEAM_CODE_PREFIX}-${suffix}`
}
