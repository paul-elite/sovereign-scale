'use client';

// "Intentional Friction" Viewport Slider
import { useScaleStore } from '@/store/useScaleStore';
import { motion } from 'framer-motion';

export function ViewportSlider() {
  const simulatedViewport = useScaleStore((s) => s.simulatedViewport);
  const minBreakpoint = useScaleStore((s) => s.minBreakpoint);
  const maxBreakpoint = useScaleStore((s) => s.maxBreakpoint);
  const setSimulatedViewport = useScaleStore((s) => s.setSimulatedViewport);

  const percentage = ((simulatedViewport - minBreakpoint) / (maxBreakpoint - minBreakpoint)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-primary">
          Viewport Preview
        </label>
        <span className="text-sm font-mono text-accent">
          {simulatedViewport}px
        </span>
      </div>

      <div className="relative">
        {/* Track */}
        <div className="h-2 bg-deep rounded-full overflow-hidden">
          {/* Progress */}
          <motion.div
            className="h-full bg-gradient-to-r from-accent/50 to-accent rounded-full"
            style={{ width: `${percentage}%` }}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Slider input */}
        <input
          type="range"
          min={minBreakpoint}
          max={maxBreakpoint}
          step={1}
          value={simulatedViewport}
          onChange={(e) => setSimulatedViewport(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Thumb indicator */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full shadow-lg border-2 border-white pointer-events-none"
          style={{ left: `calc(${percentage}% - 8px)` }}
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>

      {/* Breakpoint markers */}
      <div className="flex justify-between text-xs text-secondary">
        <span className="font-mono">{minBreakpoint}px</span>
        <span className="text-secondary/50">Drag to preview</span>
        <span className="font-mono">{maxBreakpoint}px</span>
      </div>

      {/* Device hints */}
      <div className="flex justify-between text-xs text-secondary/70">
        <span>Mobile</span>
        <span>Tablet</span>
        <span>Desktop</span>
      </div>
    </div>
  );
}
