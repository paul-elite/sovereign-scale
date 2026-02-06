'use client';

// "The Gym" - Controls Sidebar
import { useScaleStore } from '@/store/useScaleStore';
import { ViewportSlider } from '@/components/controls/ViewportSlider';
import { RatioSlider } from '@/components/controls/RatioSlider';
import { BreakpointInput } from '@/components/controls/BreakpointInput';
import { FontUploader } from '@/components/controls/FontUploader';
import { ManualOverrides } from '@/components/controls/ManualOverrides';

export function LeftSidebar() {
  const baseSize = useScaleStore((s) => s.baseSize);
  const setBaseSize = useScaleStore((s) => s.setBaseSize);
  const accentColor = useScaleStore((s) => s.accentColor);
  const setAccentColor = useScaleStore((s) => s.setAccentColor);

  return (
    <aside className="w-80 bg-surface border-r border-subtle flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-subtle">
        <h1 className="text-lg font-bold text-primary">Sovereign Scale</h1>
        <p className="text-xs text-secondary mt-1">
          Fluid typography engine
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Base Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-primary">Base Size</label>
              <span className="text-sm font-mono text-accent">{baseSize}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="24"
              step="1"
              value={baseSize}
              onChange={(e) => setBaseSize(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-secondary">
              <span>12px</span>
              <span>24px</span>
            </div>
          </div>

          <hr className="border-subtle" />

          {/* Viewport Slider */}
          <ViewportSlider />

          <hr className="border-subtle" />

          {/* Breakpoints */}
          <BreakpointInput />

          <hr className="border-subtle" />

          {/* Ratios */}
          <RatioSlider />

          <hr className="border-subtle" />

          {/* Font Upload */}
          <FontUploader />

          <hr className="border-subtle" />

          {/* Manual Overrides */}
          <ManualOverrides />

          <hr className="border-subtle" />

          {/* Accent Color Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">Accent Color</label>
            <div className="flex gap-2">
              <button
                onClick={() => setAccentColor('electric-blue')}
                className={`flex-1 py-2 rounded flex items-center justify-center gap-2 transition-colors ${
                  accentColor === 'electric-blue'
                    ? 'bg-blue-500/20 border border-blue-500'
                    : 'bg-deep border border-transparent hover:border-blue-500/50'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                <span className="text-xs text-primary">Blue</span>
              </button>
              <button
                onClick={() => setAccentColor('vibrant-orange')}
                className={`flex-1 py-2 rounded flex items-center justify-center gap-2 transition-colors ${
                  accentColor === 'vibrant-orange'
                    ? 'bg-orange-500/20 border border-orange-500'
                    : 'bg-deep border border-transparent hover:border-orange-500/50'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-orange-500" />
                <span className="text-xs text-primary">Orange</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-subtle">
        <p className="text-xs text-secondary/60 text-center">
          Pure CSS output. Zero runtime.
        </p>
      </div>
    </aside>
  );
}
