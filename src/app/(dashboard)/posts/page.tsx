"use client"

import React from "react"
import Link from "next/link"
import { Plus, FileText } from "lucide-react"
import { usePosts } from "@/hooks/usePosts"
import { useAuth } from "@/lib/auth"
import { PostCard } from "@/components/posts/PostCard"
import { Pagination } from "@/components/shared/Pagination"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { EmptyState } from "@/components/shared/EmptyState"
import { Button } from "@/components/ui/button"

export default function PostsPage() {
  const { posts, pagination, page, setPage, isLoading, deletePost } = usePosts()
  const { user, isAdmin } = useAuth()

  const handleDelete = async (id: string) => {
    await deletePost(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Community Posts</h1>
          <p className="text-muted-foreground mt-1">
            Browse knowledge, tutorials, and insights shared by users across the platform.
          </p>
        </div>

        <Button asChild className="gap-2 shrink-0">
          <Link href="/posts/new">
            <Plus className="h-4 w-4" />
            Write Post
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No posts published yet"
          description="Be the first to share your thoughts, guides, or articles with the entire community."
          actionLabel="Write First Post"
          onAction={() => {
            window.location.href = "/posts/new"
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={user?._id}
                isAdmin={isAdmin}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
          />
        </>
      )}
    </div>
  )
}
