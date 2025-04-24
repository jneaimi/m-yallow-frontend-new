# Responsive Design System Technical Specification

## System Architecture

### Component Structure

```
├── lib/
│   └── responsive/
│       └── breakpoints.ts           # Breakpoint definitions and types
├── hooks/
│   ├── use-media-query.ts           # Generic media query hooks
│   └── use-breakpoint.ts            # Breakpoint-specific hooks
└── components/
    └── ui/
        └── responsive/
            ├── index.ts             # Main export file
            ├── container.tsx        # Responsive container component
            ├── grid.tsx             # Responsive grid component
            ├── stack.tsx            # Responsive stack component
            ├── visibility.tsx       # Responsive visibility components
            └── wrapper.tsx          # Responsive component wrappers
```

### Breakpoint System

The application uses the following standard breakpoints, aligned with Tailwind's defaults:

| Breakpoint | Size (px) | Description            |
|------------|-----------|------------------------|
| xs         | 320px     | Extra small (phones)   |
| sm         | 640px     | Small (large phones)   |
| md         | 768px     | Medium (tablets)       |
| lg         | 1024px    | Large (laptops)        |
| xl         | 1280px    | Extra large (desktops) |
| 2xl        | 1536px    | Very large screens     |

Breakpoints are defined as both string values (for CSS) and numeric values (for JavaScript operations) in `/lib/responsive/breakpoints.ts`.

### Data Flow

1. CSS variables define responsive properties in `globals.css`
2. Tailwind classes apply responsive styles based on breakpoints
3. React hooks detect current breakpoint/screen size
4. Components adapt layout based on breakpoint information
5. Visibility components conditionally render content based on breakpoint

## Technical Implementation Details

### Breakpoint Definition

```typescript
// /lib/responsive/breakpoints.ts
export const breakpoints = {
  xs: '320px',   // Extra small devices (phones)
  sm: '640px',   // Small devices (large phones, small tablets)
  md: '768px',   // Medium devices (tablets)
  lg: '1024px',  // Large devices (laptops/desktops)
  xl: '1280px',  // Extra large devices (large desktops)
  '2xl': '1536px' // Very large screens
};

export type Breakpoint = keyof typeof breakpoints;
```

This ensures consistent breakpoints throughout the application, with strong TypeScript typing.

### Media Query Hooks

```typescript
// /hooks/use-media-query.ts
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return mounted ? matches : false;
}
```

Key implementation notes:
- Handles client-side detection of media query matches
- Returns `false` during server-side rendering to avoid hydration mismatches
- Adds and removes event listeners properly
- Updates when the media query changes

### Specialized Breakpoint Hooks

```typescript
// /hooks/use-breakpoint.ts
export function useBreakpointMatch(breakpoint: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${breakpointValues[breakpoint]}px)`);
}

