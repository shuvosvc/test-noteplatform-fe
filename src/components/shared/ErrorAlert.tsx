import React from "react"
import { AlertCircle } from "lucide-react"

interface ErrorAlertProps {
  message: string
  className?: string
}

export function ErrorAlert({ message, className = "" }: ErrorAlertProps) {
  if (!message) return null

  return (
    <div
      className={`flex items-start gap-3 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive ${className}`}
    >
      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
      <div>{message}</div>
    </div>
  )
}
