/**
 * Utility functions for sanitizing data to prevent XSS attacks.
 */
import DOMPurify from 'dompurify';

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
  
  // Use DOMPurify to strip all HTML tags and entities
  return DOMPurify.sanitize(stringValue, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [] // No attributes allowed
  });
}

/**
 * Sanitizes a JavaScript object by applying sanitizeString to all string properties.
 * This is useful for sanitizing objects before they are serialized to JSON.
 * 
 * @param obj - The object to sanitize
 * @returns A new object with all string properties sanitized
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const result = {} as T;

  // Loop through all properties of the object
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (typeof value === 'string' || typeof value === 'number') {
        // If the value is a string or number, sanitize it
        result[key] = sanitizeString(value) as any;
      } else if (Array.isArray(value)) {
        // If the value is an array, recursively sanitize each element
        result[key] = value.map(item => 
          typeof item === 'object' ? sanitizeObject(item) : sanitizeString(item)
        ) as any;
      } else if (value && typeof value === 'object') {
        // If the value is an object, recursively sanitize it
        result[key] = sanitizeObject(value) as any;
      } else {
        // For other types (boolean, null, undefined), use as-is
        result[key] = value;
      }
    }
  }

  return result;
}
