'use client';

// Min/Max Breakpoint Controls with Device Presets
import { useScaleStore } from '@/store/useScaleStore';
import { useState, useEffect, ReactNode } from 'react';
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

      {/* Min Breakpoint */}
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
              disabled={device.width >= maxBreakpoint}
            />
          ))}
        </div>
        <BreakpointField
          value={minBreakpoint}
          onChange={setMinBreakpoint}
          min={200}
          max={maxBreakpoint - 100}
        />
      </div>

      {/* Max Breakpoint */}
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
              disabled={device.width <= minBreakpoint}
            />
          ))}
        </div>
        <BreakpointField
          value={maxBreakpoint}
          onChange={setMaxBreakpoint}
          min={minBreakpoint + 100}
          max={3840}
        />
      </div>

      {/* Visual range indicator */}
      <div className="space-y-1">
        <div className="text-xs text-secondary">Scale Range</div>
        <div className="relative h-10 bg-deep rounded-lg overflow-hidden">
          {/* Background device markers */}
          {DEVICES.map((device) => (
            <div
              key={device.name}
              className="absolute top-0 h-full w-px bg-subtle/30"
              style={{ left: `${(device.width / 3840) * 100}%` }}
              title={`${device.name}: ${device.width}px`}
            />
          ))}

          {/* Active range */}
          <div
            className="absolute h-full bg-accent/20 border-x-2 border-accent"
            style={{
              left: `${(minBreakpoint / 3840) * 100}%`,
              width: `${((maxBreakpoint - minBreakpoint) / 3840) * 100}%`,
            }}
          />

          {/* Labels */}
          <div className="absolute inset-0 flex items-center justify-between px-2">
            <span className="text-xs font-mono text-secondary bg-deep/80 px-1 rounded">
              {minBreakpoint}
            </span>
            <span className="text-xs text-secondary/50">
              {maxBreakpoint - minBreakpoint}px range
            </span>
            <span className="text-xs font-mono text-secondary bg-deep/80 px-1 rounded">
              {maxBreakpoint}
            </span>
          </div>
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

interface BreakpointFieldProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

function BreakpointField({ value, onChange, min, max }: BreakpointFieldProps) {
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
    <div className="relative">
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-1.5 bg-deep border border-subtle rounded text-xs font-mono text-primary focus:outline-none focus:border-accent"
        placeholder="Custom value"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-secondary">
        px
      </span>
    </div>
  );
}
