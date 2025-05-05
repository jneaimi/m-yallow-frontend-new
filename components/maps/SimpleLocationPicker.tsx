'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Define our interface for the location data
export interface LocationData {
  latitude: number;
  longitude: number;
  formatted_address: string;
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

interface SimpleLocationPickerProps {
  onLocationSelected: (locationData: LocationData) => void;
}

export function SimpleLocationPicker({ onLocationSelected }: SimpleLocationPickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Perform location search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/mapbox/geocode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error searching for location');
      }
      
      const locationData: LocationData = await response.json();
      
      // Set the search results
      setSearchResults([locationData]);
      
    } catch (error) {
      toast.error(`Search error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle location selection
  const handleSelectLocation = (location: LocationData) => {
    onLocationSelected(location);
    toast.success('Location selected successfully');
  };
  
  return (
    <div className="space-y-6">
      {/* Search form */}
      <div className="space-y-2">
        <div className="flex flex-col space-y-2">
          <label htmlFor="searchQuery" className="text-sm font-medium">
            Search for a location
          </label>
          <div className="flex gap-2">
            <Input
              id="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter address, city, or place name..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            <Button 
              type="button" 
              onClick={handleSearch} 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-1" />}
              Search
            </Button>
          </div>
          {searchQuery.trim() === '' && (
            <p className="text-sm text-red-500 mt-1">Search term is required</p>
          )}
        </div>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {/* Search results */}
      {!isLoading && searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-md font-medium">Search Results</h3>
          
          {searchResults.map((location, index) => (
            <Card key={index} className="hover:bg-muted/50 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{location.formatted_address}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {location.street && (
                    <div>
                      <span className="font-medium">Street:</span> {location.street}
                    </div>
                  )}
                  {location.city && (
                    <div>
                      <span className="font-medium">City:</span> {location.city}
                    </div>
                  )}
                  {location.state && (
                    <div>
                      <span className="font-medium">State:</span> {location.state}
                    </div>
                  )}
                  {location.postal_code && (
                    <div>
                      <span className="font-medium">Postal Code:</span> {location.postal_code}
                    </div>
                  )}
                  {location.country && (
                    <div>
                      <span className="font-medium">Country:</span> {location.country}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Coordinates:</span> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </div>
                </div>
              </CardContent>
              <CardContent className="pt-0">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => handleSelectLocation(location)}
                  className="w-full"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Use This Location
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* No results message */}
      {!isLoading && searchResults.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
          <MapPin className="h-12 w-12 mb-2" />
          <p>Search for a location to get started</p>
          <p className="text-sm">Enter an address, city, or place name in the search box above</p>
        </div>
      )}
    </div>
  );
}
