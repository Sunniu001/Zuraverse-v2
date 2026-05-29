'use client';

import React, { useState } from 'react';
import styles from './HippieAliensSection.module.css';

export default function HippieAliensSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className={styles.section} id="hippie-aliens">
      <div className={styles.gridOverlay} aria-hidden="true" />

      {/* Terminal Bezel Top Bar */}
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

      <div className={`${styles.corner} ${styles.topLeft}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.topRight}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.bottomLeft}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.bottomRight}`} aria-hidden="true" />

      <div className={styles.container}>
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
      </div>

      {/* High-Fidelity Holographic Video Modal */}
      {isModalOpen && (
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
