/**
 * String Utilities Module
 * 
 * A standalone utility module for advanced string manipulation and formatting.
 * Provides helper functions for common string operations including case conversion,
 * truncation, validation, sanitization, and text transformations.
 * 
 * Use cases:
 * - Convert between different case styles (camelCase, snake_case, kebab-case, etc.)
 * - Truncate and ellipsize long strings
 * - Remove special characters and sanitize input
 * - Generate slugs for URLs
 * - Check string patterns and validate formats
 * - Extract initials and abbreviations
 * - Word counting and text analysis
 * 
 * @module stringUtilities
 * @version 1.0.0
 * @standalone - No external dependencies
 */

/**
 * Convert string to camelCase
 * @param {string} str - Input string
 * @returns {string} camelCase string
 */
export function toCamelCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^[A-Z]/, char => char.toLowerCase());
}

/**
 * Convert string to PascalCase
 * @param {string} str - Input string
 * @returns {string} PascalCase string
 */
export function toPascalCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^[a-z]/, char => char.toUpperCase());
}

/**
 * Convert string to snake_case
 * @param {string} str - Input string
 * @returns {string} snake_case string
 */
export function toSnakeCase(str) {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

/**
 * Convert string to kebab-case
 * @param {string} str - Input string
 * @returns {string} kebab-case string
 */
export function toKebabCase(str) {
  return str
    .replace(/([A-Z])/g, '-$1')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

/**
 * Capitalize first letter of string
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitalize first letter of each word
 * @param {string} str - Input string
 * @returns {string} Title case string
 */
export function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Truncate string to specified length with ellipsis
 * @param {string} str - Input string
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated string
 */
export function truncate(str, maxLength, suffix = '...') {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Remove all whitespace from string
 * @param {string} str - Input string
 * @returns {string} String without whitespace
 */
export function removeWhitespace(str) {
  return str.replace(/\s+/g, '');
}

/**
 * Remove special characters, keep only alphanumeric
 * @param {string} str - Input string
 * @param {boolean} keepSpaces - Keep spaces (default: false)
 * @returns {string} Sanitized string
 */
export function removeSpecialChars(str, keepSpaces = false) {
  const pattern = keepSpaces ? /[^a-zA-Z0-9\s]/g : /[^a-zA-Z0-9]/g;
  return str.replace(pattern, '');
}

/**
 * Generate URL-friendly slug from string
 * @param {string} str - Input string
 * @returns {string} URL slug
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Count words in a string
 * @param {string} str - Input string
 * @returns {number} Word count
 */
export function wordCount(str) {
  return str.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Count characters excluding whitespace
 * @param {string} str - Input string
 * @returns {number} Character count
 */
export function charCount(str) {
  return str.replace(/\s/g, '').length;
}

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @param {number} maxInitials - Maximum initials to return (default: 2)
 * @returns {string} Initials
 */
export function getInitials(name, maxInitials = 2) {
  return name
    .split(/\s+/)
    .filter(word => word.length > 0)
    .slice(0, maxInitials)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}

/**
 * Check if string is a valid email format
 * @param {string} email - Email string
 * @returns {boolean} True if valid email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if string is a valid URL
 * @param {string} url - URL string
 * @returns {boolean} True if valid URL
 */
export function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if string contains only numbers
 * @param {string} str - Input string
 * @returns {boolean} True if numeric
 */
export function isNumeric(str) {
  return /^\d+$/.test(str);
}

/**
 * Check if string is alphanumeric
 * @param {string} str - Input string
 * @returns {boolean} True if alphanumeric
 */
export function isAlphanumeric(str) {
  return /^[a-zA-Z0-9]+$/.test(str);
}

/**
 * Reverse a string
 * @param {string} str - Input string
 * @returns {string} Reversed string
 */
export function reverse(str) {
  return str.split('').reverse().join('');
}

/**
 * Check if string is a palindrome
 * @param {string} str - Input string
 * @returns {boolean} True if palindrome
 */
export function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === reverse(cleaned);
}

/**
 * Repeat string n times
 * @param {string} str - Input string
 * @param {number} count - Number of repetitions
 * @returns {string} Repeated string
 */
export function repeat(str, count) {
  return str.repeat(Math.max(0, count));
}

/**
 * Pad string to specified length
 * @param {string} str - Input string
 * @param {number} length - Target length
 * @param {string} char - Padding character (default: ' ')
 * @param {string} side - 'left', 'right', or 'both' (default: 'right')
 * @returns {string} Padded string
 */
export function pad(str, length, char = ' ', side = 'right') {
  if (str.length >= length) return str;
  
  const padLength = length - str.length;
  const padding = char.repeat(padLength);
  
  if (side === 'left') {
    return padding + str;
  } else if (side === 'both') {
    const leftPad = Math.floor(padLength / 2);
    const rightPad = padLength - leftPad;
    return char.repeat(leftPad) + str + char.repeat(rightPad);
  } else {
    return str + padding;
  }
}

/**
 * Extract all numbers from string
 * @param {string} str - Input string
 * @returns {number[]} Array of numbers
 */
export function extractNumbers(str) {
  const matches = str.match(/-?\d+\.?\d*/g);
  return matches ? matches.map(Number) : [];
}

/**
 * Mask sensitive information (e.g., credit card, phone)
 * @param {string} str - Input string
 * @param {number} visibleStart - Visible chars at start (default: 4)
 * @param {number} visibleEnd - Visible chars at end (default: 4)
 * @param {string} maskChar - Masking character (default: '*')
 * @returns {string} Masked string
 */
export function mask(str, visibleStart = 4, visibleEnd = 4, maskChar = '*') {
  if (str.length <= visibleStart + visibleEnd) return str;
  
  const start = str.substring(0, visibleStart);
  const end = str.substring(str.length - visibleEnd);
  const maskLength = str.length - visibleStart - visibleEnd;
  
  return start + maskChar.repeat(maskLength) + end;
}

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Edit distance
 */
export function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Default export with all functions
export default {
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  capitalize,
  toTitleCase,
  truncate,
  removeWhitespace,
  removeSpecialChars,
  slugify,
  wordCount,
  charCount,
  getInitials,
  isValidEmail,
  isValidURL,
  isNumeric,
  isAlphanumeric,
  reverse,
  isPalindrome,
  repeat,
  pad,
  extractNumbers,
  mask,
  levenshteinDistance
};
