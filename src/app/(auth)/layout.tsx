import React from "react"
import Link from "next/link"
import { NotebookTabs } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-muted/40 p-4 sm:p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105">
              <NotebookTabs className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              NotePlatform
            </span>
          </Link>
        </div>
        <div className="rounded-xl border bg-card p-6 sm:p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  )
}
