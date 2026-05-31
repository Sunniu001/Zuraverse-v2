'use client';

import React from 'react';
import { ReactLenis } from 'lenis/react';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.4, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
