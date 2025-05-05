import { NextRequest, NextResponse } from 'next/server';

/**
 * API route for geocoding an address search query to coordinates
 * This endpoint calls Mapbox directly to get geocoding results
 * @param req - The request object
 * @returns A response with the geocoding results
 */
export async function POST(req: NextRequest) {
  try {
    // Get the request body
    const body = await req.json();
    const { query } = body;
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Search query is required' },
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
    
    // Encode the query for URL
    const encodedQuery = encodeURIComponent(query);
    
    // Make the request to Mapbox
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?access_token=${mapboxToken}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Geocoding service error' },
        { status: response.status }
      );
    }
    
    // Get the geocoding results
    const mapboxResponse = await response.json();
    
    // Process the first result (most relevant)
    if (mapboxResponse.features && mapboxResponse.features.length > 0) {
      const feature = mapboxResponse.features[0];
      const coordinates = feature.center;
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
        latitude: coordinates[1],
        longitude: coordinates[0],
        formatted_address: placeName,
        street,
        city: addressComponents.city,
        state: addressComponents.state,
        postal_code: addressComponents.postal_code,
        country: addressComponents.country,
      });
    } else {
      return NextResponse.json(
        { error: 'No results found for the search query' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error in geocoding search API route:', error);
    return NextResponse.json(
      { error: 'Failed to process geocoding request' },
      { status: 500 }
    );
  }
}
