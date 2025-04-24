# Clerk Authentication Testing Procedures

This document outlines the testing procedures for verifying the Clerk authentication implementation in the M-Yallow frontend application.

## Environment Setup Testing

### Environment Variables Verification

1. **Test Environment Variable Loading**
   - Start the application in development mode
   - Verify that the application loads without environment variable errors
   - Check that the Clerk dashboard shows active connections from your application

2. **Test Missing Environment Variables**
   - Temporarily remove one environment variable at a time
   - Verify that the application provides appropriate error messages
   - Restore environment variables after testing

## ClerkProvider Testing

### Provider Integration Verification

1. **Verify ClerkProvider Wrapping**
   - Inspect the application structure using React DevTools
   - Confirm ClerkProvider is present in the component tree
   - Verify that it wraps the entire application

2. **Test Theme Integration**
   - Test authentication components in both light and dark themes
   - Verify that all components maintain proper contrast in both themes
   - Confirm that focus states are visible in both themes

## Authentication Utilities Testing

### Server-Side Utilities Testing

1. **Test getAuthStatus Function**
   - Create a test page that uses getAuthStatus
   - Verify it returns the correct authentication state when unauthenticated
   - Test with an authenticated user to verify it returns the correct state

2. **Test requireAuth Function**
   - Create a protected test page that uses requireAuth
   - Access the page while unauthenticated
   - Verify redirection to the sign-in page
   - Test with an authenticated user to verify access is granted

3. **Test getUserData Function**
   - Create a test page that displays user data using getUserData
   - Verify it returns null when unauthenticated
   - Test with an authenticated user to verify it returns correct user data

### Client-Side Utilities Testing

1. **Test useAuthStatus Hook**
   - Create a test component that uses useAuthStatus
   - Verify it correctly reflects authentication state changes
   - Test loading states during authentication

2. **Test useUserData Hook**
   - Create a test component that displays user data using useUserData
   - Verify it correctly reflects user data changes
   - Test loading states during data fetching

3. **Test useAuthNavigation Hook**
   - Create a test component with navigation functions
   - Verify navigateIfAuthenticated redirects correctly
   - Verify navigateIfUnauthenticated redirects correctly

## Accessibility Testing

### Keyboard Navigation Testing

1. **Tab Order Verification**
   - Start from the page URL
   - Tab through all interactive elements
   - Verify focus order follows a logical sequence
   - Ensure focus is trapped within authentication modals

2. **Keyboard Activation Testing**
   - Test all buttons and links with Enter key
   - Verify form submission with Enter key
   - Test dismissal of modals with Escape key
   - Verify dropdown navigation with arrow keys

### Screen Reader Testing

1. **NVDA Testing (Windows)**
   - Navigate through authentication forms
   - Verify labels and descriptions are announced
   - Test error message announcements
   - Verify authentication state changes are announced

2. **VoiceOver Testing (macOS)**
   - Navigate through authentication forms
   - Verify labels and descriptions are announced
   - Test error message announcements
   - Verify authentication state changes are announced

3. **Narrator Testing (Windows)**
   - Navigate through authentication forms
   - Verify labels and descriptions are announced
   - Test error message announcements
   - Verify authentication state changes are announced

### Color Contrast Testing

1. **Automated Contrast Testing**
   - Use automated tools (e.g., Axe, Wave) to check contrast
   - Verify all text meets 4.5:1 contrast ratio (3:1 for large text)
   - Test UI components meet 3:1 contrast ratio

2. **Manual Contrast Verification**
   - Inspect authentication forms in both themes
   - Verify focus indicators are visible against all backgrounds
   - Test contrast under different screen brightness settings

## Integration Testing

### Authentication Flow Testing

1. **Sign-In Flow Testing**
   - Test email/password sign-in with valid credentials
   - Test with invalid credentials
   - Verify error messages are displayed and announced
   - Test focus management after submission

2. **Sign-Up Flow Testing**
   - Test user registration with valid information
   - Test with invalid information
   - Verify error messages are displayed and announced
   - Test redirect after successful registration

