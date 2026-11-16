"use client"

import { useState, useCallback, useEffect } from "react"
import { Post, Pagination, PaginatedResponse } from "@/types"
import { api } from "@/lib/api"
import { toast } from "sonner"

export function usePosts(initialPage = 1, initialLimit = 10) {
  const [posts, setPosts] = useState<Post[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: initialPage,
    limit: initialLimit,
    totalDocs: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [page, setPage] = useState(initialPage)
  const [isLoading, setIsLoading] = useState(true)

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true)
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: initialLimit.toString(),
      })

      const response = await api.get(`/posts?${queryParams.toString()}`)
      const data: PaginatedResponse<Post> = response.data.data || response.data
      setPosts(data.docs || [])
      if (data.pagination) {
        setPagination(data.pagination)
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || "Failed to load posts")
    } finally {
      setIsLoading(false)
    }
  }, [page, initialLimit])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const createPost = async (data: { title: string; body: string }) => {
    const response = await api.post("/posts", data)
    await fetchPosts()
    return response.data.data || response.data
  }

  const updatePost = async (id: string, data: { title?: string; body?: string }) => {
    const response = await api.put(`/posts/${id}`, data)
    await fetchPosts()
    return response.data.data || response.data
  }

  const deletePost = async (id: string) => {
    await api.delete(`/posts/${id}`)
    await fetchPosts()
  }

  return {
    posts,
    pagination,
    page,
    setPage,
    isLoading,
    refreshPosts: fetchPosts,
    createPost,
    updatePost,
    deletePost,
  }
}
