'use client';

// Preview Mode A/B Switcher
import { useScaleStore } from '@/store/useScaleStore';
import { DocumentIcon, DashboardIcon } from '@/components/icons';
import { motion } from 'framer-motion';

export function PreviewToggle() {
  const previewMode = useScaleStore((s) => s.previewMode);
  const setPreviewMode = useScaleStore((s) => s.setPreviewMode);

  return (
    <div className="flex bg-surface rounded-lg p-1">
      <button
        onClick={() => setPreviewMode('manifesto')}
        className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          previewMode === 'manifesto'
            ? 'text-primary'
            : 'text-secondary hover:text-primary'
        }`}
      >
        {previewMode === 'manifesto' && (
          <motion.div
            layoutId="preview-bg"
            className="absolute inset-0 bg-elevated rounded-md"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative flex items-center gap-2">
          <DocumentIcon size={16} />
          Manifesto
        </span>
      </button>

      <button
        onClick={() => setPreviewMode('dashboard')}
        className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          previewMode === 'dashboard'
            ? 'text-primary'
            : 'text-secondary hover:text-primary'
        }`}
      >
        {previewMode === 'dashboard' && (
          <motion.div
            layoutId="preview-bg"
            className="absolute inset-0 bg-elevated rounded-md"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative flex items-center gap-2">
          <DashboardIcon size={16} />
          Dashboard
        </span>
      </button>
    </div>
  );
}
