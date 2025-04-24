# Clerk Middleware Testing Plan

This document outlines the testing plan for the Clerk Middleware implementation (FR-01.3.2) in the M-Yallow frontend application.

## Testing Objectives

1. Verify that the middleware correctly identifies public vs. protected routes
2. Confirm that unauthenticated users are redirected when accessing protected routes
3. Validate that JWT tokens are correctly generated and validated for API routes
4. Ensure accessibility features work correctly during authentication redirects

## Test Environments

- **Development**: Local development environment
- **Staging**: Pre-production environment with test Clerk instance
- **Production**: Production environment with production Clerk instance

## Test Cases

### 1. Public Route Access

#### TC-1.1: Access to Public Pages

**Description**: Verify that unauthenticated users can access public pages

**Steps**:
1. Sign out or use an incognito browser window
2. Navigate to the following public routes:
   - Homepage (`/`)
   - About page (`/about`)
   - Contact page (`/contact`)
   - Pricing page (`/pricing`)

**Expected Results**:
- All public pages should be accessible without authentication
- No redirects to sign-in page should occur

#### TC-1.2: Access to Authentication Pages

**Description**: Verify that unauthenticated users can access authentication pages

**Steps**:
1. Sign out or use an incognito browser window
2. Navigate to the following authentication routes:
   - Sign-in page (`/sign-in`)
   - Sign-up page (`/sign-up`)
   - Forgot password page (`/forgot-password`)

**Expected Results**:
- All authentication pages should be accessible without authentication
- No redirects should occur

### 2. Protected Route Access

#### TC-2.1: Access to Protected Pages

**Description**: Verify that unauthenticated users are redirected when accessing protected pages

**Steps**:
1. Sign out or use an incognito browser window
2. Navigate to the following protected routes:
   - Dashboard (`/dashboard`)
   - Profile page (`/profile`)
   - Settings page (`/settings`)

**Expected Results**:
- User should be redirected to the sign-in page
- The redirect URL should include the original URL as a parameter (`redirect_url`)
- The redirect URL should include accessibility parameters (`manage_focus` and `announce`)

#### TC-2.2: Post-Authentication Redirect

**Description**: Verify that users are redirected to the original URL after authentication

**Steps**:
1. Sign out or use an incognito browser window
2. Navigate to a protected route (e.g., `/dashboard`)
3. After being redirected to the sign-in page, sign in with valid credentials

**Expected Results**:
- After successful authentication, user should be redirected to the original URL
- The original URL should be preserved during the authentication flow

### 3. API Authentication

#### TC-3.1: API Access Without Authentication

**Description**: Verify that unauthenticated API requests are rejected

**Steps**:
1. Use a tool like Postman or curl to make a request to a protected API endpoint without an Authorization header

**Expected Results**:
- Request should be rejected with a 401 Unauthorized status code
- Response should include a JSON error message with "Authentication required"

#### TC-3.2: API Access With Invalid Token

**Description**: Verify that API requests with invalid tokens are rejected

**Steps**:
1. Use a tool like Postman or curl to make a request to a protected API endpoint with an invalid or expired token

**Expected Results**:
- Request should be rejected with a 401 Unauthorized status code
- Response should include a JSON error message with "Your session has expired or is invalid"

#### TC-3.3: API Access With Valid Token

**Description**: Verify that authenticated API requests are allowed

**Steps**:
1. Sign in to the application
2. Extract the JWT token from the browser (using developer tools)
3. Use a tool like Postman or curl to make a request to a protected API endpoint with the valid token

**Expected Results**:
- Request should be successful
- API should return the expected response

### 4. Accessibility Features

#### TC-4.1: Focus Management After Redirect

**Description**: Verify that focus is properly managed after authentication redirects

**Steps**:
1. Sign out or use an incognito browser window
2. Navigate to a protected route (e.g., `/dashboard`)
3. After being redirected to the sign-in page, check where the focus is placed

**Expected Results**:
- Focus should be placed on the email input field
- Focus should be visible and meet contrast requirements

#### TC-4.2: Screen Reader Announcements

**Description**: Verify that authentication redirects are announced to screen readers

**Steps**:
1. Enable a screen reader (e.g., NVDA, VoiceOver, or JAWS)
2. Sign out or use an incognito browser window
3. Navigate to a protected route (e.g., `/dashboard`)

**Expected Results**:
- Screen reader should announce the authentication requirement
- Announcement should be clear and informative

## Testing Tools

- **Manual Testing**: Browser-based testing for user flows
- **Automated Testing**: Jest and Testing Library for component testing
- **API Testing**: Postman or curl for API endpoint testing
- **Accessibility Testing**: Screen readers (NVDA, VoiceOver, JAWS) and keyboard navigation

## Test Data

### User Accounts

- **Test User**: `test@example.com` / `password123`
- **Admin User**: `admin@example.com` / `adminpass123`

### API Endpoints

- **Protected API**: `/api/user/profile`
- **Public API**: `/api/public/status`

## Test Execution

### Pre-requisites

1. Ensure Clerk is properly configured in the environment
2. Verify that all required environment variables are set
3. Ensure the application is running and accessible

### Test Execution Steps

1. Execute all test cases in the development environment
2. Fix any issues found during testing
3. Execute all test cases in the staging environment
4. Document any differences between environments
5. Prepare for production deployment

## Test Reporting

### Test Results Template

```
Test Case ID: [ID]
Test Case Name: [Name]
Test Date: [Date]
Tester: [Name]
Environment: [Dev/Staging/Prod]
Status: [Pass/Fail]
Notes: [Any observations or issues]
```

### Issue Reporting Template

```
Issue ID: [ID]
Related Test Case: [ID]
Description: [Description of the issue]
Severity: [Critical/High/Medium/Low]
Steps to Reproduce: [Steps]
Expected Result: [Expected]
Actual Result: [Actual]
Screenshots/Logs: [Attachments]
```

## Conclusion

This testing plan provides a comprehensive approach to validating the Clerk Middleware implementation. By executing these test cases, we can ensure that the middleware correctly protects routes, handles authentication redirects, and provides accessible user experiences.

The testing should be performed in all environments to ensure consistent behavior across the development lifecycle. Any issues found during testing should be documented and addressed before moving to the next environment.
