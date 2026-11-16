"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth"

export function GoogleAuthButton() {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Google authentication failed. No credential received.")
      return
    }

    try {
      setLoading(true)
      const response = await api.post("/auth/google", {
        idToken: credentialResponse.credential,
      })

      const data = response.data.data || response.data
      login(
        { accessToken: data.accessToken, refreshToken: data.refreshToken },
        data.user
      )
      toast.success("Successfully logged in with Google!")
      router.push("/dashboard")
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || "Google sign-in failed")
    } finally {
      setLoading(false)
    }
  }

  const handleError = () => {
    toast.error("Google sign-in encountered an error.")
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      {loading ? (
        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
      ) : (
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap={false}
            shape="rectangular"
            theme="outline"
            width="100%"
          />
        </div>
      )}
    </div>
  )
}
