'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './ZeroArrivalSection.module.css';

// ─────────────────────────────────────────────────────────────
// Chapter Data
// ─────────────────────────────────────────────────────────────

interface Chapter {
  id: string;
  title: string;
  year: string;
  body: string;
  mood: string;
  visual: string;
  isFinal?: boolean;
}

const CHAPTERS: Chapter[] = [
  {
    id: '01',
    title: 'THE VOYAGER LAUNCH',
    year: '1977',
    body: 'Humanity launched the Voyager spacecraft aboard a Titan IIIE rocket. The mission was to explore the outer planets and cast a message into the cosmic ocean.',
    mood: 'Launch · Exploration',
    visual: 'voyager',
  },
  {
    id: '02',
    title: 'DISCOVERED',
    year: 'THOUSANDS OF YEARS LATER',
    body: 'At the edge of the Milky Way, an ancient civilization intercepted the signal. The Golden Record hologram expanded across the void.',
    mood: 'Wonder · Discovery',
    visual: 'discovered',
  },
  {
    id: '03',
    title: 'TITANIA',
    year: 'FIRST APPROACH',
    body: 'The fleet established a temporary outpost on Titania — a moon of Uranus. The first reconnaissance team was assembled. Departure was imminent.',
    mood: 'Preparation · Anticipation',
    visual: 'titania',
  },
  {
    id: '04',
    title: 'ZERO',
    year: 'SCOUT DESIGNATION',
    body: "Selected for Earth's first covert observation mission. His identity: classified. His mission: everything.",
    mood: 'Mystery',
    visual: 'zero',
  },
  {
    id: '05',
    title: 'EARTH',
    year: 'DESTINATION LOCKED',
    body: 'Destination: Earth\nLocation: India\nMission: Observe humanity.\nWithout detection.',
    mood: 'Arrival',
    visual: 'earth',
  },
  {
    id: '06',
    title: 'FIRST CONTACT',
    year: 'THE EVENT',
    body: 'What happened next became one of the most important events in Zuraverse history.',
    mood: 'History',
    visual: 'contact',
  },
  {
    id: '07',
    title: 'Hippie Aliens Episode 1 : The arrival of Zero',
    year: 'CINEMATIC TRAILER',
    body: 'Witness the event that changed the trajectory of the Zuraverse forever.',
    mood: 'Epic',
    visual: 'trailer',
    isFinal: true,
  },
];

const NUM = CHAPTERS.length;

// ─────────────────────────────────────────────────────────────
// Visual Sub-Components
// ─────────────────────────────────────────────────────────────

