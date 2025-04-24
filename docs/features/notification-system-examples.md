# Notification System Usage Examples

This document provides practical examples of how to use the notification system in different scenarios.

## Basic Usage Examples

### Displaying Different Notification Types

```tsx
import { 
  notify, 
  notifySuccess, 
  notifyError, 
  notifyWarning, 
  notifyInfo 
} from "@/lib/notifications";

// Default notification
notify("This is a default notification");

// Success notification
notifySuccess("Operation completed successfully");

// Error notification
notifyError("An error occurred while processing your request");

// Warning notification
notifyWarning("Your session will expire in 5 minutes");

// Info notification
notifyInfo("New features have been added to the application");
```

### Customizing Notification Duration

```tsx
import { notifySuccess, notifyError } from "@/lib/notifications";

// Short success notification (1.5 seconds)
notifySuccess("Item saved", { duration: 1500 });

// Long-lasting error notification (10 seconds)
notifyError("Critical system error", { duration: 10000 });
```

## Advanced Usage Examples

### Notifications with Actions

```tsx
import { notifyWithAction } from "@/lib/notifications";

// Notification with an undo action
notifyWithAction(
  "Item deleted", 
  "Undo", 
  () => {
    // Code to restore the deleted item
    console.log("Undo delete action");
    notifySuccess("Item restored");
  }
);

// Notification with a view action
notifyWithAction(
  "You have a new message", 
  "View", 
  () => {
    // Navigate to messages
    router.push("/messages");
  },
  { duration: 8000 } // Custom duration
);
```

### Notifications with Description

```tsx
import { notifyError } from "@/lib/notifications";

// Error notification with additional details
notifyError("Failed to update profile", {
  description: "The server returned a 500 error. Please try again later or contact support if the problem persists."
});
```

### Custom Positioning

```tsx
import { notifyInfo } from "@/lib/notifications";

// Display a notification at the bottom center
notifyInfo("Page refreshed with latest data", {
  position: "bottom-center"
});
```

## Real-World Use Cases

### Form Submission Feedback

```tsx
import { notifySuccess, notifyError } from "@/lib/notifications";

const handleSubmit = async (event) => {
  event.preventDefault();
  
  try {
    // Form submission logic
    await submitFormData(formData);
    
    // Show success notification
    notifySuccess("Form submitted successfully");
    
    // Reset form
    resetForm();
  } catch (error) {
    // Show error notification with details
    notifyError("Failed to submit form", {
      description: error.message || "Please try again later"
    });
  }
};
```

### Authentication Feedback

```tsx
import { notifySuccess, notifyError, notifyWarning } from "@/lib/notifications";

// Login success
const handleLoginSuccess = () => {
  notifySuccess("Welcome back!");
  router.push("/dashboard");
};

// Login error
const handleLoginError = (error) => {
  notifyError("Login failed", {
    description: error.message || "Please check your credentials and try again"
  });
};

// Session expiring soon
const handleSessionExpiringSoon = (timeLeftInMinutes) => {
  notifyWarning(`Your session will expire in ${timeLeftInMinutes} minutes`, {
    description: "Please save your work and refresh the page to continue",
    duration: 10000 // Show for 10 seconds
  });
};
```

### API Request Feedback

```tsx
import { notifyInfo, notifySuccess, notifyError } from "@/lib/notifications";

const fetchData = async () => {
  // Show loading notification
  const loadingToast = notifyInfo("Loading data...", {
    duration: Infinity // Don't auto-dismiss
  });
  
  try {
    // API request
    const data = await api.fetchData();
    
    // Dismiss loading notification
    toast.dismiss(loadingToast);
    
    // Show success notification
    notifySuccess("Data loaded successfully");
    
    return data;
  } catch (error) {
    // Dismiss loading notification
    toast.dismiss(loadingToast);
    
    // Show error notification
    notifyError("Failed to load data", {
      description: error.message || "Please try again later"
    });
    
    return null;
  }
};
```

### Feature Announcement

```tsx
import { notifyInfo, notifyWithAction } from "@/lib/notifications";

// Simple announcement
const announceNewFeature = () => {
  notifyInfo("New feature: Dark Mode is now available!", {
    description: "Try it out by clicking the theme toggle in the header",
    duration: 8000
  });
};

// Announcement with action
const announceWithTutorial = () => {
  notifyWithAction(
    "New dashboard features available", 
    "View tutorial", 
    () => {
      router.push("/tutorial/dashboard");
    },
    {
      description: "We've added new visualization options and filtering capabilities",
      duration: 10000
    }
  );
};
```

## Accessibility Examples

### Screen Reader Friendly Notifications

```tsx
import { notifyInfo } from "@/lib/notifications";

// Using aria-label for better screen reader experience
notifyInfo("File uploaded", {
  ariaLabel: "File upload complete notification",
  description: "Your file has been uploaded successfully and is now being processed"
});
```

These examples demonstrate the versatility of the notification system and how it can be used in various parts of your application to provide clear and consistent feedback to users.
