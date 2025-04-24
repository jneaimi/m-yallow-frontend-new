import { toast } from "sonner";

export type NotificationOptions = Parameters<typeof toast>[1];

/**
 * Show a default notification
 * @param message - The message to display
 * @param options - Additional toast options
 */
export function notify(message: string, options?: NotificationOptions) {
  return toast(message, options);
}

/**
 * Show a success notification (green)
 * @param message - The message to display
 * @param options - Additional toast options
 */
export function notifySuccess(message: string, options?: NotificationOptions) {
  return toast.success(message, { duration: 3000, ...options });
}

/**
 * Show an error notification (red)
 * @param message - The message to display
 * @param options - Additional toast options
 */
export function notifyError(message: string, options?: NotificationOptions) {
  return toast.error(message, { duration: 5000, ...options });
}

/**
 * Show a warning notification (yellow/amber)
 * @param message - The message to display
 * @param options - Additional toast options
 */
export function notifyWarning(message: string, options?: NotificationOptions) {
  // Use Sonner's built-in warning toast
  return toast.warning(message, {
    duration: 4000,
    ...options,
  });
}

/**
 * Show an info notification (blue)
 * @param message - The message to display
 * @param options - Additional toast options
 */
export function notifyInfo(message: string, options?: NotificationOptions) {
  return toast(message, {
    className: "info",
    duration: 4000,
    ...options,
  });
}

/**
 * Create a notification with a custom action
 * @param message - The message to display
 * @param actionLabel - Text for the action button
 * @param onAction - Function to call when action is clicked
 * @param options - Additional toast options
 */
export function notifyWithAction(
  message: string,
  actionLabel: string,
  onAction: () => void,
  options?: NotificationOptions
) {
  return toast(message, {
    action: {
      label: actionLabel,
      onClick: onAction,
    },
    ...options,
  });
}
