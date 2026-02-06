'use client';

// Syntax-highlighted CSS Output
import { useState, useCallback } from 'react';
import { useScaleStore } from '@/store/useScaleStore';
import { generateExport, ExportFormat } from '@/lib/css-generator';
import { CopyIcon, CheckIcon } from '@/components/icons';

export function CodeExport() {
  const scaleSteps = useScaleStore((s) => s.scaleSteps);
  const customFont = useScaleStore((s) => s.customFont);
  const customFontName = useScaleStore((s) => s.customFontName);
  const fontAxes = useScaleStore((s) => s.fontAxes);

  const [format, setFormat] = useState<ExportFormat>('css');
  const [copied, setCopied] = useState(false);

  const code = generateExport(format, scaleSteps, customFont, customFontName, fontAxes);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [code]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-primary">The Receipt</h2>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors ${
            copied
              ? 'bg-green-500/20 text-green-400'
              : 'bg-accent/20 text-accent hover:bg-accent/30'
          }`}
        >
          {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Format tabs */}
      <div className="flex gap-1 mb-4 bg-deep rounded-lg p-1">
        {(['css', 'minimal', 'tailwind', 'scss'] as ExportFormat[]).map((f) => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              format === f
                ? 'bg-surface text-primary'
                : 'text-secondary hover:text-primary'
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Code output */}
      <div className="flex-1 overflow-auto bg-deep rounded-lg">
        <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto">
          <SyntaxHighlight code={code} format={format} />
        </pre>
      </div>

      {/* Footer info */}
      <div className="mt-4 text-xs text-secondary/60">
        <p>
          {format === 'css' && 'Full CSS with custom properties and utility classes.'}
          {format === 'minimal' && 'Just the essential CSS variables.'}
          {format === 'tailwind' && 'Extend your Tailwind config with fluid sizes.'}
          {format === 'scss' && 'SCSS variables with a mixin for optical sizing.'}
        </p>
      </div>
    </div>
  );
}

// Simple syntax highlighting without external dependencies
function SyntaxHighlight({ code, format }: { code: string; format: ExportFormat }) {
  const lines = code.split('\n');

  return (
    <code>
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre">
          {highlightLine(line, format)}
        </div>
      ))}
    </code>
  );
}

function highlightLine(line: string, format: ExportFormat): React.ReactNode {
  // Comment highlighting
  if (line.trim().startsWith('/*') || line.trim().startsWith('//')) {
    return <span className="text-secondary/50">{line}</span>;
  }

  // CSS/SCSS property highlighting
  if (format === 'css' || format === 'scss' || format === 'minimal') {
    // CSS custom property
    if (line.includes('--')) {
      const parts = line.split(/(--.+?:)/);
      return parts.map((part, i) => {
        if (part.startsWith('--')) {
          return <span key={i} className="text-cyan-400">{part}</span>;
        }
        if (part.includes('clamp(')) {
          return highlightClamp(part, i);
        }
        return <span key={i} className="text-primary/80">{part}</span>;
      });
    }

    // Selector
    if (line.includes('{') && !line.includes(':')) {
      return <span className="text-accent">{line}</span>;
    }

    // Property: value
    if (line.includes(':') && !line.includes('--')) {
      const [prop, ...rest] = line.split(':');
      return (
        <>
          <span className="text-purple-400">{prop}</span>
          <span className="text-primary/50">:</span>
          <span className="text-primary/80">{rest.join(':')}</span>
        </>
      );
    }
  }

  // Tailwind/JS highlighting
  if (format === 'tailwind') {
    if (line.includes(':')) {
      const [key, ...rest] = line.split(':');
      return (
        <>
          <span className="text-cyan-400">{key}</span>
          <span className="text-primary/50">:</span>
          <span className="text-yellow-300">{rest.join(':')}</span>
        </>
      );
    }
  }

  return <span className="text-primary/80">{line}</span>;
}

function highlightClamp(text: string, key: number): React.ReactNode {
  // Highlight clamp function parts
  const clampMatch = text.match(/(clamp\()(.+?)(\))/);
  if (clampMatch) {
    const [, open, args, close] = clampMatch;
    const parts = args.split(',').map((arg, i) => (
      <span key={i}>
        <span className="text-green-400">{arg.trim()}</span>
        {i < 2 && <span className="text-primary/50">, </span>}
      </span>
    ));

    return (
      <span key={key}>
        <span className="text-yellow-400">{open}</span>
        {parts}
        <span className="text-yellow-400">{close}</span>
        {text.slice(text.indexOf(')') + 1)}
      </span>
    );
  }

  return <span key={key} className="text-primary/80">{text}</span>;
}
