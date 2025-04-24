# Responsive Design System

## Purpose

The Responsive Design System ensures consistent responsive behavior across the application. It provides a structured approach to creating layouts that adapt appropriately to different screen sizes, from mobile devices to large desktop monitors.

## Key Features

- Standardized breakpoint system aligned with Tailwind CSS
- React hooks for responsive behavior detection
- Utility components for responsive layouts
- CSS utilities for fluid typography and touch-friendly interfaces
- Visibility components for conditional content rendering
- Comprehensive documentation and examples

## Components and Hooks

### Breakpoints

The system defines consistent breakpoints that align with Tailwind's default breakpoints:

| Breakpoint | Size (px) | Description |
|------------|-----------|-------------|
| xs | 320px | Extra small devices (phones) |
| sm | 640px | Small devices (large phones/small tablets) |
| md | 768px | Medium devices (tablets) |
| lg | 1024px | Large devices (laptops) |
| xl | 1280px | Extra large devices (desktops) |
| 2xl | 1536px | Very large screens |

### React Hooks

The system provides several hooks for detecting screen size and breakpoints:

- `useMediaQuery`: Detects if a media query matches
- `useMinWidth`: Checks if screen is at least a specific width
- `useMaxWidth`: Checks if screen is at most a specific width
- `useBreakpointMatch`: Checks if screen matches a named breakpoint
- `useActiveBreakpoint`: Returns the current active breakpoint
- `useDeviceCategory`: Returns device category (mobile, tablet, desktop)

### Utility Components

The system includes several utility components:

- `ResponsiveContainer`: A container with appropriate max-width and padding
- `ResponsiveGrid`: A grid layout with configurable columns per breakpoint
- `ResponsiveStack`: A stack that can change direction at different breakpoints
- `ResponsiveWrapper`: Renders different content based on screen size
- Visibility components (`ShowOnMobile`, `HideOnDesktop`, etc.)

### CSS Utilities

The system adds several utility classes to globals.css:

- Fluid typography (`text-responsive`, `text-responsive-lg`, etc.)
- Responsive padding (`px-responsive`, `py-responsive`)
- Touch target utilities (`touch-target`)
- Overflow prevention (`no-horizontal-overflow`)
- Safe area inset handling (`safe-padding-bottom`, etc.)

## Usage Guidelines

### Mobile-First Approach

Always start with the mobile layout and progressively enhance for larger screens. This ensures good performance and prioritizes the most constrained environment first.

### Touch-Friendly Design

On mobile devices, ensure all interactive elements:
- Have a minimum touch target size of 44×44 pixels
- Include sufficient spacing between touch targets (at least 8px)
- Provide clear visual feedback on interaction

### Content Prioritization

- Show only essential content on mobile
- Use progressive disclosure to reveal more content on larger screens
- Ensure the most important content is visible without scrolling

### Performance Considerations

- Lazy load images and heavy content
- Consider using different image sizes based on screen size
- Minimize layout shifts with appropriate placeholders

### Accessibility

- Ensure text remains readable at all screen sizes (minimum 16px on mobile)
- Maintain proper contrast ratios
- Keep keyboard navigation working across all breakpoints

## Testing Responsive Designs

Test your responsive layouts:

1. Using browser developer tools
2. On actual devices when possible
3. With the `ResponsiveDebugger` component during development

Pay special attention to:
- Navigation usability
- Form input interactions on touch screens
- Content readability
- Interactive element sizing and spacing

## Best Practices

1. **Error Handling**: Components like `Show` validate breakpoint values and provide helpful error messages. Always use valid breakpoint names from the system.

2. **Avoid Direct Window Access**: Use hooks like `useWindowWidth()` instead of directly accessing `window.innerWidth` to prevent hydration mismatches.

3. **Proper Tailwind Usage**: Be careful with class combinations in responsive variants. Avoid invalid combinations like `sm:lg:hidden`.

4. **Accessibility Considerations**: Make interactive elements accessible on all devices by using appropriate ARIA attributes like `aria-expanded` and `aria-controls`.

5. **Media Query Construction**: Always use pixel values from the breakpoints object when constructing media queries rather than breakpoint names.

6. **Overflow Handling**: Be careful with `overflow-hidden` or `no-horizontal-overflow` classes when working with components that need to display dropdowns or tooltips. Interactive elements often need to overflow their containers.

7. **Z-Index Management**: Implement proper z-index hierarchy for interactive elements:
   - Navigation and dropdowns should have higher z-index values (e.g., z-[100] or higher)
   - Fixed/sticky headers should have high z-index values but lower than their dropdowns
   - Modal/dialog overlays should have the highest z-index values

## Implementation Examples

For detailed implementation examples, see [Usage Examples](./responsive-design/usage-examples.md).

## Technical Details

For technical specifications and implementation details, see [Technical Specification](./responsive-design/technical-spec.md).

## Related Features

- [Theme System](./theme-system.md)
- [Global Header](./header.md)
- [Global Footer](./footer.md)
