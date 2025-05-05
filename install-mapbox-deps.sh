#!/bin/bash

# Install Mapbox GL JS and Mapbox Geocoder with legacy-peer-deps flag
npm install mapbox-gl @mapbox/mapbox-gl-geocoder --legacy-peer-deps

# Install types for TypeScript support with legacy-peer-deps flag
npm install --save-dev @types/mapbox-gl @types/mapbox__mapbox-gl-geocoder --legacy-peer-deps

echo "Mapbox dependencies installed successfully with legacy-peer-deps"
