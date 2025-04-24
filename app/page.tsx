"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useDeviceCategory } from "@/hooks/use-breakpoint";
import {
  ResponsiveContainer,
  ResponsiveStack,
  ResponsiveGrid,
} from "@/components/ui/responsive";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { isMobile } = useDeviceCategory();
  
  return (
    <ResponsiveContainer maxWidth="xl" className="py-responsive">
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-8">
        <header className="w-full flex justify-end mb-16">
          <ThemeToggle />
        </header>
        
        <main className="flex flex-col gap-8 items-center text-center">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          
          <ol className="list-inside list-decimal text-responsive max-w-md text-center font-mono">
            <li className="mb-4 tracking-tight">
              Get started by editing{" "}
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-mono font-semibold">
                app/page.tsx
              </code>
            </li>
            <li className="tracking-tight">
              Save and see your changes instantly.
            </li>
          </ol>

          <ResponsiveStack
            direction="vertical"
            switchToHorizontalAt="sm"
            spacing="4"
            className="mt-4"
          >
            <Button 
              size={isMobile ? "touch" : "lg"} 
              asChild
            >
              <Link href="/responsive-demo">
                Responsive Design Demo
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size={isMobile ? "touch" : "lg"} 
              asChild
            >
              <a
                href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the docs
              </a>
            </Button>
          </ResponsiveStack>
          
          <ResponsiveGrid
            cols={1}
            smCols={3}
            gap="6"
            className="mt-12"
          >
            <a
              className="flex flex-col items-center gap-2 p-4 hover:bg-accent rounded-lg transition-colors text-center touch-target"
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/file.svg"
                alt="Learn"
                width={24}
                height={24}
                className="mb-2"
              />
              <span className="font-medium">Learn</span>
              <span className="text-sm text-muted-foreground">Official tutorials</span>
            </a>
            
            <a
              className="flex flex-col items-center gap-2 p-4 hover:bg-accent rounded-lg transition-colors text-center touch-target"
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/window.svg"
                alt="Examples"
                width={24}
                height={24}
                className="mb-2"
              />
              <span className="font-medium">Examples</span>
              <span className="text-sm text-muted-foreground">Discover templates</span>
            </a>
            
            <a
              className="flex flex-col items-center gap-2 p-4 hover:bg-accent rounded-lg transition-colors text-center touch-target"
              href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/globe.svg"
                alt="Next.js"
                width={24}
                height={24}
                className="mb-2"
              />
              <span className="font-medium">Next.js</span>
              <span className="text-sm text-muted-foreground">Visit nextjs.org →</span>
            </a>
          </ResponsiveGrid>
        </main>
      </div>
    </ResponsiveContainer>
  );
}
