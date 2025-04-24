# Accessibility Audit Checklist

This document provides a comprehensive checklist for auditing the accessibility of UI components in the M-Yallow frontend application.

## General Component Checklist

For each component, verify the following:

### 1. ARIA Attributes

- [ ] Proper ARIA roles are applied (e.g., `button`, `menu`, `dialog`, etc.)
- [ ] Interactive elements have accessible names (text content, `aria-label`, or `aria-labelledby`)
- [ ] Components with state changes use appropriate ARIA state attributes:
  - [ ] `aria-expanded` for expandable elements
  - [ ] `aria-pressed` for toggle buttons
  - [ ] `aria-selected` for selectable items
  - [ ] `aria-current` for current items in navigation
- [ ] Related elements are properly associated:
  - [ ] Form fields have associated labels
  - [ ] Error messages use `aria-describedby`
  - [ ] Dialog titles use `aria-labelledby`
- [ ] Hidden elements use appropriate hiding technique:
  - [ ] `display: none` or `visibility: hidden` for content hidden from all users
  - [ ] `aria-hidden="true"` for decorative content that should be ignored by screen readers
  - [ ] `.sr-only` class for content only visible to screen readers

### 2. Keyboard Accessibility

- [ ] All interactive elements are focusable
- [ ] Focus order is logical and follows visual layout
- [ ] Focus state is visually apparent in both light and dark themes
- [ ] Enter/Space activates clickable elements
- [ ] Escape dismisses modal dialogs and popovers
- [ ] Arrow keys navigate within composite widgets (menus, tabs, etc.)
- [ ] No keyboard traps (except for modal dialogs)
- [ ] Skip links are provided for keyboard navigation

### 3. Color and Contrast

- [ ] All text meets WCAG AA contrast requirements:
  - [ ] Normal text (4.5:1 ratio)
  - [ ] Large text (3:1 ratio)
- [ ] UI controls and graphical objects have sufficient contrast (3:1 ratio)
- [ ] Focus indicators have sufficient contrast (3:1 ratio)
- [ ] Information is not conveyed by color alone
- [ ] Text on background images has adequate contrast

### 4. Screen Reader Compatibility

- [ ] Semantic HTML is used appropriately
- [ ] ARIA landmarks define page structure
- [ ] Heading hierarchy is logical (`h1` - `h6`)
- [ ] Images have alt text (or `aria-hidden="true"` if decorative)
- [ ] Form fields have proper labels
- [ ] Dynamic content changes are announced appropriately
- [ ] Custom components have proper ARIA roles and states

## Component-Specific Checklists

### Buttons

- [ ] Has accessible name (text content or `aria-label`)
- [ ] Uses native `<button>` element or has `role="button"`
- [ ] Icon-only buttons have `aria-label` or visually hidden text
- [ ] Toggle buttons have `aria-pressed` state
- [ ] Disabled buttons have `disabled` attribute or `aria-disabled="true"`
- [ ] Adequate touch target size (44x44px minimum)

### Dropdown Menus

- [ ] Trigger button has `aria-haspopup="menu"` and `aria-expanded`
- [ ] Menu has `role="menu"`
- [ ] Menu items have `role="menuitem"`
- [ ] Arrow key navigation between menu items
- [ ] Escape key closes the menu
- [ ] Focus is managed properly when opening/closing
- [ ] Selected items have proper indicators

### Form Controls

- [ ] Form elements use semantic HTML (`<input>`, `<select>`, etc.)
- [ ] All inputs have associated `<label>` elements
- [ ] Required fields are indicated both visually and with `aria-required="true"`
- [ ] Error validation messages use `aria-invalid` and `aria-describedby`
- [ ] Grouped inputs use `<fieldset>` and `<legend>`
- [ ] Custom form controls have proper ARIA attributes

### Modals and Dialogs

- [ ] Has `role="dialog"` and `aria-modal="true"`
- [ ] Has an accessible name via `aria-labelledby` or `aria-label`
- [ ] Focus is trapped within the dialog when open
- [ ] Focus returns to trigger element when closed
- [ ] Escape key closes the dialog
- [ ] Dialog can be closed via a clearly visible button
- [ ] Background content has `aria-hidden="true"` when dialog is open

### Tabs

- [ ] Container has `role="tablist"`
- [ ] Tab elements have `role="tab"` and `aria-selected`
- [ ] Tab panels have `role="tabpanel"` and `aria-labelledby`
- [ ] Arrow keys navigate between tabs
- [ ] Tab and panel are associated via `id` and `aria-controls`
- [ ] Only active tab is in tab order, others have `tabindex="-1"`

### Tooltips and Popovers

- [ ] Associated with trigger via `aria-describedby` or `aria-labelledby`
- [ ] Triggered via both hover and focus
- [ ] Remain visible when focus is on the tooltip content
- [ ] Can be dismissed via Escape key
- [ ] Don't obscure the trigger element

