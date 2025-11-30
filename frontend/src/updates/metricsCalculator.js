/**
 * System Metrics Calculator Utility
 * 
 * A standalone utility module providing mathematical calculations and statistical
 * analysis for system monitoring metrics. This module is completely independent
 * and can be used for calculating averages, percentiles, trends, and predictions
 * for CPU, memory, and process metrics.
 * 
 * Features:
 * - Calculate moving averages
 * - Compute percentiles and quartiles
 * - Trend analysis (increasing/decreasing/stable)
 * - Simple forecasting algorithms
 * - Statistical measures (mean, median, standard deviation)
 * - Peak/valley detection
 * - Data smoothing functions
 * 
 * @module metricsCalculator
 * @version 1.0.0
 * @standalone - No external dependencies
 */

/**
 * Calculate the mean (average) of an array of numbers
 * @param {number[]} values - Array of numeric values
 * @returns {number} The mean value or 0 if empty
 */
export function calculateMean(values) {
  if (!Array.isArray(values) || values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Calculate the median of an array of numbers
 * @param {number[]} values - Array of numeric values
 * @returns {number} The median value or 0 if empty
 */
export function calculateMedian(values) {
  if (!Array.isArray(values) || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Calculate standard deviation
 * @param {number[]} values - Array of numeric values
 * @returns {number} The standard deviation or 0 if empty
 */
export function calculateStdDev(values) {
  if (!Array.isArray(values) || values.length === 0) return 0;
  const mean = calculateMean(values);
  const squareDiffs = values.map(value => Math.pow(value - mean, 2));
  const avgSquareDiff = calculateMean(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}

/**
 * Calculate moving average with specified window size
 * @param {number[]} values - Array of numeric values
 * @param {number} windowSize - Size of the moving window
 * @returns {number[]} Array of moving averages
 */
export function calculateMovingAverage(values, windowSize = 5) {
  if (!Array.isArray(values) || values.length === 0) return [];
  if (windowSize <= 0 || windowSize > values.length) return values;
  
  const result = [];
  for (let i = 0; i <= values.length - windowSize; i++) {
    const window = values.slice(i, i + windowSize);
    result.push(calculateMean(window));
  }
  return result;
}

/**
 * Calculate percentile (e.g., 90th percentile)
 * @param {number[]} values - Array of numeric values
 * @param {number} percentile - Percentile to calculate (0-100)
 * @returns {number} The percentile value
 */
export function calculatePercentile(values, percentile) {
  if (!Array.isArray(values) || values.length === 0) return 0;
  if (percentile < 0 || percentile > 100) return 0;
  
  const sorted = [...values].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  
  if (lower === upper) return sorted[lower];
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Detect trend in time series data
 * @param {number[]} values - Array of numeric values in chronological order
 * @param {number} threshold - Sensitivity threshold (default: 0.05 = 5%)
 * @returns {string} 'increasing', 'decreasing', or 'stable'
 */
export function detectTrend(values, threshold = 0.05) {
  if (!Array.isArray(values) || values.length < 2) return 'stable';
  
  // Calculate simple linear regression slope
  const n = values.length;
  const xMean = (n - 1) / 2;
  const yMean = calculateMean(values);
  
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (values[i] - yMean);
    denominator += Math.pow(i - xMean, 2);
  }
  
  const slope = denominator !== 0 ? numerator / denominator : 0;
  const relativeSlope = Math.abs(slope / yMean);
  
  if (relativeSlope < threshold) return 'stable';
  return slope > 0 ? 'increasing' : 'decreasing';
}

/**
 * Find peaks (local maxima) in the data
 * @param {number[]} values - Array of numeric values
 * @param {number} minProminence - Minimum prominence to be considered a peak
 * @returns {number[]} Indices of peaks
 */
export function findPeaks(values, minProminence = 0) {
  if (!Array.isArray(values) || values.length < 3) return [];
  
  const peaks = [];
  for (let i = 1; i < values.length - 1; i++) {
    if (values[i] > values[i - 1] && values[i] > values[i + 1]) {
      const prominence = Math.min(
        values[i] - values[i - 1],
        values[i] - values[i + 1]
      );
      if (prominence >= minProminence) {
        peaks.push(i);
      }
    }
  }
  return peaks;
}

/**
 * Simple exponential smoothing
 * @param {number[]} values - Array of numeric values
 * @param {number} alpha - Smoothing factor (0-1, higher = more responsive)
 * @returns {number[]} Smoothed values
 */
export function exponentialSmoothing(values, alpha = 0.3) {
  if (!Array.isArray(values) || values.length === 0) return [];
  if (alpha < 0 || alpha > 1) alpha = 0.3;
  
  const smoothed = [values[0]];
  for (let i = 1; i < values.length; i++) {
    smoothed.push(alpha * values[i] + (1 - alpha) * smoothed[i - 1]);
  }
  return smoothed;
}

/**
 * Simple forecast using linear extrapolation
 * @param {number[]} values - Historical values in chronological order
 * @param {number} steps - Number of steps to forecast ahead
 * @returns {number[]} Forecasted values
 */
export function simpleForecast(values, steps = 1) {
  if (!Array.isArray(values) || values.length < 2 || steps < 1) return [];
  
  // Calculate slope from last few points
  const recentValues = values.slice(-5);
  const n = recentValues.length;
  const xMean = (n - 1) / 2;
  const yMean = calculateMean(recentValues);
  
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (recentValues[i] - yMean);
    denominator += Math.pow(i - xMean, 2);
  }
  
  const slope = denominator !== 0 ? numerator / denominator : 0;
  const lastValue = values[values.length - 1];
  
  const forecast = [];
  for (let i = 1; i <= steps; i++) {
    forecast.push(Math.max(0, lastValue + slope * i));
  }
  return forecast;
}

/**
 * Calculate resource utilization efficiency score (0-100)
 * @param {number} current - Current usage
 * @param {number} capacity - Total capacity
 * @param {number} optimal - Optimal usage percentage (default: 70)
 * @returns {number} Efficiency score (0-100)
 */
export function calculateEfficiencyScore(current, capacity, optimal = 70) {
  if (capacity <= 0) return 0;
  
  const usagePercent = (current / capacity) * 100;
  
  // Perfect score at optimal usage
  if (Math.abs(usagePercent - optimal) < 5) return 100;
  
  // Decrease score as we move away from optimal
  if (usagePercent < optimal) {
    // Under-utilization penalty
    return Math.max(0, 100 - (optimal - usagePercent) * 1.5);
  } else {
    // Over-utilization penalty (more severe)
    return Math.max(0, 100 - (usagePercent - optimal) * 2);
  }
}

/**
 * Normalize values to 0-1 range
 * @param {number[]} values - Array of numeric values
 * @returns {number[]} Normalized values
 */
export function normalize(values) {
  if (!Array.isArray(values) || values.length === 0) return [];
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  
  if (range === 0) return values.map(() => 0.5);
  return values.map(v => (v - min) / range);
}

/**
 * Calculate rate of change between consecutive values
 * @param {number[]} values - Array of numeric values
 * @returns {number[]} Array of rates of change (one less element)
 */
export function calculateRateOfChange(values) {
  if (!Array.isArray(values) || values.length < 2) return [];
  
  const rates = [];
  for (let i = 1; i < values.length; i++) {
    rates.push(values[i] - values[i - 1]);
  }
  return rates;
}

// Default export with all functions
export default {
  calculateMean,
  calculateMedian,
  calculateStdDev,
  calculateMovingAverage,
  calculatePercentile,
  detectTrend,
  findPeaks,
  exponentialSmoothing,
  simpleForecast,
  calculateEfficiencyScore,
  normalize,
  calculateRateOfChange
};
