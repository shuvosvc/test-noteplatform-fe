"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Pin, Trash2, Pencil, Calendar, Tag } from "lucide-react"
import { Note } from "@/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { formatDate } from "@/lib/utils"

interface NoteCardProps {
  note: Note
  onDelete: (id: string) => Promise<void>
  onTogglePin?: (id: string, currentPinStatus: boolean) => Promise<void>
}

export function NoteCard({ note, onDelete, onTogglePin }: NoteCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await onDelete(note._id)
      setDeleteDialogOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card className="flex flex-col justify-between transition-all hover:shadow-md border-border/80">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              <Link
                href={`/notes/${note._id}`}
                className="hover:text-primary transition-colors"
              >
                {note.title}
              </Link>
            </CardTitle>
            {onTogglePin && (
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 shrink-0 ${
                  note.isPinned ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => onTogglePin(note._id, note.isPinned)}
                title={note.isPinned ? "Unpin note" : "Pin note"}
              >
                <Pin className={`h-4 w-4 ${note.isPinned ? "fill-primary" : ""}`} />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(note.createdAt)}</span>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">
            {note.content}
          </p>

          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {note.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs font-normal">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-2 border-t flex justify-end gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/notes/${note._id}`} className="flex items-center gap-1">
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 flex items-center gap-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </Button>
        </CardFooter>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  )
}
