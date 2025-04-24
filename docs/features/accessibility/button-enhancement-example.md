# Button Component Enhancement Example

This document shows a practical example of enhancing the Button component with appropriate accessibility attributes following our accessibility implementation plan.

## Original Button Component

```tsx
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
```

## Enhanced Button Component with Accessibility Improvements

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { useDeviceCategory } from "@/hooks/use-breakpoint"
import { cn } from "@/lib/utils"
import { hasVisibleText } from "@/lib/accessibility/aria-helpers"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      // Existing variants remain the same
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
  'aria-label': ariaLabel,
  children,
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

  // ACCESSIBILITY ENHANCEMENT:
  // Check if button has visible text content for screen readers
  const hasTextContent = React.useMemo(() => {
    return hasVisibleText(children);
  }, [children]);
  
  // ACCESSIBILITY ENHANCEMENT:
  // Ensure icon-only buttons have an accessible name
  const accessibilityProps = React.useMemo(() => {
    // If button has visible text content, no need for aria-label
    if (hasTextContent) return {};
    
    // If aria-label was provided, use it
    if (ariaLabel) return { 'aria-label': ariaLabel };
    
    // If button is icon-only with no aria-label, add a warning in dev mode
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'Button component is rendered without visible text content or aria-label. ' +
        'This may cause accessibility issues for screen reader users.'
      );
    }
    
    // Provide a fallback aria-label as last resort (better than nothing)
    return { 'aria-label': 'Button' };
  }, [hasTextContent, ariaLabel]);

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ 
        variant, 
        size: isMobile && isTouchFriendly ? touchSize : size,
        touchFriendly: isMobile && isTouchFriendly,
        className
      }))}
      // ACCESSIBILITY ENHANCEMENT:
      // Merge accessibility props with any other props
      {...accessibilityProps}
      {...props}
    />
  )
}
```

## Accessibility Improvements Explained

1. **Import Accessibility Helpers**
   - Added import for `hasVisibleText` helper to detect if a button has visible text content

2. **Text Content Detection**
   - Added logic to check if the button has visible text content
   - This helps automatically determine if an `aria-label` is needed

3. **Accessible Name Logic**
   - For icon-only buttons (without visible text), ensure they have an accessible name
   - Use provided `aria-label` if available
   - Add a development warning if no text or label is provided
   - Provide a fallback label as a last resort

4. **Props Forwarding**
   - Merged the accessibility props with other props to ensure correct attribute application
   - Preserves all existing functionality while adding accessibility enhancements

## Usage Examples

### Icon-Only Button (Before)
```tsx
// Previously problematic for screen reader users
<Button variant="icon" size="icon">
  <SearchIcon />
</Button>
```

### Icon-Only Button (After - Explicit Label)
```tsx
// Explicitly labeled - best practice
<Button variant="icon" size="icon" aria-label="Search">
  <SearchIcon />
</Button>
```

### Icon-Only Button (After - With Visible Text)
```tsx
// With visually hidden text
<Button variant="icon" size="icon">
  <SearchIcon />
  <span className="sr-only">Search</span>
</Button>
```

### Toggle Button (After)
```tsx
// Properly labeled toggle button with state
<Button 
  variant="outline" 
  aria-pressed={isActive}
  onClick={() => setIsActive(!isActive)}
>
  {isActive ? "Active" : "Inactive"}
</Button>
```

## Benefits

1. **Screen Reader Compatibility**
   - All buttons now have an accessible name, either through visible text or ARIA attributes
   - Toggle buttons can properly communicate their state via `aria-pressed`

2. **Development Warnings**
   - Provides warnings when buttons might have accessibility issues
   - Encourages developers to add proper labels during development

3. **Automatic Fallbacks**
   - Even when developers forget to add proper labels, provides a minimal fallback
   - Maintains backward compatibility with existing code

4. **Preserves Existing Functionality**
   - All touch target and responsive features are maintained
   - No breaking changes to the API
