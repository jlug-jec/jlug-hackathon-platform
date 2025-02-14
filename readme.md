# CodeKumbh - JEC's 24-Hour Hackathon Platform

<div align="center">
  <h3>A modern hackathon platform with space-themed UI and real-time team management</h3>
</div>

<img width="988" alt="image" src="https://github.com/user-attachments/assets/3452bf37-d18f-4245-b248-3f48c1b31c66" />

## ✨ Features

### Core Features
- 🔐 **Secure Authentication**: Google OAuth integration with NextAuth.js
- 👥 **Team Management**: Create and manage hackathon teams
- 📊 **Real-time Updates**: Firebase Firestore integration
- 📱 **Responsive Design**: Works seamlessly on all devices
- 🌌 **Space Theme**: Interactive UI with particle effects and animations
- 📑 **Automated Registration**: Google Sheets integration for participant tracking

### Technical Stack
- ⚛️ Next.js 15 with App Router
- 🎨 TailwindCSS + Framer Motion
- 🔥 Firebase (Firestore)
- 🔒 NextAuth.js
- 📝 Google Sheets API
- 🎭 Shadcn UI Components

## 🚀 Getting Started



📁 Project Structure

```
├── app/
│   ├── actions/         # Server actions
│   ├── api/            # API routes
│   ├── hackathon/      # Hackathon dashboard
│   ├── login/          # Authentication
│   └── register/       # Team registration
├── components/
│   ├── home/           # Landing page components
│   └── ui/             # Reusable UI components
├── lib/
│   ├── firebase/       # Firebase configuration
│   ├── providers/      # Context providers
│   └── utils.ts        # Utility functions
└── public/             # Static assets
```


1. **Clone the repository**
```bash
git clone https://github.com/yourusername/codekumbh.git
cd codekumbh
```

2. Install dependencies
```bash
pnpm install
 ```

3. Set up environment variables Create a .env.local file with:


```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_SCRIPT_URL=
NEXT_PUBLIC_WHATSAPP_URL=
```

4. Run the development server
```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```
