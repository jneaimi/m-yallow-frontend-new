# Authentication Accessibility Guidelines

This document outlines the accessibility requirements and implementation guidelines for authentication flows in the M-Yallow application.

## Accessibility Requirements

All authentication flows must adhere to WCAG 2.1 AA standards, with special attention to the following aspects:

1. **Keyboard Accessibility**:
   - All interactive elements must be keyboard accessible
   - Focus order must follow a logical sequence
   - Focus must be visible and meet contrast requirements

2. **Screen Reader Compatibility**:
   - All forms must have proper labels and descriptions
   - Error messages must be properly associated with form fields
   - Authentication state changes must be announced

3. **Color and Contrast**:
   - All text must meet 4.5:1 contrast ratio (3:1 for large text)
   - UI components and focus indicators must meet 3:1 contrast ratio
   - Error states must be conveyed by more than just color

4. **Cognitive Accessibility**:
   - Instructions must be clear and concise
   - Error messages must be helpful and specific
   - Success confirmation must be clearly communicated

## Implementation Guidelines

### Forms and Inputs

1. **Form Structure**:
   ```tsx
   <form
     id="sign-in-form"
     aria-labelledby="sign-in-heading"
     aria-describedby="sign-in-description"
     role="form"
   >
     <h2 id="sign-in-heading">Sign In</h2>
     <p id="sign-in-description">Enter your credentials to access your account</p>
     {/* Form fields */}
   </form>
   ```

2. **Input Fields**:
   ```tsx
   <div>
     <label htmlFor="email">Email Address</label>
     <input
       id="email"
       type="email"
       aria-required="true"
       aria-invalid={hasError ? "true" : "false"}
       aria-describedby={hasError ? "email-error" : undefined}
     />
     {hasError && (
       <div id="email-error" role="alert">
         {errorMessage}
       </div>
     )}
   </div>
   ```

3. **Password Fields**:
   ```tsx
   <div>
     <label htmlFor="password">Password</label>
     <div className="flex items-center">
       <input
         id="password"
         type={showPassword ? "text" : "password"}
         aria-required="true"
         aria-invalid={hasError ? "true" : "false"}
         aria-describedby={hasError ? "password-error password-requirements" : "password-requirements"}
       />
       <button
         type="button"
         onClick={togglePassword}
         aria-label={showPassword ? "Hide password" : "Show password"}
         aria-pressed={showPassword}
       >
         {showPassword ? <EyeOffIcon /> : <EyeIcon />}
       </button>
     </div>
     <p id="password-requirements" className="text-sm text-muted-foreground">
       Password must be at least 8 characters
     </p>
     {hasError && (
       <div id="password-error" role="alert">
         {errorMessage}
       </div>
     )}
   </div>
   ```

### Error Handling

1. **Form Level Errors**:
   ```tsx
   {formError && (
     <div 
       role="alert" 
       className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-md"
     >
       {formError}
     </div>
   )}
   ```

2. **Field Level Errors**:
   ```tsx
   {fieldError && (
     <div 
       id={`${fieldId}-error`} 
       role="alert" 
       aria-live="assertive"
       className="text-sm text-destructive mt-1"
     >
       {fieldError}
     </div>
   )}
   ```

3. **Programmatic Error Announcement**:
   ```tsx
   // When an error occurs
   const announceError = (message) => {
     const announcer = document.getElementById('a11y-announcer-assertive');
     if (announcer) {
       announcer.textContent = message;
     }
   };
   ```

### Focus Management

1. **Focus After Form Submission**:
   ```tsx
   const handleSubmit = async (e) => {
     e.preventDefault();
     // Process form...
     
     if (error) {
       // Focus the first field with an error
       const firstErrorField = document.querySelector('[aria-invalid="true"]');
       if (firstErrorField) {
         (firstErrorField as HTMLElement).focus();
       }
     } else {
       // Success
       // Focus the success message or next action
       const successMessage = document.getElementById('success-message');
       if (successMessage) {
         successMessage.focus();
       }
     }
   };
   ```

2. **Skip Links for Authentication Flows**:
   ```tsx
   // Add at the top of authentication pages
   <a 
     href="#main-content" 
     className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:border focus:border-ring"
   >
     Skip to main content
   </a>
   ```

### Authentication State Announcements

1. **Sign-In Success**:
   ```tsx
   // After successful sign-in
   const announceSuccess = () => {
     const announcer = document.getElementById('auth-state-announcer');
     if (announcer) {
       announcer.textContent = 'Sign in successful. Welcome back.';
     }
   };
   ```

2. **Sign-Out Success**:
   ```tsx
   // After sign-out
   const announceSignOut = () => {
     const announcer = document.getElementById('auth-state-announcer');
     if (announcer) {
       announcer.textContent = 'You have been signed out successfully.';
     }
   };
   ```

3. **Authentication State Changes**:
   Use the AuthStateAnnouncer component which is already included in the root layout.

### Implementation Examples

