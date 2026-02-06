// Hook for calculating fluid typography values
import { useMemo } from 'react';
import { useScaleStore } from '@/store/useScaleStore';
import { calculateCurrentSize, generateAccessibleClamp } from '@/lib/scale-engine';

interface FluidValueResult {
  currentSize: number;
  minSize: number;
  maxSize: number;
  clampFormula: string;
  cssVar: string;
}

/**
 * Hook to get fluid typography value for a specific step
 */
export function useFluidValue(step: number): FluidValueResult {
  const scaleSteps = useScaleStore((s) => s.scaleSteps);

  return useMemo(() => {
    const stepData = scaleSteps.find((s) => s.step === step);

    if (!stepData) {
      return {
        currentSize: 16,
        minSize: 16,
        maxSize: 16,
        clampFormula: '1rem',
        cssVar: '--font-size-base',
      };
    }

    return {
      currentSize: stepData.currentSize,
      minSize: stepData.minSize,
      maxSize: stepData.maxSize,
      clampFormula: stepData.clampFormula,
      cssVar: `--font-size-${stepData.name}`,
    };
  }, [scaleSteps, step]);
}

/**
 * Hook to calculate a custom fluid value (not from the scale)
 */
export function useCustomFluidValue(
  minSize: number,
  maxSize: number
): FluidValueResult {
  const minBreakpoint = useScaleStore((s) => s.minBreakpoint);
  const maxBreakpoint = useScaleStore((s) => s.maxBreakpoint);
  const simulatedViewport = useScaleStore((s) => s.simulatedViewport);

  return useMemo(() => {
    const currentSize = calculateCurrentSize(
      minSize,
      maxSize,
      simulatedViewport,
      minBreakpoint,
      maxBreakpoint
    );

    const clamp = generateAccessibleClamp(
      minSize,
      maxSize,
      minBreakpoint,
      maxBreakpoint
    );

    return {
      currentSize,
      minSize,
      maxSize,
      clampFormula: clamp.css,
      cssVar: '',
    };
  }, [minSize, maxSize, minBreakpoint, maxBreakpoint, simulatedViewport]);
}
