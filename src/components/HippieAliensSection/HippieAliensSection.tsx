'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './HippieAliensSection.module.css';

// Futuristic Hippie Alien species portraits dataset (dich-fashion models)
const ALIEN_IMAGES = [
  {
    id: 0,
    name: 'ASTRAL WEAVER',
    class: 'TELEPATHIC COHERENCE',
    image: '/house_ayahuasca.png',
    glowColor: '#10b981' // Emerald green aura
  },
  {
    id: 1,
    name: 'REALITY SHIFTER',
    class: 'DIMENSIONAL TRANSITION',
    image: '/house_datura.png',
    glowColor: '#a78bfa' // Violet aura
  },
  {
    id: 2,
    name: 'TEMPORAL SENTINEL',
    class: 'CHRONAL TELEMETRY',
    image: '/house_iboga.png',
    glowColor: '#d946ef' // Fuchsia aura
  },
  {
    id: 3,
    name: 'PEACE HARBINGER',
    class: 'EMPATHIC RESONANCE',
    image: '/house_kava.png',
    glowColor: '#06b6d4' // Cyan aura
  },
  {
    id: 4,
    name: 'DREAM ARCHITECT',
    class: 'COSMIC DREAMWEAVING',
    image: '/house_peyote.png',
    glowColor: '#f59e0b' // Gold amber aura
  },
  {
    id: 5,
    name: 'NIRVANA MEDITATOR',
    class: 'ZEN ASCENSION',
    image: '/bze_nirvana_yoga.png',
    glowColor: '#2dd4bf' // Cyan-Teal aura
  }
];

interface HippieAliensSectionProps {
  showSliderOnly?: boolean;
}

