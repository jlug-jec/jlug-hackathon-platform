import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'CodeKumbh 2.0 | Code. Create. Conquer.',
  description: 'Join the ultimate hackathon experience. Build, innovate, and compete with the best minds.',
  applicationName: 'CodeKumbh 2.0',
  keywords: ['CodeKumbh', 'Hackathon', 'JEC', 'Jabalpur', 'CodeKumbh 2026'],
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
    shortcut: [{ url: '/favicon.ico', type: 'image/x-icon' }],
    apple: [{ url: '/apple-icon.png' }],
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'CodeKumbh 2.0 | Code. Create. Conquer.',
    description: 'Join the ultimate hackathon experience. Build, innovate, and compete with the best minds.',
    siteName: 'CodeKumbh 2.0',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeKumbh 2.0 | Code. Create. Conquer.',
    description: 'Join the ultimate hackathon experience. Build, innovate, and compete with the best minds.',
  },
}

export const viewport = {
  themeColor: '#0a0e1a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: 'oklch(0.14 0.005 260)',
              border: '1px solid oklch(0.25 0.01 260)',
              color: 'oklch(0.95 0 0)',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
