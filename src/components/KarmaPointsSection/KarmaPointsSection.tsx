'use client';

import React, { useState } from 'react';
import { ZuraHouse } from '@/data/houses';
import styles from './KarmaPointsSection.module.css';

interface KarmaPointsSectionProps {
  selectedHouse: ZuraHouse | null;
}

interface KarmaDeed {
  id: string;
  category: string;
  icon: string;
  title: string;
  description: string;
  points: number;
  badge: string;
  color: string;
}

const KARMA_DEEDS: KarmaDeed[] = [
  {
    id: 'eco-plant',
    category: 'ECOLOGY & BIOMES',
    icon: '🌿',
    title: 'Biophilic Stewardship',
    description:
      'Plant virtual-to-real mangrove trees, cleanse digital oceans, and offset compute emissions in Zura Park.',
    points: 50,
    badge: 'ECO-NODE',
    color: '#4ade80',
  },
  {
    id: 'zen-meditate',
    category: 'MINDFULNESS & NIRVANA',
    icon: '🧘',
    title: '432Hz Sound Healing',
    description:
      'Participate in communal binaural soundbaths, guided breathwork, and zero-gravity meditation sanctuaries.',
    points: 40,
    badge: 'ZEN-STREAM',
    color: '#38bdf8',
  },
  {
    id: 'lore-create',
    category: 'TRANSMEDIA & ART',
    icon: '🎨',
    title: 'Archive Lore & Music',
    description:
      'Contribute acoustic tracks, psychedelic generative art, and transmedia stories to the cosmic library.',
    points: 60,
    badge: 'ARCHIVIST',
    color: '#a78bfa',
  },
  {
    id: 'house-quest',
    category: 'COMMUNITY & DAO',
    icon: '🤝',
    title: 'House Council Quests',
    description:
      'Unite with your House for non-violent celestial rallies, community moderation, and eco-grant voting.',
    points: 45,
    badge: 'GOVERNANCE',
    color: '#fbbf24',
  },
];

const UTILITY_CARDS = [
  {
    icon: '🚀',
    title: 'Genesis Vessel Drops',
    desc: 'Exclusive access to limited 3D biome-ship blueprints and rare Hippie Alien avatar traits.',
    tier: 'TIER I+',
  },
  {
    icon: '🌌',
    title: 'Sacred Sanctuary Portals',
    desc: 'Unlock hidden dimensions, acoustic temples, and private festival hubs across Zura Park.',
    tier: 'TIER II+',
  },
  {
    icon: '🌱',
    title: 'Real-World Eco-Grants',
    desc: 'Deploy DAO treasury funds to real-world rainforest preservation and ocean plastic removal.',
    tier: 'TIER III+',
  },
  {
    icon: '👑',
    title: 'Council of Transcendent',
    desc: 'Direct co-creation privileges with the core dev team, transmedia rights, and physical merchandise.',
    tier: 'TIER IV',
  },
];

