# Notification System Technical Specification

## Architecture

The notification system is built on top of the Sonner toast library and consists of:

1. **Toaster Component** (`components/ui/sonner.tsx`): The global notification container that renders all toast notifications.
2. **Utility Functions** (`lib/notifications.ts`): Helper functions for triggering different types of notifications.
3. **Root Layout Integration**: The Toaster component is mounted in the root layout to make it available throughout the application.

## Dependencies

- **sonner**: Toast notification library
- **next-themes**: For theme integration (light/dark mode support)
- **tailwind-merge** and **clsx**: For composing CSS classes

## Toaster Component

### Implementation Details

The Toaster component is a wrapper around Sonner's Toaster component that integrates with Next Themes for theme support and adds custom styling.

```tsx
// components/ui/sonner.tsx
"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      } as React.CSSProperties}
      toastOptions={{
        classNames: {
          success: "bg-green-50 text-green-900 dark:bg-green-900 dark:text-green-50 border-green-200 dark:border-green-800",
          error: "bg-red-50 text-red-900 dark:bg-red-900 dark:text-red-50 border-red-200 dark:border-red-800",
          warning: "bg-amber-50 text-amber-900 dark:bg-amber-900 dark:text-amber-50 border-amber-200 dark:border-amber-800",
          info: "bg-blue-50 text-blue-900 dark:bg-blue-900 dark:text-blue-50 border-blue-200 dark:border-blue-800",
        },
        duration: 5000,
      }}
      {...props}
    />
  )
}

export { Toaster }
```

### Styling

The notification types are styled using Tailwind CSS classes with the following color scheme:

- **Success**: Green color palette
- **Error**: Red color palette
- **Warning**: Amber/yellow color palette
- **Info**: Blue color palette

Each notification type has different styling for light and dark modes, ensuring good contrast and visibility in all themes.

## Notification Utility Functions

### API Reference

#### `notify(message: string, options?: NotificationOptions)`
Displays a default toast notification.

#### `notifySuccess(message: string, options?: NotificationOptions)`
Displays a success notification with green styling. Default duration: 3000ms.

#### `notifyError(message: string, options?: NotificationOptions)`
Displays an error notification with red styling. Default duration: 5000ms.

#### `notifyWarning(message: string, options?: NotificationOptions)`
Displays a warning notification with amber/yellow styling. Default duration: 4000ms.

#### `notifyInfo(message: string, options?: NotificationOptions)`
Displays an info notification with blue styling. Default duration: 4000ms.

#### `notifyWithAction(message: string, actionLabel: string, onAction: () => void, options?: NotificationOptions)`
Displays a notification with a clickable action button.

### Options

Each notification function accepts an options object with the following properties:

```typescript
interface NotificationOptions {
  // Duration in milliseconds
  duration?: number;
  
  // Custom CSS classes
  className?: string;
  
  // Close button configuration
  closeButton?: boolean;
  
  // Description/secondary text
  description?: string;
  
  // Action button configuration
  action?: {
    label: string;
    onClick: () => void;
  };
  
  // ARIA label for screen readers
  ariaLabel?: string;
  
  // Positioning
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  
  // Additional options...
}
```

## Implementation in Root Layout

The Toaster component is added to the app's root layout to make it globally available:

```tsx
// app/layout.tsx
import { Toaster } from "@/components/ui/sonner";

// Inside the ThemeProvider
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <Toaster />
  <Header />
  <main className="flex-1">
    {children}
  </main>
  <Footer />
</ThemeProvider>
```

## Notification Behavior

- Notifications stack from the top-right corner by default
- The global default duration for all notifications is 5000ms (set in the Toaster component)
- Type-specific durations are applied in the utility functions:
  - Success: 3000ms (shorter as they're less critical)
  - Error: 5000ms (uses the global default)
  - Warning: 4000ms
  - Info: 4000ms
- All notifications are dismissible via a close button
- Multiple notifications will stack in chronological order
- The most recent notification appears at the top of the stack

## Performance Considerations

- The Toaster component is rendered once in the root layout
- Individual notification rendering is handled by Sonner
- Utility functions are lightweight and don't cause unnecessary re-renders

## Future Enhancements

Potential future improvements:

1. Notification persistence for critical messages
2. Notification center for viewing notification history
3. Custom animation options
4. Advanced notification grouping
5. Sound effects for important notifications
