"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  StickyNote,
  FileText,
  Plus,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  BookOpen,
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { api } from "@/lib/api"
import { Note, Post } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { formatDate } from "@/lib/utils"

export default function DashboardPage() {
  const { user, isAdmin } = useAuth()
  const [notesCount, setNotesCount] = useState<number>(0)
  const [postsCount, setPostsCount] = useState<number>(0)
  const [recentNotes, setRecentNotes] = useState<Note[]>([])
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const [notesRes, postsRes] = await Promise.all([
          api.get("/notes?limit=3"),
          api.get("/posts?limit=3"),
        ])

        const notesData = notesRes.data.data || notesRes.data
        const postsData = postsRes.data.data || postsRes.data

        setNotesCount(notesData.pagination?.totalDocs || notesData.docs?.length || 0)
        setPostsCount(postsData.pagination?.totalDocs || postsData.docs?.length || 0)
        setRecentNotes(notesData.docs || [])
        setRecentPosts(postsData.docs || [])
      } catch {
        setNotesCount(0)
        setPostsCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return <LoadingSpinner size="lg" />
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Hello, {user?.name || "there"}!
            </h1>
            <Badge variant={isAdmin ? "default" : "secondary"} className="capitalize">
              {isAdmin && <Shield className="mr-1 h-3 w-3" />}
              {user?.role}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Welcome to your workspace. Here is an overview of your activity and notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild className="gap-2">
            <Link href="/notes/new">
              <Plus className="h-4 w-4" />
              New Note
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/posts/new">
              <Plus className="h-4 w-4" />
              Write Post
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Notes
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <StickyNote className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{notesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Personal notes saved in your account
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Community Posts
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{postsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Articles and updates published
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Interests Tagged
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {user?.interests?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Topics matching your interests
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="flex flex-col justify-between">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <StickyNote className="h-5 w-5 text-primary" />
                  Recent Notes
                </CardTitle>
                <CardDescription>Your recently modified personal notes</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/notes" className="flex items-center gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex-1">
            {recentNotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No notes created yet. Click New Note above to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {recentNotes.map((note) => (
                  <Link
                    key={note._id}
                    href={`/notes/${note._id}`}
                    className="block rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm line-clamp-1">{note.title}</h4>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(note.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {note.content}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Latest Community Posts
                </CardTitle>
                <CardDescription>Recent publications from the platform</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/posts" className="flex items-center gap-1">
                  Feed <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex-1">
            {recentPosts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No posts published yet. Share your knowledge by writing the first post.
              </div>
            ) : (
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <Link
                    key={post._id}
                    href={`/posts/${post._id}`}
                    className="block rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm line-clamp-1">{post.title}</h4>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {post.body}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
