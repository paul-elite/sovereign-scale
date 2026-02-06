'use client';

// Center Stage - Preview Area
import { useScaleStore } from '@/store/useScaleStore';
import { PreviewToggle } from '@/components/preview/PreviewToggle';
import { ManifestoMode } from '@/components/preview/ManifestoMode';
import { DashboardMode } from '@/components/preview/DashboardMode';
import { motion } from 'framer-motion';

export function CenterStage() {
  const previewMode = useScaleStore((s) => s.previewMode);
  const simulatedViewport = useScaleStore((s) => s.simulatedViewport);
  const minBreakpoint = useScaleStore((s) => s.minBreakpoint);
  const maxBreakpoint = useScaleStore((s) => s.maxBreakpoint);

  // Calculate preview width as percentage
  const viewportPercentage = Math.round(
    ((simulatedViewport - minBreakpoint) / (maxBreakpoint - minBreakpoint)) * 100
  );

  return (
    <main className="flex-1 flex flex-col bg-deep overflow-hidden">
      {/* Header */}
      <header className="p-4 border-b border-subtle flex items-center justify-between bg-surface/50">
        <div className="flex items-center gap-4">
          <PreviewToggle />
          <div className="h-4 w-px bg-subtle" />
          <span className="text-xs text-secondary">
            Preview at{' '}
            <span className="font-mono text-accent">{simulatedViewport}px</span>
            <span className="text-secondary/50 ml-1">({viewportPercentage}%)</span>
          </span>
        </div>

        {/* Viewport indicator */}
        <div className="flex items-center gap-2 text-xs text-secondary">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live preview
        </div>
      </header>

      {/* Preview container */}
      <div className="flex-1 overflow-auto p-8">
        <motion.div
          className="mx-auto"
          initial={false}
          animate={{ maxWidth: `${simulatedViewport}px` }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          {/* Preview content wrapper */}
          <div className="bg-surface rounded-lg border border-subtle shadow-2xl overflow-hidden">
            {/* Browser chrome mockup */}
            <div className="bg-elevated border-b border-subtle px-4 py-2 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-deep rounded px-3 py-1 text-xs text-secondary/50 font-mono">
                  localhost:3000
                </div>
              </div>
            </div>

            {/* Preview content */}
            <div className="p-6 min-h-[600px]">
              {previewMode === 'manifesto' ? <ManifestoMode /> : <DashboardMode />}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer with viewport ruler */}
      <footer className="border-t border-subtle bg-surface/50 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-secondary">
          <span>
            Scale range: {minBreakpoint}px - {maxBreakpoint}px
          </span>
          <span className="font-mono">
            Current: {simulatedViewport}px
          </span>
        </div>

        {/* Viewport ruler */}
        <div className="relative h-2 mt-2 bg-deep rounded-full overflow-hidden">
          {/* Filled portion */}
          <motion.div
            className="absolute h-full bg-accent/30 rounded-full"
            initial={false}
            animate={{
              width: `${((simulatedViewport - minBreakpoint) / (maxBreakpoint - minBreakpoint)) * 100}%`,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          />

          {/* Current position marker */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-1 h-3 bg-accent rounded-full"
            initial={false}
            animate={{
              left: `${((simulatedViewport - minBreakpoint) / (maxBreakpoint - minBreakpoint)) * 100}%`,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          />
        </div>
      </footer>
    </main>
  );
}
