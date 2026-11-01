import type { Metadata, Viewport } from 'next';
import './globals.css';
import './cinematic.css';

export const metadata: Metadata = {
  title: 'BR-Skins — Luxury Skincare, Powered by Science',
  description:
    'Experience an ultra-luxurious, scientifically calibrated skincare ritual. Frosted glass architecture, bio-fermented actives, and pure cellular radiance.',
  keywords: ['luxury skincare', 'BR-Skins', 'vitamin c serum', 'aesthetic skincare', 'clean beauty', 'clinical cosmetics'],
  authors: [{ name: 'BR-Skins Laboratory' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FDF8F3',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FDF8F3] text-[#1A1816] antialiased selection:bg-[#FFD54A] selection:text-[#121110]">
        {children}
      </body>
    </html>
  );
}
