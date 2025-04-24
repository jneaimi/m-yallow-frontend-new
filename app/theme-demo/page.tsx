"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme";
import { useDeviceCategory } from "@/hooks/use-breakpoint";
import {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveStack,
} from "@/components/ui/responsive";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ThemeDemoPage() {
  const { theme, resolvedTheme, mounted, setTheme } = useTheme();
  const { isMobile } = useDeviceCategory();

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  // Safely capitalize the resolved theme for display
  const displayTheme = resolvedTheme
    ? resolvedTheme.charAt(0).toUpperCase() + resolvedTheme.slice(1)
    : "System";

  return (
    <ResponsiveContainer className="py-responsive">
      <ResponsiveStack
        direction="horizontal"
        spacing="4"
        justify="between"
        align="center"
        className="mb-8"
      >
        <h1 className="text-responsive-xl font-bold">Theme System Demo</h1>
        <ThemeToggle />
      </ResponsiveStack>

      <ResponsiveGrid cols={1} mdCols={2} gap="6" className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Current Theme</CardTitle>
            <CardDescription>
              This shows your current selected theme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium">{displayTheme} Mode</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size={isMobile ? "touch-sm" : "sm"}
                onClick={() => setTheme("light")}
                className={isMobile ? "touch-target" : ""}
              >
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size={isMobile ? "touch-sm" : "sm"}
                onClick={() => setTheme("dark")}
                className={isMobile ? "touch-target" : ""}
              >
                Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size={isMobile ? "touch-sm" : "sm"}
                onClick={() => setTheme("system")}
                className={isMobile ? "touch-target" : ""}
              >
                System
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme Features</CardTitle>
            <CardDescription>The implementation includes:</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Theme persistence across page refreshes</li>
              <li>System preference detection</li>
              <li>No flash of incorrect theme on load</li>
              <li>Smooth theme transitions</li>
              <li>Responsive design integration</li>
            </ul>
          </CardContent>
        </Card>
      </ResponsiveGrid>

      <Card>
        <CardHeader>
          <CardTitle>Related Features</CardTitle>
          <CardDescription>Explore other system features</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveStack
            direction="vertical"
            switchToHorizontalAt="sm"
            spacing="4"
          >
            <Button asChild className={isMobile ? "touch-target" : ""}>
              <Link href="/responsive-demo">Responsive Design Demo</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className={isMobile ? "touch-target" : ""}
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </ResponsiveStack>
        </CardContent>
      </Card>
    </ResponsiveContainer>
  );
}
