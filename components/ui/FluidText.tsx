'use client';

// Core Typography Component
import { ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { useScaleStore } from '@/store/useScaleStore';

interface FluidTextProps {
  step: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export function FluidText({
  step,
  as: Component = 'p',
  children,
  className = '',
  animate = true,
}: FluidTextProps) {
  const scaleSteps = useScaleStore((s) => s.scaleSteps);
  const customFont = useScaleStore((s) => s.customFont);
  const customFontName = useScaleStore((s) => s.customFontName);
  const fontAxes = useScaleStore((s) => s.fontAxes);

  const stepData = scaleSteps.find((s) => s.step === step);

  if (!stepData) {
    return <Component className={className}>{children}</Component>;
  }

  // Build font-variation-settings
  const axisSettings = Object.entries(fontAxes)
    .map(([axis, value]) => `"${axis}" ${value}`)
    .concat([`"opsz" ${stepData.opticalSize}`])
    .join(', ');

  const style: CSSProperties = {
    fontSize: `${stepData.currentSize}px`,
    fontFamily: customFont && customFontName
      ? `"${customFontName}", system-ui, sans-serif`
      : 'var(--font-sans), system-ui, sans-serif',
    fontVariationSettings: axisSettings,
    lineHeight: 1.4,
  };

  if (animate) {
    return (
      <motion.div
        style={style}
        className={className}
        animate={{ fontSize: `${stepData.currentSize}px` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <Component style={style} className={className}>
      {children}
    </Component>
  );
}

// Simplified version using CSS variables (for production export)
interface FluidTextCSSProps {
  step: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  children: ReactNode;
  className?: string;
}

export function FluidTextCSS({
  step,
  as: Component = 'p',
  children,
  className = '',
}: FluidTextCSSProps) {
  const style: CSSProperties = {
    fontSize: `var(--font-size-${step})`,
    fontVariationSettings: `"opsz" var(--optical-size-${step})`,
  };

  return (
    <Component style={style} className={className}>
      {children}
    </Component>
  );
}
