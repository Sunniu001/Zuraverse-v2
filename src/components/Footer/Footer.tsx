'use client';

import React, { useState } from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer} id="zuraverse-footer">
      {/* Sci-fi Neon Border & Cosmic Backing */}
      <div className={styles.topAccentLine} />
      <div className={styles.gridOverlay} aria-hidden="true" />

      <div className={styles.container}>
        {/* Top Newsletter & Comms Transmission Section */}
        <div className={styles.newsletterRow}>
          <div className={styles.newsletterLeft}>
            <span className={styles.newsletterEyebrow}>TRANSMISSION DISPATCH // 432 Hz</span>
            <h3 className={styles.newsletterTitle}>JOIN THE PSYCHEDELIC FREQUENCY</h3>
            <p className={styles.newsletterDesc}>
              Receive decoded signals, secret lore drops, early festival coordinates, and Genesis NFT
              invitations directly into your neural inbox.
            </p>
          </div>

          <div className={styles.newsletterRight}>
            {subscribed ? (
              <div className={styles.subscribedState}>
                <span className={styles.subscribedIcon}>✓</span>
                <div>
                  <strong>NEURAL LINK ESTABLISHED</strong>
                  <p>Welcome to the transmission grid. Your frequency is now synchronized.</p>
                </div>
              </div>
            ) : (
              <form className={styles.subscribeForm} onSubmit={handleSubscribe}>
                <div className={styles.inputWrapper}>
                  <input
                    type="email"
                    placeholder="ENTER YOUR NEURAL ADDRESS (EMAIL)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={styles.emailInput}
                    aria-label="Email Address for newsletter"
                  />
                  <button type="submit" className={styles.subscribeBtn}>
                    TRANSMIT <span className={styles.btnArrow}>➔</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className={styles.divider} />

        {/* Main Footer Links Columns */}
        <div className={styles.linksGrid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <div className={styles.brandLogo}>
              <span className={styles.logoPeace}>☮</span>
              <span className={styles.logoText}>ZURAVERSE</span>
            </div>
            <p className={styles.brandDesc}>
              The premier transmedia psychedelic web3 metaverse. Bridging ancient mindfulness,
              cosmic consciousness, and high-frequency virtual worlds.
            </p>

            <div className={styles.telemetryMini}>
              <div className={styles.telemetryRow}>
                <span className={styles.telemetryDot} />
                <span className={styles.telemetryText}>SYSTEM STATUS: ONLINE (v2.0)</span>
              </div>
              <div className={styles.telemetryRow}>
                <span className={styles.telemetryDotTeal} />
                <span className={styles.telemetryText}>COSMIC HARMONY: 432 Hz</span>
              </div>
            </div>
          </div>

          {/* Column 1: Chronicles & Eras */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>CHRONICLES & ERAS</h4>
            <ul className={styles.linksList}>
              <li>
                <a href="/bze">BZE: Age of Wandering</a>
              </li>
              <li>
                <a href="/aze">AZE: Age of Rebirth</a>
              </li>
              <li>
                <a href="/#zero-arrival">Zero Arrival & First Contact</a>
              </li>
              <li>
                <a href="/#fleet-hangar">Starship Fleet Hangar</a>
              </li>
              <li>
                <a href="/#nirvana-parallax">Nirvana Zen Sanctuary</a>
              </li>
            </ul>
          </div>

          {/* Column 2: The Five Houses */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>THE FIVE HOUSES</h4>
            <ul className={styles.linksList}>
              <li>
                <a href="/#enter-zuraverse">House Datura // The Philosophers</a>
              </li>
              <li>
                <a href="/#enter-zuraverse">House Iboga // The Dreamers</a>
              </li>
              <li>
                <a href="/#enter-zuraverse">House Peyote // The Optimists</a>
              </li>
              <li>
                <a href="/#enter-zuraverse">House Ayahuasca // The Stewards</a>
              </li>
              <li>
                <a href="/#enter-zuraverse">House Kava // The Adventurers</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Economy & Governance */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>CONSCIOUS ECONOMY</h4>
            <ul className={styles.linksList}>
              <li>
                <a href="/#karma-points">Karma Protocol (KP)</a>
              </li>
              <li>
                <a href="/#enter-zuraverse">Citizen Initiation & Passports</a>
              </li>
              <li>
                <a href="/bze">Biophilic Tree Grant DAO</a>
              </li>
              <li>
                <a href="/#fleet-hangar">Genesis Ship Blueprints</a>
              </li>
              <li>
                <a href="/#cosmic-eras">Transmedia Whitepaper</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Transmission Nodes */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>TRANSMISSION NODES</h4>
            <ul className={styles.linksList}>
              <li>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                  Discord Sanctuary
                </a>
              </li>
              <li>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                  X // Twitter Feed
                </a>
              </li>
              <li>
                <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
                  Telegram Dispatch
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  YouTube Transmissions
                </a>
              </li>
              <li>
                <a href="https://medium.com" target="_blank" rel="noopener noreferrer">
                  Medium Lore Chronicles
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.bottomLeft}>
            <span>© 2026 ZURAVERSE. BEYOND TIME AND SPACE. ALL RIGHTS RESERVED.</span>
            <div className={styles.legalLinks}>
              <a href="#privacy">Privacy Protocol</a>
              <span className={styles.legalSep}>•</span>
              <a href="#terms">Terms of Resonance</a>
              <span className={styles.legalSep}>•</span>
              <a href="#security">Neural Security</a>
            </div>
          </div>

          <button
            type="button"
            className={styles.scrollTopBtn}
            onClick={scrollToTop}
            aria-label="Return to top of page"
          >
            <span>↑ RETURN TO ZENITH</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
