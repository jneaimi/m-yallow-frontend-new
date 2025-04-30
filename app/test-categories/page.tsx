import { Suspense } from "react";
import { PublicCategories } from "../providers/public-categories";
import { ApiTest } from "./api-test";
import { DirectRenderingTest } from "./direct-rendering-test";
import { ResponsiveContainer } from "@/components/ui/responsive";

export default function TestCategoriesPage() {
  return (
    <div className="min-h-[80vh] py-16">
      <ResponsiveContainer maxWidth="xl">
        <h1 className="text-3xl font-bold mb-8">Public Categories Test Page</h1>
        <p className="text-muted-foreground mb-8">
          This page is used to test the dynamic category fetching from the API endpoint.
        </p>
        
        <div className="border rounded-lg p-6 mb-8 bg-muted/20">
          <h2 className="text-xl font-semibold mb-4">API Response</h2>
          <pre className="bg-black/5 p-4 rounded text-sm overflow-auto">
            {`{
  "categories": [
    {"id": 10, "name": "Auto Spare Parts", "icon": "settings"},
    {"id": 2, "name": "Building Materials Suppliers", "icon": "bricks"},
    {"id": 6, "name": "Car Maintenance & Repair", "icon": "wrench"},
    {"id": 24, "name": "Cleaning & Janitorial Supplies", "icon": "broom"},
    {"id": 8, "name": "Construction Companies", "icon": "hammer"},
    {"id": 18, "name": "Electrical Supplies & Services", "icon": "zap"},
    {"id": 29, "name": "General Trading & Wholesale", "icon": "store"},
    {"id": 19, "name": "HVAC & Cooling Systems", "icon": "wind"},
    {"id": 23, "name": "Industrial Chemicals", "icon": "beaker"},
    {"id": 21, "name": "Logistics & Freight", "icon": "truck"},
    {"id": 27, "name": "Office & Industrial Furniture", "icon": "chair"},
    {"id": 20, "name": "Paints & Coatings", "icon": "paintbrush"},
    {"id": 28, "name": "Pest Control & Facility Services", "icon": "bug"},
    {"id": 3, "name": "Plumbing & Sanitary Ware", "icon": "pipe"},
    {"id": 7, "name": "Power Tools & Equipment", "icon": "tool"},
    {"id": 25, "name": "Security & CCTV", "icon": "camera"},
    {"id": 4, "name": "Signage & Printing", "icon": "type"},
    {"id": 14, "name": "Steel & Metal Works", "icon": "anvil"},
    {"id": 9, "name": "Tire Shops & Alignment", "icon": "circle"},
    {"id": 22, "name": "Warehouse & Storage", "icon": "warehouse"},
    {"id": 5, "name": "Welding & Fabrication", "icon": "flame"}
  ],
  "total": 21
}`}
          </pre>
        </div>
        
        <h2 className="text-2xl font-bold mb-6">Rendered Categories</h2>
        <div className="bg-orange-50 p-4 mb-6 rounded-md">
          <p className="font-medium text-orange-700">Debug Info:</p>
          <p className="text-orange-600 text-sm">API URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/public/categories</p>
          <p className="text-orange-600 text-sm mt-1">Check browser console for detailed debug logs</p>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Client-side API Test</h3>
          <ApiTest />
        </div>
        <Suspense fallback={<div className="text-center py-8">Loading categories...</div>}>
          <PublicCategories />
        </Suspense>
        
        <h2 className="text-2xl font-bold my-6">Client-side Categories Test</h2>
        <p className="text-muted-foreground mb-4">
          This is a client-side rendering test to verify components are working correctly
        </p>
        <DirectRenderingTest />
      </ResponsiveContainer>
    </div>
  );
}
