'use client';

// Provider for Zustand store and custom font injection
import { ReactNode, useEffect } from 'react';
import { useScaleStore } from '@/store/useScaleStore';

interface ScaleProviderProps {
  children: ReactNode;
}

export function ScaleProvider({ children }: ScaleProviderProps) {
  const customFont = useScaleStore((s) => s.customFont);
  const customFontName = useScaleStore((s) => s.customFontName);
  const accentColor = useScaleStore((s) => s.accentColor);

  // Inject custom font when loaded
  useEffect(() => {
    if (customFont && customFontName) {
      const fontFace = new FontFace(customFontName, `url(${customFont})`);
      fontFace.load().then((loadedFace) => {
        document.fonts.add(loadedFace);
      }).catch((err) => {
        console.error('Failed to load custom font:', err);
      });
    }
  }, [customFont, customFontName]);

  // Set accent color CSS variable
  useEffect(() => {
    const root = document.documentElement;
    if (accentColor === 'electric-blue') {
      root.style.setProperty('--accent', '#3B82F6');
      root.style.setProperty('--accent-hover', '#2563EB');
    } else {
      root.style.setProperty('--accent', '#F97316');
      root.style.setProperty('--accent-hover', '#EA580C');
    }
  }, [accentColor]);

  return <>{children}</>;
}
