'use client';

import React from 'react';
import { useVortex } from '@/components/VortexTransition/VortexTransition';
import styles from './EraTimelineSection.module.css';

export default function EraTimelineSection() {
  const { triggerTransition } = useVortex();

  const handleParallax = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    // Reduced from 32px to 10px for a refined, understated depth shift!
    e.currentTarget.style.setProperty('--mouse-x', `${x * 10}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y * 10}px`);
  };

  const resetParallax = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--mouse-x', '0px');
    e.currentTarget.style.setProperty('--mouse-y', '0px');
  };

    const scrollToZero = () => {
      document.getElementById('arrival-of-zero')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
      <section className={styles.section} id="cosmic-eras">
        <div className={styles.gridOverlay} aria-hidden="true" />
  
        {/* Terminal Bezel Top Bar */}
        <div className={styles.terminalTopBar}>
          <div className={styles.termLeft}>ZURAVERSE</div>
          <div className={styles.termCenter}>
            <div className={styles.termIndex}>| 03 |</div>
            <div className={styles.termEyebrow}>TIMELINE</div>
          </div>
          <div className={styles.termRight}>
            DATABASE TERMINAL
            <span className={styles.termBeacon} />
          </div>
        </div>
  
        <div className={styles.container}>
          {/* Centered Main Header */}
          <div className={styles.header}>
            <div className={styles.subtitleBlock}>
              <p className={styles.lead}>
                The Timeline of Zuraverse is divided into two Eras.
              </p>
            </div>
          </div>
  
          {/* Massive Dual-Porthole Dashboard */}
          <div className={styles.dashboard}>
            
            {/* BZE Portal Column */}
            <div className={`${styles.portalCard} ${styles.portalCardBze}`}>
              <div className={styles.eraTitleBlock}>
                <h3 className={styles.eraTitle}>BZE</h3>
                <span className={styles.eraSubtitle}>BEFORE ZURIAN ERA</span>
              </div>
  
              {/* Circular window porthole with mouse parallax and vortex click */}
              <div 
                className={styles.porthole}
                onMouseMove={handleParallax}
                onMouseLeave={resetParallax}
                onClick={() => triggerTransition('/bze', 'bze')}
              >
                <div className={styles.bezelRing} />
                <div className={styles.bezelRingOuter} />
                <div className={styles.imageClip}>
                  <img 
                    src="/bze_portal.png" 
                    alt="BZE Cosmic Planet Vista" 
                    className={styles.portalImage}
                  />
                </div>
                <div className={styles.portholeReflection} />
              </div>
  
              <p className={styles.description}>
                Before Zurian Era (BZE) covers the journey of these Hippie Aliens and their celestial adventures and psychedelic experiences along the way, before they finally arrive on Planet Earth.
              </p>
  
              <button 
                className={styles.archiveBtn}
                onClick={() => triggerTransition('/bze', 'bze')}
              >
                ENTER BZE ARCHIVES <span className={styles.arrow}>➔</span>
              </button>
            </div>
  
            {/* Center Solar Horizon Core (Arrival of Zero) */}
            <div 
              className={styles.centerCore}
              onClick={scrollToZero}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && scrollToZero()}
            >
              <div className={styles.solarHorizonContainer}>
                <div className={styles.solarRing} style={{ width: '130px', height: '130px', animationDelay: '0s' }} />
                <div className={styles.solarRing} style={{ width: '100px', height: '100px', animationDelay: '-1s' }} />
                <div className={styles.solarRing} style={{ width: '70px', height: '70px', animationDelay: '-2s' }} />
                
                {/* Central Glowing Core */}
                <div className={styles.glowingSun} />
              </div>
  
              <div className={styles.zeroDetails}>
                <h4 className={styles.zeroTitle}>ARRIVAL OF ZERO</h4>
                <p className={styles.zeroSubtitle}>The event that changed everything.</p>
              </div>
            </div>

            {/* AZE Portal Column */}
            <div className={`${styles.portalCard} ${styles.portalCardAze}`}>
              <div className={styles.eraTitleBlock}>
                <h3 className={styles.eraTitle}>AZE</h3>
                <span className={styles.eraSubtitle}>AFTER ZURIAN ERA</span>
              </div>

              {/* Circular window porthole with mouse parallax and vortex click */}
              <div 
                className={styles.porthole}
                onMouseMove={handleParallax}
                onMouseLeave={resetParallax}
                onClick={() => triggerTransition('/aze', 'aze')}
              >
                <div className={styles.bezelRing} />
                <div className={styles.bezelRingOuter} />
                <div className={styles.imageClip}>
                  <img 
                    src="/aze_portal.png" 
                    alt="AZE Lush Biopunk Forest Planet" 
                    className={styles.portalImage}
                  />
                </div>
                <div className={styles.portholeReflection} />
              </div>

              <p className={styles.description}>
                After Zurian Era (AZE) starts with the arrival of Hippie Aliens on Planet Earth, and the birth of a new species called the Zurian and the formation of the Metaverse Park called Zura Park
              </p>

              <button 
                className={styles.archiveBtn}
                onClick={() => triggerTransition('/aze', 'aze')}
              >
                ENTER AZE ARCHIVES <span className={styles.arrow}>➔</span>
              </button>
            </div>

          </div>

        {/* Bottom Scroll Indicator */}
        <div className={styles.bottomScroll} aria-hidden="true">
          <span className={styles.scrollStatusLamp} />
          <span className={styles.scrollText}>SCROLL</span>
        </div>
      </div>
    </section>
  );
}
