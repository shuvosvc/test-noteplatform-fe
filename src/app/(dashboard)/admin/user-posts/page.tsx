"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FileSearch, ArrowRight, Mail } from "lucide-react"
import { User } from "@/types"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { EmptyState } from "@/components/shared/EmptyState"
import { getInitials } from "@/lib/utils"

export default function AdminUserPostsSelectorPage() {
  const { isAdmin, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/dashboard")
    }
  }, [authLoading, isAdmin, router])

  useEffect(() => {
    if (isAdmin) {
      const fetchUsers = async () => {
        try {
          setIsLoading(true)
          const response = await api.get("/admin/users?limit=50")
          const data = response.data.data || response.data
          setUsers(data.docs || [])
        } catch {
          setUsers([])
        } finally {
          setIsLoading(false)
        }
      }

      fetchUsers()
    }
  }, [isAdmin])

  if (authLoading || isLoading) {
    return <LoadingSpinner size="lg" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <FileSearch className="h-8 w-8 text-primary" />
          User Posts ($lookup)
        </h1>
        <p className="text-muted-foreground mt-1">
          Select a user to inspect their posts using the aggregation $lookup pipeline.
        </p>
      </div>

      {users.length === 0 ? (
        <EmptyState
          icon={FileSearch}
          title="No users available"
          description="There are currently no users in the database."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base font-bold">{user.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2 border-t flex justify-end">
                <Button variant="ghost" size="sm" asChild className="gap-1 text-primary">
                  <Link href={`/admin/user-posts/${user._id}`}>
                    <span>View Posts</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
