"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Users as UsersIcon, UserPlus, Filter } from "lucide-react"
import { useUsers } from "@/hooks/useUsers"
import { useAuth } from "@/lib/auth"
import { UserTable } from "@/components/admin/UserTable"
import { SearchInput } from "@/components/shared/SearchInput"
import { Pagination } from "@/components/shared/Pagination"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { EmptyState } from "@/components/shared/EmptyState"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminUsersPage() {
  const { user, isAdmin, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const {
    users,
    pagination,
    page,
    setPage,
    search,
    setSearch,
    role,
    setRole,
    isLoading,
    deleteUser,
  } = useUsers()

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/dashboard")
    }
  }, [authLoading, isAdmin, router])

  if (authLoading || (!isAdmin && user)) {
    return <LoadingSpinner size="lg" />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">
            View, edit, filter, and manage platform user accounts and permissions.
          </p>
        </div>

        <Button asChild className="gap-2">
          <Link href="/admin/users/new">
            <UserPlus className="h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val)
            setPage(1)
          }}
          placeholder="Search by name or email..."
          className="max-w-sm"
        />

        <div className="flex items-center gap-2 w-full sm:w-48">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select
            value={role || "all"}
            onValueChange={(val) => {
              setRole(val === "all" ? "" : val)
              setPage(1)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">Users Only</SelectItem>
              <SelectItem value="admin">Admins Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : users.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="No users found"
          description="There are no users matching your current search criteria or role filters."
        />
      ) : (
        <>
          <UserTable users={users} onDelete={deleteUser} />

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
