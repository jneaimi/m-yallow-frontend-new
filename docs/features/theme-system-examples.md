# Theme System Usage Examples

This document provides practical examples of how to use the theme system in the M-Yallow project.

## Basic Theme Awareness

### Example 1: Theme-Aware Component

Create components that respond to theme changes using Tailwind's dark mode utility classes:

```tsx
// Example of a card component that adapts to the current theme
export function ThemedCard({ title, children }) {
  return (
    <div className="bg-card text-card-foreground rounded-lg border p-4 shadow-sm">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}
```

The component automatically adapts to light or dark theme based on the presence of the `.dark` class and the CSS variables defined in `globals.css`.

### Example 2: Explicit Dark Mode Styling

When you need different styling between light and dark themes:

```tsx
export function AlertBox({ message, type = "info" }) {
  return (
    <div className={`
      p-3 rounded-md 
      ${type === "error" ? "bg-red-100 text-red-900 dark:bg-red-900/20 dark:text-red-300" : ""}
      ${type === "warning" ? "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-300" : ""}
      ${type === "info" ? "bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-300" : ""}
      ${type === "success" ? "bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-300" : ""}
    `}>
      {message}
    </div>
  );
}
```

## Programmatic Theme Access

### Example 3: Using the useTheme Hook

Access and modify the theme state in your components:

```tsx
"use client";

import { useTheme } from "@/hooks/use-theme";

export function ThemeInfo() {
  const { theme, resolvedTheme, systemTheme, toggleTheme, mounted } = useTheme();
  
  // Prevent hydration mismatch
  if (!mounted) return <div>Loading theme information...</div>;
  
  return (
    <div className="space-y-4">
      <div>
        <p>Selected theme: <strong>{theme}</strong></p>
        <p>Resolved theme: <strong>{resolvedTheme}</strong></p>
        <p>System preference: <strong>{systemTheme}</strong></p>
      </div>
      
      <button 
        onClick={toggleTheme}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Toggle Theme
      </button>
    </div>
  );
}
```

### Example 4: Theme-Dependent Logic

Implement logic that depends on the current theme:

```tsx
"use client";

import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";

export function ThemeSpecificContent() {
  const { resolvedTheme, mounted } = useTheme();
  
  if (!mounted) return null;
  
  return (
    <div className="p-4 border rounded-md">
      {resolvedTheme === "dark" ? (
        <div className="flex items-center gap-2">
          <Moon className="h-5 w-5" />
          <p>This content is optimized for dark mode viewing.</p>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Sun className="h-5 w-5" />
          <p>This content is optimized for light mode viewing.</p>
        </div>
      )}
    </div>
  );
}
```

## Integrating ThemeToggle

### Example 5: Basic Navbar with Theme Toggle

Implement a navigation bar with theme toggle:

```tsx
"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-xl">M-Yallow</Link>
        <div className="flex gap-4">
          <Link href="/features" className="hover:underline">Features</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </div>
      </div>
      
      <ThemeToggle />
    </nav>
  );
}
```

### Example 6: Settings Page with Theme Options

Create a settings page with explicit theme options:

```tsx
"use client";

import { useTheme } from "@/hooks/use-theme";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Laptop } from "lucide-react";

export function ThemeSettings() {
  const { theme, setTheme, mounted } = useTheme();
  
  if (!mounted) return null;
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Display Settings</h2>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Theme</h3>
        <RadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem id="light" value="light" />
            <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
              <Sun className="h-4 w-4" />
              Light
            </Label>
          </div>
          
          <div className="flex items-center gap-2">
            <RadioGroupItem id="dark" value="dark" />
            <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
              <Moon className="h-4 w-4" />
              Dark
            </Label>
          </div>
          
          <div className="flex items-center gap-2">
            <RadioGroupItem id="system" value="system" />
            <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer">
              <Laptop className="h-4 w-4" />
              System
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
```

## Advanced Usage

### Example 7: Theme-Dependent Images

Load different images based on theme:

```tsx
"use client";

import Image from "next/image";
import { useTheme } from "@/hooks/use-theme";

export function ThemeAwareImage() {
  const { resolvedTheme, mounted } = useTheme();
  
  if (!mounted) {
    // Return placeholder or loading state
    return <div className="h-48 w-full bg-muted animate-pulse rounded-md" />;
  }
  
  const imageSrc = resolvedTheme === "dark" 
    ? "/images/logo-dark.png" 
    : "/images/logo-light.png";
  
  return (
    <Image
      src={imageSrc}
      alt="Logo"
      width={200}
      height={100}
      className="transition-opacity"
    />
  );
}
```

