"use client"

import React, { useEffect, useState } from "react"
import { Tags, Users as UsersIcon, Mail } from "lucide-react"
import { InterestGroup } from "@/types"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { EmptyState } from "@/components/shared/EmptyState"
import { getInitials } from "@/lib/utils"

export function InterestGroups() {
  const [groups, setGroups] = useState<InterestGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true)
        const response = await api.get("/admin/users/grouped-by-interests")
        setGroups(response.data.data || response.data || [])
      } catch {
        setGroups([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchGroups()
  }, [])

  if (isLoading) {
    return <LoadingSpinner size="lg" />
  }

  if (groups.length === 0) {
    return (
      <EmptyState
        icon={Tags}
        title="No interest data"
        description="Users haven't added any interests yet. When users add interests to their profiles, they will be aggregated here."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <Card key={group.interest} className="transition-all hover:shadow-md border-border/80">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tags className="h-4 w-4 text-primary" />
                <CardTitle className="text-lg font-bold capitalize">
                  {group.interest}
                </CardTitle>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1 font-semibold">
                <UsersIcon className="h-3 w-3" />
                <span>{group.count} {group.count === 1 ? "user" : "users"}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="space-y-2">
              {group.users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between rounded-lg border p-2.5 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium leading-none text-foreground">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
