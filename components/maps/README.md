# Map Components for Provider Location Selection

This directory contains map components for selecting a provider's location in the M-Yallow application.

## Components Overview

### 1. LocationPickerMapDynamic

The primary map component using Mapbox GL JS for an interactive location selection experience. Features include:

- Interactive map with draggable marker
- Address search functionality
- Geocoding and reverse geocoding
- Support for both map and manual input of locations

### 2. SimpleLocationPicker

A lightweight alternative that doesn't require Mapbox GL JS client libraries. It uses our backend API endpoints to provide search functionality and coordinates. This component is used as a fallback if Mapbox GL JS fails to load.

## Dependencies

The components use the following dependencies:

- `mapbox-gl`: For map rendering
- `@mapbox/mapbox-gl-geocoder`: For address search functionality

## Installation

Since you're using newer versions of React 19 and Next.js 15, you may encounter peer dependency conflicts. Use our installation script to handle these conflicts:

```bash
node scripts/add-mapbox-deps.js
```

This script will:

1. Install Mapbox dependencies with the `--legacy-peer-deps` flag
2. Add a `update-mapbox` script to your package.json for future updates
3. Set appropriate version resolutions to prevent conflicts

If automatic installation fails, it will add the dependencies to your package.json, and you can run:

```bash
npm install --legacy-peer-deps
```

## Environment Variables

Ensure your `.env.local` file contains the following:

```
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

## Fallback Mechanism

The components are designed with resilience in mind:

1. First, we try to load the full `LocationPickerMapDynamic` component with interactive map
2. If Mapbox GL JS fails to load, we fall back to `SimpleLocationPicker` which uses a backend API proxy
3. If all else fails, users can always use the manual address entry tab

## Customization

You can customize the map appearance by modifying the Mapbox style URL in the `LocationPickerMap.tsx` file:

```typescript
style: 'mapbox://styles/mapbox/streets-v12', // Try other styles like: satellite-v9, light-v11, etc.
```

## Troubleshooting

If you encounter issues with the map:

1. Check that your Mapbox token is valid and has the necessary permissions
2. Ensure you're using the `--legacy-peer-deps` flag when installing dependencies
3. Try using the `SimpleLocationPicker` component if the interactive map fails
4. Check for browser console errors related to Mapbox
