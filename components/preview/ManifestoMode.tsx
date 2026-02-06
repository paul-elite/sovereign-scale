'use client';

// Long-form Article Preview - "Manifesto" Mode
import { FluidText } from '@/components/ui/FluidText';

export function ManifestoMode() {
  return (
    <article className="max-w-2xl mx-auto space-y-6">
      {/* Hero */}
      <header className="space-y-4 mb-12">
        <FluidText step={5} className="font-bold text-primary leading-tight">
          The Sovereign Scale
        </FluidText>
        <FluidText step={1} className="text-secondary leading-relaxed">
          A manifesto for fluid typography that respects both the reader and the craft.
          Where mathematics meets meaning, and scale becomes soul.
        </FluidText>
      </header>

      {/* Body content */}
      <section className="space-y-4">
        <FluidText step={3} className="font-semibold text-primary">
          The Problem We Solve
        </FluidText>
        <FluidText step={0} className="text-secondary/90 leading-relaxed">
          Typography on the web has long been a compromise. Fixed sizes that snap awkwardly
          between breakpoints. Viewport units that scale too aggressively, making text
          microscopic on mobile or comically large on ultrawide displays.
        </FluidText>
        <FluidText step={0} className="text-secondary/90 leading-relaxed">
          The Fluid Typography Paradox: we want text that adapts smoothly to any viewport,
          yet maintains readability, hierarchy, and the careful proportions that make
          typography beautiful.
        </FluidText>
      </section>

      <section className="space-y-4">
        <FluidText step={2} className="font-semibold text-primary">
          Our Approach
        </FluidText>
        <FluidText step={0} className="text-secondary/90 leading-relaxed">
          Sovereign Scale uses tapered interpolation between two typographic scales.
          At your minimum breakpoint, we apply a gentler ratio (like Major Second, 1.125)
          to keep mobile text compact yet readable. At your maximum breakpoint, we unleash
          a more dramatic ratio (like Augmented Fourth, 1.414) for desktop impact.
        </FluidText>

        <FluidText step={-1} className="text-secondary/70 italic pl-4 border-l-2 border-accent/30">
          &quot;The best typography is invisible. It doesn&apos;t call attention to itself; it calls
          attention to the content.&quot;
        </FluidText>
      </section>

      <section className="space-y-4">
        <FluidText step={2} className="font-semibold text-primary">
          The Technical Foundation
        </FluidText>
        <FluidText step={0} className="text-secondary/90 leading-relaxed">
          Every size in our scale is generated using CSS clamp(), with values calculated
          to be zoom-safe and accessible. We don&apos;t just scale text—we interpolate the
          ratio itself, creating a smooth progression from mobile-optimized to
          desktop-dramatic.
        </FluidText>

        {/* Code snippet preview */}
        <div className="bg-deep rounded-lg p-4 font-mono">
          <FluidText step={-1} className="text-accent">
            --font-size-xl: clamp(1.25rem, 0.9rem + 1.5vw, 2rem);
          </FluidText>
        </div>

        <FluidText step={0} className="text-secondary/90 leading-relaxed">
          Optical sizing is applied automatically for variable fonts, ensuring that
          smaller text remains legible with open counters, while display sizes gain
          the refined details they deserve.
        </FluidText>
      </section>

      {/* Caption example */}
      <figure className="my-8">
        <div className="aspect-video bg-surface rounded-lg flex items-center justify-center">
          <FluidText step={1} className="text-secondary/30">
            [Image Placeholder]
          </FluidText>
        </div>
        <FluidText step={-2} as="p" className="text-secondary/60 mt-2 text-center">
          Figure 1: The relationship between viewport width and typographic ratio,
          visualized as a smooth curve rather than discrete breakpoints.
        </FluidText>
      </figure>

      <section className="space-y-4">
        <FluidText step={2} className="font-semibold text-primary">
          Why &quot;Sovereign&quot;?
        </FluidText>
        <FluidText step={0} className="text-secondary/90 leading-relaxed">
          Because your typography should rule your design, not be ruled by arbitrary
          breakpoints. Sovereign Scale gives you complete control while handling the
          mathematics that would otherwise require spreadsheets and guesswork.
        </FluidText>
        <FluidText step={0} className="text-secondary/90 leading-relaxed">
          The result is typography that feels intentional at every viewport width.
          Text that breathes, scales, and maintains its relationships whether viewed
          on a phone in portrait mode or a cinema display in landscape.
        </FluidText>
      </section>

      {/* Footer */}
      <footer className="pt-8 mt-8 border-t border-subtle">
        <FluidText step={-1} className="text-secondary/60">
          Generated by Sovereign Scale. Pure CSS, zero runtime.
        </FluidText>
      </footer>
    </article>
  );
}
