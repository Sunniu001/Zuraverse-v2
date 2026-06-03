'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './HangarSection.module.css';

interface BlueprintNode {
  title: string;
  desc: string;
  top: string;
  left: string;
  // Endpoint connection lines inside SVG viewport space (width 1000, height 1000)
  lineX1: number;
  lineY1: number;
  lineX2: number;
  lineY2: number;
}

interface ShipRecord {
  id: string;
  name: string;
  color: string;
  fuel: number;
  speed: number;
  controls: string;
  pilot: string;
  role: string;
  image: string;
  thumbnail: string;
  accent: string;
  accentRgb: string;
  accentRgbLow: string;
  firstDeployment: string;
  knownFor: string;
  description: string;
  nodes: BlueprintNode[];
}

const SHIPS_DATA: ShipRecord[] = [
  {
    id: 'H.A.S.H-01',
    name: 'GARUDA PROMETHEUS',
    color: 'Blue',
    fuel: 600,
    speed: 150,
    controls: '06',
    pilot: 'Kashish',
    role: 'Scientific anomaly laboratory',
    firstDeployment: 'Kepler Sector-47',
    knownFor: 'Gravitational wave detection',
    description: 'Inspired by the legendary Indian Garuda and the mighty elephant. Garuda Prometheus is the fleet\'s fastest vessel, built for long-range travel and overwhelming presence. Its immense power comes at the cost of agility, making it less maneuverable than lighter ships.',
    image: '/images/ships/GARUDA PROMETHEUS.jpg',
    thumbnail: '/images/ships/GARUDA PROMETHEUS Thumbnail.png',
    accent: '#3b82f6',
    accentRgb: 'rgba(59, 130, 246, 0.4)',
    accentRgbLow: 'rgba(59, 130, 246, 0.08)',
    nodes: [
      { 
        title: 'Neural Cockpit', 
        desc: 'Mind-linked navigation and dream-state interfaces.', 
        top: '30%', left: '38%',
        lineX1: 380, lineY1: 300, lineX2: 440, lineY2: 440
      },
      { 
        title: 'Resonance Drive', 
        desc: 'Zero-point propulsion for silent long-haul travel.', 
        top: '48%', left: '76%',
        lineX1: 760, lineY1: 480, lineX2: 680, lineY2: 490
      },
      { 
        title: 'Gravity Sails', 
        desc: 'Adaptive field wings for atmospheric and space stability.', 
        top: '60%', left: '46%',
        lineX1: 460, lineY1: 600, lineX2: 520, lineY2: 530
      },
      { 
        title: 'Memory Core', 
        desc: 'Organic data vault stores memories, maps and teachings.', 
        top: '32%', left: '62%',
        lineX1: 620, lineY1: 320, lineX2: 580, lineY2: 430
      }
    ]
  },
  {
    id: 'H.A.S.H-02',
    name: 'MILENNIUM HORUS',
    color: 'Purple',
    fuel: 600,
    speed: 90,
    controls: '10',
    pilot: 'Zero',
    role: 'Long-range reconnaissance vessel',
    firstDeployment: 'Outer Perseus Sector',
    knownFor: 'Silent observation missions',
    description: 'Named after the African sky deity Horus and inspired by the giraffe. Its elongated design provides excellent balance and control, allowing precise handling in difficult situations. It sacrifices speed for superior maneuverability and tactical flexibility.',
    image: '/images/ships/MILENNIUM HORUS.jpg',
    thumbnail: '/images/ships/MILENNIUM HORUS Thumbnail.png',
    accent: '#a78bfa',
    accentRgb: 'rgba(167, 139, 250, 0.4)',
    accentRgbLow: 'rgba(167, 139, 250, 0.08)',
    nodes: [
      { 
        title: 'Neural Cockpit', 
        desc: 'Mind-linked navigation and dream-state interfaces.', 
        top: '28%', left: '42%',
        lineX1: 420, lineY1: 280, lineX2: 500, lineY2: 360
      },
      { 
        title: 'Resonance Drive', 
        desc: 'Zero-point propulsion for silent long-haul travel.', 
        top: '46%', left: '78%',
        lineX1: 780, lineY1: 460, lineX2: 700, lineY2: 440
      },
      { 
        title: 'Gravity Sails', 
        desc: 'Adaptive field wings for atmospheric and space stability.', 
        top: '68%', left: '38%',
        lineX1: 380, lineY1: 680, lineX2: 430, lineY2: 560
      },
      { 
        title: 'Memory Core', 
        desc: 'Organic data vault stores memories, maps and teachings.', 
        top: '66%', left: '88%',
        lineX1: 880, lineY1: 660, lineX2: 790, lineY2: 510
      }
    ]
  },
  {
    id: 'H.A.S.H-03',
    name: 'PREY-GO-NEESH ENTERPRISE',
    color: 'Yellow',
    fuel: 1000,
    speed: 90,
    controls: '06',
    pilot: 'Maya',
    role: 'Deep-space exploration voyager',
    firstDeployment: 'Beta Centauri System',
    knownFor: 'Fast scouting & navigation',
    description: 'Inspired by Native American spiritual traditions and the protective nature of the turtle. This heavily armored vessel carries the largest fuel reserves in the fleet, enabling extended journeys and exceptional durability. Slow but dependable, it is built to endure.',
    image: '/images/ships/PREY-GO-NEESH ENTERPRISE.jpg',
    thumbnail: '/images/ships/PREY-GO-NEESH ENTERPRISE Thumnail.png',
    accent: '#fbbf24',
    accentRgb: 'rgba(251, 191, 36, 0.4)',
    accentRgbLow: 'rgba(251, 191, 36, 0.08)',
    nodes: [
      { 
        title: 'Neural Cockpit', 
        desc: 'Mind-linked navigation and dream-state interfaces.', 
        top: '24%', left: '60%',
        lineX1: 600, lineY1: 240, lineX2: 540, lineY2: 340
      },
      { 
        title: 'Resonance Drive', 
        desc: 'Zero-point propulsion for silent long-haul travel.', 
        top: '64%', left: '50%',
        lineX1: 500, lineY1: 640, lineX2: 520, lineY2: 540
      },
      { 
        title: 'Gravity Sails', 
        desc: 'Adaptive field wings for atmospheric and space stability.', 
        top: '32%', left: '36%',
        lineX1: 360, lineY1: 320, lineX2: 450, lineY2: 360
      },
      { 
        title: 'Memory Core', 
        desc: 'Organic data vault stores memories, maps and teachings.', 
        top: '50%', left: '82%',
        lineX1: 820, lineY1: 500, lineX2: 730, lineY2: 460
      }
    ]
  },
  {
    id: 'H.A.S.H-04',
    name: 'QUETZAKCOATL NOSTROMO',
    color: 'Green',
    fuel: 800,
    speed: 90,
    controls: '08',
    pilot: 'Ravi',
    role: 'Bio-organic support & carrier',
    firstDeployment: 'Orion Nebula Outpost',
    knownFor: 'Nanite hull regeneration',
    description: 'Drawing inspiration from Quetzalcoatl and Aboriginal Dreamtime traditions, this ship mirrors the adaptability of the penguin. It excels at nothing in particular, yet performs well in every category. A reliable all-purpose vessel for exploration, transport, and patrol missions.',
    image: '/images/ships/QUETZAKCOATL NOSTROMO.jpg',
    thumbnail: '/images/ships/QUETZAKCOATL NOSTROMO Thumnail.png',
    accent: '#10b981',
    accentRgb: 'rgba(16, 185, 129, 0.4)',
    accentRgbLow: 'rgba(16, 185, 129, 0.08)',
    nodes: [
      { 
        title: 'Neural Cockpit', 
        desc: 'Mind-linked navigation and dream-state interfaces.', 
        top: '36%', left: '32%',
        lineX1: 320, lineY1: 360, lineX2: 400, lineY2: 420
      },
      { 
        title: 'Resonance Drive', 
        desc: 'Zero-point propulsion for silent long-haul travel.', 
        top: '56%', left: '60%',
        lineX1: 600, lineY1: 560, lineX2: 580, lineY2: 480
      },
      { 
        title: 'Gravity Sails', 
        desc: 'Adaptive field wings for atmospheric and space stability.', 
        top: '38%', left: '70%',
        lineX1: 700, lineY1: 380, lineX2: 660, lineY2: 430
      },
      { 
        title: 'Memory Core', 
        desc: 'Organic data vault stores memories, maps and teachings.', 
        top: '62%', left: '48%',
        lineX1: 480, lineY1: 620, lineX2: 500, lineY2: 500
      }
    ]
  },
  {
    id: 'H.A.S.H-05',
    name: 'SUANNI X-WING',
    color: 'Red',
    fuel: 600,
    speed: 120,
    controls: '08',
    pilot: 'Zurian Team',
    role: 'Tactical security defense fighter',
    firstDeployment: 'Sol System Gatehouse',
    knownFor: 'Shielding & heavy weapons',
    description: 'Named after the mythological Suanni and inspired by the tiger. Fast, aggressive, and combat-oriented, it combines strong speed with powerful weapons and good maneuverability. Designed for pilots who prefer to strike first and strike hard.',
    image: '/images/ships/SUANNI X-WING.jpg',
    thumbnail: '/images/ships/SUANNI X-WING Thumnail.png',
    accent: '#ef4444',
    accentRgb: 'rgba(239, 68, 68, 0.4)',
    accentRgbLow: 'rgba(239, 68, 68, 0.08)',
    nodes: [
      { 
        title: 'Neural Cockpit', 
        desc: 'Mind-linked navigation and dream-state interfaces.', 
        top: '34%', left: '45%',
        lineX1: 450, lineY1: 340, lineX2: 480, lineY2: 400
      },
      { 
        title: 'Resonance Drive', 
        desc: 'Zero-point propulsion for silent long-haul travel.', 
        top: '46%', left: '80%',
        lineX1: 800, lineY1: 460, lineX2: 720, lineY2: 440
      },
      { 
        title: 'Gravity Sails', 
        desc: 'Adaptive field wings for atmospheric and space stability.', 
        top: '54%', left: '32%',
        lineX1: 320, lineY1: 540, lineX2: 380, lineY2: 480
      },
      { 
        title: 'Memory Core', 
        desc: 'Organic data vault stores memories, maps and teachings.', 
        top: '64%', left: '72%',
        lineX1: 720, lineY1: 640, lineX2: 660, lineY2: 490
      }
    ]
  }
];


