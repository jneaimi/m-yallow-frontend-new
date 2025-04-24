# Responsive Design System Usage Examples

This document provides practical examples of how to use the responsive design system components in your application.

## Basic Responsive Container

The `ResponsiveContainer` component provides a consistent, centered container with appropriate padding that adapts to different screen sizes.

```tsx
import { ResponsiveContainer } from "@/components/ui/responsive";

export default function Page() {
  return (
    <ResponsiveContainer>
      <h1>My Page Content</h1>
      <p>This content will be properly contained with responsive padding.</p>
    </ResponsiveContainer>
  );
}
```

### Customizing Container Width

You can specify different maximum widths for the container:

```tsx
// Small container for forms or narrow content
<ResponsiveContainer maxWidth="sm">
  <form>
    <h2>Contact Form</h2>
    {/* Form fields */}
  </form>
</ResponsiveContainer>

// Full-width container with padding
<ResponsiveContainer maxWidth="full">
  <div>Full width content with padding</div>
</ResponsiveContainer>

// No maximum width or padding
<ResponsiveContainer maxWidth="none" padding={false}>
  <div>No constraints at all</div>
</ResponsiveContainer>
```

## Responsive Grid Layouts

The `ResponsiveGrid` component creates grid layouts that adapt to different screen sizes:

```tsx
import { ResponsiveGrid } from "@/components/ui/responsive";

export default function ProductGrid() {
  return (
    <ResponsiveGrid 
      cols={1}     // 1 column on mobile (default)
      smCols={2}   // 2 columns on small screens (640px+)
      mdCols={3}   // 3 columns on medium screens (768px+)
      lgCols={4}   // 4 columns on large screens (1024px+)
      gap="4"      // Gap between items
    >
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
      {/* More product cards */}
    </ResponsiveGrid>
  );
}
```

## Responsive Stack for Vertical/Horizontal Layouts

The `ResponsiveStack` component arranges items in a stack that can change direction based on screen size:

```tsx
import { ResponsiveStack } from "@/components/ui/responsive";

// Vertical stack on mobile, horizontal on tablet and up
export function FeatureSection() {
  return (
    <ResponsiveStack 
      direction="vertical"
      switchToHorizontalAt="sm"
      spacing="8"
      align="center"
    >
      <div className="feature-image">
        <img src="/feature.png" alt="Feature" />
      </div>
      <div className="feature-content">
        <h2>Amazing Feature</h2>
        <p>This feature will change how you work.</p>
      </div>
    </ResponsiveStack>
  );
}

// Horizontal on desktop, vertical on smaller screens
export function NavigationButtons() {
  return (
    <ResponsiveStack 
      direction="horizontal"
      switchToVerticalAt="lg"
      spacing="4"
      justify="end"
    >
      <Button variant="outline">Cancel</Button>
      <Button>Save</Button>
    </ResponsiveStack>
  );
}
```

## Conditional Content Visibility

Use the visibility components to show or hide content based on screen size:

```tsx
import { 
  ShowOnMobile,
  HideOnMobile,
  ShowOnDesktop,
  HideOnDesktop
} from "@/components/ui/responsive";

export function Navigation() {
  return (
    <nav>
      {/* Only visible on mobile */}
      <ShowOnMobile>
        <MobileMenu />
      </ShowOnMobile>
      
      {/* Hidden on mobile */}
      <HideOnMobile>
        <DesktopNavbar />
      </HideOnMobile>
    </nav>
  );
}

// More fine-grained control
import { Show } from "@/components/ui/responsive";

export function SpecialFeature() {
  return (
    <>
      {/* Only visible between 'sm' and 'lg' breakpoints */}
      <Show from="sm" until="lg">
        <p>This content is only visible on tablets</p>
      </Show>
      
      {/* Only visible on xl and larger screens */}
      <Show from="xl">
        <p>Extra content for large displays</p>
      </Show>
    </>
  );
}
```

## Responsive Component Wrappers

Use the `ResponsiveWrapper` to render completely different components based on screen size:

```tsx
import { ResponsiveWrapper } from "@/components/ui/responsive";

export function DataTable() {
  return (
    <ResponsiveWrapper
      xs={<MobileDataList data={data} />}
      md={<TabletDataTable data={data} />}
      lg={<DesktopComplexTable data={data} />}
    />
  );
}
```

