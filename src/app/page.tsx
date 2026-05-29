'use client';

import { useVortex } from '@/components/VortexTransition/VortexTransition';
import Preloader from '@/components/Preloader/Preloader';
import HeroSection from '@/components/HeroSection/HeroSection';
import HippieAliensSection from '@/components/HippieAliensSection/HippieAliensSection';
import EraTimelineSection from '@/components/EraTimelineSection/EraTimelineSection';
import ZeroArrivalSection from '@/components/ZeroArrivalSection/ZeroArrivalSection';
import ArchivesSection from '@/components/ArchivesSection/ArchivesSection';

export default function Home() {
  const { hasEntered, setHasEntered } = useVortex();

  return (
    <main style={{ backgroundColor: '#000000' }}>
      {!hasEntered && <Preloader onEnter={() => setHasEntered(true)} />}
      <HeroSection entered={hasEntered} />
      <HippieAliensSection />
      <EraTimelineSection />
      <ZeroArrivalSection />
      <ArchivesSection />
    </main>
  );
}
