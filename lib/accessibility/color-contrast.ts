/**
 * Color Contrast Utilities
 * 
 * Functions for calculating and testing color contrast ratios
 * to ensure compliance with WCAG accessibility standards.
 */

/**
 * RGB Color interface
 */
interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Convert a CSS color string to RGB values
 * Supports hex, rgb, and rgba color formats
 * 
 * @param color CSS color string
 * @returns RGB object with r, g, b values (0-255)
 */
export function parseColor(color: string): RGB {
  // Strip whitespace
  color = color.trim();
  
  // Handle hex colors
  if (color.startsWith('#')) {
    return parseHexColor(color);
  }
  
  // Handle rgb/rgba colors
  if (color.startsWith('rgb')) {
    return parseRgbColor(color);
  }
  
  // Handle OKLCH colors
  if (color.startsWith('oklch')) {
    // This is a simplified placeholder as OKLCH conversion is complex
    // In a real implementation, proper OKLCH to RGB conversion would be needed
    console.warn('OKLCH conversion is not fully supported in this utility');
    return { r: 128, g: 128, b: 128 };
  }
  
  // Default fallback
  console.warn(`Unsupported color format: ${color}`);
  return { r: 0, g: 0, b: 0 };
}

/**
 * Parse a hex color string to RGB
 * 
 * @param hex Hex color string (#RGB or #RRGGBB)
 * @returns RGB object
 */
function parseHexColor(hex: string): RGB {
  // Remove # prefix
  hex = hex.substring(1);
  
  // Expand shorthand format
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
}

/**
 * Parse an RGB or RGBA color string to RGB
 * 
 * @param rgbString RGB/RGBA color string (e.g., "rgb(255, 0, 0)" or "rgba(255, 0, 0, 0.5)")
 * @returns RGB object
 */
function parseRgbColor(rgbString: string): RGB {
  // Extract values from the string
  const matches = rgbString.match(/\d+(\.\d+)?/g);
  
  if (!matches || matches.length < 3) {
    console.warn(`Invalid RGB format: ${rgbString}`);
    return { r: 0, g: 0, b: 0 };
  }
  
  return {
    r: parseInt(matches[0], 10),
    g: parseInt(matches[1], 10),
    b: parseInt(matches[2], 10),
  };
}

/**
 * Calculate the relative luminance of a color
 * Using the formula from WCAG 2.0
 * 
 * @param rgb RGB color object
 * @returns Relative luminance value (0-1)
 */
export function getLuminance(rgb: RGB): number {
  // Convert RGB to sRGB
  const sRGB = {
    r: rgb.r / 255,
    g: rgb.g / 255,
    b: rgb.b / 255,
  };
  
  // Apply the formula for each channel
  const channels = Object.entries(sRGB).map(([_, value]) => {
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  
  // Calculate luminance with coefficients from WCAG
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

/**
 * Calculate contrast ratio between two colors
 * 
 * @param color1 First color (CSS color string)
 * @param color2 Second color (CSS color string)
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(parseColor(color1));
  const lum2 = getLuminance(parseColor(color2));
  
  // Determine lighter and darker luminance
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  // Calculate contrast ratio: (L1 + 0.05) / (L2 + 0.05)
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if a color combination meets WCAG AA contrast requirements
 * 
 * @param foreground Foreground color (text color)
 * @param background Background color
 * @param isLargeText Whether the text is large (18pt+ or 14pt+ bold)
 * @returns Object with contrast ratio and pass/fail status
 */
export function meetsWCAGAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): { ratio: number; passes: boolean } {
  const ratio = getContrastRatio(foreground, background);
  
  // WCAG AA requirements:
  // - Normal text: 4.5:1
  // - Large text: 3:1
  const threshold = isLargeText ? 3 : 4.5;
  
  return {
    ratio,
    passes: ratio >= threshold,
  };
}

/**
 * Check if a color combination meets WCAG AAA contrast requirements
 * 
 * @param foreground Foreground color (text color)
 * @param background Background color
 * @param isLargeText Whether the text is large (18pt+ or 14pt+ bold)
 * @returns Object with contrast ratio and pass/fail status
 */
export function meetsWCAGAAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): { ratio: number; passes: boolean } {
  const ratio = getContrastRatio(foreground, background);
  
  // WCAG AAA requirements:
  // - Normal text: 7:1
  // - Large text: 4.5:1
  const threshold = isLargeText ? 4.5 : 7;
  
  return {
    ratio,
    passes: ratio >= threshold,
  };
}

/**
 * Generate a contrast report for theme colors
 * 
 * @param colors Object containing foreground and background color pairs
 * @returns Report with contrast ratios and WCAG compliance status
 */
export function generateContrastReport(
  colors: Record<string, { foreground: string; background: string }>
): Record<string, { ratio: number; passesAA: boolean; passesAAA: boolean }> {
  const report: Record<string, { ratio: number; passesAA: boolean; passesAAA: boolean }> = {};
  
  for (const [name, { foreground, background }] of Object.entries(colors)) {
    const ratio = getContrastRatio(foreground, background);
    
    report[name] = {
      ratio,
      passesAA: ratio >= 4.5,
      passesAAA: ratio >= 7,
    };
  }
  
  return report;
}

/**
 * Get CSS variables from the document and convert to a color map
 * 
 * @returns Object mapping variable names to their color values
 */
export function getThemeColors(): Record<string, string> {
  // Ensure we're in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {};
  }
  
  // Get computed styles from document root element
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  
  // Initialize the color map
  const colors: Record<string, string> = {};
  
  // Common theme variables to look for
  const themeVars = [
    'background',
    'foreground',
    'primary',
    'primary-foreground',
    'secondary',
    'secondary-foreground',
    'muted',
    'muted-foreground',
    'accent',
    'accent-foreground',
    'destructive',
    'destructive-foreground',
    'card',
    'card-foreground',
    'popover',
    'popover-foreground',
    'border',
    'input',
    'ring',
  ];
  
  // Get CSS variable values
  themeVars.forEach((name) => {
    const value = computedStyle.getPropertyValue(`--${name}`).trim();
    if (value) {
      colors[name] = value;
    }
  });
  
  return colors;
}

