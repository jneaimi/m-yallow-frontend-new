# Theme System Technical Specification

## System Architecture

### Component Structure

```
├── components/
│   ├── theme-provider.tsx       # ThemeProvider wrapper component
│   └── ui/
│       └── theme-toggle.tsx     # Theme toggle UI component
├── hooks/
│   └── use-theme.ts             # Custom theme hook
└── app/
    ├── layout.tsx               # Root layout with ThemeProvider and anti-flash script
    └── theme-demo/
        └── page.tsx             # Theme demo page
```

### Data Flow

1. The `ThemeProvider` initializes with settings from next-themes
2. Theme preference is read from localStorage or falls back to system preference
3. The theme class is applied to the HTML element
4. UI components react to theme changes via the `useTheme` hook
5. Theme changes triggered by the `ThemeToggle` are persisted to localStorage

## Technical Implementation Details

### ThemeProvider Component

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"      // Use class strategy for theme application
      defaultTheme="system"  // Default to system preference
      enableSystem           // Enable system preference detection
      disableTransitionOnChange // Prevent transition flicker
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
```

Key implementation notes:
- Uses `"class"` attribute strategy to apply the `.dark` class to HTML element
- Enables system preference detection with `enableSystem`
- Disables transitions during theme changes to prevent visual glitches

### useTheme Hook

```tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";

export type Theme = "light" | "dark" | "system";

export function useTheme() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // Set a specific theme
  const setThemeWithFallback = (newTheme: Theme) => {
    if (!mounted) return;
    setTheme(newTheme);
  };

  return {
    theme: theme as Theme | undefined,
    setTheme: setThemeWithFallback,
    resolvedTheme: mounted ? resolvedTheme as "light" | "dark" | undefined : undefined,
    systemTheme: mounted ? systemTheme as "light" | "dark" | undefined : undefined,
    toggleTheme,
    mounted,
  };
}
```

Key implementation notes:
- Wraps the next-themes hook with additional functionality
- Handles client-side rendering with `mounted` state
- Provides convenience method for toggling between light and dark
- Adds TypeScript typing for better developer experience

### Anti-Flash Script

```js
(function() {
  try {
    const persistedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (persistedTheme === 'dark' || (persistedTheme === null && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    console.warn('Failed to initialize theme:', e);
  }
})();
```

Key implementation notes:
- Self-executing function runs before any React code
- Checks localStorage for saved preference
- Falls back to system preference if no saved preference
- Applies the appropriate class to prevent theme flash
- Wrapped in try/catch to handle localStorage permission issues

### CSS Variables System

The theme system uses CSS custom properties (variables) defined in `globals.css`:

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* Additional light theme variables */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* Additional dark theme variables */
}
```

These variables are then referenced throughout the application using Tailwind's arbitrary value syntax or direct CSS variable references.

## Performance Considerations

### Rendering Optimization

1. **Hydration Handling**
   - Components using theme information should check if mounted
   - The HTML element has `suppressHydrationWarning` to prevent console warnings

2. **CSS Variables**
   - CSS variables allow for efficient theme switching without re-rendering components
   - Changes to the `.dark` class cascade to all themed elements

3. **Transition Control**
   - `disableTransitionOnChange` prevents transition animations during theme switch
   - This reduces CPU load and prevents visual glitches

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| CSS Variables | 49+ | 31+ | 9.1+ | 15+ |
| localStorage | 4+ | 3.5+ | 4+ | 8+ |
| matchMedia | 9+ | 6+ | 5.1+ | 9+ |

For browsers not supporting these features, the site falls back to the default light theme.

## Testing Strategy

### Unit Tests

- Test `useTheme` hook with various scenarios (light, dark, system)
- Test ThemeProvider with different configuration options
- Test localStorage persistence behavior

### Integration Tests

- Test theme switching and persistence across page navigation
- Test system preference detection and overrides
- Test anti-flash script behavior with different initial conditions

### Manual Testing Checklist

- [ ] Verify theme toggle works in all supported browsers
- [ ] Confirm persistence after browser restart
- [ ] Check system preference detection
- [ ] Verify no flash of incorrect theme
- [ ] Test with localStorage disabled
- [ ] Verify transitions between themes

## Future Enhancements

1. **Theme Customization**
   - Add user theme customization options
   - Support additional theme variants beyond light/dark

2. **Per-Component Theming**
   - Allow components to override global theme

3. **Time-Based Themes**
   - Automatic theme switching based on time of day

4. **High Contrast Mode**
   - Add accessibility-focused theme variant

5. **Theme API Integration**
   - Connect with backend to sync user theme preferences across devices
