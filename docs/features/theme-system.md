# Theme System Implementation Guide

## Overview

The theme system in M-Yallow provides users with the ability to switch between light and dark themes, with proper persistence and system preference detection. This document outlines the implementation details, key components, and usage guidelines.

## Implementation Details

### Key Components

1. **ThemeProvider Component** (`/components/theme-provider.tsx`)
   - Wraps the application with Next-Themes provider
   - Configures theme attributes and default settings
   - Handles theme transitions and system preference detection

2. **useTheme Hook** (`/hooks/use-theme.ts`)
   - Custom hook for accessing and modifying theme state
   - Provides type-safe theme management functions
   - Handles client-side rendering and hydration issues

3. **ThemeToggle Component** (`/components/ui/theme-toggle.tsx`)
   - UI component for switching between themes
   - Provides dropdown with light, dark, and system options
   - Includes appropriate icons for visual representation

4. **Anti-Flash Script** (in `/app/layout.tsx`)
   - Prevents flash of incorrect theme on initial load
   - Checks localStorage and system preferences
   - Applies theme before React hydration

### CSS Implementation

The theme system uses Tailwind CSS with a class strategy. Theme variables are defined in `globals.css` with two main sections:

1. **Base Variables** (`:root` selector)
   - Default light theme colors and properties

2. **Dark Mode Variables** (`.dark` class)
   - Dark theme colors and properties applied when the `.dark` class is present

Key color variables follow the pattern of `--{component}-{property}` (e.g., `--primary-foreground`).

## Usage Guidelines

### Using Theme-Aware Components

Components should use Tailwind's dark mode utility classes for theme-specific styling:

```tsx
// Example of theme-aware component
function ThemedButton({ children }) {
  return (
    <button className="bg-primary text-primary-foreground dark:bg-secondary dark:text-secondary-foreground">
      {children}
    </button>
  );
}
```

### Accessing Theme in Components

To access the current theme or modify it programmatically:

```tsx
"use client";

import { useTheme } from "@/hooks/use-theme";

function MyComponent() {
  const { theme, setTheme, toggleTheme, resolvedTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {resolvedTheme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme("system")}>Use System Theme</button>
    </div>
  );
}
```

### Adding ThemeToggle to Pages

To include the theme toggle in a page or component:

```tsx
import { ThemeToggle } from "@/components/ui/theme-toggle";

function MyHeader() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1>My App</h1>
      <ThemeToggle />
    </header>
  );
}
```

## Theme Customization

### Adding Custom Theme Variables

To add custom theme variables:

1. Define variables in both light and dark sections of `globals.css`:

```css
:root {
  /* Existing variables */
  --custom-color: #123456;
}

.dark {
  /* Existing variables */
  --custom-color: #abcdef;
}
```

2. Reference the variables in your components:

```css
.custom-element {
  color: var(--custom-color);
}
```

### Creating Additional Themes

To add more themes beyond light and dark:

1. Add new theme classes in `globals.css` (e.g., `.sepia`, `.high-contrast`)
2. Update the ThemeProvider to include the new themes
3. Modify the ThemeToggle component to include options for the new themes

## Best Practices

1. **Use CSS Variables**: Always use the defined CSS variables rather than hardcoding colors.
2. **Respect User Preferences**: Default to system preference when no stored preference exists.
3. **Test Transitions**: Ensure smooth transitions between themes without jarring changes.
4. **Consider Accessibility**: Maintain proper contrast ratios in all themes.
5. **Prevent Theme Flashing**: Use the anti-flash script for all client-rendered pages.

## Troubleshooting

### Common Issues

1. **Flash of Incorrect Theme**:
   - Ensure the anti-flash script is properly included in the layout
   - Verify localStorage access is working correctly

2. **Hydration Mismatch**:
   - Add `if (!mounted) return null` checks in components using the theme
   - Use `suppressHydrationWarning` on the HTML element

3. **CSS Variables Not Applied**:
   - Check that the `.dark` class is being applied to the HTML element
   - Verify CSS variable definitions in globals.css

## Demo

A theme demo page is available at `/theme-demo` that showcases the implementation and provides a testing ground for theme switching functionality.
