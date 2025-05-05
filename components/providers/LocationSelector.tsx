'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Map, Edit, Loader2 } from "lucide-react";
import { LocationPickerMapDynamic, LocationData } from '../maps/LocationPickerMap';
import { SimpleLocationPicker } from '../maps/SimpleLocationPicker';
import { toast } from 'sonner';

interface LocationSelectorProps {
  onLocationSelected: (locationData: LocationFormData) => void;
  defaultValues?: Partial<LocationFormData>;
}

export interface LocationFormData {
  latitude: number;
  longitude: number;
  location: string; // Formatted address
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export function LocationSelector({ onLocationSelected, defaultValues }: LocationSelectorProps) {
  const [activeTab, setActiveTab] = useState<string>('map');
  const [mapLocationData, setMapLocationData] = useState<LocationData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useSimpleMap, setUseSimpleMap] = useState(false);
  
  // Create default form values
  const defaultFormValues = {
    location: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    latitude: 0,
    longitude: 0,
    ...defaultValues,
  };
  
  // Check if we're running in an environment where mapbox might not work
  useEffect(() => {
    const checkMapboxSupport = async () => {
      try {
        // Try to dynamically import mapbox-gl
        await import('mapbox-gl');
      } catch (error) {
        console.warn('Mapbox GL not available, falling back to simple location picker', error);
        setUseSimpleMap(true);
      }
    };
    
    checkMapboxSupport();
  }, []);

  // Form for manual entry
  const manualForm = useForm<LocationFormData>({
    defaultValues: defaultFormValues
  });

  // Form for map-selected data
  const mapForm = useForm<LocationFormData>({
    defaultValues: defaultFormValues
  });

  // Handle location selection from map
  const handleMapLocationSelected = (locationData: LocationData) => {
    setMapLocationData(locationData);
    
    // Update the map form with the new data
    mapForm.reset({
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      location: locationData.formatted_address,
      street: locationData.street || '',
      city: locationData.city || '',
      state: locationData.state || '',
      postal_code: locationData.postal_code || '',
      country: locationData.country || '',
    });
  };

  // Submit handler for manual entry form
  const onManualSubmit = async (data: LocationFormData) => {
    // Validate the data first
    if (!data.location || data.location.trim() === '') {
      toast.error('Please enter a location');
      return;
    }

    setIsSubmitting(true);
    try {
      // If coordinates are not provided, geocode the address
      if (!data.latitude || !data.longitude) {
        const response = await fetch('/api/geocoding/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: data.location }),
        });

        if (!response.ok) {
          throw new Error('Failed to geocode address');
        }

        const geocodedData: LocationData = await response.json();
        
        // Update the form data with the geocoded information
        data.latitude = geocodedData.latitude;
        data.longitude = geocodedData.longitude;
        data.street = geocodedData.street || data.street;
        data.city = geocodedData.city || data.city;
        data.state = geocodedData.state || data.state;
        data.postal_code = geocodedData.postal_code || data.postal_code;
        data.country = geocodedData.country || data.country;
        
        // Update the form values so they're visible in the UI
        manualForm.setValue('latitude', data.latitude);
        manualForm.setValue('longitude', data.longitude);
        manualForm.setValue('street', data.street || '');
        manualForm.setValue('city', data.city || '');
        manualForm.setValue('state', data.state || '');
        manualForm.setValue('postal_code', data.postal_code || '');
        manualForm.setValue('country', data.country || '');
      }

      // Call the provided callback with the updated data
      toast.success('Location information updated successfully');
      onLocationSelected(data);
    } catch (error) {
      console.error('Error during manual location selection:', error);
      toast.error(`Failed to process location: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit handler for map form
  const onMapSubmit = (data: LocationFormData) => {
    // Validate that we have the minimum required data
    if (!data.latitude || !data.longitude || !data.location) {
      toast.error('Please select a location on the map first');
      return;
    }
    
    // Call the provided callback with the map data
    toast.success('Location information updated successfully');
    onLocationSelected(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Information</CardTitle>
        <CardDescription>
          Choose your location by searching on the map or enter address details manually
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="map" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="map">
              <Map className="h-4 w-4 mr-2" />
              Select on Map
            </TabsTrigger>
            <TabsTrigger value="manual">
              <Edit className="h-4 w-4 mr-2" />
              Enter Manually
            </TabsTrigger>
          </TabsList>

          {/* Map Selection Tab */}
          <TabsContent value="map">
            <div className="space-y-4">
              {useSimpleMap ? (
                <SimpleLocationPicker onLocationSelected={handleMapLocationSelected} />
              ) : (
                <LocationPickerMapDynamic 
                  onLocationSelected={handleMapLocationSelected}
                  defaultLat={defaultValues?.latitude}
                  defaultLng={defaultValues?.longitude}
                />
              )}

              {mapLocationData && (
                <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-md mb-4">
                      <h3 className="font-medium mb-2">Selected Location</h3>
                      <p className="text-sm">{mapLocationData.formatted_address}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={mapForm.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={mapForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={mapForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={mapForm.control}
                        name="postal_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={mapForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Hidden fields for coordinates and formatted address */}
                      <input type="hidden" {...mapForm.register('latitude')} />
                      <input type="hidden" {...mapForm.register('longitude')} />
                      <input type="hidden" {...mapForm.register('location')} />
                    </div>

                    <Button 
                      type="button" 
                      onClick={() => {
                        const data = mapForm.getValues();
                        onMapSubmit(data);
                      }}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Use This Location
                    </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Manual Entry Tab */}
          <TabsContent value="manual">
            <div className="space-y-4">
                <FormField
                  control={manualForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="123 Main St, City, State, Postal Code, Country" />
                      </FormControl>
                      <FormDescription>
                        Enter your complete address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={manualForm.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={manualForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={manualForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={manualForm.control}
                    name="postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={manualForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="button" 
                  onClick={() => {
                    const data = manualForm.getValues();
                    onManualSubmit(data);
                  }} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing</>
                  ) : (
                    <><Check className="h-4 w-4 mr-2" /> Use This Address</>
                  )}
                </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
