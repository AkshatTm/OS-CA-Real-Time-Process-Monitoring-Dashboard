/**
 * formatters.ts
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
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string (e.g., "1.5 GB")
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
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
 * @param num - Number to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted number
 */
export function formatNumber(num: number, locale: string = "en-US"): string {
  if (num === null || num === undefined || isNaN(num)) return "N/A";
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format seconds to human-readable duration
 * @param seconds - Duration in seconds
 * @returns Formatted duration (e.g., "2h 30m 15s")
 */
export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return "0s";

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(" ");
}

/**
 * Calculate percentage with precision
 * @param value - Current value
 * @param total - Total value
 * @param decimals - Decimal places (default: 1)
 * @returns Percentage value
 */
export function calculatePercentage(
  value: number,
  total: number,
  decimals: number = 1
): number {
  if (!total || total === 0) return 0;
  if (!value || isNaN(value)) return 0;

  const percentage = (value / total) * 100;
  return parseFloat(percentage.toFixed(decimals));
}

/**
 * Format number in compact notation (K, M, B)
 * @param num - Number to format
 * @param decimals - Decimal places (default: 1)
 * @returns Compact formatted number
 */
export function formatCompact(num: number, decimals: number = 1): string {
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
 * @param uptimeSeconds - Uptime in seconds
 * @returns Formatted uptime
 */
export function formatUptime(uptimeSeconds: number): string {
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
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round number to nearest step
 * @param value - Value to round
 * @param step - Step size
 * @returns Rounded value
 */
export function roundToStep(value: number, step: number): number {
  if (!step || step === 0) return value;
  return Math.round(value / step) * step;
}

/**
 * Format percentage with symbol
 * @param value - Percentage value
 * @param decimals - Decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  if (value === null || value === undefined || isNaN(value)) return "N/A";
  return `${value.toFixed(decimals)}%`;
}
