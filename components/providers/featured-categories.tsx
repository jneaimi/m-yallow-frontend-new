"use client";

import Link from "next/link";
import { ResponsiveGrid } from "@/components/ui/responsive";
import { Card, CardContent } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface FeaturedCategoriesProps {
  categories: Category[];
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  return (
    <ResponsiveGrid
      cols={1}
      smCols={2}
      mdCols={3}
      lgCols={4}
      xlCols={5}
      gap="6"
    >
      {categories.map((category) => (
        <Link 
          key={category.id} 
          href={`/providers/search?category=${encodeURIComponent(category.id)}`}
          className="block transition-transform hover:scale-[1.02]"
        >
          <Card className="h-full">
            <CardContent className="flex flex-col items-center text-center p-4 space-y-3">
              <div className="text-primary p-2 rounded-full bg-primary/10">
                {category.icon}
              </div>
              <div>
                <h3 className="font-medium text-md mb-1">{category.name}</h3>
                <p className="text-muted-foreground text-xs">{category.description}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </ResponsiveGrid>
  );
}
