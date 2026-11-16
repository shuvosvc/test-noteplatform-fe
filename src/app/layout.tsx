import type { Metadata } from "next"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { AuthProvider } from "@/lib/auth"
import { Toaster } from "@/components/ui/sonner"
import "@/app/globals.css"

export const metadata: Metadata = {
  title: "NotePlatform - Elegant Note Taking & Sharing",
  description: "Secure, modern, and collaborative note taking platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "1064748421416-enkuk4h8pklfr20lmlepkrjkc79bf4cg.apps.googleusercontent.com"

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
