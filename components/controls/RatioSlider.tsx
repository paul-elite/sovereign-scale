'use client';

// Mobile/Desktop Ratio Input Controls
import { useScaleStore } from '@/store/useScaleStore';
import { RATIOS } from '@/lib/types';
import { getRatioName } from '@/lib/scale-engine';

export function RatioSlider() {
  const mobileRatio = useScaleStore((s) => s.mobileRatio);
  const desktopRatio = useScaleStore((s) => s.desktopRatio);
  const setMobileRatio = useScaleStore((s) => s.setMobileRatio);
  const setDesktopRatio = useScaleStore((s) => s.setDesktopRatio);

  return (
    <div className="space-y-6">
      {/* Mobile Ratio */}
      <RatioControl
        label="Mobile Ratio"
        description="Scale ratio at minimum breakpoint"
        value={mobileRatio}
        onChange={setMobileRatio}
      />

      {/* Desktop Ratio */}
      <RatioControl
        label="Desktop Ratio"
        description="Scale ratio at maximum breakpoint"
        value={desktopRatio}
        onChange={setDesktopRatio}
      />

      {/* Visual comparison */}
      <div className="p-3 bg-deep rounded-lg">
        <div className="text-xs text-secondary mb-2">Scale Progression</div>
        <div className="flex items-end gap-1 h-12">
          {[0, 1, 2, 3, 4].map((step) => {
            const mobileHeight = Math.pow(mobileRatio, step) * 8;
            const desktopHeight = Math.pow(desktopRatio, step) * 8;
            return (
              <div key={step} className="flex-1 flex gap-0.5">
                <div
                  className="flex-1 bg-accent/30 rounded-t"
                  style={{ height: `${Math.min(mobileHeight, 48)}px` }}
                  title={`Mobile step ${step}`}
                />
                <div
                  className="flex-1 bg-accent rounded-t"
                  style={{ height: `${Math.min(desktopHeight, 48)}px` }}
                  title={`Desktop step ${step}`}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-secondary/50 mt-1">
          <span>Step 0</span>
          <span>Step 4</span>
        </div>
      </div>
    </div>
  );
}

interface RatioControlProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}

function RatioControl({ label, description, value, onChange }: RatioControlProps) {
  const ratioName = getRatioName(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-primary">{label}</label>
          <p className="text-xs text-secondary">{description}</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-mono text-accent">{value.toFixed(3)}</span>
          <p className="text-xs text-secondary">{ratioName}</p>
        </div>
      </div>

      {/* Slider */}
      <div className="relative h-2">
        <div className="absolute inset-0 bg-deep rounded-full" />
        <div
          className="absolute h-full bg-accent/50 rounded-full"
          style={{ width: `${((value - 1) / 0.618) * 100}%` }}
        />
        <input
          type="range"
          min="1.0"
          max="1.618"
          step="0.001"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-1">
        {Object.entries(RATIOS).map(([name, ratio]) => (
          <button
            key={name}
            onClick={() => onChange(ratio)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              Math.abs(value - ratio) < 0.01
                ? 'bg-accent text-white'
                : 'bg-elevated text-secondary hover:bg-surface hover:text-primary'
            }`}
          >
            {name.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  );
}
