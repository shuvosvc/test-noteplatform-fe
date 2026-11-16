"use client"

import { useState, useCallback, useEffect } from "react"
import { Note, Pagination, PaginatedResponse } from "@/types"
import { api } from "@/lib/api"
import { toast } from "sonner"

export function useNotes(initialPage = 1, initialLimit = 9, initialSearch = "") {
  const [notes, setNotes] = useState<Note[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: initialPage,
    limit: initialLimit,
    totalDocs: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [search, setSearch] = useState(initialSearch)
  const [page, setPage] = useState(initialPage)
  const [isLoading, setIsLoading] = useState(true)

  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true)
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: initialLimit.toString(),
      })
      if (search.trim()) {
        queryParams.set("search", search.trim())
      }

      const response = await api.get(`/notes?${queryParams.toString()}`)
      const data: PaginatedResponse<Note> = response.data.data || response.data
      setNotes(data.docs || [])
      if (data.pagination) {
        setPagination(data.pagination)
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || "Failed to load notes")
    } finally {
      setIsLoading(false)
    }
  }, [page, initialLimit, search])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const createNote = async (data: { title: string; content: string; tags?: string[]; isPinned?: boolean }) => {
    const response = await api.post("/notes", data)
    await fetchNotes()
    return response.data.data || response.data
  }

  const updateNote = async (
    id: string,
    data: { title?: string; content?: string; tags?: string[]; isPinned?: boolean }
  ) => {
    const response = await api.put(`/notes/${id}`, data)
    await fetchNotes()
    return response.data.data || response.data
  }

  const deleteNote = async (id: string) => {
    await api.delete(`/notes/${id}`)
    await fetchNotes()
  }

  return {
    notes,
    pagination,
    page,
    setPage,
    search,
    setSearch,
    isLoading,
    refreshNotes: fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  }
}
