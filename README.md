# CodeKumbh 2.0 Website

Next.js app for:
- landing page with event details
- team registration (3-5 members) + UPI payment details
- generated team card with unique attendance QR
- admin attendance scanner dashboard (day-wise attendance: Day 1 and Day 2)
- team project submission + public submissions page

## Tech Stack
- Next.js (App Router)
- PostgreSQL (Neon connection string)
- Vercel deployment

## Environment Variables
Create `.env.local` in project root:

```bash
DATABASE_URL=postgres://...

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_EVENT_DATES=March 20-21, 2026
NEXT_PUBLIC_EVENT_VENUE=JEC Campus, Jabalpur
NEXT_PUBLIC_REGISTRATION_FEE=250
NEXT_PUBLIC_UPI_ID=your-upi-id@bank
NEXT_PUBLIC_UPI_QR_IMAGE=/image.png

ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-password
ADMIN_SESSION_SECRET=replace-with-long-random-secret
```

Place your organizer UPI QR image at `public/image.png` (or change `NEXT_PUBLIC_UPI_QR_IMAGE`).

## Problem Statements JSON
Edit:

`data/problem-statements.json`

Fields:
- `revealAt`: when problem statements become visible on landing page
- `submissionStartsAt`: submission form unlock time (configured to 4:00 PM, March 12, 2026)
- `submissionDeadline`: used to accept/reject project submissions
- `items`: list of statements (title, description, tags, sponsor)

## Run Locally

```bash
npm install
npm run dev
```

## Notes
- DB schema is auto-created on first API/database call.
- Team code format: `CK26-XXXXXX`.
- Admin login: `/admin/login`.
- Admin attendance page: `/admin/attendance` (after login).
- Admin can choose `Day 1` or `Day 2` before scanning QR and mark attendance separately for both days.
- Team QR payload uses a unique per-team attendance token (`codekumbh26:entry:<token>`), and tokens are unique in DB.
- Payment screenshot upload is mandatory at registration time.