export function useActiveBreakpoint(): Breakpoint {
  const is2Xl = useBreakpointMatch('2xl');
  const isXl = useBreakpointMatch('xl');
  const isLg = useBreakpointMatch('lg');
  const isMd = useBreakpointMatch('md');
  const isSm = useBreakpointMatch('sm');
  const isXs = useBreakpointMatch('xs');

  if (is2Xl) return '2xl';
  if (isXl) return 'xl';
  if (isLg) return 'lg';
  if (isMd) return 'md';
  if (isSm) return 'sm';
  if (isXs) return 'xs';
  
  return 'xs';
}
```

Key implementation notes:
- Provides semantic API for checking against standard breakpoints
- Returns the largest active breakpoint for resolution detection
- Strongly typed with TypeScript for developer experience

### Responsive Container Component

```tsx
// /components/ui/responsive/container.tsx
export function ResponsiveContainer({
  children,
  className,
  maxWidth = "xl",
  padding = true,
  center = true,
  mobilePadding = true,
  ...props
}: ResponsiveContainerProps) {
  const maxWidthClass = getMaxWidthClass(maxWidth);

  return (
    <div
      className={cn(
        maxWidthClass,
        center && "mx-auto",
        padding && mobilePadding && "px-4 sm:px-6 md:px-8",
        padding && !mobilePadding && "px-0 sm:px-6 md:px-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

Key implementation notes:
- Provides consistent container behavior across screen sizes
- Uses appropriate padding based on screen size
- Maximum width scales based on breakpoint
- Handles special cases like mobile padding

### Responsive Visibility Components

```tsx
// /components/ui/responsive/visibility.tsx
export function HideOnMobile({
  children,
  className,
  ...props
}: VisibilityProps) {
  return (
    <div className={cn("hidden sm:block", className)} {...props}>
      {children}
    </div>
  );
}

export function ShowOnMobile({
  children,
  className,
  ...props
}: VisibilityProps) {
  return (
    <div className={cn("sm:hidden", className)} {...props}>
      {children}
    </div>
  );
}

// Advanced component with validation and flexible breakpoint control
export function Show({
  children,
  className,
  from,
  until,
  keepInDOM = true,
  ...props
}: BreakpointVisibilityProps) {
  // Validate breakpoint values
  if (from && !(from in breakpoints)) {
    console.error(`Invalid 'from' breakpoint: ${from}`);
    return null;
  }
  if (until && !(until in breakpoints)) {
    console.error(`Invalid 'until' breakpoint: ${until}`);
    return null;
  }
  
  // Ensure logical breakpoint order
  if (from && until) {
    const fromIndex = Object.keys(breakpoints).indexOf(from);
    const untilIndex = Object.keys(breakpoints).indexOf(until);
    if (fromIndex > untilIndex) {
      console.error(`'from' breakpoint (${from}) cannot be larger than 'until' breakpoint (${until})`);
      return null;
    }
  }
  
  // Client-side only rendering with dynamic media query check
  if (!keepInDOM) {
    // Implementation details omitted for brevity
  }
  
  // Render with Tailwind classes for visibility control
  return (
    <div className={cn(visibilityClasses, className)} {...props}>
      {children}
    </div>
  );
}
```

Key implementation notes:
- Uses Tailwind's responsive prefixes for consistent behavior
- Simple API for common visibility patterns
- Maintains accessibility by using display properties instead of removing content
- Supports passing additional className for customization
- Includes robust validation for breakpoint values
- Uses proper media query handling with breakpoint pixel values
- Supports both CSS-based visibility and DOM-based conditional rendering

### Global CSS Responsive Utilities

```css
/* From /app/globals.css */
@layer utilities {
  .text-responsive {
    font-size: clamp(1rem, 0.95rem + 0.25vw, 1.25rem);
  }
  
  .text-responsive-lg {
    font-size: clamp(1.25rem, 1.1rem + 0.75vw, 2rem);
  }
  
  .touch-target {
    min-height: var(--touch-target-size);
    min-width: var(--touch-target-size);
  }
  
  .no-horizontal-overflow {
    max-width: 100vw;
    overflow-x: hidden;
  }
}
```

Key implementation notes:
- Uses `clamp()` for fluid typography that scales with viewport
- Ensures touch targets meet accessibility standards
- Prevents horizontal overflow for mobile devices
- Available globally through utility classes

## Performance Considerations

### Server-Side Rendering

1. **Hydration Safety**
   - Components check for client-side mounting before using browser APIs
   - Default values are provided for SSR to prevent hydration mismatches
   - Media queries default to `false` during SSR

2. **Mobile-First Approach**
   - Default styling targets mobile layouts
   - Progressive enhancement for larger screens
   - Reduces initial CSS payload

### JavaScript Performance

1. **Event Listener Management**
   - Media query listeners are properly cleaned up
   - Components use debounced resize handlers when needed
   - Use of `ResizeObserver` for element-specific monitoring

2. **State Updates**
   - Batched updates for responsive state changes
   - State updates only occur when necessary
   - Avoids unnecessary re-renders

### CSS Performance

1. **Minimal Specificity**
   - Low specificity selectors for better performance
   - Utility-first approach reduces CSS size
   - Avoid deep nesting of selectors

2. **Efficient Media Queries**
   - Media queries organized by mobile-first approach
   - Grouped media queries where possible
   - Use of `prefers-reduced-motion` for animation control

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| CSS Variables | 49+ | 31+ | 9.1+ | 15+ |
| Media Queries | 21+ | 3.5+ | 4+ | 12+ |
| ResizeObserver | 64+ | 69+ | 13.1+ | 79+ |
| CSS Clamp | 79+ | 75+ | 13.4+ | 79+ |

The system gracefully degrades for older browsers:
- Fixed font sizes for browsers without `clamp()` support
- Default sizes for browsers without media query support
- Server rendering for consistent initial display

## Accessibility Considerations

### Touch Targets

- Minimum 44×44 pixel touch targets for interactive elements
- Increased spacing on mobile for easier interaction
- Focus indicators sized appropriately for touch

### Readable Typography

- Font sizes scale with viewport for readability
- Minimum text size of 16px on mobile devices
- Maintains proper contrast ratios at all sizes

### Keyboard Navigation

- Focus visibility maintained across breakpoints
- Tab order remains logical on all devices
- Interactive elements accessible at all screen sizes

### Interactive Components

- Dropdown menus extend beyond their containers with `overflow-visible`
- Proper z-index management ensures interactive elements are accessible
- ARIA attributes (`aria-expanded`, `aria-controls`) for state communication
- Sufficient contrast for interactive elements in both light and dark modes

## Testing Strategy

### Supported Test Cases

1. **Breakpoint Detection**
   - Verify correct breakpoint detection across screen sizes
   - Test window resize behavior
   - Verify SSR behavior with hydration

2. **Component Behavior**
   - Test responsive layout adjustments
   - Validate visibility components show/hide correctly
   - Verify container behaviors

3. **Accessibility Testing**
   - Validate touch target sizes
   - Test keyboard navigation
   - Verify screen reader compatibility

### Testing Tools

- Jest for unit testing hooks
- React Testing Library for component testing
- Storybook for visual testing at different viewports
- Playwright for end-to-end testing

## Future Enhancements

1. **Responsive Images System**
   - Add support for responsive images with srcset
   - Implement picture element helper components
   - Automatic image sizing based on viewport

2. **Advanced Layout Patterns**
   - Complex multi-column layouts
   - Feature detection for CSS Grid/Flexbox support
   - Masonry layout components

3. **Device-Specific Optimizations**
   - Orientation change handling
   - Foldable device support
   - Landscape-specific layouts
