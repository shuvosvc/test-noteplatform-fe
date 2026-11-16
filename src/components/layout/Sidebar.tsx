"use client"

import React from "react"
import Link from "next/link"
import { NotebookTabs } from "lucide-react"
import { SidebarNav } from "@/components/layout/SidebarNav"
import { useAuth } from "@/lib/auth"

export function Sidebar() {
  const { isAdmin } = useAuth()

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r bg-card z-30">
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <NotebookTabs className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">
            NotePlatform
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <SidebarNav isAdmin={isAdmin} />
      </div>
    </aside>
  )
}
