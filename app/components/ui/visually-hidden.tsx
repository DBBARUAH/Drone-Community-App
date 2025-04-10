"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

interface VisuallyHiddenProps {
  asChild?: boolean
  className?: string
  children: React.ReactNode
}

export const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "span"

    return (
      <Comp
        ref={ref}
        className={cn(
          "absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden whitespace-nowrap border-0",
          "[clip:rect(0,0,0,0)]",
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)

VisuallyHidden.displayName = "VisuallyHidden" 