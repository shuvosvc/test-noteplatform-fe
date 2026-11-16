"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { NotebookPen, Pin, Calendar, Tag, ExternalLink } from "lucide-react"
import { Note, User, Pagination as PaginationType, PaginatedResponse } from "@/types"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/shared/Pagination"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { EmptyState } from "@/components/shared/EmptyState"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatDate } from "@/lib/utils"

export default function AdminAllNotesPage() {
  const { isAdmin, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [notes, setNotes] = useState<Note[]>([])
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
    totalDocs: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/dashboard")
    }
  }, [authLoading, isAdmin, router])

  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/admin/notes?page=${page}&limit=10`)
      const data: PaginatedResponse<Note> = response.data.data || response.data
      setNotes(data.docs || [])
      if (data.pagination) {
        setPagination(data.pagination)
      }
    } catch {
      setNotes([])
    } finally {
      setIsLoading(false)
    }
  }, [page])

  useEffect(() => {
    if (isAdmin) {
      fetchNotes()
    }
  }, [isAdmin, fetchNotes])

  if (authLoading) {
    return <LoadingSpinner size="lg" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">All Platform Notes</h1>
        <p className="text-muted-foreground mt-1">
          Administrative overview of all notes created across the entire platform.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : notes.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title="No notes found"
          description="There are currently no notes in the system."
        />
      ) : (
        <>
          <div className="rounded-md border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Pinned</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notes.map((note) => {
                  const author = typeof note.author === "object" ? (note.author as User) : null
                  const authorName = author?.name || "Unknown"
                  const authorEmail = author?.email || ""

                  return (
                    <TableRow key={note._id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {note.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{authorName}</span>
                          <span className="text-xs text-muted-foreground">{authorEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {note.tags && note.tags.length > 0 ? (
                            note.tags.slice(0, 2).map((t, i) => (
                              <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                                {t}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                          {note.tags && note.tags.length > 2 && (
                            <Badge variant="secondary" className="text-[10px] px-1 py-0">
                              +{note.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {note.isPinned ? (
                          <Badge variant="default" className="text-xs flex items-center gap-1 w-fit">
                            <Pin className="h-3 w-3 fill-current" />
                            <span>Pinned</span>
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">No</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(note.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedNote(note)}
                          className="gap-1 text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
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

      {selectedNote && (
        <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedNote.title}</DialogTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <span>
                  Author:{" "}
                  {typeof selectedNote.author === "object"
                    ? (selectedNote.author as User).name
                    : String(selectedNote.author)}
                </span>
                <span>&bull;</span>
                <span>{formatDate(selectedNote.createdAt)}</span>
              </div>
            </DialogHeader>

            <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed border-t pt-4">
              {selectedNote.content}
            </div>

            {selectedNote.tags && selectedNote.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-4 border-t mt-4">
                {selectedNote.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
