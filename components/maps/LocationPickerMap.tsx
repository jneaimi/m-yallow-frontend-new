'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, MapPin } from 'lucide-react';
import { toast } from 'sonner';

// We need to dynamically import mapbox-gl to avoid SSR issues
import dynamic from 'next/dynamic';

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

interface LocationPickerMapProps {
  defaultLat?: number;
  defaultLng?: number;
  onLocationSelected: (locationData: LocationData) => void;
}

// Define our component
const LocationPickerMap = ({ 
  defaultLat = 40.7128, 
  defaultLng = -74.0060,
  onLocationSelected 
}: LocationPickerMapProps) => {
  // Refs for mapbox elements
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const marker = useRef<any>(null);
  const geocoder = useRef<any>(null);
  
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxLoaded, setMapboxLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handle search button click
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      // If the geocoder is available, use it
      if (geocoder.current) {
        geocoder.current.query(searchQuery);
        setIsLoading(false);
        return;
      }
      
      // Fallback to API if geocoder not available
      const response = await fetch('/api/geocoding/search', {
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
      
      // Update marker and map position if they exist
      if (map.current && marker.current) {
        const newLngLat = [locationData.longitude, locationData.latitude];
        marker.current.setLngLat(newLngLat);
        map.current.flyTo({ center: newLngLat, zoom: 14 });
      }
      
      // Call the callback with the location data
      onLocationSelected(locationData);
    } catch (error) {
      toast.error(`Search error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  // Load mapbox modules on client side only
  useEffect(() => {
    let mapboxgl: any;
    let MapboxGeocoder: any;
    
    const loadMapbox = async () => {
      try {
        // Dynamic imports
        const mapboxModule = await import('mapbox-gl');
        mapboxgl = mapboxModule.default;
        
        // Set the access token
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
        
        try {
          // Load the geocoder module
          const geocoderModule = await import('@mapbox/mapbox-gl-geocoder');
          MapboxGeocoder = geocoderModule.default;
        } catch (error) {
          console.warn('Mapbox geocoder module failed to load:', error);
        }
        
        // Signal that mapbox has loaded
        setMapboxLoaded(true);
      } catch (error) {
        console.error('Error loading Mapbox:', error);
        toast.error('Failed to load map components. Using fallback method.');
      }
    };
    
    loadMapbox();
    
    // Dynamic import of CSS files
    try {
      import('mapbox-gl/dist/mapbox-gl.css');
      import('@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css');
    } catch (error) {
      console.warn('Failed to load map CSS:', error);
    }
  }, []);
  
  // Initialize map once mapbox has loaded
  useEffect(() => {
    if (!mapboxLoaded || map.current) return; // Only initialize once
    
    let mapboxgl;
    let MapboxGeocoder;
    
    try {
      mapboxgl = require('mapbox-gl'); // Already loaded by the previous effect
      MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder'); // Already loaded
    } catch (error) {
      console.error('Failed to require mapbox modules:', error);
      return;
    }
    
    if (!mapboxgl.accessToken) {
      console.error('Mapbox access token is required');
      toast.error('Map configuration error. Please contact support.');
      return;
    }
    
    if (mapContainer.current) {
      try {
        // Create the map instance
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [defaultLng, defaultLat],
          zoom: 12,
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Add user location control if geolocation is available
        if (navigator.geolocation) {
          map.current.addControl(
            new mapboxgl.GeolocateControl({
              positionOptions: {
                enableHighAccuracy: true
              },
              trackUserLocation: true,
              showUserHeading: true
            }),
            'top-right'
          );
        }
        
        // Add geocoder (search box) if available
        if (MapboxGeocoder) {
          try {
            geocoder.current = new MapboxGeocoder({
              accessToken: mapboxgl.accessToken,
              mapboxgl: mapboxgl,
              marker: false, // Don't add a marker immediately
              placeholder: 'Search for a location...',
            });
            
            // Add geocoder to the map
            map.current.addControl(geocoder.current);
            
            // Listen for result selection
            geocoder.current.on('result', (e: any) => {
              // Update the marker position
              const coordinates = e.result.center;
              marker.current?.setLngLat(coordinates);
              
              // Process the result
              processGeocoderResult(e.result);
            });
          } catch (error) {
            console.error('Failed to initialize geocoder:', error);
          }
        }

        // Add marker
        marker.current = new mapboxgl.Marker({ draggable: true })
          .setLngLat([defaultLng, defaultLat])
          .addTo(map.current);

        // Handle marker drag end
        marker.current.on('dragend', () => {
          const lngLat = marker.current?.getLngLat();
          if (lngLat) {
            reverseGeocode(lngLat.lat, lngLat.lng);
          }
        });

        // Handle map click
        map.current.on('click', (e: any) => {
          marker.current?.setLngLat(e.lngLat);
          reverseGeocode(e.lngLat.lat, e.lngLat.lng);
        });
        
        // Signal that the map has loaded
        map.current.on('load', () => {
          setMapLoaded(true);
        });
      } catch (error) {
        console.error('Error initializing map:', error);
        toast.error('Failed to initialize map. Try using manual address entry instead.');
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (map.current) {
        try {
          map.current.remove();
        } catch (error) {
          console.error('Error removing map:', error);
        }
        map.current = null;
      }
    };
  }, [mapboxLoaded, defaultLat, defaultLng]);
  
  // Process geocoder result
  const processGeocoderResult = (result: any) => {
    if (!result) return;
    
    try {
      // Extract coordinates and place name
      const coordinates = result.center;
      const placeName = result.place_name;
      
      // Extract address components from context
      const context = result.context || [];
      const addressComponents: Record<string, string> = {};
      
      // Attempt to extract street from the result
      let street;
      if (result.address && result.text) {
        street = `${result.address} ${result.text}`;
      } else if (result.place_type && result.place_type.includes('address')) {
        street = result.text;
      }
      
      // Process context items to extract components
      context.forEach((item: any) => {
        if (!item || !item.id) return;
        
        const id = item.id.split('.')[0];
        const text = item.text;
        
        if (id === 'postcode') {
          addressComponents.postal_code = text;
        } else if (id === 'place') {
          addressComponents.city = text;
        } else if (id === 'region') {
          addressComponents.state = text;
        } else if (id === 'country') {
          addressComponents.country = text;
        }
      });
      
      // Create location data
      const locationData: LocationData = {
        latitude: coordinates[1],
        longitude: coordinates[0],
        formatted_address: placeName,
        street,
        city: addressComponents.city,
        state: addressComponents.state,
        postal_code: addressComponents.postal_code,
        country: addressComponents.country,
      };
      
      // Call onLocationSelected with the data
      onLocationSelected(locationData);
    } catch (error) {
      console.error('Error processing geocoder result:', error);
      toast.error('Failed to process location data');
    }
  };



  // Reverse geocode coordinates
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      // Call our backend API for reverse geocoding
      const response = await fetch('/api/geocoding/reverse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error getting address information');
      }
      
      const locationData: LocationData = await response.json();
      
      // Call the callback with the location data
      onLocationSelected(locationData);
    } catch (error) {
      toast.error(`Geocoding error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Even if reverse geocoding fails, still provide coordinates
      onLocationSelected({
        latitude: lat,
        longitude: lng,
        formatted_address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle fallback if Mapbox fails to load
  if (!mapboxLoaded && isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="ml-2">Loading map components...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search bar for manual entry */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location..."
            className="w-full"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
        </div>
        <Button 
          type="button" 
          onClick={handleSearch} 
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-1" />}
          Search
        </Button>
      </div>

      {/* Map container */}
      <div 
        ref={mapContainer} 
        className="w-full h-96 rounded-md border border-gray-200 bg-gray-50"
      >
        {!mapboxLoaded && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-primary/10 rounded-full p-4 mb-2">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <p className="text-center max-w-md px-4">
              Map loading failed. You can still search for locations using the search bar above,
              or enter address details manually using the tab above.
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <p className="text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 inline mr-1" />
        Click on the map or drag the marker to select a location
      </p>
    </div>
  );
};

// Use dynamic import to avoid SSR issues
export const LocationPickerMapDynamic = dynamic(
  () => Promise.resolve(LocationPickerMap),
  { ssr: false }
);

export default LocationPickerMapDynamic;