function VoyagerVisual({ active, scrollProgress }: { active: boolean; scrollProgress: number }) {
  // Launch sequence logic:
  // Launch completes later, over the first 5% of scroll
  const launchProgress = Math.min(scrollProgress / 0.05, 1);
  const flyProgress = Math.max(0, scrollProgress - 0.05) * (1 / 0.95);
  
  // Curved trajectory - wide curve to cross into the right panel before separation
  const rocketY = -Math.sin(launchProgress * Math.PI / 2) * 40; // Ease out up to -40vh
  const rocketX = Math.pow(launchProgress, 2) * 45; // Curve right up to 45vw
  const rocketRot = Math.pow(launchProgress, 1.5) * 65; // Pitch right up to 65deg

  const voyagerRot = rocketRot + Math.min(flyProgress * 2000, 25); // Finishes rotation to 90deg

  // Voyager flies 700vw right in world space. Since world scrolls 600vw left, Voyager drifts 100vw right on screen!
  const voyagerX = flyProgress * 700;

  // Fade out Voyager as it reaches Chapter 2 (starts fading at 13%, gone by 17%)
  const voyagerOpacity = scrollProgress > 0.13 ? Math.max(0, 1 - (scrollProgress - 0.13) * 25) : 1;

  return (
    <div className={`${styles.vis} ${styles.visVoyager} ${active ? styles.visActive : ''}`}>
      <div className={styles.starBg} />
      
      {/* Earth Surface (Cape Canaveral) */}
      <div className={styles.launchPad} style={{ transform: `translateY(${launchProgress * 30}vh)` }}>
        <div className={styles.earthHorizon} />
        <div className={styles.launchTower} />
      </div>

      <div className={styles.launchAssembly} style={{ transform: `translateY(${rocketY}vh) translateX(${rocketX}vw)` }}>
        
        {/* Rocket Stage (drops away after launch) */}
        <div 
          className={styles.rocketStage} 
          style={{ 
            opacity: launchProgress >= 1 ? 0 : 1, 
            transform: `rotate(${rocketRot}deg) ${launchProgress >= 1 ? 'translateY(100vh)' : ''}`, 
            transition: launchProgress >= 1 ? 'opacity 0.8s ease, transform 1.5s cubic-bezier(0.5, 0, 1, 0)' : 'none'
          }}
        >
          <svg viewBox="0 0 40 200" className={styles.rocketSvg}>
            {/* Boosters & Core */}
            <rect x="4" y="80" width="8" height="120" fill="#cbd5e1" rx="4" />
            <rect x="28" y="80" width="8" height="120" fill="#cbd5e1" rx="4" />
            <rect x="12" y="40" width="16" height="160" fill="#f8fafc" />
            <polygon points="12,200 16,210 24,210 28,200" fill="#64748b" />
            {/* Fairing */}
            <polygon points="12,40 20,0 28,40" fill="#f1f5f9" />
          </svg>
          <div className={styles.rocketFlame} />
        </div>

        {/* Voyager Payload */}
        <div 
          className={styles.voyagerPayload} 
          style={{ 
            opacity: voyagerOpacity,
            transform: `translateX(${voyagerX}vw) rotate(${voyagerRot}deg)`
          }}
        >
          {launchProgress >= 1 && (
            <svg className={styles.voyagerSvg} viewBox="0 0 200 140" fill="none">
              {/* Main bus body */}
              <rect x="88" y="55" width="24" height="45" fill="#475569" rx="2" />
              <rect x="84" y="68" width="32" height="10" fill="#64748b" rx="1" />
              <circle cx="100" cy="77" r="16" fill="#94a3b8" />
              
              {/* High-gain antenna (dish) */}
              <path d="M50 55 C80 30, 120 30, 150 55 C120 45, 80 45, 50 55 Z" fill="#cbd5e1" />
              <path d="M96 55 L90 35 L100 48 L110 35 L104 55" stroke="#94a3b8" strokeWidth="2" strokeLinejoin="round" />
              
              {/* Solar panels left */}
              <rect x="20" y="72" width="64" height="7" fill="#334155" rx="3" />
              <rect x="14" y="65" width="18" height="21" fill="#1e293b" rx="2" />
              
              {/* Solar panels right */}
              <rect x="116" y="72" width="64" height="7" fill="#334155" rx="3" />
              <rect x="168" y="65" width="18" height="21" fill="#1e293b" rx="2" />
              
              {/* Antenna */}
              <line x1="100" y1="33" x2="100" y2="60" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="100" cy="29" r="8" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx="100" cy="29" r="3" fill="#94a3b8" />
              
              {/* Thruster glow */}
              <ellipse cx="100" cy="102" rx="10" ry="4" fill="#2dd4bf" opacity="0.6" />
            </svg>
          )}
        </div>
      </div>
      
      <div className={styles.visTag}>TITAN IIIE · VOYAGER LAUNCH</div>
    </div>
  );
}

function DiscoveredVisual({ active }: { active: boolean }) {
  return (
    <div className={`${styles.vis} ${styles.visDiscovered} ${active ? styles.visActive : ''}`}>
      <div className={styles.starBg} />
      
      {/* 3D Interactive Galaxy Map */}
      <div className={`${styles.galaxyMapWrap} ${active ? styles.galaxyMapIn : ''}`}>
        <div className={styles.galaxyMap3D}>
          <div className={styles.galaxyCore} />
          
          {/* Milky Way Rings */}
          <div className={`${styles.galaxyRing} ${styles.ring1}`} />
          <div className={`${styles.galaxyRing} ${styles.ring2}`} />
          <div className={`${styles.galaxyRing} ${styles.ring3}`} />
          
          {/* POI: Zerarth Star System */}
          <div className={styles.poiNode} style={{ top: '40%', left: '60%' }}>
            <div className={styles.poiDot} />
            <div className={styles.poiLabel}>ZERARTH STAR SYSTEM</div>
          </div>
          
          {/* POI: Andromeda */}
          <div className={styles.poiNode} style={{ top: '15%', left: '25%' }}>
            <div className={styles.poiDot} style={{ background: '#a78bfa', boxShadow: '0 0 10px #a78bfa' }} />
            <div className={styles.poiLabel} style={{ color: '#a78bfa' }}>ANDROMEDA GALAXY</div>
          </div>

          {/* POI: Milky Way Border */}
          <div className={styles.poiNode} style={{ top: '85%', left: '45%' }}>
            <div className={styles.poiDot} />
            <div className={styles.poiLabel}>MILKY WAY BORDER</div>
          </div>
          
          {/* Signal Intercept */}
          <div className={styles.signalIntercept} style={{ top: '75%', left: '80%' }}>
            <div className={styles.interceptPing} />
            <div className={styles.interceptLabel}>SIGNAL DETECTED</div>
          </div>

          {/* Radar Sweep */}
          <div className={styles.radarSweep} />
        </div>
      </div>

      <div className={styles.hologramGroup}>
        <div className={styles.hologramDisc} />
        <div className={styles.hologramBeam} />
        <div className={styles.hologramRingA} />
        <div className={styles.hologramRingB} />
      </div>
      <div className={styles.visTag}>EDGE OF THE MILKY WAY</div>
    </div>
  );
}



