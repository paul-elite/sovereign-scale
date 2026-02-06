// Zustand Global State Store
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  ScaleState,
  PreviewMode,
  AccentColor,
  OverrideValue,
  DEFAULT_STEPS,
} from '@/lib/types';
import { generateScaleSteps } from '@/lib/scale-engine';
import { generateCSSVariables } from '@/lib/css-generator';

// Recalculate derived state
function recalculateState(state: Omit<ScaleState, 'scaleSteps' | 'cssVariables' | keyof Actions>) {
  const scaleSteps = generateScaleSteps(
    state.baseSize,
    state.mobileRatio,
    state.desktopRatio,
    DEFAULT_STEPS,
    state.minBreakpoint,
    state.maxBreakpoint,
    state.simulatedViewport,
    state.manualMode ? state.overrides : undefined
  );

  const cssVariables = generateCSSVariables(
    scaleSteps,
    state.customFont,
    state.customFontName,
    state.fontAxes
  );

  return { scaleSteps, cssVariables };
}

// Action types
interface Actions {
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

// Initial state values
const initialState = {
  baseSize: 16,
  mobileRatio: 1.125,
  desktopRatio: 1.414,
  minBreakpoint: 320,
  maxBreakpoint: 1280,
  simulatedViewport: 800,
  previewMode: 'manifesto' as PreviewMode,
  manualMode: false,
  overrides: {} as Record<string, OverrideValue>,
  customFont: null as string | null,
  customFontName: null as string | null,
  fontAxes: {} as Record<string, number>,
  accentColor: 'electric-blue' as AccentColor,
};

// Calculate initial derived state
const initialDerived = recalculateState(initialState);

export const useScaleStore = create<ScaleState>()(
  subscribeWithSelector((set) => ({
    ...initialState,
    ...initialDerived,

    setBaseSize: (size) =>
      set((state) => {
        const newState = { ...state, baseSize: size };
        return { ...newState, ...recalculateState(newState) };
      }),

    setMobileRatio: (ratio) =>
      set((state) => {
        const newState = { ...state, mobileRatio: ratio };
        return { ...newState, ...recalculateState(newState) };
      }),

    setDesktopRatio: (ratio) =>
      set((state) => {
        const newState = { ...state, desktopRatio: ratio };
        return { ...newState, ...recalculateState(newState) };
      }),

    setMinBreakpoint: (bp) =>
      set((state) => {
        const newState = { ...state, minBreakpoint: bp };
        return { ...newState, ...recalculateState(newState) };
      }),

    setMaxBreakpoint: (bp) =>
      set((state) => {
        const newState = { ...state, maxBreakpoint: bp };
        return { ...newState, ...recalculateState(newState) };
      }),

    setSimulatedViewport: (vw) =>
      set((state) => {
        const newState = { ...state, simulatedViewport: vw };
        return { ...newState, ...recalculateState(newState) };
      }),

    setPreviewMode: (mode) => set({ previewMode: mode }),

    setManualMode: (enabled) =>
      set((state) => {
        const newState = { ...state, manualMode: enabled };
        return { ...newState, ...recalculateState(newState) };
      }),

    setOverride: (step, values) =>
      set((state) => {
        const newOverrides = { ...state.overrides, [step]: values };
        const newState = { ...state, overrides: newOverrides };
        return { ...newState, ...recalculateState(newState) };
      }),

    clearOverride: (step) =>
      set((state) => {
        const newOverrides = { ...state.overrides };
        delete newOverrides[step];
        const newState = { ...state, overrides: newOverrides };
        return { ...newState, ...recalculateState(newState) };
      }),

    setCustomFont: (url, name) =>
      set((state) => {
        const newState = { ...state, customFont: url, customFontName: name };
        return { ...newState, ...recalculateState(newState) };
      }),

    setFontAxis: (axis, value) =>
      set((state) => {
        const newAxes = { ...state.fontAxes, [axis]: value };
        const newState = { ...state, fontAxes: newAxes };
        return { ...newState, ...recalculateState(newState) };
      }),

    setAccentColor: (color) => set({ accentColor: color }),

    recalculate: () =>
      set((state) => ({
        ...state,
        ...recalculateState(state),
      })),
  }))
);

// Selector hooks for better performance
export const useBaseSize = () => useScaleStore((s) => s.baseSize);
export const useMobileRatio = () => useScaleStore((s) => s.mobileRatio);
export const useDesktopRatio = () => useScaleStore((s) => s.desktopRatio);
export const useBreakpoints = () =>
  useScaleStore((s) => ({ min: s.minBreakpoint, max: s.maxBreakpoint }));
export const useSimulatedViewport = () => useScaleStore((s) => s.simulatedViewport);
export const usePreviewMode = () => useScaleStore((s) => s.previewMode);
export const useScaleSteps = () => useScaleStore((s) => s.scaleSteps);
export const useCSSVariables = () => useScaleStore((s) => s.cssVariables);
export const useAccentColor = () => useScaleStore((s) => s.accentColor);
export const useManualMode = () => useScaleStore((s) => s.manualMode);
export const useOverrides = () => useScaleStore((s) => s.overrides);
export const useCustomFont = () =>
  useScaleStore((s) => ({ url: s.customFont, name: s.customFontName }));