3. **Sign-Out Flow Testing**
   - Test sign-out functionality
   - Verify proper redirection after sign-out
   - Test authentication state is updated correctly
   - Verify announcements to screen readers

### Protected Routes Testing

1. **Middleware Testing**
   - Test accessing protected routes while unauthenticated
   - Verify redirection to sign-in page
   - Test accessing public routes
   - Verify authentication persistence across page navigation

2. **Role-Based Access Testing**
   - Test accessing admin-only routes with non-admin user
   - Verify proper error or redirection
   - Test with admin user to verify access is granted

## Automated Testing Setup

### Unit Tests

```typescript
// Example unit test for server auth utilities
import { getAuthStatus } from '@/lib/auth';
import { auth } from '@clerk/nextjs/server';

// Mock Clerk's auth function
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn()
}));

describe('getAuthStatus', () => {
  it('should return isAuthenticated false when no userId', () => {
    (auth as jest.Mock).mockReturnValue({ userId: null });
    
    const result = getAuthStatus();
    
    expect(result).toEqual({
      isAuthenticated: false,
      userId: null
    });
  });
  
  it('should return isAuthenticated true when userId exists', () => {
    (auth as jest.Mock).mockReturnValue({ userId: 'user_123' });
    
    const result = getAuthStatus();
    
    expect(result).toEqual({
      isAuthenticated: true,
      userId: 'user_123'
    });
  });
});
```

### Integration Tests

```typescript
// Example integration test using Playwright
import { test, expect } from '@playwright/test';

test('unauthenticated user is redirected to sign-in page', async ({ page }) => {
  // Try to access a protected page
  await page.goto('/dashboard');
  
  // Should be redirected to sign-in
  expect(page.url()).toContain('/sign-in');
});

test('authentication state is announced to screen readers', async ({ page }) => {
  // Go to sign-in page
  await page.goto('/sign-in');
  
  // Fill in credentials
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Check for live region with announcement
  const liveRegion = await page.waitForSelector('[aria-live="polite"]');
  const announcement = await liveRegion.textContent();
  
  expect(announcement).toContain('Sign in successful');
});
```

### Accessibility Tests

```typescript
// Example accessibility test using axe
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test('sign-in page has no accessibility violations', async ({ page }) => {
  // Go to sign-in page
  await page.goto('/sign-in');
  
  // Inject axe-core
  await injectAxe(page);
  
  // Check for accessibility violations
  await checkA11y(page, '#sign-in-form', {
    axeOptions: {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    },
  });
});
```

## Manual Testing Checklist

### Visual Testing

- [ ] Verify all authentication forms display correctly on desktop
- [ ] Test responsive design on tablet and mobile devices
- [ ] Verify error states are visually distinct
- [ ] Test loading states and spinners
- [ ] Verify consistent styling across all authentication pages

### Error Handling Testing

- [ ] Test with invalid email formats
- [ ] Test with invalid password formats
- [ ] Test with non-existent accounts
- [ ] Test with incorrect passwords
- [ ] Verify appropriate error messages

### Edge Case Testing

- [ ] Test with very long email addresses and names
- [ ] Test with slow network connections
- [ ] Test session timeouts and refreshes
- [ ] Test with browser cookies disabled
- [ ] Test with JavaScript disabled (graceful degradation)

## Test Reporting

After conducting tests, prepare a test report including:

1. Test environment details
2. Test cases executed
3. Pass/fail results
4. Screenshots of any issues
5. Browser and device information
6. Accessibility violations found
7. Recommended fixes

## Continuous Integration Setup

For automated testing in CI:

1. Add environment variables for testing:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=test_key
   CLERK_SECRET_KEY=test_secret
   ```

2. Configure test script in package.json:
   ```json
   "scripts": {
     "test:auth": "jest --testPathPattern=lib/auth"
   }
   ```

3. Add authentication tests to CI workflow:
   ```yaml
   - name: Test Authentication
     run: npm run test:auth
   ```

## Monitoring Plan

After deployment, monitor authentication functionality:

1. Set up error tracking for authentication failures
2. Monitor sign-in success rates
3. Track authentication performance metrics
4. Set up alerts for unusual authentication patterns
5. Regularly review accessibility compliance
