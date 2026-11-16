"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  StickyNote,
  FileText,
  User as UserIcon,
  Users,
  NotebookPen,
  Tags,
  FileSearch,
  LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

const userNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Notes",
    href: "/notes",
    icon: StickyNote,
  },
  {
    title: "Posts",
    href: "/posts",
    icon: FileText,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: UserIcon,
  },
]

const adminNavItems: NavItem[] = [
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "All Notes",
    href: "/admin/notes",
    icon: NotebookPen,
  },
  {
    title: "Interests",
    href: "/admin/interests",
    icon: Tags,
  },
  {
    title: "User Posts",
    href: "/admin/user-posts",
    icon: FileSearch,
  },
]

interface SidebarNavProps {
  isAdmin?: boolean
  onItemClick?: () => void
}

export function SidebarNav({ isAdmin = false, onItemClick }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="space-y-1">
        <p className="px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Menu
        </p>
        <nav className="flex flex-col space-y-1">
          {userNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {isAdmin && (
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Administration
          </p>
          <nav className="flex flex-col space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </div>
  )
}
