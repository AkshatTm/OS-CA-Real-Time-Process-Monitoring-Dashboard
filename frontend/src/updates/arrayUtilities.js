/**
 * Array Utilities Module
 * 
 * A standalone utility module for advanced array operations and transformations.
 * Provides helper functions for sorting, grouping, filtering, and manipulating
 * arrays in various ways without relying on external libraries like lodash.
 * 
 * Use cases:
 * - Group array items by property
 * - Remove duplicates and find unique values
 * - Chunk arrays into smaller segments
 * - Shuffle and sample random elements
 * - Find intersections and differences
 * - Flatten nested arrays
 * - Sort by multiple criteria
 * 
 * @module arrayUtilities
 * @version 1.0.0
 * @standalone - No external dependencies
 */

/**
 * Remove duplicate values from an array
 * @param {Array} arr - Input array
 * @returns {Array} Array with unique values
 */
export function unique(arr) {
  return [...new Set(arr)];
}

/**
 * Group array items by a key or function
 * @param {Array} arr - Input array
 * @param {string|Function} key - Property name or function to group by
 * @returns {Object} Object with grouped items
 */
export function groupBy(arr, key) {
  return arr.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
}

/**
 * Split array into chunks of specified size
 * @param {Array} arr - Input array
 * @param {number} size - Chunk size
 * @returns {Array[]} Array of chunks
 */
export function chunk(arr, size) {
  if (size <= 0) return [];
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Shuffle array randomly (Fisher-Yates algorithm)
 * @param {Array} arr - Input array
 * @returns {Array} Shuffled copy of array
 */
export function shuffle(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random sample of items from array
 * @param {Array} arr - Input array
 * @param {number} count - Number of items to sample
 * @returns {Array} Random sample
 */
export function sample(arr, count = 1) {
  const shuffled = shuffle(arr);
  return shuffled.slice(0, Math.min(count, arr.length));
}

/**
 * Flatten nested array to specified depth
 * @param {Array} arr - Input array
 * @param {number} depth - Depth to flatten (default: 1)
 * @returns {Array} Flattened array
 */
export function flatten(arr, depth = 1) {
  if (depth === 0) return arr;
  return arr.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item, depth - 1) : item);
  }, []);
}

/**
 * Find intersection of multiple arrays
 * @param {...Array} arrays - Arrays to intersect
 * @returns {Array} Common elements
 */
export function intersection(...arrays) {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return [...arrays[0]];
  
  const [first, ...rest] = arrays;
  return unique(first).filter(item => 
    rest.every(arr => arr.includes(item))
  );
}

/**
 * Find difference between arrays (items in first not in others)
 * @param {Array} arr - Base array
 * @param {...Array} others - Arrays to compare
 * @returns {Array} Difference
 */
export function difference(arr, ...others) {
  const otherItems = new Set(others.flat());
  return arr.filter(item => !otherItems.has(item));
}

/**
 * Sort array by multiple properties
 * @param {Array} arr - Input array
 * @param {Array} keys - Array of property names or comparator functions
 * @returns {Array} Sorted copy of array
 */
export function sortBy(arr, keys) {
  if (!Array.isArray(keys)) {
    keys = [keys];
  }
  
  return [...arr].sort((a, b) => {
    for (const key of keys) {
      let aVal, bVal;
      
      if (typeof key === 'function') {
        aVal = key(a);
        bVal = key(b);
      } else {
        aVal = a[key];
        bVal = b[key];
      }
      
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
    }
    return 0;
  });
}

/**
 * Count occurrences of each value in array
 * @param {Array} arr - Input array
 * @returns {Object} Object with counts
 */
export function countBy(arr) {
  return arr.reduce((counts, item) => {
    counts[item] = (counts[item] || 0) + 1;
    return counts;
  }, {});
}

/**
 * Partition array into two groups based on predicate
 * @param {Array} arr - Input array
 * @param {Function} predicate - Test function
 * @returns {Array[]} Array of [truthy, falsy] items
 */
