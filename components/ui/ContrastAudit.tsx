'use client';

// WCAG Contrast Audit Indicator
import { useContrastRatio } from '@/hooks/useContrastRatio';

interface ContrastAuditProps {
  foreground?: string;
  background?: string;
  fontSize?: number;
  compact?: boolean;
}

export function ContrastAudit({
  foreground = '#FAFAFA',
  background = '#0A0A0A',
  fontSize = 16,
  compact = false,
}: ContrastAuditProps) {
  const contrast = useContrastRatio(foreground, background, fontSize);

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: contrast.color }}
        />
        <span className="text-xs text-secondary">
          {contrast.ratio}:1
        </span>
      </div>
    );
  }

  return (
    <div className="p-3 bg-elevated rounded-lg border border-subtle">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-secondary">Contrast Ratio</span>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: contrast.color }}
          />
          <span className="text-sm font-medium" style={{ color: contrast.color }}>
            {contrast.level}
          </span>
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-primary">
          {contrast.ratio}
        </span>
        <span className="text-sm text-secondary">:1</span>
      </div>
      <p className="text-xs text-secondary mt-2">
        {contrast.label}
        {!contrast.passes && contrast.passesLarge && (
          <span className="text-yellow-500"> (passes for large text)</span>
        )}
      </p>
    </div>
  );
}

// Mini badge version
export function ContrastBadge({
  foreground = '#FAFAFA',
  background = '#0A0A0A',
  fontSize = 16,
}: ContrastAuditProps) {
  const contrast = useContrastRatio(foreground, background, fontSize);

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
      style={{
        backgroundColor: `${contrast.color}20`,
        color: contrast.color,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: contrast.color }} />
      {contrast.level}
    </span>
  );
}
