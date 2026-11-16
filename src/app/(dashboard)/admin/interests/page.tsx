"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { InterestGroups } from "@/components/admin/InterestGroups"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"

export default function AdminInterestsPage() {
  const { isAdmin, isLoading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/dashboard")
    }
  }, [authLoading, isAdmin, router])

  if (authLoading) {
    return <LoadingSpinner size="lg" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Users Grouped by Interests
        </h1>
        <p className="text-muted-foreground mt-1">
          MongoDB aggregation pipeline result: users grouped and counted by their registered interests.
        </p>
      </div>

      <InterestGroups />
    </div>
  )
}
