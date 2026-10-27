'use client';

import React, { useState } from 'react';
import { useVortex } from '@/components/VortexTransition/VortexTransition';
import Preloader from '@/components/Preloader/Preloader';
import HeroSection from '@/components/HeroSection/HeroSection';
import HippieAliensSection from '@/components/HippieAliensSection/HippieAliensSection';
import EraTimelineSection from '@/components/EraTimelineSection/EraTimelineSection';
import ZeroArrivalSection from '@/components/ZeroArrivalSection/ZeroArrivalSection';
import HangarSection from '@/components/HangarSection/HangarSection';
import NirvanaParallaxSection from '@/components/NirvanaParallaxSection/NirvanaParallaxSection';
import EnterZuraverseSection from '@/components/EnterZuraverseSection/EnterZuraverseSection';
import KarmaPointsSection from '@/components/KarmaPointsSection/KarmaPointsSection';
import Footer from '@/components/Footer/Footer';
import { HOUSES, ZuraHouse } from '@/data/houses';

export default function Home() {
  const { hasEntered, setHasEntered } = useVortex();
  const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);

  const selectedHouse = HOUSES.find((h) => h.id === selectedHouseId) || null;

  const handleSelectHouse = (house: ZuraHouse) => {
    setSelectedHouseId(house.id);
  };

  return (
    <main style={{ backgroundColor: '#000000' }}>
      {!hasEntered && <Preloader onEnter={() => setHasEntered(true)} />}
      <HeroSection entered={hasEntered} />
      <HippieAliensSection />
      <EraTimelineSection />
      <ZeroArrivalSection />
      <HangarSection />
      <NirvanaParallaxSection />
      <EnterZuraverseSection
        selectedHouseId={selectedHouseId}
        onSelectHouse={handleSelectHouse}
      />
      <KarmaPointsSection selectedHouse={selectedHouse} />
      <Footer />
    </main>
  );
}
