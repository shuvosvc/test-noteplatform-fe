"use client"

import React from "react"
import Link from "next/link"
import { Plus, StickyNote } from "lucide-react"
import { useNotes } from "@/hooks/useNotes"
import { NoteCard } from "@/components/notes/NoteCard"
import { SearchInput } from "@/components/shared/SearchInput"
import { Pagination } from "@/components/shared/Pagination"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { EmptyState } from "@/components/shared/EmptyState"
import { Button } from "@/components/ui/button"

export function NoteList() {
  const {
    notes,
    pagination,
    page,
    setPage,
    search,
    setSearch,
    isLoading,
    updateNote,
    deleteNote,
  } = useNotes()

  const handleTogglePin = async (id: string, currentPinStatus: boolean) => {
    await updateNote(id, { isPinned: !currentPinStatus })
  }

  const handleDelete = async (id: string) => {
    await deleteNote(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val)
            setPage(1)
          }}
          placeholder="Search notes by title or tags..."
          className="max-w-md"
        />
        <Button asChild className="flex items-center gap-2">
          <Link href="/notes/new">
            <Plus className="h-4 w-4" />
            Create Note
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : notes.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title={search ? "No matching notes" : "No notes yet"}
          description={
            search
              ? "We couldn't find any notes matching your search keywords. Try adjusting your query."
              : "You haven't created any notes yet. Start capturing your thoughts and ideas today."
          }
          actionLabel="Create First Note"
          onAction={() => {
            window.location.href = "/notes/new"
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onDelete={handleDelete}
                onTogglePin={handleTogglePin}
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
