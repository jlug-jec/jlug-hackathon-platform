## JLUG Hackathon Platform

A modern hackathon management platform built with Next.js 14, featuring server components, API routes, and Google Sheets integration.
<img width="988" alt="image" src="https://github.com/user-attachments/assets/3452bf37-d18f-4245-b248-3f48c1b31c66" />
## Features

### Core Features
- 🔐 Authentication using Next-Auth
- 📝 Team registration system
- 📊 Google Sheets integration for data management
- ✉️ Automated email notifications
- 📤 Project submission portal
- 📱 Responsive design with Tailwind CSS

### Technical Features
- ⚡ Server and Client Components
- 🔄 Server Actions for form handling
- 📡 API Routes for external integrations
- 🎨 Styled using Tailwind CSS & Shadcn UI
- 📦 Type-safe with TypeScript

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Authentication**: Next-Auth
- **Database**: Google Sheets
- **Email**: Nodemailer/Google Apps Script
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   ├── submit/
│   ├── api/
│   └── layout.tsx
├── components/
│   ├── forms/
│   │   ├── RegistrationForm.tsx
│   │   └── SubmissionForm.tsx
│   └── ui/
├── lib/
│   ├── auth.ts
│   └── sheets.ts
└── types/
    └── index.ts
```

## Getting Started

1. **Clone and Install**
```bash
git clone [your-repository-url]
cd hackathon-platform
npm install
```

2. **Environment Setup**
Create a `.env.local` file:
```env
# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=

# Next-Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Email (Optional)
EMAIL_SERVER=
EMAIL_FROM=
```

3. **Google Sheets Setup**
```javascript
// Create service account and enable Google Sheets API
// Add service account email to your Google Sheet sharing settings
```

4. **Development**
```bash
npm run dev
```

5. **Build**
```bash
npm run build
npm start
```

## API Routes

```typescript
POST /api/register
POST /api/submit
GET /api/projects
```

## Deployment

Deploy on Vercel:

```bash
vercel deploy
```

## Environment Variables on Vercel

Configure the following:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SHEET_ID`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## License

MIT License


