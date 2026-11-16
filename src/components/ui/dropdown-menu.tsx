import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuContextValue {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null)

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left" ref={menuRef}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({
  asChild,
  children,
  className,
}: {
  asChild?: boolean
  children: React.ReactNode
  className?: string
}) {
  const context = React.useContext(DropdownMenuContext)
  if (!context) return null

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    context.setOpen((prev) => !prev)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>, {
      onClick: handleClick,
    })
  }

  return (
    <button type="button" onClick={handleClick} className={cn("inline-flex", className)}>
      {children}
    </button>
  )
}

export function DropdownMenuContent({
  children,
  align = "end",
  className,
}: {
  children: React.ReactNode
  align?: "start" | "end" | "center"
  className?: string
}) {
  const context = React.useContext(DropdownMenuContext)
  if (!context || !context.open) return null

  const alignmentClass =
    align === "end" ? "right-0" : align === "start" ? "left-0" : "left-1/2 -translate-x-1/2"

  return (
    <div
      className={cn(
        "absolute z-50 mt-2 min-w-[160px] rounded-md border bg-popover p-1 shadow-md animate-in fade-in-80",
        alignmentClass,
        className
      )}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({
  asChild,
  children,
  className,
  onClick,
}: {
  asChild?: boolean
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  const context = React.useContext(DropdownMenuContext)

  const handleClick = (e: React.MouseEvent) => {
    context?.setOpen(false)
    onClick?.()
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void; className?: string }>,
      {
        onClick: (e: React.MouseEvent) => {
          handleClick(e)
          const childOnClick = (children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>).props?.onClick
          childOnClick?.(e)
        },
        className: cn(
          "flex w-full cursor-pointer select-none items-center rounded-sm px-2.5 py-1.5 text-sm font-medium text-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
          className,
          (children as React.ReactElement<{ className?: string }>).props?.className
        ),
      }
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex w-full cursor-pointer select-none items-center rounded-sm px-2.5 py-1.5 text-sm font-medium text-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      {children}
    </button>
  )
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
}

export function DropdownMenuLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", className)}>
      {children}
    </div>
  )
}
