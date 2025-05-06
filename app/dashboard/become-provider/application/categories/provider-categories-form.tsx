'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiCategory, fetchPublicCategories } from '@/lib/api/categories';
import { useProviderClient } from '@/lib/api/providers/client';
import { CategoryIcon } from '@/components/providers/category-icon';

interface ProviderCategoriesFormProps {
  providerId: string;
}

export function ProviderCategoriesForm({ providerId }: ProviderCategoriesFormProps) {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { updateProviderCategories } = useProviderClient();

  // Fetch categories on mount
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const getCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetchPublicCategories();
        if (isMounted) {
          setCategories(response.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        if (isMounted) {
          if (retryCount < maxRetries) {
            retryCount++;
            const retryDelay = 1000 * retryCount; // Exponential backoff
            toast.error(`Failed to load categories. Retrying in ${retryDelay/1000}s...`);
            setTimeout(getCategories, retryDelay);
          } else {
            toast.error('Failed to load categories after multiple attempts. Please refresh the page.');
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getCategories();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Toggle category selection
  const toggleCategorySelection = (categoryId: number) => {
    setSelectedCategoryIds(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Submit selected categories
  const handleSubmit = async () => {
    if (selectedCategoryIds.length === 0) {
      toast.warning('Please select at least one category');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting categories:', selectedCategoryIds);
      await updateProviderCategories(selectedCategoryIds);
      
      toast.success('Categories updated successfully!');
      
      // Navigate to dashboard or success page
      router.push('/dashboard?profileSetupComplete=true');
    } catch (error: unknown) {
      console.error('Error updating categories:', error);
      // More detailed error logging
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { 
          response: { 
            data?: { message?: string }, 
            status: number 
          }, 
          message?: string 
        };
        console.error('Error response data:', apiError.response.data);
        console.error('Error response status:', apiError.response.status);
        toast.error(`Failed to update categories: ${apiError.response.data?.message || apiError.message}`);
      } else {
        toast.error('Failed to update categories. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group categories for better organization
  const groupedCategories = {
    'Automotive': categories.filter(c => 
      ['Auto Spare Parts', 'Car Maintenance & Repair', 'Tire Shops & Alignment'].includes(c.name)
    ),
    'Construction & Building': categories.filter(c => 
      ['Building Materials Suppliers', 'Construction Companies', 'Steel & Metal Works', 
       'Plumbing & Sanitary Ware', 'Welding & Fabrication', 'Paints & Coatings'].includes(c.name)
    ),
    'Industrial & Equipment': categories.filter(c => 
      ['Power Tools & Equipment', 'Industrial Chemicals', 'Warehouse & Storage', 
       'Office & Industrial Furniture', 'Electrical Supplies & Services', 
       'HVAC & Cooling Systems', 'General Trading & Wholesale'].includes(c.name)
    ),
    'Services & Maintenance': categories.filter(c => 
      ['Cleaning & Janitorial Supplies', 'Pest Control & Facility Services', 
       'Security & CCTV', 'Logistics & Freight', 'Signage & Printing'].includes(c.name)
    ),
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {selectedCategoryIds.length === 0 
            ? 'No categories selected. Select at least one category that best represents your business.'
            : `Selected ${selectedCategoryIds.length} ${selectedCategoryIds.length === 1 ? 'category' : 'categories'}`
          }
        </p>
        
        {selectedCategoryIds.length > 0 && (
          <div className="mt-2 p-3 bg-muted rounded-md">
            <h4 className="text-sm font-medium mb-2">Selected Categories:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedCategoryIds.map(id => {
                const category = categories.find(c => c.id === id);
                return category ? (
                  <div key={id} className="bg-background text-sm rounded-full px-3 py-1 border flex items-center">
                    <CategoryIcon name={category.icon} size={14} className="mr-1.5 text-primary" />
                    {category.name}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>

      {/* Display categories by group */}
      {Object.entries(groupedCategories).map(([groupName, groupCategories]) => 
        groupCategories.length > 0 && (
          <div key={groupName} className="mb-6">
            <h3 className="text-lg font-medium mb-3 pb-2 border-b">{groupName}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {groupCategories.map(category => (
                <div 
                  key={category.id}
                  onClick={() => toggleCategorySelection(category.id)}
                  className={`
                    p-4 rounded-lg border cursor-pointer transition-all
                    ${selectedCategoryIds.includes(category.id) 
                      ? 'border-primary bg-primary/5 shadow-sm' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <CategoryIcon name={category.icon} size={18} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{category.name}</h4>
                      </div>
                    </div>
                    {selectedCategoryIds.includes(category.id) && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      <div className="flex justify-end mt-8 space-x-4">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => router.push(`/dashboard/become-provider/application/images?providerId=${providerId}`)}
        >
          Back
        </Button>
        <Button
          type="button"
          disabled={isSubmitting || selectedCategoryIds.length === 0}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : "Complete Setup"}
        </Button>
      </div>
    </div>
  );
}