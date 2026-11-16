"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Save, ArrowLeft, Loader2 } from "lucide-react"
import { Post } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  body: z.string().min(1, "Post body is required").max(20000, "Post body is too long"),
})

type PostFormValues = z.infer<typeof postSchema>

interface PostEditorProps {
  initialData?: Post | null
  onSave: (data: { title: string; body: string }) => Promise<void>
}

export function PostEditor({ initialData, onSave }: PostEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || "",
      body: initialData?.body || "",
    },
  })

  const onSubmit = async (values: PostFormValues) => {
    try {
      setIsSubmitting(true)
      await onSave(values)
      toast.success(initialData ? "Post updated successfully!" : "Post published successfully!")
      router.push("/posts")
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || "Failed to save post")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <CardTitle className="text-xl font-bold">
          {initialData ? "Edit Post" : "Write a New Post"}
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/posts")}
          className="flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Posts
        </Button>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Post Title</Label>
            <Input
              id="title"
              placeholder="What's this post about?"
              className="text-lg font-medium"
              disabled={isSubmitting}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Post Body</Label>
            <Textarea
              id="body"
              placeholder="Share your thoughts with the community..."
              className="min-h-[300px] leading-relaxed resize-y"
              disabled={isSubmitting}
              {...register("body")}
            />
            {errors.body && (
              <p className="text-xs text-destructive">{errors.body.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/posts")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {initialData ? "Save Changes" : "Publish Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