function TitaniaVisual({ active }: { active: boolean }) {
  return (
    <div className={`${styles.vis} ${styles.visTitania} ${active ? styles.visActive : ''}`}>
      <div className={styles.starBg} />
      <div className={styles.titaniaImageWrap}>
        <img src="/images/titania.jpg" alt="Landing on Titania" className={styles.titaniaImage} />
      </div>
      <div className={styles.visTag}>TITANIA · MOON OF URANUS</div>
    </div>
  );
}

function ZeroVisual({ active }: { active: boolean }) {
  return (
    <div className={`${styles.vis} ${styles.visZero} ${active ? styles.visActive : ''}`}>
      <div className={styles.starBg} />
      <div className={styles.zeroImageWrap}>
        <img src="/images/zero-hologram.jpg" alt="Zero Hologram" className={styles.zeroImage} />
      </div>
      <div className={styles.visTag}>CLASSIFIED</div>
    </div>
  );
}

function EarthVisual({ active }: { active: boolean }) {
  return (
    <div className={`${styles.vis} ${styles.visEarth} ${active ? styles.visActive : ''}`}>
      <div className={styles.starBg} />
      <div className={styles.earthImageWrap}>
        <img src="/images/earth-hologram.png" alt="Earth Hologram" className={styles.earthImage} />
      </div>
      <div className={styles.visTag}>SOL-3 · EARTH · INDIA</div>
    </div>
  );
}

function ContactVisual({ active }: { active: boolean }) {
  return (
    <div className={`${styles.vis} ${styles.visContact} ${active ? styles.visActive : ''}`}>
      <div className={styles.contactImageWrap}>
        <img src="/images/first-contact.jpg" alt="First Contact" className={styles.contactImage} />
      </div>
      <div className={styles.visTag}>BIT MESRA · HALLOWEEN EVENT</div>
    </div>
  );
}

