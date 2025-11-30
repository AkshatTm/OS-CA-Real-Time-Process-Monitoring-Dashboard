/**
 * Date and Time Utilities Module
 * 
 * A standalone utility module for date and time manipulation, formatting,
 * and calculations. Provides helper functions for common date operations
 * without relying on external libraries like moment.js or date-fns.
 * 
 * Use cases:
 * - Format dates in various styles (relative time, custom formats)
 * - Calculate time differences and durations
 * - Parse and validate date strings
 * - Get time ago representations (e.g., "2 hours ago")
 * - Handle timezone-aware operations
 * - Generate date ranges
 * 
 * @module dateTimeUtilities
 * @version 1.0.0
 * @standalone - No external dependencies
 */

/**
 * Format a date into a readable string
 * @param {Date|string|number} date - Date object, ISO string, or timestamp
 * @param {string} format - Format type: 'short', 'long', 'iso', 'time', 'datetime'
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = 'short') {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }
  
  const options = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
    time: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
    datetime: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  };
  
  if (format === 'iso') {
    return d.toISOString();
  }
  
  return d.toLocaleDateString('en-US', options[format] || options.short);
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param {Date|string|number} date - Date to compare
 * @param {Date} baseDate - Base date for comparison (default: now)
 * @returns {string} Relative time string
 */
export function getTimeAgo(date, baseDate = new Date()) {
  const d = new Date(date);
  const base = new Date(baseDate);
  
  if (isNaN(d.getTime()) || isNaN(base.getTime())) {
    return 'Invalid Date';
  }
  
  const seconds = Math.floor((base - d) / 1000);
  const isFuture = seconds < 0;
  const absSeconds = Math.abs(seconds);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(absSeconds / interval.seconds);
    if (count >= 1) {
      const plural = count > 1 ? 's' : '';
      return isFuture 
        ? `in ${count} ${interval.label}${plural}`
        : `${count} ${interval.label}${plural} ago`;
    }
  }
  
  return 'just now';
}

/**
 * Calculate the difference between two dates
 * @param {Date|string|number} date1 - First date
 * @param {Date|string|number} date2 - Second date
 * @param {string} unit - Unit: 'ms', 'seconds', 'minutes', 'hours', 'days'
 * @returns {number} Time difference in specified unit
 */
export function getTimeDifference(date1, date2, unit = 'ms') {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    return NaN;
  }
  
  const diff = Math.abs(d1 - d2);
  
  const conversions = {
    ms: 1,
    seconds: 1000,
    minutes: 60000,
    hours: 3600000,
    days: 86400000
  };
  
  return diff / (conversions[unit] || 1);
}

/**
 * Add time to a date
 * @param {Date|string|number} date - Base date
 * @param {number} amount - Amount to add
 * @param {string} unit - Unit: 'days', 'hours', 'minutes', 'seconds'
 * @returns {Date} New date with added time
 */
export function addTime(date, amount, unit = 'days') {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return new Date('Invalid Date');
  }
  
  const conversions = {
    seconds: 1000,
    minutes: 60000,
    hours: 3600000,
    days: 86400000
  };
  
  const ms = amount * (conversions[unit] || conversions.days);
  return new Date(d.getTime() + ms);
}

/**
 * Check if a date is valid
 * @param {any} date - Value to check
 * @returns {boolean} True if valid date
 */
export function isValidDate(date) {
  const d = new Date(date);
  return !isNaN(d.getTime());
}

/**
 * Check if a date is in the past
 * @param {Date|string|number} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export function isPast(date) {
  const d = new Date(date);
  return isValidDate(d) && d < new Date();
}

/**
 * Check if a date is in the future
 * @param {Date|string|number} date - Date to check
 * @returns {boolean} True if date is in the future
 */
export function isFuture(date) {
  const d = new Date(date);
  return isValidDate(d) && d > new Date();
}

/**
 * Check if a date is today
 * @param {Date|string|number} date - Date to check
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
  const d = new Date(date);
  const today = new Date();
  
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear();
}

/**
 * Get the start of day for a date
 * @param {Date|string|number} date - Date
 * @returns {Date} Start of day (00:00:00.000)
 */
export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the end of day for a date
 * @param {Date|string|number} date - Date
 * @returns {Date} End of day (23:59:59.999)
 */
export function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Format duration in milliseconds to readable string
 * @param {number} ms - Duration in milliseconds
 * @param {boolean} verbose - Use verbose format (default: false)
 * @returns {string} Formatted duration
 */
export function formatDuration(ms, verbose = false) {
  if (typeof ms !== 'number' || ms < 0) {
    return '0s';
  }
  
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / 60000) % 60;
  const hours = Math.floor(ms / 3600000) % 24;
  const days = Math.floor(ms / 86400000);
  
  if (verbose) {
    const parts = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    if (seconds > 0) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);
    return parts.length > 0 ? parts.join(', ') : '0 seconds';
  }
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
  
  return parts.join(' ');
}

/**
 * Get an array of dates between two dates
 * @param {Date|string|number} startDate - Start date
 * @param {Date|string|number} endDate - End date
 * @returns {Date[]} Array of dates
 */
export function getDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (!isValidDate(start) || !isValidDate(end) || start > end) {
    return [];
  }
  
  const dates = [];
  const current = new Date(start);
  
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

/**
 * Get day of week name
 * @param {Date|string|number} date - Date
 * @param {boolean} short - Use short format (default: false)
 * @returns {string} Day name
 */
export function getDayName(date, short = false) {
  const d = new Date(date);
  
  if (!isValidDate(d)) {
    return 'Invalid Date';
  }
  
  const days = short 
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  return days[d.getDay()];
}

/**
 * Get month name
 * @param {Date|string|number} date - Date
 * @param {boolean} short - Use short format (default: false)
 * @returns {string} Month name
 */
export function getMonthName(date, short = false) {
  const d = new Date(date);
  
  if (!isValidDate(d)) {
    return 'Invalid Date';
  }
  
  const months = short
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 
       'August', 'September', 'October', 'November', 'December'];
  
  return months[d.getMonth()];
}

/**
 * Parse common date string formats
 * @param {string} dateString - Date string to parse
 * @returns {Date|null} Parsed date or null if invalid
 */
export function parseDate(dateString) {
  if (!dateString) return null;
  
  const d = new Date(dateString);
  return isValidDate(d) ? d : null;
}

// Default export with all functions
export default {
  formatDate,
  getTimeAgo,
  getTimeDifference,
  addTime,
  isValidDate,
  isPast,
  isFuture,
  isToday,
  startOfDay,
  endOfDay,
  formatDuration,
  getDateRange,
  getDayName,
  getMonthName,
  parseDate
};
