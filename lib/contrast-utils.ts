// WCAG Contrast Calculation Utilities

/**
 * Parse a hex color string to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance of a color
 * Per WCAG 2.1 guidelines
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a ratio between 1:1 and 21:1
 */
export function getContrastRatio(
  foreground: string,
  background: string
): number {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) return 0;

  const l1 = getLuminance(fg.r, fg.g, fg.b);
  const l2 = getLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * WCAG conformance levels
 */
export type WCAGLevel = 'AAA' | 'AA' | 'AA Large' | 'Fail';

/**
 * Check WCAG conformance level for text
 */
export function getWCAGLevel(
  contrastRatio: number,
  fontSize: number,
  isBold: boolean = false
): WCAGLevel {
  // Large text is >= 18pt (24px) or >= 14pt (18.67px) bold
  const isLargeText = fontSize >= 24 || (fontSize >= 18.67 && isBold);

  if (isLargeText) {
    if (contrastRatio >= 4.5) return 'AAA';
    if (contrastRatio >= 3) return 'AA';
    return 'Fail';
  } else {
    if (contrastRatio >= 7) return 'AAA';
    if (contrastRatio >= 4.5) return 'AA';
    if (contrastRatio >= 3) return 'AA Large'; // Would pass as large text
    return 'Fail';
  }
}

/**
 * Get a human-readable contrast rating
 */
export function getContrastRating(ratio: number): {
  label: string;
  color: string;
  level: WCAGLevel;
} {
  if (ratio >= 7) {
    return { label: 'Excellent', color: '#22C55E', level: 'AAA' };
  } else if (ratio >= 4.5) {
    return { label: 'Good', color: '#84CC16', level: 'AA' };
  } else if (ratio >= 3) {
    return { label: 'Large Text OK', color: '#EAB308', level: 'AA Large' };
  } else {
    return { label: 'Poor', color: '#EF4444', level: 'Fail' };
  }
}

/**
 * Suggest a better foreground color for contrast
 */
export function suggestBetterContrast(
  foreground: string,
  background: string,
  targetRatio: number = 4.5
): string {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) return foreground;

  const bgLuminance = getLuminance(bg.r, bg.g, bg.b);

  // Decide whether to lighten or darken based on background
  const shouldLighten = bgLuminance < 0.5;

  let currentRatio = getContrastRatio(foreground, background);
  let iterations = 0;
  const adjustedFg = { ...fg };

  while (currentRatio < targetRatio && iterations < 50) {
    if (shouldLighten) {
      adjustedFg.r = Math.min(255, adjustedFg.r + 5);
      adjustedFg.g = Math.min(255, adjustedFg.g + 5);
      adjustedFg.b = Math.min(255, adjustedFg.b + 5);
    } else {
      adjustedFg.r = Math.max(0, adjustedFg.r - 5);
      adjustedFg.g = Math.max(0, adjustedFg.g - 5);
      adjustedFg.b = Math.max(0, adjustedFg.b - 5);
    }

    const newHex = `#${adjustedFg.r.toString(16).padStart(2, '0')}${adjustedFg.g.toString(16).padStart(2, '0')}${adjustedFg.b.toString(16).padStart(2, '0')}`;
    currentRatio = getContrastRatio(newHex, background);
    iterations++;
  }

  return `#${adjustedFg.r.toString(16).padStart(2, '0')}${adjustedFg.g.toString(16).padStart(2, '0')}${adjustedFg.b.toString(16).padStart(2, '0')}`;
}