### Example 8: Creating Theme-Aware Charts

Implement charts that adapt to the current theme:

```tsx
"use client";

import { useTheme } from "@/hooks/use-theme";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
];

export function ThemeAwareChart() {
  const { resolvedTheme, mounted } = useTheme();
  
  if (!mounted) return <div className="h-64 w-full bg-muted animate-pulse rounded-md" />;
  
  // Set colors based on theme
  const barColor = resolvedTheme === "dark" ? "#7b3ff3" : "#4f46e5";
  const textColor = resolvedTheme === "dark" ? "#e5e7eb" : "#374151";
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis 
          dataKey="name" 
          stroke={textColor}
          tick={{ fill: textColor }}
        />
        <YAxis 
          stroke={textColor}
          tick={{ fill: textColor }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: resolvedTheme === "dark" ? "#1f2937" : "#ffffff",
            borderColor: resolvedTheme === "dark" ? "#374151" : "#e5e7eb",
            color: textColor
          }}
        />
        <Bar dataKey="value" fill={barColor} />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

## Troubleshooting Examples

### Example 9: Fixing Hydration Mismatch

```tsx
"use client";

import { useTheme } from "@/hooks/use-theme";

export function ThemeSensitiveComponent() {
  const { resolvedTheme, mounted } = useTheme();
  
  // CORRECT: Check for mounted state before rendering theme-dependent content
  if (!mounted) {
    return <div className="h-10 w-full bg-transparent" />; // Neutral placeholder
  }
  
  return (
    <div className={resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"}>
      Current theme: {resolvedTheme}
    </div>
  );
  
  // INCORRECT: Would cause hydration mismatch
  // return (
  //   <div className={resolvedTheme === "dark" ? "bg-gray-800" : "bg-white"}>
  //     Current theme: {resolvedTheme}
  //   </div>
  // );
}
```

### Example 10: Manually Applying Theme

In rare cases where you need to manually apply theme classes:

```tsx
"use client";

import { useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";

export function ManualThemeApplier() {
  const { resolvedTheme, mounted } = useTheme();
  
  useEffect(() => {
    if (!mounted) return;
    
    // Get the element to modify
    const element = document.getElementById("theme-target");
    if (!element) return;
    
    // Apply appropriate class
    if (resolvedTheme === "dark") {
      element.classList.add("dark-theme");
      element.classList.remove("light-theme");
    } else {
      element.classList.add("light-theme");
      element.classList.remove("dark-theme");
    }
  }, [resolvedTheme, mounted]);
  
  return (
    <div id="theme-target" className="p-4 border rounded">
      This element has theme classes manually applied via JavaScript.
    </div>
  );
}
```

## Testing the Theme System

### Example 11: Theme Toggle Testing Component

```tsx
"use client";

import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

export function ThemeTestPanel() {
  const { theme, setTheme, resolvedTheme, systemTheme, toggleTheme, mounted } = useTheme();
  
  if (!mounted) return <div>Loading theme tester...</div>;
  
  return (
    <div className="space-y-6 p-6 border rounded-lg">
      <div className="grid grid-cols-2 gap-2">
        <div>Theme setting:</div>
        <div className="font-medium">{theme}</div>
        
        <div>Actually applied theme:</div>
        <div className="font-medium">{resolvedTheme}</div>
        
        <div>System preference:</div>
        <div className="font-medium">{systemTheme}</div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setTheme("light")}>Set Light</Button>
        <Button onClick={() => setTheme("dark")}>Set Dark</Button>
        <Button onClick={() => setTheme("system")}>Set System</Button>
        <Button onClick={toggleTheme}>Toggle Theme</Button>
      </div>
      
      <div className="flex gap-4">
        <div className="p-4 bg-card text-card-foreground border rounded">Card</div>
        <div className="p-4 bg-primary text-primary-foreground border rounded">Primary</div>
        <div className="p-4 bg-secondary text-secondary-foreground border rounded">Secondary</div>
        <div className="p-4 bg-muted text-muted-foreground border rounded">Muted</div>
      </div>
    </div>
  );
}
```

This test panel helps verify that your theme system is working correctly by displaying all relevant information and allowing manual theme changes.
