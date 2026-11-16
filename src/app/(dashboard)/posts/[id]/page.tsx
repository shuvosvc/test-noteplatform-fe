"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, ArrowLeft, Pencil, Trash2, User as UserIcon } from "lucide-react"
import { Post, User } from "@/types"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth"
import { PostEditor } from "@/components/posts/PostEditor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { formatDate, getInitials } from "@/lib/utils"
import { toast } from "sonner"

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const isNew = id === "new"

  const { user, isAdmin } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(!isNew)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!isNew && id) {
      const fetchPost = async () => {
        try {
          setIsLoading(true)
          const response = await api.get(`/posts/${id}`)
          setPost(response.data.data || response.data)
        } catch (err: unknown) {
          const error = err as { response?: { data?: { message?: string } } }
          toast.error(error.response?.data?.message || "Failed to load post")
          router.push("/posts")
        } finally {
          setIsLoading(false)
        }
      }

      fetchPost()
    }
  }, [id, isNew, router])

  const handleSave = async (data: { title: string; body: string }) => {
    if (isNew) {
      await api.post("/posts", data)
    } else {
      await api.put(`/posts/${id}`, data)
      setPost((prev) => (prev ? { ...prev, ...data } : null))
      setIsEditing(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await api.delete(`/posts/${id}`)
      toast.success("Post deleted successfully")
      router.push("/posts")
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || "Failed to delete post")
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner size="lg" />
  }

  if (isNew || isEditing) {
    return (
      <div className="py-2">
        <PostEditor initialData={post} onSave={handleSave} />
      </div>
    )
  }

  if (!post) {
    return null
  }

  const author = typeof post.author === "object" ? (post.author as User) : null
  const authorId = author ? author._id : (post.author as string)
  const authorName = author?.name || "Community Member"
  const canModify = (user && authorId === user._id) || isAdmin

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild className="gap-1.5">
          <Link href="/posts">
            <ArrowLeft className="h-4 w-4" />
            Back to Posts
          </Link>
        </Button>

        {canModify && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-1.5"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              className="gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <Card className="shadow-sm">
        <CardHeader className="space-y-4 border-b pb-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={author?.avatar} alt={authorName} />
              <AvatarFallback>{getInitials(authorName)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground text-sm leading-none">
                {authorName}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(post.createdAt)}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <UserIcon className="h-3 w-3" />
                  ID: {authorId ? authorId.slice(-6) : "Anonymous"}
                </span>
              </div>
            </div>
          </div>

          <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {post.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="prose max-w-none text-foreground leading-relaxed whitespace-pre-wrap text-base sm:text-lg">
            {post.body}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
