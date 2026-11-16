"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { User } from "@/types"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth"
import { UserForm } from "@/components/admin/UserForm"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { toast } from "sonner"

export default function AdminUserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const isNew = id === "new"

  const { isAdmin, isLoading: authLoading } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(!isNew)

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/dashboard")
    }
  }, [authLoading, isAdmin, router])

  useEffect(() => {
    if (!isNew && id && isAdmin) {
      const fetchUser = async () => {
        try {
          setIsLoading(true)
          const response = await api.get(`/admin/users/${id}`)
          setUser(response.data.data || response.data)
        } catch (err: unknown) {
          const error = err as { response?: { data?: { message?: string } } }
          toast.error(error.response?.data?.message || "Failed to load user")
          router.push("/admin/users")
        } finally {
          setIsLoading(false)
        }
      }

      fetchUser()
    }
  }, [id, isNew, isAdmin, router])

  const handleSave = async (data: {
    name: string
    email?: string
    password?: string
    role: "user" | "admin"
    isActive: boolean
    interests: string[]
  }) => {
    if (isNew) {
      await api.post("/admin/users", data)
    } else {
      await api.put(`/admin/users/${id}`, data)
    }
  }

  if (authLoading || isLoading) {
    return <LoadingSpinner size="lg" />
  }

  return (
    <div className="py-2">
      <UserForm initialData={user} onSave={handleSave} />
    </div>
  )
}
