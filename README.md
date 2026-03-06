# CodeKumbh 2.0 - JEC's 24-Hour Hackathon Platform

<div align="center">
  <h3>Landing, team registration with UPI, attendance QR, and project submissions</h3>
</div>

<!-- Add a screenshot of the landing or dashboard here -->
<!-- <img width="988" alt="CodeKumbh 2.0" src="https://github.com/user-attachments/assets/your-screenshot.png" /> -->

## ✨ Features

### Core Features
- 🏠 **Landing Page**: Event details, problem statements (time-gated), prizes, FAQ
- 👥 **Team Registration**: 3–5 members per team with UPI payment and screenshot upload
- 🎫 **Team Card**: Unique attendance QR and team code (e.g. `CK26-XXXXXX`)
- 📱 **Admin Attendance**: Day 1 / Day 2 scanner dashboard with QR-based check-in
- 📤 **Project Submissions**: Time-gated submission form and public submissions page
- 🔐 **Admin Auth**: Session-based login for admin dashboard

### Technical Stack
- ⚛️ Next.js (App Router)
- 🐘 PostgreSQL (Neon)
- 🎨 TailwindCSS + Radix UI (Shadcn-style components)
- 📱 QR generation & scanning (@zxing/browser, qrcode)
- 🚀 Vercel deployment

## 🚀 Getting Started

### 📁 Project Structure

```
├── app/
│   ├── api/                 # API routes (register, admin, submissions)
│   ├── admin/               # Admin login & attendance dashboard
│   ├── team/[teamCode]/     # Team card & QR
│   ├── register/            # Team registration
│   ├── submit/              # Project submission form
│   ├── submissions/         # Public submissions page
│   └── entry/[token]/       # QR entry (attendance) page
├── components/
│   ├── ui/                  # Reusable UI (shadcn-style)
│   ├── hero-section.tsx
│   ├── registration-form.tsx
│   ├── team-id-card.tsx
│   ├── attendance-scanner.tsx
│   └── ...
├── lib/
│   ├── db.ts                # PostgreSQL (Neon)
│   ├── admin-auth.ts
│   ├── attendance.ts
│   └── problem-statements.ts
├── data/
│   └── problem-statements.json
└── public/                  # Static assets (UPI QR image, etc.)
```

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/code-kumbh-2026.git
cd code-kumbh-2026
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```
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

Place your organizer UPI QR image at `public/image.png` (or set `NEXT_PUBLIC_UPI_QR_IMAGE` accordingly).

### 4. Run the development server

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Run tests
pnpm test
```

## 📋 Configuration

### Problem statements

Edit `data/problem-statements.json`:

- **revealAt**: When problem statements become visible on the landing page
- **submissionStartsAt**: When the submission form is unlocked (e.g. 4:00 PM, March 12, 2026)
- **submissionDeadline**: Cutoff for accepting project submissions
- **items**: List of statements (title, description, tags, sponsor)

## 📌 Notes

- DB schema is auto-created on first API/database call.
- Team code format: `CK26-XXXXXX`.
- Admin login: `/admin/login` → Attendance: `/admin/attendance`.
- Admin can choose **Day 1** or **Day 2** before scanning; attendance is stored per day.
- Team QR payload: `codekumbh26:entry:<token>` (unique per team in DB).
- Payment screenshot upload is required at registration.
