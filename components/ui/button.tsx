"use client";

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { useDeviceCategory } from "@/hooks/use-breakpoint"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        // Responsive touch-friendly sizes
        touch: "h-11 px-5 py-3 has-[>svg]:px-4 min-w-[44px] min-h-[44px]",
        "touch-sm": "h-10 rounded-md gap-1.5 px-4 has-[>svg]:px-3 min-w-[44px] min-h-[44px]",
        "touch-lg": "h-12 rounded-md px-6 has-[>svg]:px-5 min-w-[44px] min-h-[44px]",
        "touch-icon": "size-11 min-w-[44px] min-h-[44px]",
      },
      touchFriendly: {
        true: "min-w-[44px] min-h-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      touchFriendly: false,
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  touchFriendly,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    touchFriendly?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  const { isMobile } = useDeviceCategory();
  
  // Automatically apply touch-friendly sizing on mobile if touchFriendly is true
  // or if the touch-target class is added
  const isTouchFriendly = touchFriendly || className?.includes('touch-target');
  
  // Adjust size for touch devices
  const touchSize = React.useMemo(() => {
    if (!isMobile || !isTouchFriendly) return size;
    
    // If already using a touch-specific size, keep it
    if (size?.startsWith('touch-')) return size;
    
    // Map standard sizes to touch sizes
    switch (size) {
      case 'default': return 'touch';
      case 'sm': return 'touch-sm';
      case 'lg': return 'touch-lg';
      case 'icon': return 'touch-icon';
      default: return 'touch';
    }
  }, [size, isMobile, isTouchFriendly]);

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ 
        variant, 
        size: isMobile && isTouchFriendly ? touchSize : size,
        touchFriendly: isMobile && isTouchFriendly,
        className
      }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