## Using Media Query Hooks

For more dynamic control, use the responsive hooks directly:

```tsx
import { useMediaQuery, useMinWidth, useMaxWidth } from "@/hooks/use-media-query";
import { useBreakpointMatch, useActiveBreakpoint, useDeviceCategory } from "@/hooks/use-breakpoint";

export function DynamicLayout() {
  // Check if viewport matches a custom query
  const isLandscape = useMediaQuery('(orientation: landscape)');
  
  // Check if viewport is at least medium size
  const isMediumOrLarger = useMinWidth(768);
  
  // Check if we're smaller than large screens
  const isNotDesktop = useMaxWidth(1023);
  
  // Check if we match a specific breakpoint
  const isTabletOrLarger = useBreakpointMatch('md');
  
  // Get the current active breakpoint
  const activeBreakpoint = useActiveBreakpoint();
  
  // Get common device categories
  const { isMobile, isTablet, isDesktop } = useDeviceCategory();
  
  return (
    <div>
      {/* Conditional rendering based on screen properties */}
      {isMobile && <MobileOptimizedView />}
      {isTablet && <TabletOptimizedView />}
      {isDesktop && <DesktopOptimizedView />}
      
      {/* Dynamic styles or props */}
      <div style={{ fontSize: isMobile ? '14px' : '16px' }}>
        Dynamic content
      </div>
      
      {/* Display current breakpoint for debugging */}
      <div>Current breakpoint: {activeBreakpoint}</div>
      
      {/* Advanced conditionals */}
      {isLandscape && !isMobile && (
        <SpecialLandscapeLayout />
      )}
    </div>
  );
}
```

## CSS Utilities for Responsive Design

The system provides several CSS utility classes that can be used directly:

```tsx
export function ResponsiveText() {
  return (
    <>
      {/* Text that scales with viewport size */}
      <h1 className="text-responsive-xl">Responsive Heading</h1>
      <p className="text-responsive">This text scales smoothly between screen sizes.</p>
      
      {/* Padding that adjusts with screen size */}
      <div className="px-responsive py-responsive">
        Content with responsive padding
      </div>
      
      {/* Ensure touch targets are large enough on mobile */}
      <button className="touch-target">
        Tap Me
      </button>
      
      {/* Prevent horizontal overflow on mobile */}
      <div className="no-horizontal-overflow">
        <div className="very-wide-content">
          This won't cause horizontal scrolling on mobile
        </div>
      </div>
      
      {/* Safe area insets for modern mobile browsers */}
      <footer className="safe-padding-bottom">
        Footer content respects device notches and home indicators
      </footer>
    </>
  );
}
```

## Complete Page Example

Here's how to use multiple components together in a complete page layout:

```tsx
import {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveStack,
  Show,
  HideOnMobile
} from "@/components/ui/responsive";

export default function HomePage() {
  return (
    <div className="no-horizontal-overflow">
      <header>
        {/* Header content */}
      </header>
      
      <main>
        {/* Hero section */}
        <section className="py-responsive">
          <ResponsiveContainer>
            <ResponsiveStack 
              direction="vertical"
              switchToHorizontalAt="lg"
              align="center"
              spacing="8"
            >
              <div className="flex-1">
                <h1 className="text-responsive-xl">Welcome to Our Platform</h1>
                <p className="text-responsive">A powerful solution for your needs.</p>
                <div className="mt-6">
                  <Button size="lg" className="touch-target">Get Started</Button>
                </div>
              </div>
              
              <div className="flex-1">
                <img src="/hero-image.png" alt="Platform Preview" />
              </div>
            </ResponsiveStack>
          </ResponsiveContainer>
        </section>
        
        {/* Features grid */}
        <section className="bg-muted py-responsive">
          <ResponsiveContainer>
            <h2 className="text-responsive-lg text-center mb-8">Our Features</h2>
            <ResponsiveGrid
              cols={1}
              smCols={2}
              lgCols={3}
              gap="6"
            >
              <FeatureCard title="Feature One" />
              <FeatureCard title="Feature Two" />
              <FeatureCard title="Feature Three" />
              <FeatureCard title="Feature Four" />
              <FeatureCard title="Feature Five" />
              <FeatureCard title="Feature Six" />
            </ResponsiveGrid>
          </ResponsiveContainer>
        </section>
        
        {/* Testimonials - different layouts for mobile vs desktop */}
        <section className="py-responsive">
          <ResponsiveContainer>
            <h2 className="text-responsive-lg text-center mb-8">Testimonials</h2>
            
            <Show until="md">
              <TestimonialCarousel />
            </Show>
            
            <HideOnMobile>
              <ResponsiveGrid cols={2} lgCols={3} gap="4">
                <TestimonialCard />
                <TestimonialCard />
                <TestimonialCard />
              </ResponsiveGrid>
            </HideOnMobile>
          </ResponsiveContainer>
        </section>
      </main>
      
      <footer className="safe-padding-bottom">
        {/* Footer content */}
      </footer>
    </div>
  );
}
```

