"use client";

import React from "react";
import { HybridCategories } from "@/components/providers/hybrid-categories";
import { featuredCategories } from "@/components/providers/category-icons";
import { ResponsiveContainer } from "@/components/ui/responsive";

export default function TestViewAllPage() {
  return (
    <div className="min-h-screen py-10">
      <ResponsiveContainer maxWidth="xl">
        <h1 className="text-3xl font-bold mb-6">Testing View All Categories Component</h1>
        
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Default Implementation</h2>
          <div className="border p-6 rounded-lg">
            <HybridCategories categories={featuredCategories} />
          </div>
        </div>
        
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Responsive Test Instructions</h2>
          <div className="bg-muted/30 p-4 rounded-lg">
            <ol className="list-decimal pl-5 space-y-2">
              <li>Resize your browser window to different widths to see how the "View All Categories" button adapts.</li>
              <li>On mobile (&lt;640px), the button should be full-width and appear below the carousel controls.</li>
              <li>On small screens (640px-768px), the button should be more compact but still visible.</li>
              <li>On medium and larger screens (&gt;768px), the button should display the total number of categories.</li>
              <li>Click the button to test that it opens the categories modal correctly.</li>
            </ol>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
