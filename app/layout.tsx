import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "../lib/providers/SessionProvider";
import Footer from "../components/home/Footer";



export const metadata: Metadata = {
  title: "CodeKumbh 2025",
  description: "JEC'S EXCLUSIVE 24-HOUR HACKATHON",
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          {/* <Footer/> */}
        </AuthProvider>
      </body>
    </html>
  )
}
