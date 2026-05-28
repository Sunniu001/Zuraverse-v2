'use client';

import React, { useState } from 'react';
import styles from './ArchivesSection.module.css';

interface Faction {
  id: string;
  name: string;
  codename: string;
  color: 'teal' | 'purple';
  description: string;
  lore: string;
  stats: {
    origin: string;
    affinity: string;
    specialty: string;
  };
  icon: string;
}

const FACTIONS: Faction[] = [
  {
    id: 'iboga',
    name: 'Iboga Guardians',
    codename: 'BIO-SIGNAL: ACTIVE',
    color: 'teal',
    description: 'Masters of organic biotechnology and keepers of the planetary consciousness. They channel the emerald life-streams of the cosmos.',
    lore: 'Deep within the lush, bioluminescent canopy of Zura-3, the Iboga Faction lives in symbiosis with the Great Canopy. By harnessing the vibrational resonance of local spores and psychoactive fauna, they construct self-healing vegetative spaceships and light-emitting structures that operate in harmony with nature.',
    stats: {
      origin: 'Zura-3 Primeval Forests',
      affinity: 'Organic Tech & Spore Magic',
      specialty: 'Hyper-Regen & Telepathic Links',
    },
    icon: '◈',
  },
  {
    id: 'datura',
    name: 'Datura Synthetics',
    codename: 'NEURAL-LINK: SYNCED',
    color: 'purple',
    description: 'Pioneers of advanced cyber-technology and cosmic spatial manipulation. They bend gravity and dimensions to their will.',
    lore: 'Exiled to the fractured gravity reefs of Zura-7, the Datura turned their brilliant minds to the synth-core. Through rigorous metallic integration, they forged sleek, levitating neon monoliths, gravity-folding drives, and quantum HUD arrays. They believe that technology is the supreme gateway to stellar transcendence.',
    stats: {
      origin: 'Zura-7 Gravity Reefs',
      affinity: 'Cyber-Dynamics & Gravitics',
      specialty: 'Warp Gate Folding & Nano-Shields',
    },
    icon: '✦',
  },
];

export default function ArchivesSection() {
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);

  const handleCardClick = (faction: Faction) => {
    // Toggle details drawer
    if (selectedFaction?.id === faction.id) {
      setSelectedFaction(null);
    } else {
      setSelectedFaction(faction);
    }
  };

  return (
    <section className={styles.section} id="lore-archives">
      {/* Decorative Grid Overlay & Corners */}
      <div className={styles.gridOverlay} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.topLeft}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.topRight}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.bottomLeft}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.bottomRight}`} aria-hidden="true" />

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span className={styles.eyebrowText}>DATABASE TERMINAL</span>
            <span className={styles.eyebrowLine} />
          </div>
          <h2 className={styles.title}>Cosmic Factions</h2>
          <p className={styles.subtitle}>
            A deep-dive data stream into the opposing forces fighting for the soul of Zuraverse.
          </p>
        </div>

        {/* Faction Cards Grid */}
        <div className={styles.grid}>
          {FACTIONS.map(faction => {
            const isSelected = selectedFaction?.id === faction.id;
            const isTeal = faction.color === 'teal';
            const themeClass = isTeal ? styles.themeTeal : styles.themePurple;
            
            return (
              <div
                key={faction.id}
                className={`${styles.card} ${themeClass} ${isSelected ? styles.cardSelected : ''}`}
                onClick={() => handleCardClick(faction)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(faction); }}
              >
                <div className={styles.cardGlow} />
                <div className={styles.cardScanlines} />
                
                {/* Micro Sci-fi Details */}
                <div className={styles.cardHeader}>
                  <span className={styles.factionIcon}>{faction.icon}</span>
                  <span className={styles.codename}>{faction.codename}</span>
                </div>

                <h3 className={styles.factionName}>{faction.name}</h3>
                <p className={styles.factionDesc}>{faction.description}</p>

                {/* Micro Stats Grid */}
                <div className={styles.statsMini}>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>ORIGIN:</span>
                    <span className={styles.statValue}>{faction.stats.origin}</span>
                  </div>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>AFFINITY:</span>
                    <span className={styles.statValue}>{faction.stats.affinity}</span>
                  </div>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>SPECIALTY:</span>
                    <span className={styles.statValue}>{faction.stats.specialty}</span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.actionPrompt}>
                    {isSelected ? '[ CLOSE SYSTEM DRAWER ]' : '[ DECRYPT LORE ARCHIVE ]'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Detail Drawer (Slide-down disclosure block) */}
        {selectedFaction && (
          <div className={`${styles.drawer} ${selectedFaction.color === 'teal' ? styles.drawerTeal : styles.drawerPurple}`}>
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>SECURE LOG DECIPHERED: {selectedFaction.name.toUpperCase()}</span>
              <button 
                className={styles.closeBtn} 
                onClick={() => setSelectedFaction(null)}
                aria-label="Close lore archive"
              >
                ×
              </button>
            </div>
            <div className={styles.drawerBody}>
              <p className={styles.drawerLoreText}>{selectedFaction.lore}</p>
              <div className={styles.tacticalOverlay}>
                <div className={styles.overlayBar} />
                <span className={styles.overlayText}>TRANSMEDIA DATA LINK // STABLE</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
