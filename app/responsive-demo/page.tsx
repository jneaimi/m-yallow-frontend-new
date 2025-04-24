"use client";
import { breakpoints } from "@/lib/responsive/breakpoints";
import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveStack,
  ShowOnMobile,
  HideOnMobile,
  ShowOnDesktop,
  HideOnDesktop,
  Show,
} from "@/components/ui/responsive";
import { Button } from "@/components/ui/button";
import { useActiveBreakpoint, useDeviceCategory } from "@/hooks/use-breakpoint";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Hook to safely handle window width measurements
 */
function useWindowWidth() {
  const [width, setWidth] = useState<number | string>("?");

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

/**
 * A demo page showcasing the responsive design system components
 */
export default function ResponsiveDemoPage() {
  const [count, setCount] = useState<number>(0);
  const activeBreakpoint = useActiveBreakpoint();
  const { isMobile, isTablet, isDesktop } = useDeviceCategory();
  const windowWidth = useWindowWidth();

  return (
    <div className="no-horizontal-overflow pb-16">
      {/* Responsive Debugger - Sticky Floating Display */}
      <div className="fixed bottom-4 right-4 bg-card border rounded p-2 z-50 text-xs opacity-75 hover:opacity-100">
        <p>
          <strong>Current breakpoint:</strong> {activeBreakpoint}
        </p>
        <p>
          <strong>Device category:</strong>
          {isMobile && " Mobile"}
          {isTablet && " Tablet"}
          {isDesktop && " Desktop"}
        </p>
        <p>
          <strong>Window width:</strong>{" "}
          <span id="window-width">{windowWidth}</span>px
        </p>
      </div>

      {/* Page Header */}
      <header className="border-b">
        <ResponsiveContainer>
          <div className="py-6">
            <h1 className="text-responsive-xl font-bold">
              Responsive Design System
            </h1>
            <p className="text-responsive text-muted-foreground">
              Demonstration of responsive components and utilities
            </p>
          </div>
        </ResponsiveContainer>
      </header>

      <main>
        {/* Responsive Container Demo */}
        <section className="py-8 border-b">
          <ResponsiveContainer>
            <h2 className="text-responsive-lg font-semibold mb-4">
              ResponsiveContainer
            </h2>
            <p className="mb-6">
              This section is wrapped in a ResponsiveContainer with default
              settings. Notice how it maintains appropriate width and padding
              across screen sizes.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="border border-dashed rounded p-4 text-center">
                <ResponsiveContainer
                  maxWidth="sm"
                  className="bg-muted p-4 rounded"
                >
                  <p>Small Container (sm)</p>
                </ResponsiveContainer>
              </div>
              <div className="border border-dashed rounded p-4 text-center">
                <ResponsiveContainer
                  maxWidth="md"
                  className="bg-muted p-4 rounded"
                >
                  <p>Medium Container (md)</p>
                </ResponsiveContainer>
              </div>
              <div className="border border-dashed rounded p-4 text-center">
                <ResponsiveContainer
                  maxWidth="lg"
                  className="bg-muted p-4 rounded"
                >
                  <p>Large Container (lg)</p>
                </ResponsiveContainer>
              </div>
            </div>
          </ResponsiveContainer>
        </section>

        {/* Responsive Grid Demo */}
        <section className="py-8 border-b">
          <ResponsiveContainer>
            <h2 className="text-responsive-lg font-semibold mb-4">
              ResponsiveGrid
            </h2>
            <p className="mb-6">
              The grid below changes its column count based on screen size: 1
              column on mobile, 2 on small screens, 3 on medium screens, and 4
              on large screens.
            </p>

            <ResponsiveGrid cols={1} smCols={2} mdCols={3} lgCols={4} gap="4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="bg-muted p-6 rounded flex items-center justify-center text-center"
                >
                  <p>Grid Item {item}</p>
                </div>
              ))}
            </ResponsiveGrid>
          </ResponsiveContainer>
        </section>

        {/* Responsive Stack Demo */}
        <section className="py-8 border-b">
          <ResponsiveContainer>
            <h2 className="text-responsive-lg font-semibold mb-4">
              ResponsiveStack
            </h2>
            <p className="mb-6">
              The stack below changes from vertical to horizontal layout at the
              medium breakpoint. It also demonstrates alignment and spacing
              properties.
            </p>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Vertical to Horizontal Stack</CardTitle>
                <CardDescription>
                  This stack is vertical on mobile and small screens, but
                  horizontal on medium screens and up.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveStack
                  direction="vertical"
                  switchToHorizontalAt="md"
                  spacing="4"
                  align="center"
                  className="bg-muted/30 p-4 rounded"
                >
                  <div className="bg-primary text-primary-foreground p-4 rounded flex items-center justify-center">
                    <p>Item 1</p>
                  </div>
                  <div className="bg-primary text-primary-foreground p-4 rounded flex items-center justify-center">
                    <p>Item 2</p>
                  </div>
                  <div className="bg-primary text-primary-foreground p-4 rounded flex items-center justify-center">
                    <p>Item 3</p>
                  </div>
                </ResponsiveStack>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Horizontal to Vertical Stack</CardTitle>
                <CardDescription>
                  This stack is horizontal on mobile and small screens, but
                  vertical on medium screens and up.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveStack
                  direction="horizontal"
                  switchToVerticalAt="md"
                  spacing="4"
                  justify="between"
                  className="bg-muted/30 p-4 rounded"
                >
                  <div className="bg-accent text-accent-foreground p-4 rounded flex items-center justify-center">
                    <p>Item 1</p>
                  </div>
                  <div className="bg-accent text-accent-foreground p-4 rounded flex items-center justify-center">
                    <p>Item 2</p>
                  </div>
                  <div className="bg-accent text-accent-foreground p-4 rounded flex items-center justify-center">
                    <p>Item 3</p>
                  </div>
                </ResponsiveStack>
              </CardContent>
            </Card>
          </ResponsiveContainer>
        </section>

        {/* Visibility Components Demo */}
        <section className="py-8 border-b">
          <ResponsiveContainer>
            <h2 className="text-responsive-lg font-semibold mb-4">
              Visibility Components
            </h2>
            <p className="mb-6">
              These components show or hide content based on screen size. Resize
              your browser window to see the effect.
            </p>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Visibility</CardTitle>
                  <CardDescription>
                    Simple show/hide components for different device categories.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ShowOnMobile>
                    <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded">
                      <p className="font-medium">
                        This is only visible on mobile devices
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Using ShowOnMobile component
                      </p>
                    </div>
                  </ShowOnMobile>

                  <HideOnMobile>
                    <div className="bg-green-100 dark:bg-green-900 p-4 rounded">
                      <p className="font-medium">
                        This is hidden on mobile devices
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Using HideOnMobile component
                      </p>
                    </div>
                  </HideOnMobile>

                  <ShowOnDesktop>
                    <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded">
                      <p className="font-medium">
                        This is only visible on desktop devices
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Using ShowOnDesktop component
                      </p>
                    </div>
                  </ShowOnDesktop>

                  <HideOnDesktop>
                    <div className="bg-amber-100 dark:bg-amber-900 p-4 rounded">
                      <p className="font-medium">
                        This is hidden on desktop devices
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Using HideOnDesktop component
                      </p>
                    </div>
                  </HideOnDesktop>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Visibility with Breakpoints</CardTitle>
                  <CardDescription>
                    More precise control with the Show component that accepts
                    from/until props.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Show from="sm" until="lg">
                    <div className="bg-pink-100 dark:bg-pink-900 p-4 rounded">
                      <p className="font-medium">
                        This is only visible on tablets
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Using Show component with from=&quot;sm&quot;
                        until=&quot;lg&quot;
                      </p>
                    </div>
                  </Show>

                  <Show from="lg">
                    <div className="bg-cyan-100 dark:bg-cyan-900 p-4 rounded">
                      <p className="font-medium">
                        This is only visible on large screens
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Using Show component with from=&quot;lg&quot;
                      </p>
                    </div>
                  </Show>

                  <Show until="sm">
                    <div className="bg-orange-100 dark:bg-orange-900 p-4 rounded">
                      <p className="font-medium">
                        This is only visible on small mobile devices
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Using Show component with until=&quot;sm&quot
                      </p>
                    </div>
                  </Show>
                </CardContent>
              </Card>
            </div>
          </ResponsiveContainer>
        </section>

        {/* Responsive CSS Utilities Demo */}
        <section className="py-8 border-b">
          <ResponsiveContainer>
            <h2 className="text-responsive-lg font-semibold mb-4">
              Responsive CSS Utilities
            </h2>
            <p className="mb-6">
              The system includes several CSS utility classes for responsive
              behavior.
            </p>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Responsive Typography</CardTitle>
                  <CardDescription>
                    Text sizes that automatically scale with viewport width.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium text-sm mb-2">
                      Standard Text (16px)
                    </h3>
                    <p className="p-2 bg-muted rounded">
                      This is standard text that does not scale with viewport
                      size.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-2">
                      text-responsive
                    </h3>
                    <p className="text-responsive p-2 bg-muted rounded">
                      This text scales smoothly from small to large screens.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-2">
                      text-responsive-lg
                    </h3>
                    <p className="text-responsive-lg p-2 bg-muted rounded">
                      This is larger text that also scales with viewport.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-2">
                      text-responsive-xl
                    </h3>
                    <p className="text-responsive-xl p-2 bg-muted rounded">
                      This is heading text that scales dramatically.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Touch-Friendly Interfaces</CardTitle>
                  <CardDescription>
                    Interactive elements optimized for touch devices.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Standard Button
                      </p>
                      <Button>Standard Size</Button>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Touch-Target Button
                      </p>
                      <Button className="touch-target">Touch-Friendly</Button>
                    </div>

                    <ShowOnMobile>
                      <div className="bg-muted p-4 rounded mt-6">
                        <p className="text-sm">
                          On mobile devices, it&apos;s especially important to
                          have large enough touch targets. The minimum
                          recommended size is 44×44 pixels.
                        </p>
                      </div>
                    </ShowOnMobile>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Responsive Padding</CardTitle>
                  <CardDescription>
                    Padding that scales with viewport size.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Standard Padding (p-4)
                      </p>
                      <div className="p-4 bg-muted rounded border border-dashed">
                        <p>This content has a fixed padding of 1rem (16px).</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Responsive Padding (px-responsive py-responsive)
                      </p>
                      <div className="px-responsive py-responsive bg-muted rounded border border-dashed">
                        <p>
                          This content has padding that scales with the viewport
                          size.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ResponsiveContainer>
        </section>

        {/* Interactive Demo */}
        <section className="py-8">
          <ResponsiveContainer>
            <h2 className="text-responsive-lg font-semibold mb-4">
              Interactive Example
            </h2>
            <p className="mb-6">
              This example shows a counter with different layouts based on
              screen size.
            </p>

            <Card>
              <CardHeader>
                <CardTitle>Responsive Counter</CardTitle>
                <CardDescription>
                  The layout and styling change based on your screen size.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ShowOnMobile>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold mb-4">{count}</div>
                    <div className="flex justify-center space-x-2">
                      <Button
                        onClick={() => setCount(count - 1)}
                        className="touch-target"
                        variant="outline"
                      >
                        Decrease
                      </Button>
                      <Button
                        onClick={() => setCount(count + 1)}
                        className="touch-target"
                      >
                        Increase
                      </Button>
                    </div>
                  </div>
                </ShowOnMobile>

                <HideOnMobile>
                  <ResponsiveStack
                    direction="horizontal"
                    spacing="8"
                    align="center"
                    justify="between"
                    className="p-4"
                  >
                    <Button
                      onClick={() => setCount(count - 1)}
                      size="lg"
                      variant="outline"
                    >
                      Decrease
                    </Button>
                    <div className="text-6xl font-bold">{count}</div>
                    <Button onClick={() => setCount(count + 1)} size="lg">
                      Increase
                    </Button>
                  </ResponsiveStack>
                </HideOnMobile>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  variant="ghost"
                  onClick={() => setCount(0)}
                  className={isMobile ? "touch-target" : ""}
                >
                  Reset Counter
                </Button>
              </CardFooter>
            </Card>
          </ResponsiveContainer>
        </section>
      </main>
    </div>
  );
}
