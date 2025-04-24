# Global Header Implementation Guide

## Overview

The Global Header component in M-Yallow provides a consistent navigation structure across all pages of the application. This document outlines the implementation details, key components, and usage guidelines.

## Implementation Details

### Key Components

1. **Header Component** (`/components/layout/header.tsx`)
   - Main container for the global header
   - Implements responsive design for all device sizes
   - Manages mobile menu state and interactions

2. **Navigation Structure**
   - Desktop navigation using NavigationMenu from RadixUI
   - Mobile navigation with collapsible menu
   - Dropdown support for nested navigation items

3. **Authentication Controls**
   - Displays login/register buttons when user is not authenticated
   - Shows user profile dropdown when authenticated
   - Integrates with Clerk authentication

4. **Theme Toggle**
   - Integrates the existing ThemeToggle component
   - Allows users to switch between light, dark, and system themes

### CSS Implementation

The header uses Tailwind CSS with responsive utilities. Key design aspects:

1. **Container Styling**
   - Sticky positioning for persistent visibility
   - Backdrop blur for modern translucent effect
   - Border for visual separation

2. **Responsive Breakpoints**
   - Mobile-first approach with stacked navigation on small screens
   - Horizontal navigation bar on medium screens and above
   - Conditional rendering of elements based on screen size

## Usage Guidelines

### Basic Integration

The header is automatically included in the root layout and will appear on all pages:

```tsx
// /app/layout.tsx
import { Header } from "@/components/layout/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Customizing Navigation Items

To modify the navigation structure, edit the `navItems` array in the Header component:

```tsx
// Example of adding a new navigation item
const navItems = [
  // Existing items...
  {
    title: "New Section",
    href: "/new-section",
    children: [
      {
        title: "Subpage",
        href: "/new-section/subpage",
        description: "Description of this subpage"
      }
    ]
  }
];
```

### Authentication Integration

The header is designed to work with Clerk authentication. When fully implemented, it will automatically display the appropriate controls based on the user's authentication state.

## Configuration Options

### Logo Customization

To replace the logo, modify the logo section in the Header component:

```tsx
<Link href="/" className="flex items-center space-x-2">
  {/* Replace with your custom logo */}
  <Image src="/your-logo.svg" alt="Logo" width={32} height={32} />
  <span className="font-bold text-lg">Your Brand</span>
</Link>
```

### Navigation Structure

The navigation structure supports:
- Simple links (title and href)
- Dropdown menus (title, href, and children array)
- Descriptions for dropdown items

## Responsive Behavior

The header implements the following responsive behaviors:

1. **Mobile View** (< 768px)
   - Logo and brand name
   - Collapsed menu toggled by hamburger icon
   - Full-width expandable navigation
   - Stacked navigation items and auth controls

2. **Tablet View** (≥ 768px)
   - Horizontal navigation menu
   - Dropdown menus for sections with children
   - Authentication controls visible in the header

3. **Desktop View** (≥ 1024px)
   - Same as tablet with more spacing
   - Expanded navigation item descriptions

## Best Practices

1. **Keep Navigation Focused**: Limit to 4-6 main navigation items for best usability
2. **Meaningful Grouping**: Group related items in dropdown menus
3. **Clear Labels**: Use descriptive titles for navigation items
4. **Consistent Styling**: Maintain visual consistency with the rest of the application
5. **Active States**: Indicate the current page/section to aid navigation

## Troubleshooting

### Common Issues

1. **Mobile Menu Not Toggling**:
   - Check state management in the Header component
   - Verify event handlers are properly connected

2. **Navigation Items Not Appearing**:
   - Ensure the navItems array is properly formatted
   - Check for errors in the rendering logic

3. **Authentication Not Updating**:
   - Verify integration with Clerk or authentication provider
   - Check that authentication state is being passed correctly

## Accessibility

The header implements several accessibility features:

1. **Keyboard Navigation**: All interactive elements are keyboard accessible
2. **Screen Reader Support**: Appropriate ARIA labels and roles
3. **Focus Management**: Proper focus handling for dropdown menus
4. **Color Contrast**: Meets WCAG standards in both light and dark themes

## Future Enhancements

Planned improvements for the header include:

1. Full integration with authentication system
2. Breadcrumb navigation for deeper page hierarchies
3. Search functionality integration
4. Notification center
5. Dynamic navigation based on user roles and permissions
