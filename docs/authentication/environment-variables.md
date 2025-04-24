# Clerk Authentication Environment Variables

This document outlines the environment variables used for Clerk authentication in the M-Yallow frontend application.

## Required Environment Variables

| Variable Name | Description | Public? | Required |
|---------------|-------------|---------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | The public API key for Clerk authentication | Yes | Yes |
| `CLERK_SECRET_KEY` | The secret API key for Clerk authentication (server-side only) | No | Yes |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | The URL path for the sign-in page | Yes | Yes |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | The URL path for the sign-up page | Yes | Yes |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | The URL to redirect to after successful sign-in | Yes | Yes |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | The URL to redirect to after successful sign-up | Yes | Yes |

## Optional Environment Variables

| Variable Name | Description | Public? | Default |
|---------------|-------------|---------|---------|
| `NEXT_PUBLIC_CLERK_MIDDLEWARE_PREFIX` | Prefix for middleware control routes | Yes | `/api/auth` |
| `CLERK_API_URL` | Custom Clerk API URL (for enterprise) | No | Clerk SaaS API |
| `NEXT_PUBLIC_CLERK_DOMAIN` | Custom domain for Clerk | Yes | N/A |

## Format and Security

- All `NEXT_PUBLIC_` prefixed variables are exposed to the browser
- Secret keys should never be prefixed with `NEXT_PUBLIC_`
- Keys should be added to `.gitignore` to prevent accidental commits
- For production, use environment variable management in your deployment platform

## Setup Instructions

1. Create a Clerk application at [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Copy the API keys from your Clerk dashboard
3. Add the variables to `.env.local` for local development
4. Add the variables to your deployment platform for production

## Accessibility Considerations

When configuring Clerk environment variables, consider:

- Setting up appropriate redirect URLs that maintain context for screen reader users
- Ensuring authentication flows maintain keyboard focus
- Configuring localization options for multilingual support
