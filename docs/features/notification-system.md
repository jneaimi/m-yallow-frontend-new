# Notification System

## Overview

The notification system provides a global mechanism for displaying feedback to users. It uses the Sonner toast library for showing notifications that are visually distinct, accessible, and properly integrated with the application's theme system.

## Features

- **Four notification types** with distinct styling:
  - Success notifications (green)
  - Error notifications (red)
  - Warning notifications (amber/yellow)
  - Info notifications (blue)
- **Dismissible notifications** that users can manually close
- **Auto-dismissal** with customizable timeouts
- **Stacked notifications** that properly display when multiple are shown
- **Theme integration** for both light and dark modes
- **Action support** for notifications that require user interaction
- **Global availability** throughout the application

## Implementation

The notification system consists of:

1. A global `Toaster` component mounted in the root layout
2. Enhanced styling for different notification types
3. Utility functions for easily triggering notifications from anywhere in the app

## Usage

To display notifications, import the utility functions from `lib/notifications` and call them as needed:

```tsx
import { notifySuccess, notifyError, notifyWarning, notifyInfo } from "@/lib/notifications";

// Display a success notification
notifySuccess("Profile updated successfully");

// Display an error notification
notifyError("Failed to save changes");

// Display a warning notification
notifyWarning("Your session will expire in 5 minutes");

// Display an info notification
notifyInfo("New features are available");

// Display a notification with an action
notifyWithAction(
  "Unsaved changes", 
  "Save now", 
  () => saveChanges()
);
```

## Customization

Each notification function accepts an options object as a second parameter, allowing customization of:

- Duration (how long the notification is displayed)
- Position on screen
- Custom styling
- Dismiss behavior
- Additional actions

See the [Technical Specification](./notification-system-technical-spec.md) for details on all available options.

## Accessibility

The notification system is designed with accessibility in mind:

- Notifications have appropriate color contrast for all themes
- Dismissible via keyboard
- Compatible with screen readers
- Non-modal (don't block the UI)

## Related Documentation

- [Technical Specification](./notification-system-technical-spec.md)
- [Usage Examples](./notification-system-examples.md)
