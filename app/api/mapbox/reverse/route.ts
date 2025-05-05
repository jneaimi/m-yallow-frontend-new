import { NextRequest, NextResponse } from 'next/server';

/**
 * This endpoint proxies reverse geocoding requests to Mapbox
 * It provides a server-side implementation that doesn't require client-side Mapbox libraries
 */
export async function POST(req: NextRequest) {
  try {
    // Get the request body
    const body = await req.json();
    const { latitude, longitude } = body;
    
    // Validate required parameters
    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }
    
    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180' },
        { status: 400 }
      );
    }
    
    // Get the Mapbox API token from environment variables
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    
    if (!mapboxToken) {
      return NextResponse.json(
        { error: 'Mapbox configuration error' },
        { status: 500 }
      );
    }
    
    // Make the request to Mapbox reverse geocoding API
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Reverse geocoding service error' },
        { status: response.status }
      );
    }
    
    // Get the geocoding results
    const mapboxResponse = await response.json();
    
    // Process the first result (most relevant)
    if (mapboxResponse.features && mapboxResponse.features.length > 0) {
      const feature = mapboxResponse.features[0];
      const placeName = feature.place_name;
      
      // Extract address components from context
      const context = feature.context || [];
      const addressComponents: Record<string, string> = {};
      
      // Try to extract street from the feature
      let street;
      if (feature.address && feature.text) {
        street = `${feature.address} ${feature.text}`;
      } else if (feature.place_type && feature.place_type.includes('address')) {
        street = feature.text;
      }
      
      // Process context for other components
      for (const item of context) {
        if (!item.id) continue;
        
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
      }
      
      // Return the processed result
      return NextResponse.json({
        latitude,
        longitude,
        formatted_address: placeName,
        street,
        city: addressComponents.city,
        state: addressComponents.state,
        postal_code: addressComponents.postal_code,
        country: addressComponents.country,
      });
    } else {
      return NextResponse.json(
        { error: 'No results found for the coordinates' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error in Mapbox reverse geocoding API:', error);
    return NextResponse.json(
      { error: 'Failed to process reverse geocoding request' },
      { status: 500 }
    );
  }
}