## Form Layout Examples

Responsive design is especially important for forms to ensure good usability across devices:

```tsx
import { ResponsiveContainer, ResponsiveStack, ResponsiveGrid } from "@/components/ui/responsive";
import { useDeviceCategory } from "@/hooks/use-breakpoint";

export function ContactForm() {
  const { isMobile } = useDeviceCategory();
  
  return (
    <ResponsiveContainer maxWidth="lg">
      <form>
        <h2 className="text-responsive-lg">Contact Us</h2>
        
        {/* Two fields side by side on larger screens */}
        <ResponsiveGrid
          cols={1}
          mdCols={2}
          gap="4"
          className="mb-4"
        >
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              className={isMobile ? "touch-target" : ""} 
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              className={isMobile ? "touch-target" : ""} 
            />
          </div>
        </ResponsiveGrid>
        
        {/* Full width fields */}
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            className={isMobile ? "touch-target" : ""} 
          />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="message">Message</Label>
          <Textarea 
            id="message"
            rows={isMobile ? 3 : 5}
          />
        </div>
        
        {/* Buttons that stack on mobile */}
        <ResponsiveStack
          direction="horizontal"
          switchToVerticalAt="sm"
          spacing="4"
          justify="end"
        >
          <Button variant="outline">Cancel</Button>
          <Button className={isMobile ? "touch-target" : ""}>Submit</Button>
        </ResponsiveStack>
      </form>
    </ResponsiveContainer>
  );
}
```

## Data Visualization Example

Responsive charts and visualizations:

```tsx
import { ResponsiveContainer, ResponsiveWrapper } from "@/components/ui/responsive";
import { useBreakpointMatch } from "@/hooks/use-breakpoint";

export function SalesChart() {
  const isLargeScreen = useBreakpointMatch('lg');
  
  return (
    <ResponsiveContainer>
      <h2 className="text-responsive-lg">Sales Performance</h2>
      
      {/* Different chart types based on screen size */}
      <ResponsiveWrapper
        xs={<SimpleBarChart data={data} height={200} />}
        md={<BarChart data={data} height={300} showLegend />}
        lg={<AdvancedChart data={data} height={400} showControls showLegend />}
      />
      
      {/* Adjust chart options based on screen size */}
      <LineChart 
        data={data}
        height={isLargeScreen ? 400 : 250}
        showPoints={isLargeScreen}
        labelFontSize={isLargeScreen ? 14 : 10}
        margin={{
          top: 20,
          right: isLargeScreen ? 40 : 20,
          bottom: 60,
          left: isLargeScreen ? 60 : 40,
        }}
      />
    </ResponsiveContainer>
  );
}
```

## Navigation Patterns

Implement responsive navigation patterns:

