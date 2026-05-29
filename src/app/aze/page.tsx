'use client';

import React, { useRef, useEffect } from 'react';
import { useVortex } from '@/components/VortexTransition/VortexTransition';
import styles from './page.module.css';

const AZE_NARRATIVE = [
  'The After Zurian Era (AZE) marks the dawn of a unified civilization.',
  'Initiated by the majestic arrival of the Hippie Aliens on Planet Earth, this era gave birth to a highly evolved, symbiotic biopunk species known as the Zurians.',
  'A monumental renaissance.',
  'Combining human biology with cosmic genetics, the Zurians constructed a magnificent metaverse domain: the Zura Park.',
  'Within this vibrant ecosystem, bioluminescent architecture, eco-energetics, and cybernetic fauna blend to preserve planetary balance.',
];

export default function AzePage() {
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
            <span className={styles.navLink}>BZE</span>
            <span className={`${styles.navLink} ${styles.navLinkActive}`}>AZE</span>
            <span className={styles.navLink}>LORE</span>
            <span className={styles.navLink}>EXPERIENCES</span>
            <span className={styles.navLink}>ABOUT</span>
          </nav>
          <button 
            className={styles.navRight}
            onClick={() => triggerTransition('/#cosmic-eras', 'aze')}
          >
            <span className={styles.navTerminal}>·DATABASE TERMINAL</span>
            <span className={styles.navTerminalIcon}>◉</span>
          </button>
        </header>

        {/* Ultra-wide cinematic banner image with parallax + text overlay */}
        <div className={styles.heroBanner} ref={bannerRef}>
          <img
            src="/AZE Hero Image.jpg"
            alt="After Zurian Era — cosmic vista"
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
                    <path d="M1 1L5 5L9 1" stroke="#facc15" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Text content block */}
              <div className={styles.bannerText}>
                <span className={styles.bannerEyebrow}>AZE //</span>
                <h1 className={styles.bannerTitle}>AFTER ZURIAN ERA</h1>
                <p className={styles.bannerSubtitle}>THE AGE OF REBIRTH</p>
                <p className={styles.bannerDesc}>
                  Earth awakened. The Hippie Aliens arrived. The Metaverse was born.
                </p>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 1 — THE NEW CIVILIZATION
      ═══════════════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.gridOverlay} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.sectionHeaderLeft}>
            <span className={styles.sectionEyebrowLeft}>SECTION 01</span>
            <h2 className={styles.sectionTitleLeft}>
              THE NEW<br />
              <span className={styles.titleGradient}>CIVILIZATION</span>
            </h2>
          </div>

          <div className={styles.heroNarrative}>
            {AZE_NARRATIVE.map((line, i) => {
              // Check if it's the specific cyan word
              const parts = line.split('Zurians');
              
              if (parts.length > 1) {
                return (
                  <p key={i} className={styles.heroSectionDesc}>
                    {parts[0]}<span className={styles.highlightCyan}>Zurians</span>{parts[1]}
                  </p>
                );
              }
              
              return (
                <p
                  key={i}
                  className={`${line === 'A monumental renaissance.' ? styles.heroNarrativeAccent : styles.heroSectionDesc}`}
                >
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FOOTER NAV
      ═══════════════════════════════════════════════ */}
      <div className={styles.footerNav}>
        <button
          className={styles.returnBtn}
          onClick={() => triggerTransition('/#cosmic-eras', 'aze')}
        >
          <span className={styles.backArrow}>←</span> RETURN TO MAIN CONSOLE
        </button>
      </div>

    </main>
  );
}
