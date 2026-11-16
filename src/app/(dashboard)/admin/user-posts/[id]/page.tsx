"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  FileSearch,
  User as UserIcon,
  Mail,
  Calendar,
  ArrowLeft,
  FileText,
} from "lucide-react"
import { UserPostsData } from "@/types"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { EmptyState } from "@/components/shared/EmptyState"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"

export default function AdminUserPostsLookupPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const { isAdmin, isLoading: authLoading } = useAuth()
  const [userData, setUserData] = useState<UserPostsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/dashboard")
    }
  }, [authLoading, isAdmin, router])

  useEffect(() => {
    if (isAdmin && id) {
      const fetchUserPosts = async () => {
        try {
          setIsLoading(true)
          const response = await api.get(`/admin/users/${id}/posts`)
          const result = response.data.data || response.data
          if (Array.isArray(result) && result.length > 0) {
            setUserData(result[0])
          } else if (result && !Array.isArray(result)) {
            setUserData(result)
          } else {
            setUserData(null)
          }
        } catch (err: unknown) {
          const error = err as { response?: { data?: { message?: string } } }
          toast.error(error.response?.data?.message || "Failed to load user posts")
        } finally {
          setIsLoading(false)
        }
      }

      fetchUserPosts()
    }
  }, [id, isAdmin])

  if (authLoading || isLoading) {
    return <LoadingSpinner size="lg" />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild className="gap-1.5">
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <FileSearch className="h-8 w-8 text-primary" />
          User Posts ($lookup)
        </h1>
        <p className="text-muted-foreground mt-1">
          MongoDB $lookup aggregation result joining the User document with their authored posts.
        </p>
      </div>

      {userData ? (
        <>
          <Card className="border-primary/20 bg-primary/5 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-primary" />
                  {userData.name}
                </CardTitle>
                <Badge variant="secondary" className="font-semibold">
                  {userData.posts?.length || 0} {userData.posts?.length === 1 ? "Post" : "Posts"}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-2 pt-1 text-sm">
                <Mail className="h-4 w-4" />
                {userData.email}
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Authored Posts</h3>
            {(!userData.posts || userData.posts.length === 0) ? (
              <EmptyState
                icon={FileText}
                title="No posts authored"
                description={`${userData.name} has not authored any posts yet.`}
              />
            ) : (
              <div className="space-y-4">
                {userData.posts.map((post) => (
                  <Card key={post._id} className="shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold">{post.title}</CardTitle>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {post.body}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <EmptyState
          icon={UserIcon}
          title="User not found"
          description="Could not find any user matching this ID."
        />
      )}
    </div>
  )
}
