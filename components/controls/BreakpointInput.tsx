'use client';

// Min/Max Breakpoint Controls with Device Presets and Draggable Range
import { useScaleStore } from '@/store/useScaleStore';
import { useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import {
  SmartphoneIcon,
  TabletIcon,
  LaptopIcon,
  MonitorIcon,
  TvIcon,
  WatchIcon,
} from '@/components/icons';

// Device definitions with icons
interface Device {
  name: string;
  width: number;
  icon: ReactNode;
  category: 'min' | 'max' | 'both';
}

const DEVICES: Device[] = [
  { name: 'Watch', width: 272, icon: <WatchIcon size={16} />, category: 'min' },
  { name: 'iPhone SE', width: 320, icon: <SmartphoneIcon size={16} />, category: 'min' },
  { name: 'iPhone 14', width: 390, icon: <SmartphoneIcon size={16} />, category: 'min' },
  { name: 'iPhone Pro Max', width: 430, icon: <SmartphoneIcon size={16} />, category: 'both' },
  { name: 'iPad Mini', width: 744, icon: <TabletIcon size={16} />, category: 'both' },
  { name: 'iPad', width: 820, icon: <TabletIcon size={16} />, category: 'both' },
  { name: 'iPad Pro 11"', width: 834, icon: <TabletIcon size={16} />, category: 'both' },
  { name: 'iPad Pro 12.9"', width: 1024, icon: <TabletIcon size={16} />, category: 'both' },
  { name: 'MacBook Air', width: 1280, icon: <LaptopIcon size={16} />, category: 'max' },
  { name: 'MacBook Pro 14"', width: 1512, icon: <LaptopIcon size={16} />, category: 'max' },
  { name: 'Desktop HD', width: 1440, icon: <MonitorIcon size={16} />, category: 'max' },
  { name: 'Desktop FHD', width: 1920, icon: <MonitorIcon size={16} />, category: 'max' },
  { name: 'Desktop QHD', width: 2560, icon: <MonitorIcon size={16} />, category: 'max' },
  { name: '4K Display', width: 3840, icon: <TvIcon size={16} />, category: 'max' },
];

const MIN_RANGE = 200;
const MAX_RANGE = 2560;
const MIN_GAP = 100;

export function BreakpointInput() {
  const minBreakpoint = useScaleStore((s) => s.minBreakpoint);
  const maxBreakpoint = useScaleStore((s) => s.maxBreakpoint);
  const setMinBreakpoint = useScaleStore((s) => s.setMinBreakpoint);
  const setMaxBreakpoint = useScaleStore((s) => s.setMaxBreakpoint);

  const minDevices = DEVICES.filter((d) => d.category === 'min' || d.category === 'both');
  const maxDevices = DEVICES.filter((d) => d.category === 'max' || d.category === 'both');

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-primary">Breakpoints</div>

      {/* Draggable Range Slider */}
      <RangeSlider
        minValue={minBreakpoint}
        maxValue={maxBreakpoint}
        onMinChange={setMinBreakpoint}
        onMaxChange={setMaxBreakpoint}
        min={MIN_RANGE}
        max={MAX_RANGE}
        minGap={MIN_GAP}
      />

      {/* Min Breakpoint Devices */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-secondary">Minimum (Mobile)</label>
          <span className="text-xs font-mono text-accent">{minBreakpoint}px</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {minDevices.map((device) => (
            <DeviceButton
              key={device.name}
              device={device}
              isSelected={minBreakpoint === device.width}
              onClick={() => setMinBreakpoint(device.width)}
              disabled={device.width >= maxBreakpoint - MIN_GAP}
            />
          ))}
        </div>
      </div>

      {/* Max Breakpoint Devices */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-secondary">Maximum (Desktop)</label>
          <span className="text-xs font-mono text-accent">{maxBreakpoint}px</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {maxDevices.map((device) => (
            <DeviceButton
              key={device.name}
              device={device}
              isSelected={maxBreakpoint === device.width}
              onClick={() => setMaxBreakpoint(device.width)}
              disabled={device.width <= minBreakpoint + MIN_GAP}
            />
          ))}
        </div>
      </div>

      {/* Quick presets */}
      <div className="space-y-2">
        <div className="text-xs text-secondary">Quick Presets</div>
        <div className="grid grid-cols-2 gap-2">
          <PresetButton
            label="Mobile First"
            description="320 → 1280"
            onClick={() => {
              setMinBreakpoint(320);
              setMaxBreakpoint(1280);
            }}
            isActive={minBreakpoint === 320 && maxBreakpoint === 1280}
          />
          <PresetButton
            label="Modern"
            description="390 → 1440"
            onClick={() => {
              setMinBreakpoint(390);
              setMaxBreakpoint(1440);
            }}
            isActive={minBreakpoint === 390 && maxBreakpoint === 1440}
          />
          <PresetButton
            label="Wide Range"
            description="320 → 1920"
            onClick={() => {
              setMinBreakpoint(320);
              setMaxBreakpoint(1920);
            }}
            isActive={minBreakpoint === 320 && maxBreakpoint === 1920}
          />
          <PresetButton
            label="Tablet Focus"
            description="744 → 1024"
            onClick={() => {
              setMinBreakpoint(744);
              setMaxBreakpoint(1024);
            }}
            isActive={minBreakpoint === 744 && maxBreakpoint === 1024}
          />
        </div>
      </div>
    </div>
  );
}

// Draggable Range Slider Component
interface RangeSliderProps {
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  min: number;
  max: number;
  minGap: number;
}

function RangeSlider({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  min,
  max,
  minGap,
}: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null);

  const getPercentage = (value: number) => ((value - min) / (max - min)) * 100;
  const getValue = (percentage: number) => Math.round(min + (percentage / 100) * (max - min));

  const handleMouseDown = useCallback((handle: 'min' | 'max') => {
    setDragging(handle);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging || !trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const newValue = getValue(percentage);

      if (dragging === 'min') {
        const clampedValue = Math.max(min, Math.min(maxValue - minGap, newValue));
        onMinChange(clampedValue);
      } else {
        const clampedValue = Math.min(max, Math.max(minValue + minGap, newValue));
        onMaxChange(clampedValue);
      }
    },
    [dragging, minValue, maxValue, min, max, minGap, onMinChange, onMaxChange]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  // Touch support
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!dragging || !trackRef.current) return;

      const touch = e.touches[0];
      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
      const newValue = getValue(percentage);

      if (dragging === 'min') {
        const clampedValue = Math.max(min, Math.min(maxValue - minGap, newValue));
        onMinChange(clampedValue);
      } else {
        const clampedValue = Math.min(max, Math.max(minValue + minGap, newValue));
        onMaxChange(clampedValue);
      }
    },
    [dragging, minValue, maxValue, min, max, minGap, onMinChange, onMaxChange]
  );

  const handleTouchEnd = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
      return () => {
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [dragging, handleTouchMove, handleTouchEnd]);

  const minPercent = getPercentage(minValue);
  const maxPercent = getPercentage(maxValue);

  return (
    <div className="space-y-2">
      <div className="text-xs text-secondary flex justify-between">
        <span>Drag handles to adjust range</span>
        <span className="text-accent">{maxValue - minValue}px</span>
      </div>

      {/* Track container */}
      <div
        ref={trackRef}
        className="relative h-14 bg-deep rounded-lg cursor-pointer select-none"
      >
        {/* Device markers */}
        {DEVICES.filter(d => d.width >= min && d.width <= max).map((device) => (
          <div
            key={device.name}
            className="absolute top-0 h-full flex flex-col items-center justify-end pb-1"
            style={{ left: `${getPercentage(device.width)}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-px h-3 bg-subtle/50" />
          </div>
        ))}

        {/* Inactive track left */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 bg-elevated rounded-l-full"
          style={{ left: 0, width: `${minPercent}%` }}
        />

        {/* Active range */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 bg-accent/40"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Inactive track right */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 bg-elevated rounded-r-full"
          style={{ left: `${maxPercent}%`, right: 0 }}
        />

        {/* Min Handle */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-10 rounded-lg cursor-ew-resize flex flex-col items-center justify-center gap-0.5 transition-colors ${
            dragging === 'min'
              ? 'bg-accent shadow-lg shadow-accent/30'
              : 'bg-accent/80 hover:bg-accent'
          }`}
          style={{ left: `${minPercent}%` }}
          onMouseDown={() => handleMouseDown('min')}
          onTouchStart={() => handleMouseDown('min')}
        >
          <div className="w-0.5 h-3 bg-white/60 rounded-full" />
          <div className="w-0.5 h-3 bg-white/60 rounded-full" />
        </div>

        {/* Max Handle */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-10 rounded-lg cursor-ew-resize flex flex-col items-center justify-center gap-0.5 transition-colors ${
            dragging === 'max'
              ? 'bg-accent shadow-lg shadow-accent/30'
              : 'bg-accent/80 hover:bg-accent'
          }`}
          style={{ left: `${maxPercent}%` }}
          onMouseDown={() => handleMouseDown('max')}
          onTouchStart={() => handleMouseDown('max')}
        >
          <div className="w-0.5 h-3 bg-white/60 rounded-full" />
          <div className="w-0.5 h-3 bg-white/60 rounded-full" />
        </div>

        {/* Min value label */}
        <div
          className="absolute bottom-0 -translate-x-1/2 text-xs font-mono text-primary bg-surface px-1.5 py-0.5 rounded"
          style={{ left: `${minPercent}%` }}
        >
          {minValue}
        </div>

        {/* Max value label */}
        <div
          className="absolute bottom-0 -translate-x-1/2 text-xs font-mono text-primary bg-surface px-1.5 py-0.5 rounded"
          style={{ left: `${maxPercent}%` }}
        >
          {maxValue}
        </div>
      </div>

      {/* Scale labels */}
      <div className="flex justify-between text-xs text-secondary/50 font-mono">
        <span>{min}px</span>
        <span>{max}px</span>
      </div>
    </div>
  );
}

interface DeviceButtonProps {
  device: Device;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function DeviceButton({ device, isSelected, onClick, disabled }: DeviceButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={`${device.name}: ${device.width}px`}
      className={`flex flex-col items-center gap-1 p-2 rounded transition-all ${
        isSelected
          ? 'bg-accent text-white'
          : disabled
          ? 'bg-deep/50 text-secondary/30 cursor-not-allowed'
          : 'bg-deep text-secondary hover:bg-elevated hover:text-primary'
      }`}
    >
      <span className={isSelected ? 'text-white' : ''}>{device.icon}</span>
      <span className="text-[10px] leading-tight truncate w-full text-center">
        {device.width}
      </span>
    </button>
  );
}

interface PresetButtonProps {
  label: string;
  description: string;
  onClick: () => void;
  isActive: boolean;
}

function PresetButton({ label, description, onClick, isActive }: PresetButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-xs rounded text-left transition-colors ${
        isActive
          ? 'bg-accent/20 border border-accent text-primary'
          : 'bg-elevated border border-transparent hover:bg-surface text-secondary hover:text-primary'
      }`}
    >
      <span className="block font-medium text-primary">{label}</span>
      <span className={isActive ? 'text-accent' : 'text-secondary'}>{description}</span>
    </button>
  );
}
