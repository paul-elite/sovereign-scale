// The Mathematical Engine - Core of The Sovereign Scale
import { ScaleStep, ClampResult, STEP_NAMES } from './types';

/**
 * Interpolate ratio between mobile and desktop based on viewport width
 * Uses linear interpolation between breakpoints
 */
export function interpolateRatio(
  viewportWidth: number,
  mobileRatio: number,
  desktopRatio: number,
  minBreakpoint: number,
  maxBreakpoint: number
): number {
  // Clamp viewport to breakpoint range
  const clampedViewport = Math.max(minBreakpoint, Math.min(maxBreakpoint, viewportWidth));

  // Calculate interpolation factor (0 at min, 1 at max)
  const factor = (clampedViewport - minBreakpoint) / (maxBreakpoint - minBreakpoint);

  // Linear interpolation between ratios
  return mobileRatio + (desktopRatio - mobileRatio) * factor;
}

/**
 * Generate a zoom-safe, accessible clamp formula
 * Uses the formula: clamp(minSize, relative + (value * 100vw), maxSize)
 * Where:
 *   value = (maxSize - minSize) / (maxBreakpoint - minBreakpoint)
 *   relative = minSize - (minBreakpoint * value)
 */
export function generateAccessibleClamp(
  minSize: number,
  maxSize: number,
  minBreakpoint: number,
  maxBreakpoint: number
): ClampResult {
  // Calculate the slope (value per viewport pixel)
  const value = (maxSize - minSize) / (maxBreakpoint - minBreakpoint);

  // Calculate the relative offset
  const relative = minSize - (minBreakpoint * value);

  // Convert to rem for accessibility (assumes 16px base)
  const minRem = minSize / 16;
  const maxRem = maxSize / 16;
  const relativeRem = relative / 16;
  const valueVw = value * 100;

  // Generate CSS clamp formula
  // Format: clamp(minRem, relativeRem + valueVw, maxRem)
  const css = `clamp(${minRem.toFixed(4)}rem, ${relativeRem.toFixed(4)}rem + ${valueVw.toFixed(4)}vw, ${maxRem.toFixed(4)}rem)`;

  return {
    css,
    value: valueVw,
    relative: relativeRem,
    minSize,
    maxSize,
  };
}

/**
 * Calculate the font size at a given step for a specific ratio
 */
export function calculateStepSize(baseSize: number, ratio: number, step: number): number {
  return baseSize * Math.pow(ratio, step);
}

/**
 * Calculate the current size at a specific viewport width
 * Interpolates between min and max sizes
 */
export function calculateCurrentSize(
  minSize: number,
  maxSize: number,
  viewportWidth: number,
  minBreakpoint: number,
  maxBreakpoint: number
): number {
  if (viewportWidth <= minBreakpoint) return minSize;
  if (viewportWidth >= maxBreakpoint) return maxSize;

  const factor = (viewportWidth - minBreakpoint) / (maxBreakpoint - minBreakpoint);
  return minSize + (maxSize - minSize) * factor;
}

/**
 * Calculate optical size axis value based on font size
 * Larger text needs less optical correction
 * Maps font size to optical size axis (typically 8-144)
 */
export function calculateOpticalSize(fontSize: number): number {
  // Optical size generally matches the point size
  // Clamp between common optical size axis bounds
  return Math.max(8, Math.min(144, Math.round(fontSize * 0.75)));
}

/**
 * Generate the complete scale with all steps
 */
export function generateScaleSteps(
  baseSize: number,
  mobileRatio: number,
  desktopRatio: number,
  steps: number[],
  minBreakpoint: number,
  maxBreakpoint: number,
  viewportWidth: number,
  overrides?: Record<string, { min: number; max: number }>
): ScaleStep[] {
  return steps.map((step) => {
    const stepKey = step.toString();

    // Calculate min/max sizes based on respective ratios
    let minSize = calculateStepSize(baseSize, mobileRatio, step);
    let maxSize = calculateStepSize(baseSize, desktopRatio, step);

    // Apply manual overrides if present
    if (overrides && overrides[stepKey]) {
      minSize = overrides[stepKey].min;
      maxSize = overrides[stepKey].max;
    }

    // Round to 2 decimal places for cleaner output
    minSize = Math.round(minSize * 100) / 100;
    maxSize = Math.round(maxSize * 100) / 100;

    // Calculate current size at viewport
    const currentSize = calculateCurrentSize(
      minSize,
      maxSize,
      viewportWidth,
      minBreakpoint,
      maxBreakpoint
    );

    // Generate clamp formula
    const clamp = generateAccessibleClamp(minSize, maxSize, minBreakpoint, maxBreakpoint);

    // Calculate optical size
    const opticalSize = calculateOpticalSize(currentSize);

    return {
      step,
      name: STEP_NAMES[step] || `step-${step}`,
      minSize,
      maxSize,
      currentSize: Math.round(currentSize * 100) / 100,
      clampFormula: clamp.css,
      opticalSize,
    };
  });
}

/**
 * Get the ratio name for a given value
 */
export function getRatioName(ratio: number): string {
  const RATIO_NAMES: Record<number, string> = {
    1.067: 'Minor Second',
    1.125: 'Major Second',
    1.2: 'Minor Third',
    1.25: 'Major Third',
    1.333: 'Perfect Fourth',
    1.414: 'Augmented Fourth',
    1.5: 'Perfect Fifth',
    1.618: 'Golden Ratio',
  };

  // Find closest match
  const closest = Object.keys(RATIO_NAMES)
    .map(Number)
    .reduce((prev, curr) =>
      Math.abs(curr - ratio) < Math.abs(prev - ratio) ? curr : prev
    );

  if (Math.abs(closest - ratio) < 0.01) {
    return RATIO_NAMES[closest];
  }

  return `Custom (${ratio.toFixed(3)})`;
}