function TrailerVisual({ active, onWatch }: { active: boolean; onWatch: () => void }) {
  const awards = [
    { logo: '/images/award-meratv.png',          title: 'Official Winner',    org: 'MeraTV Film Festival' },
    { logo: '/images/award-beyond-reality.png', title: 'Official Selection', org: 'Beyond Reality AI Film Festival 2026' },
    { logo: '/images/award-fictional-scifi.png', title: 'Official Selection', org: 'Fictional Sci-Fi Award 2026' },
  ];

  return (
    <div className={`${styles.vis} ${styles.visTrailer} ${active ? styles.visActive : ''}`}>
      <div className={styles.trailerBg} />

      <div className={styles.trailerInner}>

        {/* ── Left: Video Frame ────────────────────────────── */}
        <div className={styles.trailerLeft}>
          <div className={styles.trailerFrame}>
            <div className={styles.cornerTL} />
            <div className={styles.cornerTR} />
            <div className={styles.cornerBL} />
            <div className={styles.cornerBR} />
            <div className={styles.trailerHeader}>
              <span className={styles.trailerDot} />
              EPISODE 01 // OFFICIAL TRAILER
              <span className={styles.trailerDot} />
            </div>
            <div className={styles.trailerContent} onClick={onWatch}>
              <img
                src="https://img.youtube.com/vi/v3Yc5UcHZmk/maxresdefault.jpg"
                alt="Trailer Cover"
                className={styles.trailerPoster}
              />
              <div className={styles.playOverlay}>
                <div className={styles.playCircle}>
                  <svg viewBox="0 0 24 24" className={styles.playIconFilled}>
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
            <div className={styles.trailerFooter}>
              CLICK TO WATCH TRAILER
              <span className={styles.trailerDot} />
            </div>
          </div>
        </div>

        {/* ── Right: Info Panel ────────────────────────────── */}
        <div className={styles.trailerRight}>
          <div className={styles.infoEyebrow}>NOW STREAMING</div>
          <h2 className={styles.infoTitle}>
            Hippie Aliens <span className={styles.infoTitleGlow}>Episode 1 : The Arrival of Zero</span>
          </h2>
          <p className={styles.infoSub}>
            Witness the event that changed the trajectory of the Zuraverse forever. Now streaming on MeraTV.
          </p>

          {/* Stream CTA */}
          <div className={styles.infoCtas}>
            <a
              href="https://meratv.in/share/video/1/18/205"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaStream}
            >
              STREAM EPISODE 1
            </a>
          </div>

          {/* Awards & Accolades */}
          <div className={styles.awardsSection}>
            <div className={styles.awardsDivider}>
              <span className={styles.awardsDivLine} />
              <span className={styles.awardsDivText}>AWARDS &amp; ACCOLADES</span>
              <span className={styles.awardsDivLine} />
            </div>
            <div className={styles.awardsGrid}>
              {awards.map((a, i) => (
                <div key={i} className={styles.awardCard}>
                  <img
                    src={a.logo}
                    alt={a.org}
                    className={styles.awardLogo}
                    style={
                      (a as any).darkLogo
                        ? { filter: 'brightness(0) invert(1)', opacity: 0.85 }
                        : { opacity: 0.85 }
                    }
                  />
                  <span className={styles.awardTitle}>{a.title}</span>
                  <span className={styles.awardOrg}>{a.org}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ChapterVisual({ visual, active, scrollProgress, onWatch }: { visual: string; active: boolean; scrollProgress: number; onWatch: () => void }) {
  switch (visual) {
    case 'voyager':    return <VoyagerVisual    active={active} scrollProgress={scrollProgress} />;
    case 'discovered': return <DiscoveredVisual active={active} />;
    case 'titania':    return <TitaniaVisual    active={active} />;
    case 'zero':       return <ZeroVisual       active={active} />;
    case 'earth':      return <EarthVisual      active={active} />;
    case 'contact':    return <ContactVisual    active={active} />;
    case 'trailer':    return <TrailerVisual    active={active} onWatch={onWatch} />;
    default:           return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Trailer Modal
// ─────────────────────────────────────────────────────────────

function TrailerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHead}>
          <span className={styles.modalLabel}>ARRIVAL CHRONICLE // DIMENSIONAL CATALYST</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close video">
            ×
          </button>
        </div>
        <div className={styles.modalFrame}>
          <iframe
            className={styles.modalIframe}
            src="https://www.youtube.com/embed/v3Yc5UcHZmk?autoplay=1&rel=0&modestbranding=1"
            title="Arrival of Zero – Zuraverse Chronicle"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mobile Fallback
// ─────────────────────────────────────────────────────────────

function MobileJourney({ onWatch }: { onWatch: () => void }) {
  return (
    <section className={styles.mobileFallback} id="arrival-of-zero">
      <div className={styles.starBg} />
      <div className={styles.mobileHd}>
        <span className={styles.mobileEye}>THE RESONANCE MISSION</span>
        <h2 className={styles.mobileBigTitle}>
          ARRIVAL OF <span className={styles.mobileTitleGlow}>ZERO</span>
        </h2>
      </div>
      {CHAPTERS.map(ch => (
        <div key={ch.id} className={styles.mobileChap}>
          {ch.isFinal ? (
            <div className={styles.mobileTrailerWrap} onClick={onWatch} style={{ cursor: 'pointer', position: 'relative' }}>
              <img
                src="https://img.youtube.com/vi/v3Yc5UcHZmk/maxresdefault.jpg"
                alt="Trailer Cover"
                style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px', display: 'block' }}
              />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)', borderRadius: '8px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(45,212,191,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5v14l11-7z" fill="#0a0a0f" /></svg>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.textMeta}>
                <span className={styles.chapterId}>CHAPTER {ch.id}</span>
                <span className={styles.chapterDivider} />
                <span className={styles.chapterYear}>{ch.year}</span>
              </div>
              <h3 className={styles.mobileChTitle}>{ch.title}</h3>
              <p className={styles.chapterBody}>
                {ch.body.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </>
          )}
        </div>
      ))}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function ZeroArrivalSection() {
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile]           = useState(false);
  // Trailer is opened manually via the "Watch Trailer" button

  // Sync ambient music volume with modal open state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isModalOpen) {
      if ((window as any).fadeAmbientOut) {
        (window as any).fadeAmbientOut();
      }
    } else {
      if ((window as any).fadeAmbientIn) {
        (window as any).fadeAmbientIn();
      }
    }
  }, [isModalOpen]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Scroll driver
  const handleScroll = useCallback(() => {
    if (!wrapperRef.current || isMobile) return;
    const rect  = wrapperRef.current.getBoundingClientRect();
    const range = wrapperRef.current.offsetHeight - window.innerHeight;
    if (range <= 0) return;

    // Raw scroll progress 0→1 over the full wrapper height
    const raw = Math.max(0, Math.min(1, -rect.top / range));

    // Lock buffers: 200vh at entry and exit expressed as a fraction of total range
    const lockFraction = (window.innerHeight * 2) / range;
    // Map raw into the inner band [lockFraction, 1-lockFraction]
    const p = Math.max(0, Math.min(1, (raw - lockFraction) / (1 - 2 * lockFraction)));

    // Progress bar & chapter dots use smooth p
    setScrollProgress(p);

    // ── Per-chapter snap with dwell ─────────────────────────────
    // Each of the (NUM-1) transition blocks is split:
    //   first DWELL fraction  → hold at current chapter (dwell)
    //   last  (1-DWELL)       → travel to next chapter (smoothstep eased)
    const DWELL = 0.5; // 50% of each block = ~85vh of dwell at normal speed
    const numTransitions = NUM - 1; // 7
    const blockSize = 1 / numTransitions;

    let snappedPos: number; // fractional chapter index 0..NUM-1

    if (p <= 0) {
      snappedPos = 0;
    } else if (p >= 1) {
      snappedPos = NUM - 1;
    } else {
      const blockIdx = Math.min(Math.floor(p / blockSize), numTransitions - 1);
      const blockP   = (p - blockIdx * blockSize) / blockSize; // 0..1 within block

      if (blockP < DWELL) {
        // Dwell — stay locked at this chapter
        snappedPos = blockIdx;
      } else {
        // Travel — smoothstep ease toward next chapter
        const t = (blockP - DWELL) / (1 - DWELL);
        const eased = t * t * (3 - 2 * t); // smoothstep
        snappedPos = blockIdx + eased;
      }
    }

    setActiveChapter(Math.round(snappedPos));

    if (trackRef.current) {
      trackRef.current.style.transform =
        `translateX(${-snappedPos * window.innerWidth}px)`;
    }
  }, [isMobile]);


  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // ── Mobile ───────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <MobileJourney onWatch={() => setIsModalOpen(true)} />
        <TrailerModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  // ── Desktop ──────────────────────────────────────────────
  return (
    <>
      {/* Tall scroll wrapper — 700vh gives 100vh per chapter */}
      <div ref={wrapperRef} className={styles.sceneWrapper} id="arrival-of-zero">

        {/* Sticky cinematic viewport */}
        <div className={styles.stickyStage}>

          {/* Starfield */}
          <div className={styles.starfield} aria-hidden="true" />

          {/* Top gradient divider */}
          <div className={styles.topDivider} aria-hidden="true" />

          {/* Bottom progress bar */}
          <div className={styles.progressBar} aria-hidden="true">
            <div
              className={styles.progressFill}
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>

          {/* Chapter counter — top left */}
          <div className={styles.chapterCounter} aria-live="polite">
            <span className={styles.cntCur}>{String(activeChapter + 1).padStart(2, '0')}</span>
            <span className={styles.cntSlash}>/</span>
            <span className={styles.cntTotal}>{String(NUM).padStart(2, '0')}</span>
          </div>

          {/* Section label — top right — fades away as we scroll right */}
          <div 
            className={styles.sectionLabel} 
            aria-hidden="true"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 10),
              transition: 'opacity 0.2s ease-out, visibility 0.2s',
              visibility: scrollProgress > 0.1 ? 'hidden' : 'visible'
            }}
          >
            <span className={styles.sectionLabelTxt}>Hippie Aliens Episode 1 : The arrival of Zero</span>
            <span className={styles.sectionBeacon} />
          </div>

          {/* Trajectory SVG — bottom strip */}
          <svg
            className={styles.trajSvg}
            viewBox="0 0 1400 60"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <filter id="trajGlow">
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="trajGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#2dd4bf" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            {/* Dashed background line */}
            <line
              x1="0" y1="30" x2="1400" y2="30"
              stroke="rgba(45,212,191,0.35)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />
            {/* Reveal line — driven by scrollProgress */}
            <line
              x1="0" y1="30" x2="1400" y2="30"
              stroke="url(#trajGrad)"
              strokeWidth="1.5"
              strokeDasharray="1400"
              strokeDashoffset={1400 * (1 - scrollProgress)}
              filter="url(#trajGlow)"
            />
            {/* Chapter nodes */}
            {CHAPTERS.map((_, i) => {
              const x      = (i / (NUM - 1)) * 1400;
              const passed = i <= activeChapter;
              return (
                <g key={i}>
                  <circle
                    cx={x} cy={30}
                    r={passed ? 5 : 3}
                    fill={passed ? '#2dd4bf' : 'rgba(45,212,191,0.2)'}
                    filter={passed ? 'url(#trajGlow)' : undefined}
                    style={{ transition: 'all 0.5s ease' }}
                  />
                  {passed && (
                    <circle
                      cx={x} cy={30} r={10}
                      fill="none"
                      stroke="rgba(45,212,191,0.18)"
                      strokeWidth="1"
                    />
                  )}
                </g>
              );
            })}
            {/* Moving ship dot */}
            <circle
              cx={scrollProgress * 1400}
              cy={30}
              r={5}
              fill="#ffffff"
              filter="url(#trajGlow)"
            />
          </svg>

          {/* Scroll hint */}
          <div
            className={`${styles.scrollHint} ${scrollProgress > 0.03 ? styles.scrollHintGone : ''}`}
            aria-hidden="true"
          >
            <span className={styles.scrollHintTxt}>SCROLL TO TRAVEL</span>
            <div className={styles.scrollHintLine} />
          </div>

          {/* ── Horizontal chapter track ─────────────────── */}
          <div ref={trackRef} className={styles.hTrack}>
            {CHAPTERS.map((ch, idx) => {
              const isActive = activeChapter === idx;
              return (
                <div
                  key={ch.id}
                  className={`${styles.chPanel} ${isActive ? styles.chPanelActive : ''}`}
                  style={{
                    position: 'relative',
                    zIndex: ch.id === '01' ? 100 : 1,
                    gridTemplateColumns: ch.isFinal ? '100% 0%' : undefined,
                  }}
                >
                  {/* Visual left half */}
                  <div 
                    className={styles.panelVis}
                    style={{ 
                      overflow: ch.id === '01' ? 'visible' : 'hidden',
                      zIndex: ch.id === '01' ? 10 : 1
                    }}
                  >
                    <ChapterVisual visual={ch.visual} active={isActive} scrollProgress={scrollProgress} onWatch={() => setIsModalOpen(true)} />
                  </div>

                  {/* Text right half */}
                  {!ch.isFinal && (
                    <div className={`${styles.panelTxt} ${isActive ? styles.panelTxtActive : ''}`}>
                      <div className={styles.textMeta}>
                        <span className={styles.chapterId}>CHAPTER {ch.id}</span>
                        <span className={styles.chapterDivider} />
                        <span className={styles.chapterYear}>{ch.year}</span>
                      </div>
                      <h2 className={styles.chapterTitle}>{ch.title}</h2>
                      <p className={styles.chapterBody}>
                        {ch.body.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                      </p>

                      {ch.isFinal && (
                        <button
                          id="watch-arrival-cta"
                          className={styles.watchCta}
                          onClick={() => setIsModalOpen(true)}
                        >
                          <span className={styles.watchCtaPulse} aria-hidden="true" />
                          <svg
                            viewBox="0 0 24 24"
                            className={styles.watchCtaIcon}
                            aria-hidden="true"
                          >
                            <path d="M8 5v14l11-7z" fill="currentColor" />
                          </svg>
                          <span className={styles.watchCtaLabel}>WATCH ARRIVAL OF ZERO</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      <TrailerModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
