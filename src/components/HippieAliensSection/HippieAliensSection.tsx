'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './HippieAliensSection.module.css';
import { gsap } from 'gsap';

const ALIEN_IMAGES = [
  {
    id: 0,
    name: 'Imei-Khyrra',
    planet: "Dzo'Näri",
    system: "Dzo'Näri System",
    image: '/Hippie Aliens/HA_B1.webp',
    glowColor: '#38bdf8'
  },
  {
    id: 1,
    name: 'Tyrsoh-Vei',
    planet: "Dzo'Näri",
    system: "Dzo'Näri System",
    image: '/Hippie Aliens/HA_B2.webp',
    glowColor: '#2563eb'
  },
  {
    id: 2,
    name: 'Rynai',
    planet: "Dzo'Näri",
    system: "Dzo'Näri System",
    image: '/Hippie Aliens/HA_B3.webp',
    glowColor: '#818cf8'
  },
  {
    id: 3,
    name: 'Ka-Lyngdoh',
    planet: "Dzo'Näri",
    system: "Dzo'Näri System",
    image: '/Hippie Aliens/HA_B4.webp',
    glowColor: '#2dd4bf'
  },
  {
    id: 4,
    name: 'Zeru Nongkynrih (Zero)',
    planet: "Dzo'Näri",
    system: "Dzo'Näri System",
    image: '/Hippie Aliens/HA_B11.webp',
    glowColor: '#a78bfa'
  },
  {
    id: 5,
    name: 'Kael Veyn',
    planet: 'Veyra',
    system: 'Thalor',
    image: '/Hippie Aliens/HA_B5.webp',
    glowColor: '#3b82f6'
  },
  {
    id: 6,
    name: 'Oru Sen',
    planet: 'Iskara',
    system: 'Nyxaris',
    image: '/Hippie Aliens/HA_B6.webp',
    glowColor: '#06b6d4'
  },
  {
    id: 7,
    name: 'Tekk-7',
    planet: 'Cindraal',
    system: 'Helion Verge',
    image: '/Hippie Aliens/HA_B7.webp',
    glowColor: '#6366f1'
  },
  {
    id: 8,
    name: 'Faev',
    planet: 'Kharum',
    system: 'Serekh',
    image: '/Hippie Aliens/HA_B8.webp',
    glowColor: '#14b8a6'
  },
  {
    id: 9,
    name: 'Serun',
    planet: 'Aurelith',
    system: 'Nyxaris',
    image: '/Hippie Aliens/HA_B9.webp',
    glowColor: '#60a5fa'
  },
  {
    id: 10,
    name: 'Jaroi',
    planet: 'Mycoris',
    system: 'Umbra Root',
    image: '/Hippie Aliens/HA_B10.webp',
    glowColor: '#4f46e5'
  },
  {
    id: 11,
    name: 'Tarekh',
    planet: 'Avaru',
    system: 'Nayaru System',
    image: '/Hippie Aliens/HA_B12.webp',
    glowColor: '#0284c7'
  }
];

interface HippieAliensSectionProps {
  showSliderOnly?: boolean;
}