export default function KarmaPointsSection({ selectedHouse }: KarmaPointsSectionProps) {
  // Base initiation karma: 500 base + 250 if house is selected
  const [bonusEarned, setBonusEarned] = useState<number>(0);
  const [completedDeeds, setCompletedDeeds] = useState<string[]>([]);
  const [activeToast, setActiveToast] = useState<{ title: string; pts: number } | null>(null);

  const houseBonus = selectedHouse ? 250 : 0;
  const currentTotal = 500 + houseBonus + bonusEarned;

  // Calculate current tier
  let currentTier = {
    name: 'COSMIC INITIATE',
    rank: 'TIER I',
    nextThreshold: 1000,
    prevThreshold: 500,
  };

  if (currentTotal >= 1500) {
    currentTier = {
      name: 'TRANSCENDENT MASTER',
      rank: 'TIER IV',
      nextThreshold: 2000,
      prevThreshold: 1500,
    };
  } else if (currentTotal >= 1000) {
    currentTier = {
      name: 'CELESTIAL STEWARD',
      rank: 'TIER III',
      nextThreshold: 1500,
      prevThreshold: 1000,
    };
  } else if (currentTotal >= 750) {
    currentTier = {
      name: 'ASTRAL PILGRIM',
      rank: 'TIER II',
      nextThreshold: 1000,
      prevThreshold: 750,
    };
  }

  const progressPercent = Math.min(
    100,
    Math.max(
      15,
      ((currentTotal - currentTier.prevThreshold) /
        (currentTier.nextThreshold - currentTier.prevThreshold)) *
        100
    )
  );

  const handlePerformDeed = (deed: KarmaDeed) => {
    const isFirstTime = !completedDeeds.includes(deed.id);
    const addedPoints = isFirstTime ? deed.points : Math.round(deed.points * 0.5);

    setBonusEarned((prev) => prev + addedPoints);
    if (isFirstTime) {
      setCompletedDeeds((prev) => [...prev, deed.id]);
    }

    setActiveToast({
      title: deed.title,
      pts: addedPoints,
    });

    setTimeout(() => {
      setActiveToast((current) => (current?.title === deed.title ? null : current));
    }, 3200);
  };

  return (
    <section className={styles.section} id="karma-points">
      {/* Background Decorators */}
      <div className={styles.gridOverlay} aria-hidden="true" />
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.topLeft}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.topRight}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.bottomLeft}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.bottomRight}`} aria-hidden="true" />

      {/* Floating Notification Toast */}
      {activeToast && (
        <div className={styles.toastNotification} role="status">
          <span className={styles.toastIcon}>⚡</span>
          <div className={styles.toastText}>
            <strong>+{activeToast.pts} KARMA POINTS</strong>
            <span>Action Calibrated: {activeToast.title}</span>
          </div>
        </div>
      )}

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span className={styles.eyebrowBadge}>CONSCIOUSNESS ECONOMY</span>
            <span className={styles.eyebrowLine} />
          </div>

          <h2 className={styles.title}>
            KARMA <span className={styles.titleGradient}>POINTS (KP)</span>
          </h2>

          <p className={styles.subtitle}>
            In Zuraverse, wealth is not mined or extracted — it is cultivated through intentional
            living. Karma Points (KP) measure your positive resonance across the metaverse, from
            restoring biomes to archiving cosmic frequencies.
          </p>
        </div>

        {/* ─── LIVE CITIZEN KARMA HUD ─────────────────────── */}
        <div className={styles.hudCard}>
          <div className={styles.hudTop}>
            <div className={styles.hudUser}>
              <div className={styles.hudAvatar}>
                {selectedHouse ? (
                  <img
                    src={selectedHouse.image}
                    alt={selectedHouse.name}
                    className={styles.hudAvatarImg}
                  />
                ) : (
                  <span className={styles.hudAvatarPlaceholder}>☮</span>
                )}
              </div>
              <div className={styles.hudUserInfo}>
                <span className={styles.hudRankTag}>{currentTier.rank}</span>
                <h3 className={styles.hudUserName}>{currentTier.name}</h3>
                <span className={styles.hudHouseTag}>
                  {selectedHouse ? (
                    <>
                      AFFILIATION: <strong style={{ color: selectedHouse.color }}>HOUSE {selectedHouse.name}</strong>
                    </>
                  ) : (
                    'AFFILIATION: UNALIGNED INITIATE'
                  )}
                </span>
              </div>
            </div>

            <div className={styles.hudStatsGroup}>
              <div className={styles.hudStatItem}>
                <span className={styles.statLabel}>KARMA BALANCE</span>
                <div className={styles.statScore}>
                  <span className={styles.scoreNumber}>{currentTotal}</span>
                  <span className={styles.scoreUnit}>KP</span>
                </div>
              </div>

              <div className={styles.hudStatItem}>
                <span className={styles.statLabel}>RESONANCE MULTIPLIER</span>
                <div className={styles.statMultiplier}>
                  {selectedHouse ? '1.25x (HOUSE BUFF)' : '1.00x (BASE)'}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar towards Next Tier */}
          <div className={styles.hudProgressBlock}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>
                ASCENSION PROGRESS: {currentTotal} / {currentTier.nextThreshold} KP
              </span>
              <span className={styles.progressPercent}>{Math.round(progressPercent)}%</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{
                  width: `${progressPercent}%`,
                  background: selectedHouse
                    ? `linear-gradient(90deg, ${selectedHouse.color}, #38bdf8)`
                    : 'linear-gradient(90deg, #38bdf8, #a78bfa)',
                }}
              />
            </div>
          </div>
        </div>

        {/* ─── 4 WAYS TO EARN KARMA (INTERACTIVE NODES) ───── */}
        <div className={styles.deedsSection}>
          <div className={styles.deedsHeadingWrap}>
            <h3 className={styles.deedsTitle}>CONSCIOUS DEEDS & TRANSMISSION NODES</h3>
            <p className={styles.deedsSubtitle}>
              Simulate or perform actions below to test how your Karma Points grow within the
              protocol:
            </p>
          </div>

          <div className={styles.deedsGrid}>
            {KARMA_DEEDS.map((deed) => {
              const hasDone = completedDeeds.includes(deed.id);

              return (
                <div
                  key={deed.id}
                  className={`${styles.deedCard} ${hasDone ? styles.deedCardDone : ''}`}
                  style={{ '--deed-color': deed.color } as React.CSSProperties}
                >
                  <div className={styles.deedHeader}>
                    <span className={styles.deedIcon}>{deed.icon}</span>
                    <span className={styles.deedBadge}>{deed.badge}</span>
                  </div>

                  <h4 className={styles.deedTitle}>{deed.title}</h4>
                  <p className={styles.deedDesc}>{deed.description}</p>

                  <div className={styles.deedFooter}>
                    <span className={styles.deedReward}>+{deed.points} KP</span>
                    <button
                      type="button"
                      id={`action-${deed.id}`}
                      className={styles.deedActionBtn}
                      onClick={() => handlePerformDeed(deed)}
                    >
                      {hasDone ? 'ENGAGE AGAIN (+50%)' : 'TRANSMIT DEED'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── KARMA UTILITY & UNLOCKS MATRIX ─────────────── */}
        <div className={styles.utilitySection}>
          <div className={styles.utilityHeader}>
            <span className={styles.utilityEyebrow}>ELEVATION MATRIX</span>
            <h3 className={styles.utilityTitle}>WHAT KARMA POINTS UNLOCK</h3>
          </div>

          <div className={styles.utilityGrid}>
            {UTILITY_CARDS.map((card, i) => (
              <div key={i} className={styles.utilityCard}>
                <div className={styles.utilityIconWrap}>
                  <span className={styles.utilityIcon}>{card.icon}</span>
                  <span className={styles.utilityTierBadge}>{card.tier}</span>
                </div>
                <h4 className={styles.utilityCardTitle}>{card.title}</h4>
                <p className={styles.utilityCardDesc}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── CALL TO ACTION BANNER ──────────────────────── */}
        <div className={styles.ctaBanner}>
          <div className={styles.ctaGlow} />
          <div className={styles.ctaContent}>
            <span className={styles.ctaTag}>INITIATION GATEWAY ACTIVE</span>
            <h3 className={styles.ctaTitle}>READY TO ASCEND THROUGH THE CONSCIOUS METAVERSE?</h3>
            <p className={styles.ctaDesc}>
              {selectedHouse
                ? `You have pledged allegiance to House ${selectedHouse.name}. Carry their torch of ${selectedHouse.traits[0].toLowerCase()} into the cosmos.`
                : 'Select your House in the Enter Zuraverse section above to claim your citizen passport and lock in bonus karma.'}
            </p>
            <div className={styles.ctaButtons}>
              <a href="#enter-zuraverse" className={styles.ctaPrimaryBtn}>
                {selectedHouse ? 'REVIEW HOUSE SELECTION' : 'CHOOSE YOUR HOUSE'}
              </a>
              <a href="/bze" className={styles.ctaSecondaryBtn}>
                EXPLORE BZE ARCHIVES ➔
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
