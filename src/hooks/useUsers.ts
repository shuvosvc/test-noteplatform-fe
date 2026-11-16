"use client"

import { useState, useCallback, useEffect } from "react"
import { User, Pagination, PaginatedResponse } from "@/types"
import { api } from "@/lib/api"
import { toast } from "sonner"

export function useUsers(initialPage = 1, initialLimit = 10, initialSearch = "", initialRole = "") {
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: initialPage,
    limit: initialLimit,
    totalDocs: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [search, setSearch] = useState(initialSearch)
  const [role, setRole] = useState(initialRole)
  const [page, setPage] = useState(initialPage)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: initialLimit.toString(),
      })
      if (search.trim()) {
        queryParams.set("search", search.trim())
      }
      if (role && role !== "all") {
        queryParams.set("role", role)
      }

      const response = await api.get(`/admin/users?${queryParams.toString()}`)
      const data: PaginatedResponse<User> = response.data.data || response.data
      setUsers(data.docs || [])
      if (data.pagination) {
        setPagination(data.pagination)
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || "Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }, [page, initialLimit, search, role])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const createUser = async (data: {
    name: string
    email: string
    password?: string
    role?: "user" | "admin"
    isActive?: boolean
    interests?: string[]
  }) => {
    const response = await api.post("/admin/users", data)
    await fetchUsers()
    return response.data.data || response.data
  }

  const updateUser = async (
    id: string,
    data: {
      name?: string
      role?: "user" | "admin"
      isActive?: boolean
      interests?: string[]
    }
  ) => {
    const response = await api.put(`/admin/users/${id}`, data)
    await fetchUsers()
    return response.data.data || response.data
  }

  const deleteUser = async (id: string) => {
    await api.delete(`/admin/users/${id}`)
    await fetchUsers()
  }

  return {
    users,
    pagination,
    page,
    setPage,
    search,
    setSearch,
    role,
    setRole,
    isLoading,
    refreshUsers: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  }
}
