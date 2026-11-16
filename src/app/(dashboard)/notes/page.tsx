import { Metadata } from "next"
import { NoteList } from "@/components/notes/NoteList"

export const metadata: Metadata = {
  title: "My Notes - NotePlatform",
  description: "View and organize your personal notes",
}

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">My Notes</h1>
        <p className="text-muted-foreground mt-1">
          Capture, search, and manage your private notes and reminders.
        </p>
      </div>
      <NoteList />
    </div>
  )
}