export default function HangarSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeShip = SHIPS_DATA[activeIdx];

  // Dynamically set CSS variables to style glowing frames per active ship accent color
  useEffect(() => {
    const root = document.getElementById('garage-hangar');
    if (root) {
      root.style.setProperty('--ship-accent', activeShip.accent);
      root.style.setProperty('--ship-accent-rgba', activeShip.accentRgb);
      root.style.setProperty('--ship-accent-rgba-low', activeShip.accentRgbLow);
    }
  }, [activeIdx, activeShip]);

  // Parallax refs
  const heroRef = useRef<HTMLElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effect — background scrolls slower, text scrolls faster
  useEffect(() => {
    const handleParallax = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const scrolled = -rect.top;
      const viewH = window.innerHeight;
      // Only apply when the section is in view
      if (rect.bottom < 0 || rect.top > viewH) return;

      if (heroBgRef.current) {
        heroBgRef.current.style.transform = `translateY(${scrolled * 0.35}px)`;
      }
      if (heroTextRef.current) {
        heroTextRef.current.style.transform = `translateY(${scrolled * 0.15}px)`;
      }
    };

    window.addEventListener('scroll', handleParallax, { passive: true });
    handleParallax();
    return () => window.removeEventListener('scroll', handleParallax);
  }, []);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? SHIPS_DATA.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === SHIPS_DATA.length - 1 ? 0 : prev + 1));
  };

  const getCardTransform = (index: number) => {
    switch (index) {
      case 0: return 'translate(calc(-100% - 15px), calc(-100% - 15px))'; // Top-left
      case 1: return 'translate(15px, calc(-100% - 15px))'; // Top-right
      case 2: return 'translate(calc(-100% - 15px), 15px)'; // Bottom-left
      case 3: return 'translate(15px, 15px)'; // Bottom-right
      default: return 'none';
    }
  };

  return (
    <>
      {/* SECTION 1: HERO INTRO */}
      <section className={styles.heroSection} ref={heroRef}>
        {/* Futuristic Cathedral docked ships backdrop */}
        <div className={styles.cathedralBgWrap} ref={heroBgRef} aria-hidden="true">
          <img
            src="/images/ships/HASH Section 1.png"
            alt="Hangar cathedral background"
            className={styles.cathedralBg}
          />
        </div>

        <div className={styles.heroOverlay} aria-hidden="true" />
        
        <div className={styles.heroContainer} ref={heroTextRef}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>H.A.S.H</h1>
            <h2 className={styles.heroSubtitle}>HIPPIE ALIEN SPACE HOVERSHIPS</h2>
            <p className={styles.heroDesc}>
              For millennia, the Hippie Aliens have traversed the cosmos aboard living vessels engineered for exploration, first contact and cultural preservation.
            </p>
          </div>
        </div>

        {/* Scroll indicator pinned to bottom-left */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollIconWrap}>
            <svg viewBox="0 0 24 80" className={styles.scrollIcon}>
              <line x1="12" y1="18" x2="12" y2="62" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="18" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="18" r="3" fill="currentColor" />
              <circle cx="12" cy="62" r="3" fill="currentColor" />
              <circle cx="12" cy="18" r="2.5" fill="#ffffff" className={styles.animatedDot} />
            </svg>
          </div>
          <div className={styles.scrollText}>
            <span className={styles.scrollLabel}>SCROLL TO ENTER</span>
            <span className={styles.scrollTarget}>THE HANGAR</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: SHOWCASE */}
      <section className={`${styles.section} ${styles.showcaseSection}`} id="garage-hangar">
        <div className={styles.starfield} aria-hidden="true" />
        <div className={styles.gridOverlay} aria-hidden="true" />
        <div className={styles.scanline} aria-hidden="true" />

        <div className={styles.container}>
          {/* Central Showcase Workspace */}
          <div className={styles.workspace}>
            <div className={styles.workspaceTop}>
            
            {/* Left specification sheet */}
            <div className={styles.sidebar}>
              <div key={activeShip.id} className={styles.animateSidebarEnter}>
                <div className={styles.shipHeader}>
                  <span className={styles.shipId}>{activeShip.id}</span>
                  <h3 className={styles.shipName}>
                    <span className={styles.shipNameFirst}>{activeShip.name.split(' ')[0]}</span>
                    <span className={styles.shipNameGradient}>
                      {activeShip.name.split(' ').slice(1).join(' ')}
                    </span>
                  </h3>
                </div>                
                <p className={styles.shipDescription}>{activeShip.description}</p>

                <div className={styles.statsList}>
                  <div className={styles.statBox}>
                    <span className={styles.statLabel} style={{ color: activeShip.accent }}>Fuel</span>
                    <span className={styles.statValue}>{activeShip.fuel}</span>
                  </div>
                  <div className={styles.statBox}>
                    <span className={styles.statLabel} style={{ color: activeShip.accent }}>Speed</span>
                    <span className={styles.statValue}>{activeShip.speed}</span>
                  </div>
                  <div className={styles.statBox}>
                    <span className={styles.statLabel} style={{ color: activeShip.accent }}>Controls</span>
                    <span className={styles.statValue} style={{ color: activeShip.accent }}>{activeShip.controls}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Center blueprint viewport */}
            <div className={styles.viewport}>
              <div className={styles.shipDisplayBox}>
                
                {/* Spinning rings moved to animated wrapper */}

                {/* Floating central spaceship render */}
                <div className={`${styles.shipImageWrapper} ${styles.animateShipEnter}`} key={activeShip.name}>
                  <img
                    src={activeShip.image}
                    alt={activeShip.name}
                    className={styles.shipImage}
                  />
                </div>

                {/* Spinning high-tech baseline rings */}
                <div className={styles.shipRingBase} />
                <div className={styles.shipRingOuter} />

                {/* Animated wrapper for SVG and nodes */}
                <div 
                  key={`nodes-${activeShip.id}`} 
                  className={styles.animateNodesEnter} 
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 15 }}
                >
                  {/* SVG connection lines for hot-nodes */}
                  <svg 
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} 
                    viewBox="0 0 1000 1000"
                    preserveAspectRatio="none"
                  >
                    {activeShip.nodes.map((node, i) => (
                      <line 
                        key={i} 
                        x1={node.lineX1} 
                        y1={node.lineY1} 
                        x2={node.lineX2} 
                        y2={node.lineY2}
                        className={styles.nodeLine}
                      />
                    ))}
                  </svg>

                  {/* Interactive blueprint hotspot nodes (always visible) */}
                  {activeShip.nodes.map((node, i) => {
                    const dotStyle = {
                      top: `${node.lineY2 / 10}%`,
                      left: `${node.lineX2 / 10}%`,
                    };
                    const cardStyle = {
                      top: node.top,
                      left: node.left,
                      transform: getCardTransform(i),
                    };

                    return (
                      <React.Fragment key={i}>
                        {/* The hotspot dot on the ship */}
                        <div 
                          className={styles.nodeDot} 
                          style={dotStyle}
                        />
                        {/* The info card always visible around the ship */}
                        <div 
                          className={styles.nodeCard} 
                          style={cardStyle}
                        >
                          <span className={styles.nodeCardTitle}>{node.title}</span>
                          <p className={styles.nodeCardDesc}>{node.desc}</p>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>

              </div>
            </div>
            </div>

          {/* Bottom selector slider */}
          <div className={styles.catalogWrapper}>
            <button className={styles.navArrow} onClick={handlePrev} aria-label="Previous ship">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className={styles.catalog}>
              {SHIPS_DATA.map((ship, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <div
                    key={ship.id}
                    className={`${styles.catalogCard} ${isActive ? styles.catalogCardActive : ''}`}
                    onClick={() => setActiveIdx(idx)}
                    style={{
                      '--card-accent': ship.accent,
                    } as React.CSSProperties}
                  >
                    <div className={styles.catalogImgWrap}>
                      <img
                        src={ship.thumbnail}
                        alt={ship.name}
                        className={styles.catalogImg}
                      />
                    </div>
                    <div className={styles.catalogMeta}>
                      <span className={styles.catalogId}>{ship.id.replace('H.A.S.H-', '')}</span>
                      <span className={styles.catalogName}>{ship.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className={styles.navArrow} onClick={handleNext} aria-label="Next ship">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          </div>
        </div>
      </section>
    </>
  );
}
