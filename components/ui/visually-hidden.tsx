import * as React from "react"
import { cn } from "@/lib/utils"

interface VisuallyHiddenProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

/**
 * VisuallyHidden component
 * 
 * This component visually hides content while keeping it accessible to screen readers.
 * Useful for providing context to assistive technologies without visual clutter.
 */
const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden whitespace-nowrap",
          "border-0 clip-rect-0",
          className
        )}
        {...props}
      />
    )
  }
)
VisuallyHidden.displayName = "VisuallyHidden"

export { VisuallyHidden }
