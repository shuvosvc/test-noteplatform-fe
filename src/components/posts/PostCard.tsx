"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Calendar, Pencil, Trash2, User as UserIcon } from "lucide-react"
import { Post, User } from "@/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { formatDate, getInitials } from "@/lib/utils"

interface PostCardProps {
  post: Post
  currentUserId?: string
  isAdmin?: boolean
  onDelete?: (id: string) => Promise<void>
}

export function PostCard({
  post,
  currentUserId,
  isAdmin = false,
  onDelete,
}: PostCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const author = typeof post.author === "object" ? (post.author as User) : null
  const authorId = author ? author._id : (post.author as string)
  const authorName = author?.name || "Community Member"
  const isAuthorOrAdmin = (currentUserId && authorId === currentUserId) || isAdmin

  const handleDelete = async () => {
    if (!onDelete) return
    try {
      setIsDeleting(true)
      await onDelete(post._id)
      setDeleteDialogOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card className="transition-all hover:shadow-md border-border/80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={author?.avatar} alt={authorName} />
                <AvatarFallback>{getInitials(authorName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground leading-none">
                  {authorName}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>
            </div>

            {isAuthorOrAdmin && onDelete && (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <Link href={`/posts/${post._id}`}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit post</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete post</span>
                </Button>
              </div>
            )}
          </div>

          <CardTitle className="text-xl font-bold tracking-tight">
            <Link
              href={`/posts/${post._id}`}
              className="hover:text-primary transition-colors"
            >
              {post.title}
            </Link>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed line-clamp-4">
            {post.body}
          </p>
        </CardContent>

        <CardFooter className="pt-2 border-t text-xs text-muted-foreground flex justify-between items-center">
          <span className="flex items-center gap-1">
            <UserIcon className="h-3.5 w-3.5" />
            <span>Author ID: {authorId ? authorId.slice(-6) : "Anonymous"}</span>
          </span>
          <Button variant="link" size="sm" asChild className="p-0 h-auto text-primary">
            <Link href={`/posts/${post._id}`}>Read More &rarr;</Link>
          </Button>
        </CardFooter>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action will permanently remove it from the feed."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  )
}
