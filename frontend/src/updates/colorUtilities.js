/**
 * Color Utilities Module
 * 
 * A standalone utility module for color manipulation, conversion, and generation.
 * Provides functions for working with colors in various formats (HEX, RGB, HSL),
 * generating color palettes, calculating contrast ratios, and more.
 * 
 * Use cases:
 * - Convert between color formats (HEX ↔ RGB ↔ HSL)
 * - Generate complementary and analogous colors
 * - Calculate color contrast for accessibility
 * - Create color palettes
 * - Lighten/darken colors
 * - Generate random colors
 * 
 * @module colorUtilities
 * @version 1.0.0
 * @standalone - No external dependencies
 */

/**
 * Convert HEX color to RGB
 * @param {string} hex - Hex color code (e.g., "#FF5733" or "FF5733")
 * @returns {{r: number, g: number, b: number}} RGB object
 */
export function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Handle shorthand hex (e.g., "F00")
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
}

/**
 * Convert RGB to HEX
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} Hex color code
 */
export function rgbToHex(r, g, b) {
  const toHex = (num) => {
    const hex = Math.round(Math.max(0, Math.min(255, num))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Convert RGB to HSL
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {{h: number, s: number, l: number}} HSL object
 */
export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / diff + 2) / 6;
        break;
      case b:
        h = ((r - g) / diff + 4) / 6;
        break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Convert HSL to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {{r: number, g: number, b: number}} RGB object
 */
export function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Lighten a color by a percentage
 * @param {string} hex - Hex color code
 * @param {number} percent - Percentage to lighten (0-100)
 * @returns {string} Lightened hex color
 */
export function lightenColor(hex, percent) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  hsl.l = Math.min(100, hsl.l + percent);
  
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Darken a color by a percentage
 * @param {string} hex - Hex color code
 * @param {number} percent - Percentage to darken (0-100)
 * @returns {string} Darkened hex color
 */
export function darkenColor(hex, percent) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  hsl.l = Math.max(0, hsl.l - percent);
  
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Generate a random hex color
 * @returns {string} Random hex color code
 */
export function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Calculate relative luminance for WCAG contrast
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {number} Relative luminance
 */
export function calculateLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors (WCAG)
 * @param {string} hex1 - First hex color
 * @param {string} hex2 - Second hex color
 * @returns {number} Contrast ratio (1-21)
 */
export function calculateContrast(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  
  const lum1 = calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = calculateLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color combination meets WCAG AA standards
 * @param {string} hex1 - First hex color
 * @param {string} hex2 - Second hex color
 * @param {boolean} largeText - Whether text is large (18pt+ or 14pt+ bold)
 * @returns {boolean} True if meets WCAG AA standards
 */
export function meetsWCAG_AA(hex1, hex2, largeText = false) {
  const contrast = calculateContrast(hex1, hex2);
  return largeText ? contrast >= 3 : contrast >= 4.5;
}

/**
 * Generate complementary color (opposite on color wheel)
 * @param {string} hex - Hex color code
 * @returns {string} Complementary hex color
 */
export function getComplementaryColor(hex) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  hsl.h = (hsl.h + 180) % 360;
  
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Generate analogous colors (adjacent on color wheel)
 * @param {string} hex - Hex color code
 * @param {number} angle - Degree separation (default: 30)
 * @returns {string[]} Array of two analogous hex colors
 */
export function getAnalogousColors(hex, angle = 30) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  const hsl1 = { ...hsl, h: (hsl.h + angle) % 360 };
  const hsl2 = { ...hsl, h: (hsl.h - angle + 360) % 360 };
  
  const rgb1 = hslToRgb(hsl1.h, hsl1.s, hsl1.l);
  const rgb2 = hslToRgb(hsl2.h, hsl2.s, hsl2.l);
  
  return [
    rgbToHex(rgb1.r, rgb1.g, rgb1.b),
    rgbToHex(rgb2.r, rgb2.g, rgb2.b)
  ];
}

/**
 * Generate a color palette with multiple shades
 * @param {string} hex - Base hex color
 * @param {number} steps - Number of shades (default: 5)
 * @returns {string[]} Array of hex colors from light to dark
 */
export function generatePalette(hex, steps = 5) {
  const palette = [];
  const step = 100 / (steps + 1);
  
  for (let i = 1; i <= steps; i++) {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    hsl.l = 100 - (step * i);
    
    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    palette.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }
  
  return palette;
}

/**
 * Check if a color is considered "light" or "dark"
 * @param {string} hex - Hex color code
 * @returns {string} 'light' or 'dark'
 */
export function getColorBrightness(hex) {
  const rgb = hexToRgb(hex);
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? 'light' : 'dark';
}

/**
 * Get appropriate text color (black or white) for background
 * @param {string} backgroundHex - Background hex color
 * @returns {string} '#000000' or '#FFFFFF'
 */
export function getTextColor(backgroundHex) {
  return getColorBrightness(backgroundHex) === 'light' ? '#000000' : '#FFFFFF';
}

// Default export with all functions
export default {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  lightenColor,
  darkenColor,
  generateRandomColor,
  calculateLuminance,
  calculateContrast,
  meetsWCAG_AA,
  getComplementaryColor,
  getAnalogousColors,
  generatePalette,
  getColorBrightness,
  getTextColor
};
