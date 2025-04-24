# Accessibility Technical Specification

## Technology Stack

The M-Yallow UI system is built with:
- **Next.js** - React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **OKLCH Color Model** - For theme color definitions

## Implementation Details

### 1. ARIA Attributes Implementation

#### Component-Level ARIA Patterns

| Component Type | Required ARIA Attributes | Notes |
|----------------|--------------------------|-------|
| Button | `aria-label` (for icon-only), `aria-pressed` (for toggles) | Icon-only buttons must have an accessible name |
| DropdownMenu | `aria-haspopup`, `aria-expanded`, `role="menu"`, `role="menuitem"` | Implement keyboard arrow navigation |
| Form Controls | `aria-required`, `aria-invalid`, `aria-describedby` | Link error messages with form fields |
| Tabs | `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected` | Tab panels should have proper relationship to tabs |
| Dialog | `role="dialog"`, `aria-modal`, `aria-labelledby` | Implement focus trapping |
| Toast Notifications | `role="alert"`, `aria-live="polite"` | Non-critical notifications should use `polite` |

#### Implementation Strategy

1. Create helper utilities for common ARIA patterns:

```typescript
// /lib/accessibility.ts

/**
 * Helper function to add appropriate ARIA attributes to icon-only buttons
 */
export function getIconButtonProps(
  hasVisibleText: boolean, 
  ariaLabel?: string
): Record<string, string> {
  if (!hasVisibleText) {
    return { 'aria-label': ariaLabel || 'Button' };
  }
  return {};
}

/**
 * Helper function for toggle button attributes
 */
export function getToggleProps(
  isPressed: boolean,
  ariaLabel?: string
): Record<string, string | boolean> {
  return {
    'aria-pressed': isPressed,
    ...(ariaLabel ? { 'aria-label': ariaLabel } : {})
  };
}

/**
 * Helper function for form field accessibility attributes
 */
export function getFormFieldProps(
  id: string,
  isRequired: boolean,
  isInvalid: boolean,
  errorId?: string
): Record<string, string | boolean> {
  return {
    id,
    'aria-required': isRequired,
    'aria-invalid': isInvalid,
    ...(isInvalid && errorId ? { 'aria-describedby': errorId } : {})
  };
}
```

2. Apply these patterns systematically to all components in the component library.

### 2. Color Contrast Implementation

#### Contrast Ratio Requirements

- Text: 4.5:1 (WCAG AA)
- Large Text (18pt+ or 14pt+ bold): 3:1 (WCAG AA)
- UI Components and Graphics: 3:1 (WCAG AA)

#### OKLCH Color Adjustment Strategy

The application uses OKLCH color model which allows for more perceptually uniform color adjustments:

```css
/* Example of adjusting colors for better contrast */
:root {
  /* Original */
  --muted-foreground: oklch(0.556 0 0);
  
  /* Adjusted for better contrast */
  --muted-foreground: oklch(0.5 0 0);
}

.dark {
  /* Original */
  --muted-foreground: oklch(0.708 0 0);
  
  /* Adjusted for better contrast */
  --muted-foreground: oklch(0.75 0 0);
}
```

#### Testing Methodology

1. Create a contrast testing component:

```tsx
// /components/dev/contrast-tester.tsx
export function ContrastTester() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Test all foreground/background combinations */}
      <div className="p-4 bg-background">
        <p className="text-foreground">Text on background</p>
      </div>
      <div className="p-4 bg-primary">
        <p className="text-primary-foreground">Text on primary</p>
      </div>
      {/* Additional combinations... */}
    </div>
  );
}
```

2. Use external tools like WebAIM's contrast checker to verify ratios.

### 3. Keyboard Navigation Implementation

#### Focus Management

1. Implement a skip link component:

```tsx
// /components/skip-link.tsx
export function SkipLink() {
  return (
    <a 
      href="#main-content" 
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:border focus:border-ring"
    >
      Skip to main content
    </a>
  );
}
```

2. Create a focus trap utility for modals:

```tsx
// /hooks/use-focus-trap.ts
import { useRef, useEffect } from 'react';

export function useFocusTrap(isActive: boolean = true) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isActive || !ref.current) return;
    
    const focusableElements = ref.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
    
    // Focus first element when trap activates
    firstElement?.focus();
    
    // Add event listener
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);
  
  return ref;
}
```

3. Implement keyboard navigation for complex components:

```tsx
// Example for dropdown menu
function handleKeyDown(e: React.KeyboardEvent) {
  const items = Array.from(menuRef.current?.querySelectorAll('[role="menuitem"]') || []);
  const currentIndex = items.findIndex(item => item === document.activeElement);
  
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % items.length;
      (items[nextIndex] as HTMLElement).focus();
      break;
    case 'ArrowUp':
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + items.length) % items.length;
      (items[prevIndex] as HTMLElement).focus();
      break;
    // Additional key handlers...
  }
}
```

### 4. Screen Reader Compatibility

#### Semantic Structure Implementation

1. Ensure proper document outline:

```tsx
// /app/layout.tsx
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>...</head>
      <body>
        <SkipLink />
        <header role="banner">...</header>
        <main id="main-content" role="main">
          {children}
        </main>
        <footer role="contentinfo">...</footer>
      </body>
    </html>
  );
}
```

2. Implement proper heading hierarchy:

```tsx
// Example component with proper heading levels
function Section({ title, level = 2, children }: SectionProps) {
  const Heading = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <section>
      <Heading>{title}</Heading>
      {children}
    </section>
  );
}
```

#### Live Region Implementation

```tsx
// For dynamic content that should be announced
function Notification({ message, isActive }: NotificationProps) {
  return (
    <div 
      role="alert"
      aria-live="polite"
      className={isActive ? 'visible' : 'invisible'}
    >
      {message}
    </div>
  );
}
```

## Testing Infrastructure

### Automated Testing

1. Component testing with Jest and Testing Library:

```typescript
// Example test for button accessibility
test('icon-only button has accessible name', () => {
  render(<Button variant="icon"><Icon /></Button>);
  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-label');
});
```

2. Automated accessibility testing with axe-core:

```typescript
import { axe } from 'jest-axe';

test('button has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing Procedures

1. Keyboard testing checklist:
   - Tab through all interactive elements
   - Activate elements with Enter/Space
   - Navigate menus with arrow keys
   - Dismiss dialogs with Escape

2. Screen reader testing script:
   - Navigate headings with screen reader shortcuts
   - Test form controls with screen reader
   - Verify dynamic content is announced

## Integration Strategy

1. Update core components first:
   - Button
   - Input
   - Dropdown
   - Dialog
   - Navigation

2. Implement global accessibility features:
   - Skip links
   - Focus management
   - Keyboard shortcuts

3. Apply to page layouts and templates

4. Test comprehensive user flows

## Performance Considerations

- ARIA attributes have minimal performance impact
- Focus management can impact performance if implemented inefficiently
- Color contrast adjustments have no performance impact

## Backward Compatibility

The accessibility enhancements should be backward compatible with existing implementations, as they primarily add attributes rather than changing component APIs.