1. **Accessible Sign-In Form**:
   ```tsx
   'use client';

   import { useState } from 'react';
   import { useSignIn } from '@clerk/nextjs';
   import { getAuthFormProps, getAuthErrorProps } from '@/lib/accessibility/auth';

   export function SignInForm() {
     const { signIn, isLoaded, setActive } = useSignIn();
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [error, setError] = useState('');
     const [formError, setFormError] = useState('');
     const [loading, setLoading] = useState(false);
     
     const formId = 'sign-in-form';
     const emailId = 'sign-in-email';
     const passwordId = 'sign-in-password';
     
     const handleSubmit = async (e) => {
       e.preventDefault();
       setLoading(true);
       setFormError('');
       
       try {
         const result = await signIn.create({
           identifier: email,
           password,
         });
         
         if (result.status === "complete") {
           await setActive({ session: result.createdSessionId });
           
           // Announce success to screen readers
           const announcer = document.getElementById('auth-state-announcer');
           if (announcer) {
             announcer.textContent = 'Sign in successful. Welcome back.';
           }
         } else {
           // This shouldn't happen, but handle it just in case
           setFormError('Sign in failed. Please try again.');
         }
       } catch (err) {
         setFormError('Invalid email or password. Please try again.');
         
         // Announce error to screen readers
         const announcer = document.getElementById('a11y-announcer-assertive');
         if (announcer) {
           announcer.textContent = 'Sign in failed. ' + (err.message || 'Please check your credentials and try again.');
         }
         
         // Focus the first field
         document.getElementById(emailId)?.focus();
       } finally {
         setLoading(false);
       }
     };
     
     return (
       <form 
         {...getAuthFormProps(formId)}
         onSubmit={handleSubmit}
         className="space-y-4"
       >
         <h2 id={`${formId}-heading`} className="text-2xl font-bold">Sign In</h2>
         <p id={`${formId}-description`} className="text-muted-foreground">
           Enter your credentials to access your account
         </p>
         
         {formError && (
           <div 
             role="alert" 
             className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-md"
           >
             {formError}
           </div>
         )}
         
         <div className="space-y-2">
           <label htmlFor={emailId} className="block text-sm font-medium">
             Email Address
           </label>
           <input
             id={emailId}
             type="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
             aria-required="true"
             aria-invalid={!!error}
             aria-describedby={error ? `${emailId}-error` : undefined}
             className="w-full p-2 border rounded-md"
           />
           {error && (
             <div {...getAuthErrorProps(emailId)} className="text-sm text-destructive mt-1">
               {error}
             </div>
           )}
         </div>
         
         <div className="space-y-2">
           <label htmlFor={passwordId} className="block text-sm font-medium">
             Password
           </label>
           <input
             id={passwordId}
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
             aria-required="true"
             className="w-full p-2 border rounded-md"
           />
         </div>
         
         <button 
           type="submit" 
           disabled={loading || !isLoaded}
           aria-busy={loading}
           className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md"
         >
           {loading ? 'Signing In...' : 'Sign In'}
         </button>
         
         <div className="text-sm text-center">
           <a href="/sign-up" className="text-primary hover:underline">
             Don't have an account? Sign up
           </a>
         </div>
       </form>
     );
   }
   ```

2. **Accessible Sign-Out Button**:
   ```tsx
   'use client';
   
   import { useClerk } from '@clerk/nextjs';
   import { announceAuthStateChange } from '@/lib/accessibility/auth';
   
   export function SignOutButton() {
     const { signOut } = useClerk();
     const [loading, setLoading] = useState(false);
     
     const handleSignOut = async () => {
       setLoading(true);
       
       try {
         await signOut();
         
         // Announce sign out to screen readers
         announceAuthStateChange('You have been signed out successfully.');
       } catch (error) {
         console.error('Sign out failed', error);
       } finally {
         setLoading(false);
       }
     };
     
     return (
       <button
         onClick={handleSignOut}
         disabled={loading}
         aria-busy={loading}
         className="text-sm font-medium text-destructive hover:text-destructive/90"
       >
         {loading ? 'Signing Out...' : 'Sign Out'}
       </button>
     );
   }
   ```

## Testing Checklist

### Keyboard Accessibility Testing

- [ ] Tab through authentication forms in a logical sequence
- [ ] Activate buttons with Enter key
- [ ] Close error messages with Escape key
- [ ] Ensure focus is trapped within modals
- [ ] Verify all interactive elements have visible focus indicators

### Screen Reader Testing

- [ ] Test forms with NVDA, VoiceOver, or JAWS
- [ ] Verify form labels are properly announced
- [ ] Ensure error messages are announced when they appear
- [ ] Check that authentication state changes are announced
- [ ] Verify success confirmations are announced

### ARIA Implementation Testing

- [ ] Verify forms have proper aria-labelledby and aria-describedby
- [ ] Check that aria-invalid is set correctly for form fields
- [ ] Ensure error messages have role="alert"
- [ ] Verify loading states have aria-busy
- [ ] Check that buttons have descriptive aria-label when needed

## Resources

- [WCAG 2.1 Form Accessibility](https://www.w3.org/WAI/standards-guidelines/wcag/glance/)
- [WAI-ARIA Authoring Practices for Forms](https://www.w3.org/WAI/ARIA/apg/patterns/forms/)
- [WebAIM Screen Reader Testing Guide](https://webaim.org/articles/screenreader_testing/)
