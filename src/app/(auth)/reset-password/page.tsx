import React, { Suspense } from "react"
import { Metadata } from "next"
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"

export const metadata: Metadata = {
  title: "Reset Password - NotePlatform",
  description: "Set a new password for your account",
}

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below
        </p>
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