/**
 * Check if theme colors meet WCAG AA contrast requirements
 * 
 * @returns Report on contrast compliance
 */
/**
 * Report structure for WCAG contrast compliance
 */
export type WCAGReport = {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  foreground: string;
  background: string;
};

/**
 * Check if theme colors meet WCAG AA contrast requirements
 * 
 * @returns Report on contrast compliance
 */
export function auditThemeContrast(): Record<string, WCAGReport> {
  const colors = getThemeColors();
  const report: Record<string, WCAGReport> = {};
  
  // Text on background
  if (colors.foreground && colors.background) {
    const ratio = getContrastRatio(colors.foreground, colors.background);
    report['text'] = {
      ratio,
      passesAA: ratio >= 4.5,
      passesAAA: ratio >= 7,
      foreground: colors.foreground,
      background: colors.background,
    };
  }
  
  // Primary button text
  if (colors['primary-foreground'] && colors.primary) {
    const ratio = getContrastRatio(colors['primary-foreground'], colors.primary);
    report['primary-button'] = {
      ratio,
      passesAA: ratio >= 4.5,
      passesAAA: ratio >= 7,
      foreground: colors['primary-foreground'],
      background: colors.primary,
    };
  }
  
  // Secondary button text
  if (colors['secondary-foreground'] && colors.secondary) {
    const ratio = getContrastRatio(colors['secondary-foreground'], colors.secondary);
    report['secondary-button'] = {
      ratio,
      passesAA: ratio >= 4.5,
      passesAAA: ratio >= 7,
      foreground: colors['secondary-foreground'],
      background: colors.secondary,
    };
  }
  
  // Muted text
  if (colors['muted-foreground'] && colors.muted) {
    const ratio = getContrastRatio(colors['muted-foreground'], colors.muted);
    report['muted-text'] = {
      ratio,
      passesAA: ratio >= 4.5,
      passesAAA: ratio >= 7,
      foreground: colors['muted-foreground'],
      background: colors.muted,
    };
  }
  
  // Accent elements
  if (colors['accent-foreground'] && colors.accent) {
    const ratio = getContrastRatio(colors['accent-foreground'], colors.accent);
    report['accent'] = {
      ratio,
      passesAA: ratio >= 4.5,
      passesAAA: ratio >= 7,
      foreground: colors['accent-foreground'],
      background: colors.accent,
    };
  }
  
  // Destructive elements
  if (colors.destructive && colors.background) {
    const ratio = getContrastRatio(colors.destructive, colors.background);
    report['destructive'] = {
      ratio,
      passesAA: ratio >= 4.5,
      passesAAA: ratio >= 7,
      foreground: colors.destructive,
      background: colors.background,
    };
  }
  
  // Card text
  if (colors['card-foreground'] && colors.card) {
    const ratio = getContrastRatio(colors['card-foreground'], colors.card);
    report['card'] = {
      ratio,
      passesAA: ratio >= 4.5,
      passesAAA: ratio >= 7,
      foreground: colors['card-foreground'],
      background: colors.card,
    };
  }
  
  return report;
}

/**
 * Creates a diagnostic tool component for testing color contrast in the application
 * This can be used in a development environment to check for accessibility issues
 */
export function createContrastDiagnostic() {
  const report = auditThemeContrast();
  
  // Format the diagnostic output
  let output = '### Theme Color Contrast Report\n\n';
  output += '| Element | Ratio | AA (4.5:1) | AAA (7:1) |\n';
  output += '|---------|-------|------------|------------|\n';
  
  Object.entries(report).forEach(([name, data]) => {
    output += `| ${name} | ${data.ratio.toFixed(2)}:1 | ${data.passesAA ? '✅' : '❌'} | ${data.passesAAA ? '✅' : '❌'} |\n`;
  });
  
  return output;
}
