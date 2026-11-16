import { Metadata } from "next"
import { ShieldCheck } from "lucide-react"
import { AdminLoginForm } from "@/components/auth/AdminLoginForm"

export const metadata: Metadata = {
  title: "Admin Portal - NotePlatform",
  description: "Secure Administrator Access",
}

export default function AdminLoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-amber-400 shadow-sm mx-auto">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
        <p className="text-sm text-muted-foreground">
          Restricted access for platform administrators
        </p>
      </div>
      <AdminLoginForm />
    </div>
  )
}
