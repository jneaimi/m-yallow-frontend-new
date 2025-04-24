"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <div role="status" aria-live="polite">
      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        style={
          {
            "--normal-bg": "var(--popover)",
            "--normal-text": "var(--popover-foreground)",
            "--normal-border": "var(--border)",
          } as React.CSSProperties
        }
        toastOptions={{
          classNames: {
            success:
              "bg-green-50 text-green-900 dark:bg-green-900 dark:text-green-50 border-green-200 dark:border-green-800",
            error:
              "bg-red-50 text-red-900 dark:bg-red-900 dark:text-red-50 border-red-200 dark:border-red-800",
            warning:
              "bg-amber-50 text-amber-900 dark:bg-amber-900 dark:text-amber-50 border-amber-200 dark:border-amber-800",
            info: "bg-blue-50 text-blue-900 dark:bg-blue-900 dark:text-blue-50 border-blue-200 dark:border-blue-800",
          },
          duration: 5000,
        }}
        {...props}
      />
    </div>
  );
};

export { Toaster };