export default function HippieAliensSection({ showSliderOnly = false }: HippieAliensSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoSlideTimer = useRef<NodeJS.Timeout | null>(null);

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideTimer.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % ALIEN_IMAGES.length;
        scrollToIndex(next);
        return next;
      });
    }, 3000); // Cycles every 3 seconds
  };

  const stopAutoSlide = () => {
    if (autoSlideTimer.current) {
      clearInterval(autoSlideTimer.current);
    }
  };

  const scrollToIndex = (index: number) => {
    if (sliderRef.current) {
      const cardWidth = 244; // card (220px) + gap (24px)
      const scrollPosition = index * cardWidth - (sliderRef.current.clientWidth / 2 - 110);
      sliderRef.current.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  };

  // Re-start or reset the timer whenever the activeIndex is modified (manual or automatic)
  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [activeIndex]);

  const handleManualClick = (index: number) => {
    setActiveIndex(index);
    scrollToIndex(index);
  };

  const handleArrowScroll = (direction: 'left' | 'right') => {
    let nextIndex = activeIndex;
    if (direction === 'left') {
      nextIndex = (activeIndex - 1 + ALIEN_IMAGES.length) % ALIEN_IMAGES.length;
    } else {
      nextIndex = (activeIndex + 1) % ALIEN_IMAGES.length;
    }
    handleManualClick(nextIndex);
  };

  return (
    <section 
      className={`${styles.section} ${showSliderOnly ? styles.sliderOnlySection : ''}`} 
      id="hippie-aliens"
    >
      <div className={styles.gridOverlay} aria-hidden="true" />

      {/* Terminal Bezel Top Bar */}
      {!showSliderOnly && (
        <div className={styles.terminalTopBar}>
          <div className={styles.termLeft}>ZURAVERSE</div>
          <div className={styles.termCenter}>
            <div className={styles.termIndex}>| 02 |</div>
            <div className={styles.termEyebrow}>THE HIPPIE ALIENS</div>
          </div>
          <div className={styles.termRight}>
            DATABASE TERMINAL
            <span className={styles.termBeacon} />
          </div>
        </div>
      )}

      {!showSliderOnly && (
        <>
          <div className={`${styles.corner} ${styles.topLeft}`} aria-hidden="true" />
          <div className={`${styles.corner} ${styles.topRight}`} aria-hidden="true" />
          <div className={`${styles.corner} ${styles.bottomLeft}`} aria-hidden="true" />
          <div className={`${styles.corner} ${styles.bottomRight}`} aria-hidden="true" />
        </>
      )}

      <div className={styles.container}>
        {!showSliderOnly && (
          <div className={styles.layout}>
          
          {/* Content Column */}
          <div className={styles.contentCol}>
            <h2 className={styles.title}>
              THE HIPPIE <span className={styles.titleGlow}>ALIENS</span>
            </h2>

            <div className={styles.narrative}>
              <p className={styles.lead}>
                Zuraverse is a transmedia science-fiction universe centered around the <strong>Hippie Aliens</strong>—an immortal civilization from the far edge of the future and the last known living species in a dying cosmos. For millennia they wandered the cosmos in search of Nirvana, witnessing the rise and fall of countless worlds. Then they discovered a mysterious signal: <span className={styles.tooltipContainer}>
                  <a 
                    href="https://science.nasa.gov/mission/voyager/voyager-golden-record-overview/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.goldenLink}
                  >
                    Voyager's Golden Record
                  </a>
                  <a 
                    href="https://science.nasa.gov/mission/voyager/voyager-golden-record-overview/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.tooltipBtn}
                  >
                    <span className={styles.miniVinyl}>
                      <span className={styles.vinylGrooves} />
                      <span className={styles.vinylCenter} />
                    </span>
                    <span className={styles.tooltipText}>NASA OVERVIEW ↗</span>
                  </a>
                </span>.
              </p>
              
              <p className={styles.bodyText}>
                That discovery would lead them to humanity and begin a story that unfolds across films, games, music, lore, and interactive experiences. Their stories span thousands of years, multiple worlds and two defining eras that shaped the universe as we know it.
              </p>
            </div>
          </div>

          {/* Interactive Play Video Card Column */}
          <div className={styles.visualCol}>
            <div 
              className={styles.videoCard} 
              onClick={() => setIsModalOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setIsModalOpen(true)}
            >
              <div className={styles.terminalScanlines} />
              
              <div className={styles.terminalHeader}>
                <span className={styles.statusLight} />
                <span className={styles.terminalTitle}>SECURE STREAMS: TEASER TRAILER</span>
              </div>
              
              {/* Retro scientific telemetry play graphic with real trailer thumbnail */}
              <div className={styles.videoThumbnail}>
                <img 
                  src="/We%20are%20coming%20Thumbnail.jpg" 
                  alt="Zuraverse Teaser Trailer Cover"
                  className={styles.thumbnailImg}
                />
                
                <div className={styles.telemetryOverlay}>
                  <div className={styles.gridBox} />
                  <div className={styles.coordsLabel}>LOC: SOL-3 // SYSTEM_DECODED</div>
                </div>

                <div className={styles.playButtonWrapper}>
                  <div className={styles.playButtonRing} />
                  <div className={styles.playButton}>
                    <svg viewBox="0 0 24 24" className={styles.playIcon}>
                      <path d="M8 5v14l11-7z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
                
                <span className={styles.teaserLabel}>LAUNCH CINEMATIC TRANSMISSION</span>
              </div>

              <div className={styles.terminalFooter}>
                <span className={styles.decryptBtn}>
                  [ BROADCASTING TRANSMISSION FROM THE VOID ]
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* ========================================================
            DICH-FASHION HIPPIE ALIEN PORTRAITS AUTO-SLIDER
           ======================================================== */}
        <div className={styles.sliderSection}>
          <div className={styles.sliderHeader}>
            <div className={styles.sliderHeaderLeft}>
              <span className={styles.sliderIndex}>TRANSMISSION DETECTED: HIPPIE ALIEN SPECTRUM</span>
              <h3 className={styles.sliderMainTitle}>THE COSMIC WANDERERS</h3>
            </div>
            <div className={styles.sliderDots}>
              {ALIEN_IMAGES.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`${styles.sliderDot} ${activeIndex === idx ? styles.activeDot : ''}`}
                  onClick={() => handleManualClick(idx)}
                />
              ))}
            </div>
          </div>
          
          <div className={styles.modelViewportContainer}>
            <button className={styles.slideBtnLeft} onClick={() => handleArrowScroll('left')} aria-label="Slide Left">[ &lt; ]</button>
            
            <div ref={sliderRef} className={styles.modelStrip}>
              {ALIEN_IMAGES.map((alien, idx) => (
                <div 
                  key={alien.id} 
                  className={`${styles.modelCard} ${activeIndex === idx ? styles.activeCard : ''}`}
                  onClick={() => handleManualClick(idx)}
                  style={{ 
                    // Dynamic drop shadow aura for active selections
                    filter: activeIndex === idx 
                      ? `drop-shadow(0 0 35px ${alien.glowColor}50) drop-shadow(0 0 15px ${alien.glowColor}30)` 
                      : 'none'
                  } as React.CSSProperties}
                >
                  <div className={styles.modelGridDots} />
                  <div className={styles.modelScanline} />
                  
                  {/* Subtle index tag overlay */}
                  <div className={styles.houseIndexTag}>{`ALIEN_${alien.id + 1}`}</div>
                  
                  <img 
                    src={alien.image} 
                    alt={alien.name}
                    className={styles.modelImage}
                  />
                  
                  <div className={styles.modelOverlayInfo}>
                    <span className={styles.modelClass}>{alien.class}</span>
                    <h4 className={styles.modelName}>{alien.name}</h4>
                  </div>
                </div>
              ))}
            </div>
            
            <button className={styles.slideBtnRight} onClick={() => handleArrowScroll('right')} aria-label="Slide Right">[ &gt; ]</button>
          </div>
        </div>
      </div>

      {/* High-Fidelity Holographic Video Modal */}
      {!showSliderOnly && isModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsModalOpen(false)}>
          <div 
            className={styles.modalContent} 
            onClick={e => e.stopPropagation()} // Prevent close on content click
          >
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>TRANSMISSION DECODED // VOYAGER_SIGNAL</span>
              <button 
                className={styles.closeBtn} 
                onClick={() => setIsModalOpen(false)}
                aria-label="Close video player"
              >
                ×
              </button>
            </div>
            
            <div className={styles.videoWrapper}>
              <iframe
                className={styles.videoIframe}
                src="https://www.youtube.com/embed/EgIdvNzXegA?autoplay=1&rel=0&showinfo=0&modestbranding=1"
                title="Zuraverse Cinematic Teaser Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
