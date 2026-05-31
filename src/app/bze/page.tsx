'use client';

import React, { useEffect, useRef } from 'react';
import { useVortex } from '@/components/VortexTransition/VortexTransition';
import UniverseMap from '@/components/UniverseMap/UniverseMap';
import styles from './page.module.css';

const HOUSES = [
  {
    id: 'datura',
    name: 'DATURA',
    title: 'The Philosophers',
    color: '#38bdf8',
    colorRgb: '56,189,248',
    description: 'Seekers of wisdom, consciousness and cosmic understanding.',
    image: '/Houses/house1.png',
  },
  {
    id: 'iboga',
    name: 'IBOGA',
    title: 'The Dreamers',
    color: '#a78bfa',
    colorRgb: '167,139,250',
    description: 'Explorers of imagination, art and possibility.',
    image: '/Houses/house2.png',
  },
  {
    id: 'peyote',
    name: 'PEYOTE',
    title: 'The Optimists',
    color: '#fbbf24',
    colorRgb: '251,191,36',
    description: 'Believers in hope, joy and the infinite potential of life.',
    image: '/Houses/house3.png',
  },
  {
    id: 'ayahuasca',
    name: 'AYAHUASCA',
    title: 'The Stewards',
    color: '#4ade80',
    colorRgb: '74,222,128',
    description: 'Protectors of nature, ecosystems and living worlds.',
    image: '/Houses/house4.png',
  },
  {
    id: 'kava',
    name: 'KAVA',
    title: 'The Adventurers',
    color: '#f87171',
    colorRgb: '248,113,113',
    description: 'Pioneers of exploration and discovery.',
    image: '/Houses/house5.png',
  },
];

// Consolidated text arrays in favor of exact paragraph structures


function HouseCardItem({ house }: { house: any }) {
  // ... existing ...
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Image shift parallax limits (e.g. max 12px shift)
    const shiftX = (x / (rect.width / 2)) * -12;
    const shiftY = (y / (rect.height / 2)) * -12;
    
    cardRef.current.style.setProperty('--px', `${shiftX}px`);
    cardRef.current.style.setProperty('--py', `${shiftY}px`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--px', `0px`);
    cardRef.current.style.setProperty('--py', `0px`);
  };

  return (
    <div
      ref={cardRef}
      className={styles.houseCard}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--house-color': house.color,
        '--house-rgb': house.colorRgb,
      } as React.CSSProperties}
    >
      <div className={styles.houseImageWrap}>
        <div className={styles.houseImageClip}>
          <img src={house.image} alt={house.name} className={styles.houseImage} />
          <div className={styles.houseImageGlow} />
        </div>
      </div>

      <div className={styles.houseCardBody}>
        <div className={styles.housePeace}>☮</div>
        <h3 className={styles.houseName}>{house.name}</h3>
        <span className={styles.houseTitle}>{house.title.toUpperCase()}</span>
        <p className={styles.houseDesc}>{house.description}</p>
      </div>
    </div>
  );
}

function NirvanaParallaxCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const parent = containerRef.current.parentElement;
      const track = parent?.parentElement;
      if (!track) return;
      
      const trackRect = track.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const totalScrollable = trackRect.height - viewportHeight;
      const currentScroll = -trackRect.top;
      
      let progress = 0;
      if (currentScroll >= 0 && totalScrollable > 0) {
        progress = Math.min(currentScroll / totalScrollable, 1);
      }
      
      // ── PHASE 1 (0–33.3%): Camera locked, no zoom — 2 full viewport scrolls ──
      // ── PHASE 2 (33.3–100%): Zoom begins gradually — 4 full scrolls ──

      const zoomProgress = progress < 0.333
        ? 0
        : Math.min((progress - 0.333) / 0.667, 1);

      // No fade out phase — we immediately let the page scroll to Section 4
      const blurProgress = 0;

      // Subtle DoF on background layers to simulate focus lock on the character
      const blurBG = zoomProgress;
      const blurL4 = zoomProgress;

      containerRef.current.style.setProperty('--scroll-progress', `${progress}`);
      containerRef.current.style.setProperty('--zoom-progress', `${zoomProgress}`);
      containerRef.current.style.setProperty('--blur-progress', `${blurProgress}`);
      containerRef.current.style.setProperty('--blur-canvas', `${(blurProgress * 4).toFixed(1)}px`);
      containerRef.current.style.setProperty('--blur-l1', `0px`);
      containerRef.current.style.setProperty('--blur-l2', `0px`);
      containerRef.current.style.setProperty('--blur-l3', `0px`);
      containerRef.current.style.setProperty('--blur-l4', `${(blurL4 * 2).toFixed(1)}px`);
      containerRef.current.style.setProperty('--blur-bg', `${(blurBG * 4).toFixed(1)}px`);
    };
    
    let ticking = false;
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || ticking) return;
      
      const clientX = e.clientX;
      const clientY = e.clientY;
      
      ticking = true;
      requestAnimationFrame(() => {
        if (containerRef.current) {
          const x = (clientX - window.innerWidth / 2) / (window.innerWidth / 2);
          const y = (clientY - window.innerHeight / 2) / (window.innerHeight / 2);
          
          containerRef.current.style.setProperty('--mx', `${x}`);
          containerRef.current.style.setProperty('--my', `${y}`);
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, []);

  return (
    <div 
      className={styles.parallaxCanvas} 
      ref={containerRef}
    >
      <div className={`${styles.pLayerWrap} ${styles.pWrapBG}`}>
        <img src="/Nirvana BG.png" alt="BG" className={styles.pLayerImg} />
      </div>
      
      <div className={`${styles.pLayerWrap} ${styles.pWrapL4}`}>
        <img src="/Nirvana L4.png" alt="Layer 4" className={`${styles.pLayerImg} ${styles.pFloatSlow}`} />
      </div>

      <div className={`${styles.pLayerWrap} ${styles.pWrapL3}`}>
        <img src="/Nirvana L3.png" alt="Layer 3" className={`${styles.pLayerImg} ${styles.pFloatMedRev}`} />
      </div>
      
      <div className={`${styles.pLayerWrap} ${styles.pWrapL2}`}>
        <img src="/Nirvana Zero L2.png" alt="Zero Gravity Meditator" className={`${styles.pLayerImg} ${styles.pFloatMain}`} />
      </div>
      
      <div className={`${styles.pLayerWrap} ${styles.pWrapL1}`}>
        <img src="/Nirvana Boombox L1.png" alt="Boombox" className={`${styles.pLayerImg} ${styles.pFloatFast}`} />
      </div>
      
      <div className={styles.parallaxGlowOverlay} />
    </div>
  );
}

export default function BzePage() {
  const { triggerTransition } = useVortex();
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (bannerRef.current) {
        bannerRef.current.style.setProperty('--parallax-y', `${window.scrollY * 0.4}px`);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  return (
    <main className={styles.page}>

      {/* ═══════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════ */}
      <section className={styles.hero}>

        {/* Top nav bezel */}
        <header className={styles.topBar}>
          <div className={styles.navLeft}>
            <span className={styles.navLogoIcon}>☮</span>
            <span className={styles.navLogoText}>ZURAVERSE</span>
          </div>
          <nav className={styles.navCenter}>
            <span className={styles.navLink}>UNIVERSE</span>
            <span className={`${styles.navLink} ${styles.navLinkActive}`}>BZE</span>
            <span className={styles.navLink}>AZE</span>
            <span className={styles.navLink}>LORE</span>
            <span className={styles.navLink}>EXPERIENCES</span>
            <span className={styles.navLink}>ABOUT</span>
          </nav>
          <button 
            className={styles.navRight}
            onClick={() => triggerTransition('/#cosmic-eras', 'bze')}
          >
            <span className={styles.navTerminal}>·DATABASE TERMINAL</span>
            <span className={styles.navTerminalIcon}>◉</span>
          </button>
        </header>

        {/* Ultra-wide cinematic banner image with parallax + text overlay */}
        <div className={styles.heroBanner} ref={bannerRef}>
          <img
            src="/BZE Hero Image.png"
            alt="Before Zurian Era — cosmic vista"
            className={styles.heroImage}
          />
          <div className={styles.bannerFadeBottom} />

          {/* Text overlaid on the LEFT of the banner image */}
          <div className={styles.bannerOverlay}>
            <div className={styles.bannerLeftGrad} />
            <div className={styles.bannerContentWrap}>
              
              {/* Vertical line and chevron on the far left */}
              <div className={styles.bannerSidebar}>
                <div className={styles.sidebarLine}></div>
                <div className={styles.sidebarChevron}>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Text content block */}
              <div className={styles.bannerText}>
                <span className={styles.bannerEyebrow}>BZE //</span>
                <h1 className={styles.bannerTitle}>BEFORE ZURIAN ERA</h1>
                <p className={styles.bannerSubtitle}>THE AGE OF WANDERING</p>
                <p className={styles.bannerDesc}>
                  Before Earth. Before the Zurians. Before First Contact.
                </p>
              </div>
            </div>
          </div>
        </div>


      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 1 — THE LAST CIVILIZATION
      ═══════════════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.gridOverlay} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.sectionHeaderLeft}>
            <span className={styles.sectionEyebrowLeft}>SECTION 01</span>
            <h2 className={styles.sectionTitleLeft}>
              THE LAST<br />
              <span className={styles.titleGradient}>CIVILIZATION</span>
            </h2>
          </div>

          <div className={styles.heroNarrative}>
            <p className={styles.heroSectionDesc}>
              These <span className={styles.highlightCyan}>Hippie Aliens</span> come from a distant future, near the outermost reaches of a dying universe. By the time their civilization arose, countless species had already vanished. Stars had collapsed. Galaxies had grown old. <span className={styles.heroNarrativeAccentInline}>Among the silence, they endured.</span>
            </p>
            <p className={styles.heroSectionDesc}>
              Immortal and unaging, they became the last known civilization still wandering the cosmos. <span className={styles.heroNarrativeAccentInline}>Yet survival came with a burden.</span> To live forever meant watching everything else disappear.
            </p>
          </div>
        </div>
      </section>

      <div className={styles.sectionDivider} aria-hidden="true" />

      {/* ═══════════════════════════════════════════════
          SECTION 2 — THE HOUSES OF ZURA
      ═══════════════════════════════════════════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <span className={styles.sectionEyebrowCenter}>SECTION 02</span>
            <h2 className={styles.sectionTitleCenter}>
              THE HOUSES OF <span className={styles.titleGradient}>ZURA</span>
            </h2>
            <div className={styles.sectionLineCenter} />
          </div>
          <p className={styles.sectionDescCenter}>
            The Hippie Aliens are organized into five great Houses, each representing a distinct philosophy in the search for Nirvana.
          </p>

          {/* Five Houses Cards — reference image style */}
          <div className={styles.housesGrid}>
            {HOUSES.map((house) => (
              <HouseCardItem key={house.id} house={house} />
            ))}
          </div>
        </div>
      </section>

      <div className={styles.sectionDivider} aria-hidden="true" />

      {/* ═══════════════════════════════════════════════
          SECTION 3 — THE SEARCH FOR NIRVANA
      ═══════════════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.gridOverlay} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.sectionHeaderLeft}>
            <span className={styles.sectionEyebrowLeft}>SECTION 03</span>
            <h2 className={styles.sectionTitleLeft}>
              THE SEARCH FOR<br />
              <span className={styles.titleGradient}>NIRVANA</span>
            </h2>
          </div>

          <div className={styles.heroNarrative}>
            <p className={styles.heroSectionDesc}>
              Unable to find meaning in endless existence, the <span className={styles.highlightCyan}>Hippie Aliens</span> abandoned conquest, wealth and expansion. Instead, they dedicated themselves to a singular pursuit: <span className={styles.nirvanaKeyword}>Nirvana</span>.
            </p>
            <p className={styles.heroSectionDesc}>
              <span className={styles.heroNarrativeAccentInline}>Not as a destination. But as a state of harmony between consciousness, creativity and the universe itself.</span> They traveled from world to world collecting stories, music, art, philosophies and memories, believing that somewhere among the countless civilizations they encountered lay the answer they sought.
            </p>
          </div>
        </div>

      </section>

      {/* Cinematic Parallax (Sticky track outside the padded section) */}
      <div className={styles.nirvanaOuterContainer}>
        <div className={styles.nirvanaCanvasContainer}>
          <div className={styles.nirvanaStickyViewport}>
            <NirvanaParallaxCanvas />
          </div>
        </div>
      </div>

      <div className={styles.sectionDivider} aria-hidden="true" />

      {/* ═══════════════════════════════════════════════
          SECTION 4 — THE COSMIC WANDERERS
      ═══════════════════════════════════════════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          
          <div className={styles.stackedLayout}>
            
            {/* Top Text */}
            <div className={styles.stackedTop}>
              <div className={styles.sectionHeaderLeft}>
                <span className={styles.sectionEyebrowLeft}>SECTION 04</span>
                <h2 className={styles.sectionTitleLeft}>
                  THE COSMIC<br />
                  <span className={styles.titleGradient}>WANDERERS</span>
                </h2>
              </div>
              
              <div className={styles.heroNarrativeRow}>
                <p className={styles.heroSectionDesc}>
                  Across millions of years, the <span className={styles.highlightCyan}>Hippie Aliens</span> crossed nebulae, wormholes and forgotten galaxies.
                  They cultivated sanctuaries around dying stars, preserved endangered ecosystems, and archived extinct cultures.
                </p>
                <p className={styles.heroSectionDesc}>
                  They transformed their vessels into traveling museums of the universe. Every journey expanded their knowledge.
                  <br/><br/><span className={styles.heroNarrativeAccentInline}>Yet the answer remained elusive.</span>
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Edge-to-Edge Full-width Map */}
      <div className={styles.linearMapContainer}>
        <UniverseMap />
      </div>

      {/* ═══════════════════════════════════════════════
          FOOTER NAV
      ═══════════════════════════════════════════════ */}
      <div className={styles.footerNav}>
        <button
          className={styles.returnBtn}
          onClick={() => triggerTransition('/#cosmic-eras', 'bze')}
        >
          <span className={styles.backArrow}>←</span> RETURN TO MAIN CONSOLE
        </button>
      </div>

    </main>
  );
}
