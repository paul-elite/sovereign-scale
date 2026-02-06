'use client';

// Variable Font Playground
import { useCallback, useState } from 'react';
import { useScaleStore } from '@/store/useScaleStore';
import { UploadIcon, XIcon } from '@/components/icons';

export function FontUploader() {
  const customFont = useScaleStore((s) => s.customFont);
  const customFontName = useScaleStore((s) => s.customFontName);
  const setCustomFont = useScaleStore((s) => s.setCustomFont);
  const fontAxes = useScaleStore((s) => s.fontAxes);
  const setFontAxis = useScaleStore((s) => s.setFontAxis);

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.match(/\.(woff2?|otf|ttf)$/i)) {
        setError('Please upload a .woff, .woff2, .otf, or .ttf file');
        return;
      }

      setError(null);
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result as string;
        const fontName = file.name.replace(/\.(woff2?|otf|ttf)$/i, '');
        setCustomFont(result, fontName);
      };

      reader.onerror = () => {
        setError('Failed to read font file');
      };

      reader.readAsDataURL(file);
    },
    [setCustomFont]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleClear = () => {
    setCustomFont(null, null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-primary">Variable Font</div>

      {customFont ? (
        <div className="space-y-4">
          {/* Font loaded indicator */}
          <div className="flex items-center justify-between p-3 bg-deep rounded-lg">
            <div>
              <div className="text-sm font-medium text-primary">{customFontName}</div>
              <div className="text-xs text-secondary">Custom font loaded</div>
            </div>
            <button
              onClick={handleClear}
              className="p-2 text-secondary hover:text-primary hover:bg-surface rounded transition-colors"
            >
              <XIcon size={16} />
            </button>
          </div>

          {/* Font axis controls */}
          <div className="space-y-3">
            <div className="text-xs text-secondary">Variable Axes</div>

            {/* Common variable font axes */}
            <AxisSlider
              axis="wght"
              label="Weight"
              min={100}
              max={900}
              value={fontAxes.wght ?? 400}
              onChange={(v) => setFontAxis('wght', v)}
            />
            <AxisSlider
              axis="wdth"
              label="Width"
              min={50}
              max={200}
              value={fontAxes.wdth ?? 100}
              onChange={(v) => setFontAxis('wdth', v)}
            />
            <AxisSlider
              axis="slnt"
              label="Slant"
              min={-15}
              max={0}
              value={fontAxes.slnt ?? 0}
              onChange={(v) => setFontAxis('slnt', v)}
            />
          </div>

          {/* Preview */}
          <div
            className="p-4 bg-deep rounded-lg"
            style={{
              fontFamily: `"${customFontName}", system-ui, sans-serif`,
              fontVariationSettings: Object.entries(fontAxes)
                .map(([k, v]) => `"${k}" ${v}`)
                .join(', '),
            }}
          >
            <div className="text-2xl text-primary mb-2">
              The quick brown fox
            </div>
            <div className="text-sm text-secondary">
              jumps over the lazy dog
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative p-6 border-2 border-dashed rounded-lg text-center transition-colors ${
              isDragging
                ? 'border-accent bg-accent/10'
                : 'border-subtle hover:border-accent/50'
            }`}
          >
            <input
              type="file"
              accept=".woff,.woff2,.otf,.ttf"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadIcon size={24} className="mx-auto mb-2 text-secondary" />
            <div className="text-sm text-primary">Drop font here</div>
            <div className="text-xs text-secondary mt-1">
              or click to browse
            </div>
            <div className="text-xs text-secondary/50 mt-2">
              .woff2, .woff, .otf, .ttf
            </div>
          </div>

          {error && (
            <div className="p-2 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400">
              {error}
            </div>
          )}

          <p className="text-xs text-secondary">
            Upload a variable font to test optical sizing and other axes.
            The font stays in your browser.
          </p>
        </>
      )}
    </div>
  );
}

interface AxisSliderProps {
  axis: string;
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

function AxisSlider({ axis, label, min, max, value, onChange }: AxisSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-secondary">
          {label} <span className="font-mono text-secondary/50">({axis})</span>
        </span>
        <span className="text-xs font-mono text-accent">{value}</span>
      </div>
      <div className="relative h-1.5">
        <div className="absolute inset-0 bg-deep rounded-full" />
        <div
          className="absolute h-full bg-accent/50 rounded-full"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}
