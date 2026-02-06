import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ScaleProvider } from '@/components/providers/ScaleProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'The Sovereign Scale | Fluid Typography Engine',
  description:
    'A high-performance typography engine with tapered scale interpolation, accessible clamp formulas, and optical sizing support.',
  keywords: [
    'typography',
    'fluid typography',
    'CSS',
    'design system',
    'type scale',
    'responsive',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <ScaleProvider>{children}</ScaleProvider>
      </body>
    </html>
  );
}
