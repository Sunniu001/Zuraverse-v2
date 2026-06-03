'use client';

import React, { useEffect, useRef } from 'react';
import styles from './NirvanaParallaxSection.module.css';

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

      const blurProgress = 0;

      // Subtle DoF on background layers to simulate focus lock on the character
      const blurBG = zoomProgress * 10;
      const blurSpace = 0; // Space remains perfectly sharp
      const shipBlur = zoomProgress * 20;
      
      const blurL5 = shipBlur;
      const blurL4 = shipBlur;
      const blurL3 = shipBlur;
      const blurL2 = shipBlur;
      const blurL1 = shipBlur;

      containerRef.current.style.setProperty('--scroll-progress', `${progress}`);
      containerRef.current.style.setProperty('--zoom-progress', `${zoomProgress}`);
      containerRef.current.style.setProperty('--blur-progress', `${blurProgress}`);
      containerRef.current.style.setProperty('--blur-canvas', `${(blurProgress * 4).toFixed(1)}px`);
      containerRef.current.style.setProperty('--blur-l1', `0px`);
      containerRef.current.style.setProperty('--blur-l2', `0px`);
      containerRef.current.style.setProperty('--blur-l3', `0px`);
      containerRef.current.style.setProperty('--blur-l4', `${(blurL4 * 2).toFixed(1)}px`);
      containerRef.current.style.setProperty('--blur-l5', `${(blurL5 * 2).toFixed(1)}px`);
      containerRef.current.style.setProperty('--blur-bg', `${(blurBG * 4).toFixed(1)}px`);
      containerRef.current.style.setProperty('--blur-space', `${(blurSpace * 2).toFixed(1)}px`);
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
    <div className={styles.parallaxCanvas} ref={containerRef}>
      <div className={`${styles.pLayerWrap} ${styles.pWrapSpace}`}>
        <img src="/images/ships/Ship Parallax/Space Layer.jpg" alt="Space" className={styles.pLayerImg} />
      </div>
      
      <div className={`${styles.pLayerWrap} ${styles.pWrapBG}`}>
        <img src="/images/ships/Ship Parallax/GARAGE BG.png" alt="BG" className={styles.pLayerImg} />
      </div>
      
      <div className={`${styles.pLayerWrap} ${styles.pWrapL5}`}>
        <img src="/images/ships/Ship Parallax/Suanni Floating.png" alt="Suanni" className={`${styles.pLayerImg} ${styles.pFloatSlow}`} />
      </div>

      <div className={`${styles.pLayerWrap} ${styles.pWrapL4}`}>
        <img src="/images/ships/Ship Parallax/Horus Floating.png" alt="Horus" className={`${styles.pLayerImg} ${styles.pFloatMedRev}`} />
      </div>

      <div className={`${styles.pLayerWrap} ${styles.pWrapL3}`}>
        <img src="/images/ships/Ship Parallax/Garuda Floating.png" alt="Garuda" className={`${styles.pLayerImg} ${styles.pFloatMain}`} />
      </div>
      
      <div className={`${styles.pLayerWrap} ${styles.pWrapL2}`}>
        <img src="/images/ships/Ship Parallax/Prey Floating.png" alt="Prey" className={`${styles.pLayerImg} ${styles.pFloatFast}`} />
      </div>
      
      <div className={`${styles.pLayerWrap} ${styles.pWrapL1}`}>
        <img src="/images/ships/Ship Parallax/Quetzal Floating.png" alt="Quetzal" className={`${styles.pLayerImg} ${styles.pFloatMedRev}`} />
      </div>
      
      <div className={styles.parallaxGlowOverlay} />
    </div>
  );
}

export default function NirvanaParallaxSection() {
  return (
    <>


      {/* Cinematic Parallax (Sticky track outside the padded section) */}
      <div className={styles.nirvanaOuterContainer}>
        <div className={styles.nirvanaCanvasContainer}>
          <div className={styles.nirvanaStickyViewport}>
            <NirvanaParallaxCanvas />
          </div>
        </div>
      </div>
    </>
  );
}
