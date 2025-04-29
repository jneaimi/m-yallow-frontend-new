/**
 * Utility functions for sanitizing data to prevent XSS attacks.
 */
import DOMPurify from 'dompurify';

/**
 * Simple regex-based HTML sanitizer for server-side contexts
 * where DOMPurify is not available
 */
function simpleSanitize(str: string): string {
  return str.replace(/<[^>]*>?/gm, '');
}

/**
 * Sanitizes a string by removing all HTML tags.
 * Use this function when embedding user-generated content in dangerous contexts
 * like JSON-LD or HTML attributes.
 * 
 * @param value - The string to sanitize, can be undefined or null
 * @returns A sanitized string with all HTML tags removed, or empty string if input is undefined/null
 */
export function sanitizeString(value: string | number | undefined | null): string {
  if (value === undefined || value === null) {
    return '';
  }
  
  // Convert to string if it's a number
  const stringValue = typeof value === 'number' ? String(value) : value;
  
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  if (isBrowser) {
    try {
      // Use DOMPurify in browser environments
      return DOMPurify.sanitize(stringValue, {
        ALLOWED_TAGS: [], // No HTML tags allowed
        ALLOWED_ATTR: [] // No attributes allowed
      });
    } catch (error) {
      console.error('DOMPurify sanitization failed, using fallback method:', error);
      return simpleSanitize(stringValue);
    }
  } else {
    // Use regex-based sanitization for server-side rendering
    return simpleSanitize(stringValue);
  }
}

/**
 * Sanitizes a JavaScript object by applying sanitizeString to all string properties.
 * This is useful for sanitizing objects before they are serialized to JSON.
 * 
 * @param obj - The object to sanitize
 * @param seen - WeakSet to track processed objects and prevent circular reference issues
 * @returns A new object with all string properties sanitized
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T, seen?: WeakSet<object>): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  const _seen = seen || new WeakSet();
  if (_seen.has(obj)) {
    return {} as T; // Return empty object for circular references
  }
  _seen.add(obj);

  const result = {} as T;

  // Loop through all properties of the object
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (typeof value === 'string' || typeof value === 'number') {
        // If the value is a string or number, sanitize it
        result[key] = sanitizeString(value) as unknown as T[typeof key];
      } else if (Array.isArray(value)) {
        // If the value is an array, recursively sanitize each element
        result[key] = value.map(item => 
          typeof item === 'object' && item !== null ? sanitizeObject(item, _seen) : sanitizeString(item)
        ) as unknown as T[typeof key];
      } else if (value && typeof value === 'object') {
        // If the value is an object, recursively sanitize it
        result[key] = sanitizeObject(value, _seen) as unknown as T[typeof key];
      } else {
        // For other types (boolean, null, undefined), use as-is
        result[key] = value;
      }
    }
  }

  return result;
}