export default function HippieAliensSection({ showSliderOnly = false }: HippieAliensSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  
  const scrollOffsetRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isVisibleRef = useRef(false);

  // Initialize offset in the middle set of cards for seamless infinite looping
  useEffect(() => {
    const singleSetWidth = ALIEN_IMAGES.length * 184; // 160px card + 24px gap
    scrollOffsetRef.current = singleSetWidth;
  }, []);

  const loop = () => {
    if (!isVisibleRef.current || !trackRef.current) return;

    // Slide track continuously at 0.75px per frame
    scrollOffsetRef.current += 0.75;

    const singleSetWidth = ALIEN_IMAGES.length * 184;

    // Seamless scroll wrapping:
    // If we exceed Set 2 + Set 3 boundaries, wrap back into Set 2 seamlessly
    if (scrollOffsetRef.current >= singleSetWidth * 2) {
      scrollOffsetRef.current -= singleSetWidth;
    } else if (scrollOffsetRef.current < 0) {
      scrollOffsetRef.current += singleSetWidth;
    }

    trackRef.current.style.transform = `translate3d(${-scrollOffsetRef.current}px, 0, 0)`;

    // Calculate dynamic scale and opacity relative to horizontal screen center
    const screenCenter = window.innerWidth / 2;
    const cards = trackRef.current.querySelectorAll(`.${styles.modelCard}`);

    let closestId = activeIndex;
    let minDistance = Infinity;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distanceFromCenter = Math.abs(screenCenter - cardCenter);
      const maxDistance = window.innerWidth * 0.45;

      const cardHtml = card as HTMLElement;

      // Calculate dynamic Z-index: smaller distance from screen center = higher z-index
      // Using a large positive range to prevent negative z-indices and force correct layering
      const zIndex = Math.max(1, Math.round(10000 - distanceFromCenter));
      cardHtml.style.zIndex = `${zIndex}`;

      // GPU 3D depth layer translation to force perfect hardware depth sorting (safe range: 1 to 100px)
      const depthZ = Math.max(1, Math.round(100 - (distanceFromCenter / (window.innerWidth || 1920)) * 100));

      if (distanceFromCenter < maxDistance) {
        // Linear scale interpolation from 1.0 (edges) to 1.45 (screen center)
        const scale = 1.0 + (1.45 - 1.0) * (1 - distanceFromCenter / maxDistance);
        const opacity = 0.4 + (1.0 - 0.4) * (1 - distanceFromCenter / maxDistance);

        // Smooth dynamic vertical lift as cards approach the center (up to -12px)
        const translateY = -12 * (1 - distanceFromCenter / maxDistance);

        // Include depthZ in translate3d to force GPU composite depth sorting
        cardHtml.style.transform = `translate3d(0, ${translateY}px, ${depthZ}px) scale(${scale})`;
        cardHtml.style.opacity = `${opacity}`;

        if (distanceFromCenter < minDistance) {
          minDistance = distanceFromCenter;
          closestId = parseInt(cardHtml.getAttribute('data-alien-id') || '0');
        }

        // Active glowing dropshadow if card is right in the center view
        if (distanceFromCenter < 90) {
          const glowColor = cardHtml.getAttribute('data-glow-color') || '#2dd4bf';
          cardHtml.style.filter = `drop-shadow(0 0 25px ${glowColor}25) drop-shadow(0 0 10px ${glowColor}10)`;
          cardHtml.classList.add(styles.activeCard);
        } else {
          cardHtml.style.filter = 'none';
          cardHtml.classList.remove(styles.activeCard);
        }
      } else {
        cardHtml.style.transform = `translate3d(0, 0, ${depthZ}px) scale(1.0)`;
        cardHtml.style.opacity = '0.4';
        cardHtml.style.filter = 'none';
        cardHtml.classList.remove(styles.activeCard);
      }
    });

    if (closestId !== activeIndex) {
      setActiveIndex(closestId);
    }

    requestRef.current = requestAnimationFrame(loop);
  };

  // IntersectionObserver to only animate the sliding loop when visible on screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
          if (isVisibleRef.current) {
            requestRef.current = requestAnimationFrame(loop);
          } else if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
          }
        });
      },
      { threshold: 0.02 }
    );

    const section = document.getElementById('hippie-aliens');
    if (section) observer.observe(section);

    return () => {
      observer.disconnect();
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [activeIndex]);

  const handleArrowScroll = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const cardWidth = 184;
      const change = direction === 'left' ? -cardWidth : cardWidth;
      
      gsap.to(scrollOffsetRef, {
        current: scrollOffsetRef.current + change,
        duration: 0.6,
        ease: 'power2.out'
      });
    }
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
          <div 
            className={styles.modelViewportContainer}
            onMouseEnter={() => { isHoveredRef.current = true; }}
            onMouseLeave={() => { isHoveredRef.current = false; }}
          >
            {/* Pulsing active background glow projection behind active model */}
            <div 
              className={styles.sliderActiveGlow} 
              style={{
                background: `radial-gradient(circle, ${(ALIEN_IMAGES[activeIndex] || ALIEN_IMAGES[0]).glowColor}25 0%, transparent 70%)`
              }}
            />

            <div 
              ref={trackRef} 
              className={styles.modelStrip}
            >
              {[...ALIEN_IMAGES, ...ALIEN_IMAGES, ...ALIEN_IMAGES].map((alien, idx) => (
                <div 
                  key={`${alien.id}-${idx}`} 
                  className={styles.modelCard}
                  data-alien-id={alien.id}
                  data-glow-color={alien.glowColor}
                  onClick={() => {
                    if (trackRef.current) {
                      const cardWidth = 184; // 160px card + 24px gap
                      const singleSetWidth = ALIEN_IMAGES.length * cardWidth;
                      
                      // Calculate target offset to align this specific card in center viewport
                      let targetOffset = (idx * cardWidth) - (window.innerWidth / 2 - 80);
                      
                      // Seamless snap target inside Set 2 looping zone [singleSetWidth, singleSetWidth * 2]
                      while (targetOffset < singleSetWidth) {
                        targetOffset += singleSetWidth;
                      }
                      while (targetOffset >= singleSetWidth * 2) {
                        targetOffset -= singleSetWidth;
                      }

                      setActiveIndex(alien.id);
                      
                      // Smoothly glide the track to the target centered offset
                      gsap.to(scrollOffsetRef, {
                        current: targetOffset,
                        duration: 0.8,
                        ease: 'power3.out'
                      });
                    }
                  }}
                >
                  <div className={styles.modelGridDots} />
                  <div className={styles.modelScanline} />
                  
                  

                  
                  <img 
                    src={alien.image} 
                    alt={alien.name}
                    className={styles.modelImage}
                  />
                  
                  <div className={styles.modelOverlayInfo}>
                    <h4 className={styles.modelName}>{alien.name}</h4>
                    <span className={styles.modelClass}>
                      {`PLANET: ${alien.planet} // SYSTEM: ${alien.system}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
