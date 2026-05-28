import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zuraverse — Beyond The Event Horizon',
  description:
    'Step aboard the ancient vessel. Explore the living universe of Zuraverse — a cosmic odyssey spanning ten thousand light-years of biopunk mythology and interstellar lore.',
  keywords: ['Zuraverse', 'sci-fi', 'cosmic', 'biopunk', 'space', 'metaverse'],
  openGraph: {
    title: 'Zuraverse — Beyond The Event Horizon',
    description: 'A cosmic odyssey spanning ten thousand light-years.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
