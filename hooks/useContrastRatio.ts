// Hook for WCAG contrast calculations
import { useMemo } from 'react';
import {
  getContrastRatio,
  getWCAGLevel,
  getContrastRating,
  WCAGLevel,
} from '@/lib/contrast-utils';

interface ContrastResult {
  ratio: number;
  level: WCAGLevel;
  label: string;
  color: string;
  passes: boolean;
  passesLarge: boolean;
}

/**
 * Hook to calculate contrast ratio and WCAG compliance
 */
export function useContrastRatio(
  foreground: string,
  background: string,
  fontSize: number = 16,
  isBold: boolean = false
): ContrastResult {
  return useMemo(() => {
    const ratio = getContrastRatio(foreground, background);
    const level = getWCAGLevel(ratio, fontSize, isBold);
    const rating = getContrastRating(ratio);

    return {
      ratio: Math.round(ratio * 100) / 100,
      level,
      label: rating.label,
      color: rating.color,
      passes: level === 'AAA' || level === 'AA',
      passesLarge: level !== 'Fail',
    };
  }, [foreground, background, fontSize, isBold]);
}