```tsx
import { 
  ShowOnMobile, 
  HideOnMobile, 
  ResponsiveContainer 
} from "@/components/ui/responsive";
import { useState } from "react";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="border-b">
      <ResponsiveContainer>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>
          
          {/* Desktop Navigation */}
          <HideOnMobile>
            <nav>
              <ul className="flex space-x-4">
                <li><NavLink href="/">Home</NavLink></li>
                <li><NavLink href="/products">Products</NavLink></li>
                <li><NavLink href="/pricing">Pricing</NavLink></li>
                <li><NavLink href="/about">About</NavLink></li>
                <li><NavLink href="/contact">Contact</NavLink></li>
              </ul>
            </nav>
          </HideOnMobile>
          
          {/* Mobile Menu Toggle */}
          <ShowOnMobile>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="touch-target"
            >
              {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </Button>
          </ShowOnMobile>
        </div>
      </ResponsiveContainer>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <ShowOnMobile>
          <div className="border-t p-4">
            <nav>
              <ul className="space-y-4">
                <li><NavLink href="/" onClick={() => setMobileMenuOpen(false)}>Home</NavLink></li>
                <li><NavLink href="/products" onClick={() => setMobileMenuOpen(false)}>Products</NavLink></li>
                <li><NavLink href="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</NavLink></li>
                <li><NavLink href="/about" onClick={() => setMobileMenuOpen(false)}>About</NavLink></li>
                <li><NavLink href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</NavLink></li>
              </ul>
            </nav>
          </div>
        </ShowOnMobile>
      )}
    </header>
  );
}
```

## Testing Responsive Behavior

Example of how to test and debug responsive layouts:

```tsx
import { useActiveBreakpoint, useDeviceCategory } from "@/hooks/use-breakpoint";

export function ResponsiveDebugger() {
  const currentBreakpoint = useActiveBreakpoint();
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useDeviceCategory();
  
  return (
    <div className="fixed bottom-4 right-4 bg-background border rounded p-2 z-50 text-xs opacity-75 hover:opacity-100">
      <p><strong>Current breakpoint:</strong> {currentBreakpoint}</p>
      <p>
        <strong>Device category:</strong>
        {isMobile && " Mobile"}
        {isTablet && " Tablet"}
        {isDesktop && " Desktop"}
        {isLargeDesktop && " (Large)"}
      </p>
      <p><strong>Window width:</strong> <span id="window-width">{typeof window !== 'undefined' ? window.innerWidth : '?'}</span>px</p>
    </div>
  );
}

// Add to your layout during development
export default function TestLayout({ children }) {
  return (
    <>
      {children}
      {process.env.NODE_ENV === 'development' && <ResponsiveDebugger />}
    </>
  );
}
```

## Best Practices Demonstrations

Example showing multiple best practices for responsive design:

```tsx
export function BestPracticesDemo() {
  const { isMobile } = useDeviceCategory();
  
  return (
    <div className="no-horizontal-overflow">
      {/* Responsive typography */}
      <h1 className="text-responsive-xl font-bold">Responsive Design</h1>
      
      {/* Responsive spacing */}
      <div className="py-responsive">
        <p className="text-responsive mb-4">
          This example demonstrates several responsive design best practices that
          you can incorporate into your own applications.
        </p>
        
        {/* Touch-friendly interactions */}
        <Button className={isMobile ? "touch-target w-full" : ""}>
          {isMobile ? "Tap here" : "Click here"}
        </Button>
      </div>
      
      {/* Responsive content with appropriate image loading */}
      <ResponsiveContainer>
        <figure>
          <picture>
            <source media="(min-width: 1024px)" srcSet="/images/large.webp" />
            <source media="(min-width: 640px)" srcSet="/images/medium.webp" />
            <img 
              src="/images/small.webp" 
              alt="Responsive image example"
              className="w-full h-auto"
              loading="lazy"
            />
          </picture>
          <figcaption className="text-center text-sm text-muted-foreground mt-2">
            This image loads in different sizes based on screen width
          </figcaption>
        </figure>
      </ResponsiveContainer>
      
      {/* Progressive disclosure of content */}
      <ResponsiveContainer className="mt-8">
        <div className="border rounded-lg overflow-hidden">
          <div className="p-4 bg-muted">
            <h3 className="font-medium">Additional Information</h3>
          </div>
          <div className="p-4">
            <p className="mb-4">Essential information visible on all devices.</p>
            
            <Show from="md">
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2">Detailed Specifications</h4>
                <p>This additional content is only shown on larger screens where there's more space.</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Specification one</li>
                  <li>Specification two</li>
                  <li>Specification three</li>
                </ul>
              </div>
            </Show>
            
            <ShowOnMobile>
              <div className="border-t pt-4 mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  View More Details
                </Button>
              </div>
            </ShowOnMobile>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
```

These examples demonstrate the wide range of possibilities available with the responsive design system. Use them as starting points and adapt them to your specific needs.