### Tables

- [ ] Uses semantic table elements (`<table>`, `<th>`, `<td>`, etc.)
- [ ] Column headers have `scope="col"`
- [ ] Row headers have `scope="row"`
- [ ] Complex tables use `id` and `headers` attributes
- [ ] Caption or labeled by heading with `aria-labelledby`
- [ ] Sortable columns indicate sort direction with `aria-sort`

### Navigation

- [ ] Uses `<nav>` element with `aria-label`
- [ ] Current page/section is indicated with `aria-current="page"`
- [ ] Dropdown navigation uses `aria-expanded`
- [ ] Mobile navigation toggle has accessible name and `aria-expanded`
- [ ] Keyboard navigation is supported

## Component-Specific Audit Template

Use this template to audit individual components:

### Component Name: [Component Name]

| Criteria | Status | Notes |
|----------|--------|-------|
| **ARIA Attributes** | | |
| Has proper role | ❌ ✅ | |
| Has accessible name | ❌ ✅ | |
| Uses appropriate state attributes | ❌ ✅ | |
| **Keyboard Accessibility** | | |
| Focusable with Tab key | ❌ ✅ | |
| Visible focus indicator | ❌ ✅ | |
| Operable with keyboard | ❌ ✅ | |
| **Color and Contrast** | | |
| Text meets contrast requirements | ❌ ✅ | |
| UI elements have sufficient contrast | ❌ ✅ | |
| **Screen Reader Compatibility** | | |
| Announced correctly | ❌ ✅ | |
| State changes are announced | ❌ ✅ | |
| **Component-Specific Requirements** | | |
| [Add specific requirements] | ❌ ✅ | |

## Prioritized Component List

Audit components in this order based on usage frequency and complexity:

1. Button
2. Input and Form Controls
3. Dropdown Menu
4. Dialog/Modal
5. Navigation Components
6. Tabs
7. Table
8. Checkbox and Radio
9. Switch
10. Accordion
11. Toast/Notification
12. Card
13. Pagination
14. Avatar
15. Badge

## Color Contrast Audit Matrix

Use this table to record contrast ratios for key color combinations:

| Foreground | Background | Contrast Ratio | Passes AA (4.5:1) | Notes |
|------------|------------|----------------|-------------------|-------|
| `--foreground` | `--background` | | | |
| `--primary-foreground` | `--primary` | | | |
| `--secondary-foreground` | `--secondary` | | | |
| `--muted-foreground` | `--muted` | | | |
| `--accent-foreground` | `--accent` | | | |

Repeat this table for dark theme as well.

## Testing Scenarios

The following scenarios should be tested for each component:

1. **Keyboard Navigation**
   - Tab through the UI following the visual order
   - Activate controls using Space and Enter keys
   - Navigate composite widgets with arrow keys
   - Dismiss dialogs with Escape key

2. **Screen Reader Testing**
   - Test with at least two screen readers (e.g., NVDA and VoiceOver)
   - Verify all content is properly announced
   - Check that state changes are announced
   - Ensure form controls are properly labeled

3. **Color and Contrast**
   - Test all color combinations with contrast checker
   - Verify focus states are visible in both themes
   - Check user interface with grayscale filter
   - Test with high contrast mode

## Acceptance Testing Checklist

Use this checklist to verify the acceptance criteria for FR-01.2.9:

### All Interactive Elements are Keyboard Accessible
- [ ] All buttons, links, and controls can be reached via Tab key
- [ ] Focus order follows a logical sequence
- [ ] All interactive elements can be activated with keyboard
- [ ] Composite widgets have appropriate keyboard navigation
- [ ] No keyboard traps exist (except for modals with proper focus management)
- [ ] Skip links are implemented for main content

### Color Contrast Meets WCAG AA Standards
- [ ] Normal text (smaller than 18pt) meets 4.5:1 contrast ratio
- [ ] Large text (18pt+ or 14pt+ bold) meets 3:1 contrast ratio
- [ ] UI components and graphical objects meet 3:1 contrast ratio
- [ ] Focus indicators meet 3:1 contrast ratio against adjacent colors
- [ ] Both light and dark themes meet contrast requirements

### Screen Readers Can Properly Navigate the UI
- [ ] Proper semantic HTML is used throughout
- [ ] ARIA roles and attributes are correctly implemented
- [ ] Form controls have appropriate labels
- [ ] Images have proper alt text
- [ ] Dynamic content changes are announced
- [ ] Custom widgets follow ARIA authoring practices

### Focus States are Clearly Visible
- [ ] All interactive elements have visible focus indicators
- [ ] Focus indicators have sufficient contrast
- [ ] Focus indicators are consistent across the UI
- [ ] Focus state is distinct from hover state
- [ ] Focus is visible in both light and dark themes
