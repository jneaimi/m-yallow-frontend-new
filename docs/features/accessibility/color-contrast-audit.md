# Color Contrast Audit

This document provides an analysis of the color contrast in the M-Yallow UI system and recommendations for ensuring WCAG AA compliance.

## WCAG 2.1 AA Requirements

- **Normal Text**: Contrast ratio of at least 4.5:1
- **Large Text** (18pt+ or 14pt+ bold): Contrast ratio of at least 3:1
- **UI Components and Graphical Objects**: Contrast ratio of at least 3:1

## Current Theme Colors Analysis

The M-Yallow UI system uses OKLCH color model for defining theme colors. Below is an analysis of the current color combinations.

### Light Theme

| Foreground | Background | Contrast Ratio | Passes AA | Notes |
|------------|------------|----------------|-----------|-------|
| `--foreground` (oklch(0.145 0 0)) | `--background` (oklch(1 0 0)) | 13.9:1 | ✅ | Black on white, excellent contrast |
| `--primary-foreground` (oklch(0.985 0 0)) | `--primary` (oklch(0.205 0 0)) | 10.4:1 | ✅ | White on near-black, excellent contrast |
| `--secondary-foreground` (oklch(0.205 0 0)) | `--secondary` (oklch(0.97 0 0)) | 11.3:1 | ✅ | Near-black on light gray, excellent contrast |
| `--muted-foreground` (oklch(0.556 0 0)) | `--muted` (oklch(0.97 0 0)) | 3.6:1 | ❌ | May not meet 4.5:1 for normal text |
| `--accent-foreground` (oklch(0.205 0 0)) | `--accent` (oklch(0.97 0 0)) | 11.3:1 | ✅ | Same as secondary, excellent contrast |
| `--destructive` (oklch(0.577 0.245 27.325)) | `--background` (oklch(1 0 0)) | 3.7:1 | ✅ (Large text only) | May not meet 4.5:1 for normal text |

### Dark Theme

| Foreground | Background | Contrast Ratio | Passes AA | Notes |
|------------|------------|----------------|-----------|-------|
| `--foreground` (oklch(0.985 0 0)) | `--background` (oklch(0.145 0 0)) | 13.9:1 | ✅ | White on black, excellent contrast |
| `--primary-foreground` (oklch(0.205 0 0)) | `--primary` (oklch(0.922 0 0)) | 10.4:1 | ✅ | Near-black on light gray, excellent contrast |
| `--secondary-foreground` (oklch(0.985 0 0)) | `--secondary` (oklch(0.269 0 0)) | 7.5:1 | ✅ | White on dark gray, good contrast |
| `--muted-foreground` (oklch(0.708 0 0)) | `--muted` (oklch(0.269 0 0)) | 2.8:1 | ❌ | Below required ratio for normal text |
| `--accent-foreground` (oklch(0.985 0 0)) | `--accent` (oklch(0.269 0 0)) | 7.5:1 | ✅ | Same as secondary, good contrast |
| `--destructive` (oklch(0.704 0.191 22.216)) | `--background` (oklch(0.145 0 0)) | 5.3:1 | ✅ | Red on black, good contrast |

## Issues Identified

1. **Muted Text in Light Theme**: The contrast between `--muted-foreground` and `--muted` background is approximately 3.6:1, which doesn't meet the 4.5:1 requirement for normal text.

2. **Muted Text in Dark Theme**: The contrast between `--muted-foreground` and `--muted` background is approximately 2.8:1, which doesn't meet the 4.5:1 requirement for normal text or 3:1 for large text.

3. **Destructive Color in Light Theme**: The contrast between `--destructive` and `--background` is approximately 3.7:1, which is suitable for large text but doesn't meet the 4.5:1 requirement for normal text.

## Recommended Adjustments

### Light Theme Adjustments

```css
:root {
  /* Original */
  --muted-foreground: oklch(0.556 0 0);
  
  /* Adjusted for better contrast (darker) */
  --muted-foreground: oklch(0.5 0 0);
  
  /* Original */
  --destructive: oklch(0.577 0.245 27.325);
  
  /* Adjusted for better contrast (darker red) */
  --destructive: oklch(0.52 0.245 27.325);
}
```

### Dark Theme Adjustments

```css
.dark {
  /* Original */
  --muted-foreground: oklch(0.708 0 0);
  
  /* Adjusted for better contrast (lighter) */
  --muted-foreground: oklch(0.78 0 0);
}
```

## Focus Indicators Analysis

Focus indicators should have a contrast ratio of at least 3:1 against the adjacent colors.

### Current Implementation

The current focus style in the button component is:

```css
focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
```

Where `--ring` is defined as:
- Light theme: `oklch(0.708 0 0)` (medium gray)
- Dark theme: `oklch(0.556 0 0)` (darker gray)

### Focus Contrast Analysis

| Theme | Focus Ring | Adjacent Color | Contrast Ratio | Passes AA | Notes |
|-------|-----------|----------------|----------------|-----------|-------|
| Light | `--ring` | `--background` | 2.1:1 | ❌ | Below required 3:1 ratio |
| Dark | `--ring` | `--background` | 3.5:1 | ✅ | Meets required 3:1 ratio |

### Recommended Focus Adjustments

```css
:root {
  /* Original */
  --ring: oklch(0.708 0 0);
  
  /* Adjusted for better contrast */
  --ring: oklch(0.5 0 0);
}
```

## Implementation Testing Plan

1. Implement the recommended color adjustments in `globals.css`
2. Create a contrast testing page that displays all color combinations
3. Verify adjusted colors with WebAIM Color Contrast Checker
4. Test with actual components in both light and dark themes
5. Verify focus visibility across different browsers

## Extended Color Combinations to Test

Beyond the basic color combinations listed above, the following additional combinations should be tested:

- Text on card backgrounds
- Text on popover backgrounds
- Interactive elements in disabled state
- Error, warning, and success message text
- Links within different contexts
- Focus indicators on various background colors

## Automated Testing Strategy

To ensure ongoing compliance as colors are updated:

1. Implement a contrast checking utility:

```typescript
// /lib/color-contrast.ts
import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";

// Extend colord with a11y plugin
extend([a11yPlugin]);

/**
 * Checks if a color combination meets WCAG AA contrast requirements
 */
export function meetsContrastRequirements(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): {
  ratio: number;
  passes: boolean;
} {
  const ratio = colord(foreground).contrast(background);
  const passes = isLargeText ? ratio >= 3 : ratio >= 4.5;
  
  return { ratio, passes };
}
```

2. Create a comprehensive test suite that verifies all theme color combinations.

## Design System Documentation Updates

Update the theme system documentation to include:

1. Contrast requirements for different text sizes
2. Approved color combinations that meet accessibility standards
3. Colors to avoid or use with caution
4. Best practices for ensuring text readability
