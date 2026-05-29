'use client';

import React, { useState } from 'react';
import styles from './ZeroArrivalSection.module.css';

export default function ZeroArrivalSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal  = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <section className={styles.section} id="arrival-of-zero">
      <div className={styles.gridOverlay} aria-hidden="true" />

      {/* Ambient corner bracket decor */}
      <div className={`${styles.corner} ${styles.topLeft}`}    aria-hidden="true" />
      <div className={`${styles.corner} ${styles.topRight}`}   aria-hidden="true" />
      <div className={`${styles.corner} ${styles.bottomLeft}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.bottomRight}`}aria-hidden="true" />

      {/* Top radial glow bloom */}
      <div className={styles.glowBloom} aria-hidden="true" />

      <div className={styles.container}>

        {/* Section Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            Arrival of <span className={styles.titleGlow}>Zero</span>
          </h2>
          <p className={styles.description}>
            Zero is not just a traveler — he is the ultimate dimensional catalyst. An enigmatic 
            wanderer who bridged the gap between natural magic and digital cybernetics, 
            shattering the traditional timeline and triggering the massive Zura portal convergence.
          </p>
        </div>

        {/* Cinematic Video Frame — click to open modal */}
        <div className={styles.videoOuter} onClick={openModal} role="button" tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && openModal()}
          aria-label="Play Arrival of Zero video"
        >
          {/* Decorative corner brackets */}
          <div className={`${styles.videoCorner} ${styles.vcTopLeft}`} />
          <div className={`${styles.videoCorner} ${styles.vcTopRight}`} />
          <div className={`${styles.videoCorner} ${styles.vcBottomLeft}`} />
          <div className={`${styles.videoCorner} ${styles.vcBottomRight}`} />

          {/* Scanning line texture */}
          <div className={styles.scanSweep} aria-hidden="true" />

          {/* Top bezel strip */}
          <div className={styles.videoBezel}>
            <span className={styles.bezelDot} />
            <span className={styles.bezelLabel}>ZURAVERSE // ARRIVAL CHRONICLE FEED</span>
            <span className={styles.bezelDot} />
          </div>

          {/* YouTube thumbnail with play button overlay */}
          <div className={styles.videoWrapper}>
            <img
              src="https://img.youtube.com/vi/v3Yc5UcHZmk/maxresdefault.jpg"
              alt="Arrival of Zero – Zuraverse Chronicle"
              className={styles.thumbnailImg}
            />

            {/* Dark overlay on thumbnail */}
            <div className={styles.thumbnailOverlay} />

            {/* Centered play button */}
            <div className={styles.playButtonWrapper}>
              <div className={styles.playRingOuter} />
              <div className={styles.playRingInner} />
              <div className={styles.playButton}>
                <svg viewBox="0 0 24 24" className={styles.playIcon}>
                  <path d="M8 5v14l11-7z" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom bezel strip */}
          <div className={styles.videoBezelBottom}>
            <span className={styles.bezelStat}>CLICK TO PLAY TRANSMISSION</span>
            <span className={styles.bezelPulse} />
          </div>
        </div>

      </div>

      {/* ── YouTube Modal ───────────────────────────────────── */}
      {isModalOpen && (
        <div className={styles.modalBackdrop} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>

            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>ARRIVAL CHRONICLE // DIMENSIONAL CATALYST</span>
              <button
                className={styles.closeBtn}
                onClick={closeModal}
                aria-label="Close video"
              >
                ×
              </button>
            </div>

            <div className={styles.modalVideoWrapper}>
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
      )}
    </section>
  );
}
