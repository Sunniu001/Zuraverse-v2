'use client';

import React, { useRef } from 'react';
import { HOUSES, ZuraHouse } from '@/data/houses';
import styles from './EnterZuraverseSection.module.css';

interface EnterZuraverseSectionProps {
  selectedHouseId: string | null;
  onSelectHouse: (house: ZuraHouse) => void;
}

function HouseCard({
  house,
  isSelected,
  onSelect,
}: {
  house: ZuraHouse;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const shiftX = (x / (rect.width / 2)) * -10;
    const shiftY = (y / (rect.height / 2)) * -10;

    cardRef.current.style.setProperty('--px', `${shiftX}px`);
    cardRef.current.style.setProperty('--py', `${shiftY}px`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--px', `0px`);
    cardRef.current.style.setProperty('--py', `0px`);
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.houseCard} ${isSelected ? styles.houseCardSelected : ''}`}
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      id={`house-card-${house.id}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      style={
        {
          '--house-color': house.color,
          '--house-rgb': house.colorRgb,
        } as React.CSSProperties
      }
    >
      {/* Glow Backplate */}
      <div className={styles.cardGlow} />
      <div className={styles.cardScanlines} />

      {/* Selected Ribbon */}
      {isSelected && (
        <div className={styles.selectedRibbon}>
          <span className={styles.ribbonDot}>●</span> PLEDGED
        </div>
      )}

      {/* Image Container with Parallax Effect */}
      <div className={styles.houseImageWrap}>
        <div className={styles.houseImageClip}>
          <img
            src={house.image}
            alt={`House of ${house.name}`}
            className={styles.houseImage}
            loading="lazy"
          />
          <div className={styles.houseImageGlow} />
        </div>
        <div className={styles.houseSymbolBadge}>{house.symbol}</div>
      </div>

      {/* House Information Body */}
      <div className={styles.houseCardBody}>
        <div className={styles.housePeace}>☮</div>
        <h3 className={styles.houseName}>{house.name}</h3>
        <span className={styles.houseTitle}>{house.title.toUpperCase()}</span>
        <p className={styles.houseDesc}>{house.description}</p>

        {/* Traits Pills */}
        <div className={styles.traitsList}>
          {house.traits.map((trait, i) => (
            <span key={i} className={styles.traitPill}>
              {trait}
            </span>
          ))}
        </div>

        {/* Karma Perk */}
        <div className={styles.perkContainer}>
          <span className={styles.perkIcon}>⚡</span>
          <span className={styles.perkText}>{house.karmaPerk}</span>
        </div>

        {/* Choose Button / Selection Status */}
        <button
          type="button"
          className={`${styles.selectBtn} ${isSelected ? styles.selectBtnActive : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          aria-pressed={isSelected}
        >
          {isSelected ? (
            <>
              <span className={styles.btnCheck}>✓</span> HOUSE ALIGNED
            </>
          ) : (
            <>PLEDGE ALLEGIANCE</>
          )}
        </button>
      </div>
    </div>
  );
}

export default function EnterZuraverseSection({
  selectedHouseId,
  onSelectHouse,
}: EnterZuraverseSectionProps) {
  const selectedHouse = HOUSES.find((h) => h.id === selectedHouseId) || null;

  const scrollToKarma = () => {
    const el = document.getElementById('karma-points');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.section} id="enter-zuraverse">
      {/* Ambient Visual Backdrops & HUD Corners */}
      <div className={styles.gridOverlay} aria-hidden="true" />
      <div className={styles.ambientBlobLeft} aria-hidden="true" />
      <div className={styles.ambientBlobRight} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.topLeft}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.topRight}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.bottomLeft}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.bottomRight}`} aria-hidden="true" />

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span className={styles.eyebrowBadge}>INITIATION PROTOCOL</span>
            <span className={styles.eyebrowLine} />
          </div>

          <h2 className={styles.title}>
            ENTER <span className={styles.titleGradient}>ZURAVERSE</span>
          </h2>

          <p className={styles.subtitle}>
            Before you step into the metaverse, you must choose your path. Align with one of the
            Five Great Houses of Zura — each carrying an ancient cosmic philosophy, unique talents,
            and an amplified resonance in the Karma ecosystem.
          </p>

          <div className={styles.calloutPill}>
            <span className={styles.calloutDot}>●</span>
            <span>CHOOSE YOUR ZURA HOUSE TO UNLOCK CITIZEN STATUS & EARN +250 INITIAL KARMA</span>
          </div>
        </div>

        {/* Five Houses Selection Grid */}
        <div className={styles.housesGrid}>
          {HOUSES.map((house) => (
            <HouseCard
              key={house.id}
              house={house}
              isSelected={selectedHouseId === house.id}
              onSelect={() => onSelectHouse(house)}
            />
          ))}
        </div>

        {/* Dynamic Initiation Terminal / Confirmation HUD */}
        {selectedHouse ? (
          <div
            className={styles.initiationTerminal}
            style={
              {
                '--active-color': selectedHouse.color,
                '--active-rgb': selectedHouse.colorRgb,
              } as React.CSSProperties
            }
          >
            <div className={styles.terminalTopBar}>
              <div className={styles.terminalStatus}>
                <span className={styles.statusPulse} />
                <span>NEURAL SYMMETRY: SYNCHRONIZED</span>
              </div>
              <span className={styles.terminalId}>
                PASSPORT // HOUSE_{selectedHouse.name.toUpperCase()}
              </span>
            </div>

            <div className={styles.terminalContent}>
              <div className={styles.terminalLeft}>
                <div className={styles.avatarCrest}>
                  <img
                    src={selectedHouse.image}
                    alt={selectedHouse.name}
                    className={styles.crestImg}
                  />
                  <div className={styles.crestSymbol}>{selectedHouse.symbol}</div>
                </div>

                <div className={styles.affiliationInfo}>
                  <span className={styles.swornEyebrow}>CITIZENSHIP PLEDGED</span>
                  <h3 className={styles.swornHouseTitle}>
                    HOUSE {selectedHouse.name}
                    <span className={styles.swornSubtitle}> // {selectedHouse.title}</span>
                  </h3>
                  <p className={styles.swornPhilosophy}>"{selectedHouse.philosophy}"</p>
                </div>
              </div>

              <div className={styles.terminalRight}>
                <div className={styles.rewardCard}>
                  <div className={styles.rewardBadge}>
                    <span className={styles.rewardIcon}>✦</span>
                    <span className={styles.rewardLabel}>INITIATION BONUS</span>
                  </div>
                  <div className={styles.rewardValue}>+250 KP</div>
                  <span className={styles.rewardDesc}>Credited to your Karma Protocol balance</span>
                </div>

                <button
                  type="button"
                  id="proceed-to-karma-btn"
                  className={styles.proceedBtn}
                  onClick={scrollToKarma}
                >
                  INITIALIZE KARMA PROTOCOL <span className={styles.arrowIcon}>➔</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.promptBanner}>
            <span className={styles.promptIcon}>✧</span>
            <span>Select one of the 5 houses above to calibrate your citizenship & initiate Karma Points</span>
          </div>
        )}
      </div>
    </section>
  );
}
