"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme";

export default function ThemeDemoPage() {
  const { resolvedTheme, mounted } = useTheme();
  
  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Theme System Demo</h1>
        <ThemeToggle />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Theme</CardTitle>
            <CardDescription>
              This shows your current selected theme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium">
              {resolvedTheme?.charAt(0).toUpperCase() + resolvedTheme?.slice(1)} Mode
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Theme Features</CardTitle>
            <CardDescription>
              The implementation includes:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Theme persistence across page refreshes</li>
              <li>System preference detection</li>
              <li>No flash of incorrect theme on load</li>
              <li>Smooth theme transitions</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
