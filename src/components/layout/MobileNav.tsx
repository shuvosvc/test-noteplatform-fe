"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Menu, NotebookTabs } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SidebarNav } from "@/components/layout/SidebarNav"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const { isAdmin } = useAuth()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="h-16 flex items-center justify-start border-b px-6">
          <SheetTitle>
            <Link
              href="/dashboard"
              className="flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <NotebookTabs className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg text-foreground tracking-tight">
                NotePlatform
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="px-4 py-2 overflow-y-auto">
          <SidebarNav isAdmin={isAdmin} onItemClick={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
