#!/usr/bin/env node

/**
 * This script adds Mapbox dependencies to package.json with the --legacy-peer-deps flag
 * to handle dependency conflicts with newer versions of React/Next.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path to package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');

// Check if package.json exists
if (!fs.existsSync(packageJsonPath)) {
  console.error('package.json not found!');
  process.exit(1);
}

// Add the dependencies with legacy-peer-deps
try {
  console.log('Installing Mapbox dependencies...');
  execSync('npm install mapbox-gl @mapbox/mapbox-gl-geocoder --legacy-peer-deps', { stdio: 'inherit' });
  console.log('Installing Mapbox type dependencies...');
  execSync('npm install --save-dev @types/mapbox-gl @types/mapbox__mapbox-gl-geocoder --legacy-peer-deps', { stdio: 'inherit' });
  console.log('Mapbox dependencies installed successfully!');
} catch (error) {
  console.error('Failed to install dependencies:', error.message);
  
  // Even if direct installation fails, add the dependencies to package.json manually
  console.log('Attempting to add dependencies manually to package.json...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Add dependencies if not already present
    packageJson.dependencies = packageJson.dependencies || {};
    packageJson.devDependencies = packageJson.devDependencies || {};
    
    packageJson.dependencies['mapbox-gl'] = '^2.15.0';
    packageJson.dependencies['@mapbox/mapbox-gl-geocoder'] = '^5.0.0';
    packageJson.devDependencies['@types/mapbox-gl'] = '^2.7.15';
    packageJson.devDependencies['@types/mapbox__mapbox-gl-geocoder'] = '^4.7.6';
    
    // Add resolutions to handle conflicts
    packageJson.resolutions = packageJson.resolutions || {};
    packageJson.resolutions['mapbox-gl'] = '^2.15.0';
    
    // Write the updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    console.log('Dependencies added to package.json. Run npm install with --legacy-peer-deps flag manually.');
  } catch (err) {
    console.error('Failed to update package.json manually:', err.message);
  }
}

// Add a special script to package.json for future dependency updates
try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add a script for updating Mapbox dependencies
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts['update-mapbox'] = 'npm install mapbox-gl @mapbox/mapbox-gl-geocoder --legacy-peer-deps';
  
  // Write the updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  console.log('Added "update-mapbox" script to package.json');
} catch (error) {
  console.error('Failed to add script to package.json:', error.message);
}

console.log('Setup complete!');
