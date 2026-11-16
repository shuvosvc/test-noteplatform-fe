export interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  interests: string[]
  avatar?: string
  googleId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Note {
  _id: string
  title: string
  content: string
  author: string | User
  tags: string[]
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export interface Post {
  _id: string
  title: string
  body: string
  author: string | User
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  page: number
  limit: number
  totalDocs: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PaginatedResponse<T> {
  docs: T[]
  pagination: Pagination
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface InterestGroup {
  interest: string
  count: number
  users: Array<{
    _id: string
    name: string
    email: string
  }>
}

export interface UserPostsData {
  _id: string
  name: string
  email: string
  posts: Array<{
    _id: string
    title: string
    body: string
    createdAt: string
  }>
}
