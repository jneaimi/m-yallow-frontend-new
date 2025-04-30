"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function CategoryCard({ id, name, icon, onClick, className }: CategoryCardProps) {
  return (
    <Link
      href={`/providers/category/${encodeURIComponent(id)}`}
      className={cn("block transition-transform hover:scale-[1.02]", className)}
      onClick={onClick}
    >
      <Card className="h-full">
        <CardContent className="flex flex-row items-start p-2 sm:p-3 gap-2">
          <div 
            className="text-primary rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center" 
            style={{ width: '24px', height: '24px', minWidth: '24px' }}
          >
            {icon}
          </div>
          <div className="min-w-0 flex-1"> {/* This div prevents text overflow */}
            <h4 className="font-medium text-sm leading-tight break-words line-clamp-2 text-left">
              {name}
            </h4>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
