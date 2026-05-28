'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './Preloader.module.css';

const BOOT_LINES = [
  { label: 'Neural Link',       value: 'ONLINE',      delay: 400  },
  { label: 'Quantum Drive',     value: 'CALIBRATED',  delay: 900  },
  { label: 'Bridge Systems',    value: 'STANDBY',     delay: 1400 },
  { label: 'Biosync Protocol',  value: 'ACTIVE',      delay: 1900 },
];

interface PreloaderProps {
  onEnter: () => void;
}

export default function Preloader({ onEnter }: PreloaderProps) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const enterWrapRef  = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [btnVisible,   setBtnVisible]   = useState(false);

  /* ─── Staggered boot sequence ─────────────────────────────── */
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setVisibleLines(prev => [...prev, i]);
      }, line.delay));
    });

    // Show button after last line
    timers.push(setTimeout(() => setBtnVisible(true), 2600));

    return () => timers.forEach(clearTimeout);
  }, []);

  /* ─── GSAP exit animation ─────────────────────────────────── */
  const handleEnter = () => {
    const tl = gsap.timeline({ onComplete: onEnter });

    tl.to(enterWrapRef.current, {
      y: -16,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.in',
    }).to(containerRef.current, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      duration: 1.1,
      ease: 'power4.inOut',
    }, '-=0.1');
  };

  return (
    <div ref={containerRef} className={styles.preloader}>
      <div className={styles.scanLine} />

      <p className={styles.wordmark}>Zuraverse — Core System</p>

      {/* Animated ring system */}
      <div className={styles.ringSystem}>
        <div className={styles.ring + ' ' + styles.ring1} />
        <div className={styles.ring + ' ' + styles.ring2} />
        <div className={styles.ring + ' ' + styles.ring3} />
        <div className={styles.orb}>
          <div className={styles.orbCore} />
        </div>
      </div>

      {/* Boot status lines */}
      <div className={styles.statusBlock}>
        {BOOT_LINES.map((line, i) => (
          <div
            key={line.label}
            className={`${styles.statusLine} ${visibleLines.includes(i) ? styles.visible : ''}`}
          >
            <span className={styles.statusLabel}>{line.label}</span>
            <span className={styles.statusDots} />
            <span className={styles.statusValue}>{line.value}</span>
          </div>
        ))}
      </div>

      {/* Enter button */}
      <div
        ref={enterWrapRef}
        className={`${styles.enterWrap} ${btnVisible ? styles.visible : ''}`}
      >
        <button className={styles.enterBtn} onClick={handleEnter}>
          [ Enter Bridge ]
        </button>
      </div>

      <span className={styles.versionTag}>v0.1.0 — ALPHA</span>
    </div>
  );
}