export function partition(arr, predicate) {
  return arr.reduce(
    ([truthy, falsy], item) => {
      if (predicate(item)) {
        truthy.push(item);
      } else {
        falsy.push(item);
      }
      return [truthy, falsy];
    },
    [[], []]
  );
}

/**
 * Create array of numbers in range
 * @param {number} start - Start value
 * @param {number} end - End value (exclusive)
 * @param {number} step - Step size (default: 1)
 * @returns {Array} Range array
 */
export function range(start, end, step = 1) {
  if (step === 0) return [];
  const result = [];
  
  if (step > 0) {
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      result.push(i);
    }
  }
  
  return result;
}

/**
 * Zip multiple arrays together
 * @param {...Array} arrays - Arrays to zip
 * @returns {Array} Array of tuples
 */
export function zip(...arrays) {
  if (arrays.length === 0) return [];
  const maxLength = Math.max(...arrays.map(arr => arr.length));
  
  return range(0, maxLength).map(i => 
    arrays.map(arr => arr[i])
  );
}

/**
 * Find first and last items matching predicate
 * @param {Array} arr - Input array
 * @param {Function} predicate - Test function
 * @returns {Object} {first, last} or {first: undefined, last: undefined}
 */
export function findFirstAndLast(arr, predicate) {
  let first = undefined;
  let last = undefined;
  
  for (const item of arr) {
    if (predicate(item)) {
      if (first === undefined) {
        first = item;
      }
      last = item;
    }
  }
  
  return { first, last };
}

/**
 * Rotate array elements by n positions
 * @param {Array} arr - Input array
 * @param {number} n - Positions to rotate (positive = right, negative = left)
 * @returns {Array} Rotated copy of array
 */
export function rotate(arr, n) {
  if (arr.length === 0) return [];
  const len = arr.length;
  n = ((n % len) + len) % len; // Normalize rotation
  return [...arr.slice(n), ...arr.slice(0, n)];
}

/**
 * Compare two arrays for equality
 * @param {Array} arr1 - First array
 * @param {Array} arr2 - Second array
 * @param {boolean} deep - Deep comparison (default: false)
 * @returns {boolean} True if equal
 */
export function arraysEqual(arr1, arr2, deep = false) {
  if (arr1.length !== arr2.length) return false;
  
  for (let i = 0; i < arr1.length; i++) {
    if (deep && Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
      if (!arraysEqual(arr1[i], arr2[i], true)) return false;
    } else if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  
  return true;
}

/**
 * Get the maximum value based on a property or function
 * @param {Array} arr - Input array
 * @param {string|Function} selector - Property name or function
 * @returns {*} Item with maximum value
 */
export function maxBy(arr, selector) {
  if (arr.length === 0) return undefined;
  
  return arr.reduce((max, item) => {
    const maxVal = typeof selector === 'function' ? selector(max) : max[selector];
    const itemVal = typeof selector === 'function' ? selector(item) : item[selector];
    return itemVal > maxVal ? item : max;
  });
}

/**
 * Get the minimum value based on a property or function
 * @param {Array} arr - Input array
 * @param {string|Function} selector - Property name or function
 * @returns {*} Item with minimum value
 */
export function minBy(arr, selector) {
  if (arr.length === 0) return undefined;
  
  return arr.reduce((min, item) => {
    const minVal = typeof selector === 'function' ? selector(min) : min[selector];
    const itemVal = typeof selector === 'function' ? selector(item) : item[selector];
    return itemVal < minVal ? item : min;
  });
}

// Default export with all functions
export default {
  unique,
  groupBy,
  chunk,
  shuffle,
  sample,
  flatten,
  intersection,
  difference,
  sortBy,
  countBy,
  partition,
  range,
  zip,
  findFirstAndLast,
  rotate,
  arraysEqual,
  maxBy,
  minBy
};
