// Type definitions for The Sovereign Scale

export interface ScaleStep {
  step: number;
  name: string;
  minSize: number;
  maxSize: number;
  currentSize: number;
  clampFormula: string;
  opticalSize: number;
}

export interface ClampResult {
  css: string;
  value: number;
  relative: number;
  minSize: number;
  maxSize: number;
}

export interface FontAxis {
  tag: string;
  name: string;
  min: number;
  max: number;
  default: number;
}

export interface OverrideValue {
  min: number;
  max: number;
}

export type PreviewMode = 'manifesto' | 'dashboard';
export type AccentColor = 'electric-blue' | 'vibrant-orange';

export interface ScaleState {
  // Base settings
  baseSize: number;
  mobileRatio: number;
  desktopRatio: number;
  minBreakpoint: number;
  maxBreakpoint: number;

  // Viewport simulation
  simulatedViewport: number;

  // Preview mode
  previewMode: PreviewMode;

  // Manual overrides ("The Struggle")
  manualMode: boolean;
  overrides: Record<string, OverrideValue>;

  // Variable font settings
  customFont: string | null;
  customFontName: string | null;
  fontAxes: Record<string, number>;

  // Theme
  accentColor: AccentColor;

  // Computed (derived)
  scaleSteps: ScaleStep[];
  cssVariables: string;

  // Actions
  setBaseSize: (size: number) => void;
  setMobileRatio: (ratio: number) => void;
  setDesktopRatio: (ratio: number) => void;
  setMinBreakpoint: (bp: number) => void;
  setMaxBreakpoint: (bp: number) => void;
  setSimulatedViewport: (vw: number) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setManualMode: (enabled: boolean) => void;
  setOverride: (step: string, values: OverrideValue) => void;
  clearOverride: (step: string) => void;
  setCustomFont: (url: string | null, name: string | null) => void;
  setFontAxis: (axis: string, value: number) => void;
  setAccentColor: (color: AccentColor) => void;
  recalculate: () => void;
}

// Step names for the typography scale
export const STEP_NAMES: Record<number, string> = {
  '-2': 'xs',
  '-1': 'sm',
  '0': 'base',
  '1': 'lg',
  '2': 'xl',
  '3': '2xl',
  '4': '3xl',
  '5': '4xl',
};

// Default scale steps
export const DEFAULT_STEPS = [-2, -1, 0, 1, 2, 3, 4, 5];

// Common typographic ratios with names
export const RATIOS: Record<string, number> = {
  'Minor Second': 1.067,
  'Major Second': 1.125,
  'Minor Third': 1.2,
  'Major Third': 1.25,
  'Perfect Fourth': 1.333,
  'Augmented Fourth': 1.414,
  'Perfect Fifth': 1.5,
  'Golden Ratio': 1.618,
};
