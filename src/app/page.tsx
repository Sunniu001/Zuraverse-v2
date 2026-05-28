'use client';

import { useState } from 'react';
import Preloader from '@/components/Preloader/Preloader';
import HeroSection from '@/components/HeroSection/HeroSection';
import ArchivesSection from '@/components/ArchivesSection/ArchivesSection';

export default function Home() {
  const [entered, setEntered] = useState(false);

  return (
    <main>
      {/* Preloader sits on top; hero mounts beneath so it's ready on enter */}
      {!entered && <Preloader onEnter={() => setEntered(true)} />}
      <HeroSection />
      <ArchivesSection />
    </main>
  );
}
