/**
 * formatters.js
 *
 * Standalone utility module for data formatting and conversion.
 *
 * Purpose:
 * This module provides a collection of pure formatting functions for common
 * data transformations including byte size conversion, number formatting,
 * duration formatting, and percentage calculations. These utilities are
 * designed to be reusable across different components without dependencies.
 *
 * Features:
 * - Byte size formatting (B, KB, MB, GB, TB, PB)
 * - Number formatting with locale support
 * - Duration formatting (seconds to human-readable)
 * - Percentage calculations with precision control
 * - File size comparisons
 * - Compact number notation (1K, 1M, 1B)
 *
 * Note: This is a standalone utility and does not connect to the main application.
 */

/**
 * Convert bytes to human-readable format
 * @param {number} bytes - Number of bytes
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted string (e.g., "1.5 GB")
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  if (!bytes || isNaN(bytes)) return "N/A";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${value} ${sizes[i]}`;
}

/**
 * Format number with thousands separators
 * @param {number} num - Number to format
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted number
 */
export function formatNumber(num, locale = "en-US") {
  if (num === null || num === undefined || isNaN(num)) return "N/A";
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format seconds to human-readable duration
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration (e.g., "2h 30m 15s")
 */
export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds) || seconds < 0) return "0s";

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(" ");
}

/**
 * Calculate percentage with precision
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @param {number} decimals - Decimal places (default: 1)
 * @returns {number} Percentage value
 */
export function calculatePercentage(value, total, decimals = 1) {
  if (!total || total === 0) return 0;
  if (!value || isNaN(value)) return 0;

  const percentage = (value / total) * 100;
  return parseFloat(percentage.toFixed(decimals));
}

/**
 * Format number in compact notation (K, M, B)
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places (default: 1)
 * @returns {string} Compact formatted number
 */
export function formatCompact(num, decimals = 1) {
  if (num === null || num === undefined || isNaN(num)) return "N/A";
  if (num === 0) return "0";

  const suffixes = ["", "K", "M", "B", "T"];
  const tier = Math.floor(Math.log10(Math.abs(num)) / 3);

  if (tier === 0) return num.toString();

  const suffix = suffixes[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  return scaled.toFixed(decimals) + suffix;
}

/**
 * Format uptime to readable string
 * @param {number} uptimeSeconds - Uptime in seconds
 * @returns {string} Formatted uptime
 */
export function formatUptime(uptimeSeconds) {
  if (!uptimeSeconds || isNaN(uptimeSeconds)) return "N/A";

  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor((uptimeSeconds % 86400) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round number to nearest step
 * @param {number} value - Value to round
 * @param {number} step - Step size
 * @returns {number} Rounded value
 */
export function roundToStep(value, step) {
  if (!step || step === 0) return value;
  return Math.round(value / step) * step;
}
