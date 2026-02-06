'use client';

// "The Receipt" - CSS Output Sidebar
import { CodeExport } from '@/components/output/CodeExport';
import { useScaleStore } from '@/store/useScaleStore';
import { ContrastAudit } from '@/components/ui/ContrastAudit';

export function RightSidebar() {
  const scaleSteps = useScaleStore((s) => s.scaleSteps);
  const simulatedViewport = useScaleStore((s) => s.simulatedViewport);
  const mobileRatio = useScaleStore((s) => s.mobileRatio);
  const desktopRatio = useScaleStore((s) => s.desktopRatio);

  return (
    <aside className="w-96 bg-surface border-l border-subtle flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-subtle">
        <h2 className="text-lg font-bold text-primary">The Receipt</h2>
        <p className="text-xs text-secondary mt-1">
          Copy-paste ready CSS
        </p>
      </div>

      {/* Quick stats */}
      <div className="p-4 border-b border-subtle grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-lg font-bold text-accent">{scaleSteps.length}</div>
          <div className="text-xs text-secondary">Steps</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-primary">{mobileRatio.toFixed(2)}</div>
          <div className="text-xs text-secondary">Mobile</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-primary">{desktopRatio.toFixed(2)}</div>
          <div className="text-xs text-secondary">Desktop</div>
        </div>
      </div>

      {/* Current sizes preview */}
      <div className="p-4 border-b border-subtle">
        <div className="text-xs text-secondary mb-2">
          Current sizes at {simulatedViewport}px
        </div>
        <div className="space-y-1">
          {scaleSteps.map((step) => (
            <div
              key={step.step}
              className="flex items-center justify-between py-1"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 text-center font-mono text-xs text-secondary">
                  {step.step > 0 ? `+${step.step}` : step.step}
                </span>
                <span className="text-xs text-primary">{step.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-2 bg-accent/30 rounded"
                  style={{ width: `${Math.min(60, step.currentSize)}px` }}
                />
                <span className="text-xs font-mono text-accent w-12 text-right">
                  {step.currentSize.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contrast audit */}
      <div className="p-4 border-b border-subtle">
        <div className="text-xs text-secondary mb-2">WCAG Contrast Check</div>
        <ContrastAudit
          foreground="#FAFAFA"
          background="#0A0A0A"
          fontSize={scaleSteps.find((s) => s.step === 0)?.currentSize || 16}
        />
      </div>

      {/* Code export */}
      <div className="flex-1 p-4 overflow-hidden">
        <CodeExport />
      </div>
    </aside>
  );
}
