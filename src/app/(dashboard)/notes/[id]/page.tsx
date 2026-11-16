"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Note } from "@/types"
import { api } from "@/lib/api"
import { NoteEditor } from "@/components/notes/NoteEditor"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { toast } from "sonner"

export default function NoteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const isNew = id === "new"

  const [note, setNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(!isNew)

  useEffect(() => {
    if (!isNew && id) {
      const fetchNote = async () => {
        try {
          setIsLoading(true)
          const response = await api.get(`/notes/${id}`)
          setNote(response.data.data || response.data)
        } catch (err: unknown) {
          const error = err as { response?: { data?: { message?: string } } }
          toast.error(error.response?.data?.message || "Failed to load note")
          router.push("/notes")
        } finally {
          setIsLoading(false)
        }
      }

      fetchNote()
    }
  }, [id, isNew, router])

  const handleSave = async (data: {
    title: string
    content: string
    tags: string[]
    isPinned: boolean
  }) => {
    if (isNew) {
      await api.post("/notes", data)
    } else {
      await api.put(`/notes/${id}`, data)
    }
  }

  if (isLoading) {
    return <LoadingSpinner size="lg" />
  }

  return (
    <div className="py-2">
      <NoteEditor initialData={note} onSave={handleSave} />
    </div>
  )
}
