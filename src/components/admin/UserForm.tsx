"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Save, ArrowLeft, Plus, X, Tag, Shield, Loader2 } from "lucide-react"
import { User } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const userCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  role: z.enum(["user", "admin"]),
  isActive: z.boolean().default(true),
})

type UserFormValues = z.infer<typeof userCreateSchema>

interface UserFormProps {
  initialData?: User | null
  onSave: (data: {
    name: string
    email?: string
    password?: string
    role: "user" | "admin"
    isActive: boolean
    interests: string[]
  }) => Promise<void>
}

export function UserForm({ initialData, onSave }: UserFormProps) {
  const [interests, setInterests] = useState<string[]>(initialData?.interests || [])
  const [interestInput, setInterestInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "",
      role: initialData?.role || "user",
      isActive: initialData?.isActive ?? true,
    },
  })

  const currentRole = watch("role")
  const currentIsActive = watch("isActive")

  const handleAddInterest = () => {
    const trimmed = interestInput.trim().toLowerCase()
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed])
      setInterestInput("")
    }
  }

  const handleRemoveInterest = (item: string) => {
    setInterests(interests.filter((i) => i !== item))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddInterest()
    }
  }

  const onSubmit = async (values: UserFormValues) => {
    try {
      setIsSubmitting(true)
      await onSave({
        name: values.name,
        email: values.email,
        password: values.password || undefined,
        role: values.role,
        isActive: values.isActive,
        interests,
      })
      toast.success(initialData ? "User updated successfully!" : "User created successfully!")
      router.push("/admin/users")
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || "Failed to save user")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <CardTitle className="text-xl font-bold">
          {initialData ? "Edit User" : "Add New User"}
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/admin/users")}
          className="flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Full name"
              disabled={isSubmitting}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              disabled={isSubmitting || !!initialData}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {!initialData && (
            <div className="space-y-2">
              <Label htmlFor="password">Initial Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                disabled={isSubmitting}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={currentRole}
              onValueChange={(val) => setValue("role", val as "user" | "admin")}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select user role" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-sm font-semibold cursor-pointer">
                Account Active
              </Label>
              <p className="text-xs text-muted-foreground">
                Disabled users cannot sign in to the platform.
              </p>
            </div>
            <Switch
              id="isActive"
              checked={currentIsActive}
              onCheckedChange={(checked) => setValue("isActive", checked)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label>Interests</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. technology, design, science"
                  className="pl-9"
                  disabled={isSubmitting}
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddInterest}
                disabled={isSubmitting || !interestInput.trim()}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            {interests.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {interests.map((interest) => (
                  <Badge
                    key={interest}
                    variant="secondary"
                    className="flex items-center gap-1 px-2.5 py-1 text-xs"
                  >
                    <span>{interest}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="ml-1 rounded-full text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/users")}
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
              {initialData ? "Save Changes" : "Create User"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
