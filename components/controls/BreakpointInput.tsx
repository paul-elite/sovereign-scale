'use client';

// Min/Max Breakpoint Controls
import { useScaleStore } from '@/store/useScaleStore';
import { useState, useEffect } from 'react';

export function BreakpointInput() {
  const minBreakpoint = useScaleStore((s) => s.minBreakpoint);
  const maxBreakpoint = useScaleStore((s) => s.maxBreakpoint);
  const setMinBreakpoint = useScaleStore((s) => s.setMinBreakpoint);
  const setMaxBreakpoint = useScaleStore((s) => s.setMaxBreakpoint);

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-primary">Breakpoints</div>

      <div className="grid grid-cols-2 gap-3">
        <BreakpointField
          label="Min"
          value={minBreakpoint}
          onChange={setMinBreakpoint}
          min={200}
          max={maxBreakpoint - 100}
        />
        <BreakpointField
          label="Max"
          value={maxBreakpoint}
          onChange={setMaxBreakpoint}
          min={minBreakpoint + 100}
          max={2560}
        />
      </div>

      {/* Common presets */}
      <div className="space-y-2">
        <div className="text-xs text-secondary">Presets</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setMinBreakpoint(320);
              setMaxBreakpoint(1280);
            }}
            className="px-3 py-2 text-xs bg-elevated rounded hover:bg-surface transition-colors text-left"
          >
            <span className="block text-primary">Default</span>
            <span className="text-secondary">320 - 1280px</span>
          </button>
          <button
            onClick={() => {
              setMinBreakpoint(375);
              setMaxBreakpoint(1440);
            }}
            className="px-3 py-2 text-xs bg-elevated rounded hover:bg-surface transition-colors text-left"
          >
            <span className="block text-primary">Modern</span>
            <span className="text-secondary">375 - 1440px</span>
          </button>
          <button
            onClick={() => {
              setMinBreakpoint(320);
              setMaxBreakpoint(1920);
            }}
            className="px-3 py-2 text-xs bg-elevated rounded hover:bg-surface transition-colors text-left"
          >
            <span className="block text-primary">Wide</span>
            <span className="text-secondary">320 - 1920px</span>
          </button>
          <button
            onClick={() => {
              setMinBreakpoint(480);
              setMaxBreakpoint(1200);
            }}
            className="px-3 py-2 text-xs bg-elevated rounded hover:bg-surface transition-colors text-left"
          >
            <span className="block text-primary">Compact</span>
            <span className="text-secondary">480 - 1200px</span>
          </button>
        </div>
      </div>

      {/* Visual representation */}
      <div className="relative h-8 bg-deep rounded-lg overflow-hidden">
        <div
          className="absolute h-full bg-accent/20"
          style={{
            left: `${(minBreakpoint / 2560) * 100}%`,
            width: `${((maxBreakpoint - minBreakpoint) / 2560) * 100}%`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-mono text-secondary">
          <span>0</span>
          <span className="text-accent">{minBreakpoint}</span>
          <span className="text-accent">{maxBreakpoint}</span>
          <span>2560</span>
        </div>
      </div>
    </div>
  );
}

interface BreakpointFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

function BreakpointField({ label, value, onChange, min, max }: BreakpointFieldProps) {
  const [localValue, setLocalValue] = useState(value.toString());

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleBlur = () => {
    const num = parseInt(localValue, 10);
    if (!isNaN(num)) {
      const clamped = Math.max(min, Math.min(max, num));
      onChange(clamped);
      setLocalValue(clamped.toString());
    } else {
      setLocalValue(value.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-xs text-secondary">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 bg-deep border border-subtle rounded text-sm font-mono text-primary focus:outline-none focus:border-accent"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-secondary">
          px
        </span>
      </div>
    </div>
  );
}
