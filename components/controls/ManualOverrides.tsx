'use client';

// "The Struggle" - Manual Override Toggle and Controls
import { useScaleStore } from '@/store/useScaleStore';
import { RefreshIcon } from '@/components/icons';
import { motion, AnimatePresence } from 'framer-motion';

export function ManualOverrides() {
  const manualMode = useScaleStore((s) => s.manualMode);
  const setManualMode = useScaleStore((s) => s.setManualMode);
  const scaleSteps = useScaleStore((s) => s.scaleSteps);
  const overrides = useScaleStore((s) => s.overrides);
  const setOverride = useScaleStore((s) => s.setOverride);
  const clearOverride = useScaleStore((s) => s.clearOverride);

  return (
    <div className="space-y-4">
      {/* Toggle header */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-primary">
            Manual Overrides
          </label>
          <p className="text-xs text-secondary">
            &quot;The Struggle&quot; - fine-tune individual steps
          </p>
        </div>
        <button
          onClick={() => setManualMode(!manualMode)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            manualMode ? 'bg-accent' : 'bg-elevated'
          }`}
        >
          <motion.div
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
            animate={{ left: manualMode ? '28px' : '4px' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      {/* Override controls */}
      <AnimatePresence>
        {manualMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pt-2">
              {scaleSteps.map((step) => {
                const stepKey = step.step.toString();
                const hasOverride = stepKey in overrides;
                const override = overrides[stepKey] || {
                  min: step.minSize,
                  max: step.maxSize,
                };

                return (
                  <div
                    key={step.step}
                    className={`p-3 rounded-lg border transition-colors ${
                      hasOverride
                        ? 'bg-accent/10 border-accent/30'
                        : 'bg-deep border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary">
                        Step {step.step}
                        <span className="text-secondary ml-1">
                          ({step.name})
                        </span>
                      </span>
                      {hasOverride && (
                        <button
                          onClick={() => clearOverride(stepKey)}
                          className="p-1 text-secondary hover:text-primary rounded transition-colors"
                          title="Reset to calculated value"
                        >
                          <RefreshIcon size={14} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-secondary">Min</label>
                        <input
                          type="number"
                          step="0.5"
                          value={hasOverride ? override.min : step.minSize}
                          onChange={(e) => {
                            const newMin = parseFloat(e.target.value) || 0;
                            setOverride(stepKey, {
                              min: newMin,
                              max: hasOverride ? override.max : step.maxSize,
                            });
                          }}
                          className="w-full px-2 py-1 bg-surface border border-subtle rounded text-sm font-mono text-primary focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-secondary">Max</label>
                        <input
                          type="number"
                          step="0.5"
                          value={hasOverride ? override.max : step.maxSize}
                          onChange={(e) => {
                            const newMax = parseFloat(e.target.value) || 0;
                            setOverride(stepKey, {
                              min: hasOverride ? override.min : step.minSize,
                              max: newMax,
                            });
                          }}
                          className="w-full px-2 py-1 bg-surface border border-subtle rounded text-sm font-mono text-primary focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>

                    {/* Size preview bar */}
                    <div className="mt-2 h-1 bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent/50 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            ((hasOverride ? override.max : step.maxSize) / 60) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!manualMode && (
        <p className="text-xs text-secondary/70">
          Enable to manually adjust min/max sizes for each scale step.
          Overrides persist when switching between calculated ratios.
        </p>
      )}
    </div>
  );
}
