'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import styles from './HeroSection.module.css';
import { useScrambleText } from '@/hooks/useScrambleText';
import { gsap } from 'gsap';

/* ─── Per-layer depth config ─────────────────────────────────── */
const LAYER_DEPTH = [
  { mouseFactor: 0.003, scrollZoom: 0.06  },  // Layer 1 — BG/stars
  { mouseFactor: 0.010, scrollZoom: 0.55  },  // Layer 2 — Spaceship Console
  { mouseFactor: 0.035, scrollZoom: 1.50  },  // Layer 3 — Dreamcatcher (closest, bokeh)
  { mouseFactor: 0.024, scrollZoom: 1.20  },  // Layer 4 — Console foreground
];

const NAV_LINKS = [
  { label: 'Home',     href: '#', active: true  },
  { label: 'Universe', href: '#', active: false },
  { label: 'Lore',     href: '#', active: false },
  { label: 'Enter',    href: '#', active: false },
];

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; radius: number;
  life: number; maxLife: number;
}

export default function HeroSection({ entered = true }: { entered?: boolean }) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const sceneRef      = useRef<HTMLDivElement>(null);
  const layerRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const cursorRef     = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const contentRef    = useRef<HTMLDivElement>(null);
  const holoRef       = useRef<HTMLDivElement>(null);   // magnetic hologram
  const mouseRef      = useRef({ x: 0, y: 0 });
  const targetRef     = useRef({ x: 0, y: 0 });
  const holoTarget    = useRef({ x: 0, y: 0 });        // hologram magnetic target
  const rafRef        = useRef<number>(0);
  const particlesRef  = useRef<Particle[]>([]);
  const scrollRef     = useRef(0);

  const entranceProgressRef = useRef({
    bgScale: 0.9,
    bgOpacity: 0,
    midScale: 1.15,
    midBlur: 0,
    midOpacity: 0,
    foreScale: 1.4,
    foreBlur: 0,
    foreOpacity: 0,
    dashY: 150,
    dashScale: 1.25,
    dashBlur: 0,
    dashOpacity: 0,
    recordY: -350,
    recordScale: 0.3,
    recordOpacity: 0,
    parallaxStrength: 0
  });

  const { scramble } = useScrambleText();

  const [isPlaying, setIsPlaying] = useState(false);
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const [flashActive, setFlashActive] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const ambientPlayerRef = useRef<any>(null);

  useEffect(() => {
    if (!entered) return;

    // Activate the white transition flash overlay initially, then fade it out smoothly!
    setFlashActive(true);
    const timer = setTimeout(() => {
      setFlashActive(false);
    }, 50);

    // Cinematic depth-staggered layered entrance timeline on mount
    const entrance = entranceProgressRef.current;
    const tl = gsap.timeline({
      delay: 0.15 // tiny buffer for the flash overlay to begin its fadeout
    });

    // 1. ENVIRONMENT STAGES (0.0s - 0.45s) — Stars, frame viewport, console deck arrive empty (fully sharp)
    tl.to(entrance, {
      bgScale: 1.0,
      bgOpacity: 1,
      duration: 2.5,
      ease: 'power2.out'
    }, 0.0);

    tl.to(entrance, {
      midScale: 1.0,
      midBlur: 0,
      midOpacity: 1,
      duration: 2.2,
      ease: 'power2.out'
    }, 0.15);

    tl.to(entrance, {
      foreScale: 1.0,
      foreBlur: 0,
      foreOpacity: 1,
      duration: 2.0,
      ease: 'power3.out'
    }, 0.3);

    tl.to(entrance, {
      dashY: 0,
      dashScale: 1.0,
      dashBlur: 0,
      dashOpacity: 1,
      duration: 1.8,
      ease: 'back.out(1.2)' // subtle fluid spring rebound!
    }, 0.45);

    // 2. PRIMARY INTERACTIVE FOCAL OBJECT (0.95s) — Golden Record floats down from above!
    tl.to(entrance, {
      recordY: 0,
      recordScale: 1.0,
      recordOpacity: 1,
      duration: 1.8,
      ease: 'back.out(1.4)' // gorgeous deceleration spring drop!
    }, 0.95);

    // 3. BRAND IDENTITY & HUD DATA (2.8s - 3.0s) — Title, Subtitle, and buttons fade in at last!
    tl.fromTo(`.${styles.headerCopy}`,
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 1.6, ease: 'power3.out' },
      2.8
    );

    tl.fromTo(`.${styles.ctaGroup}`,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' },
      3.0
    );

    // 4. PERIPHERAL CONTROLS (3.2s) — Nav and Signal Tracker fade in to lock layout
    tl.fromTo(`.${styles.nav}, .${styles.ambientHud}, .${styles.scrollIndicator}`,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out', stagger: 0.1 },
      3.2
    );

    // 5. UNLOCK MOUSE PARALLAX (3.8s) — Eases in mouse parallax only after Zuraverse text finishes boots!
    tl.to(entrance, {
      parallaxStrength: 1.0,
      duration: 1.6,
      ease: 'power2.out'
    }, 3.8);

    return () => {
      clearTimeout(timer);
      tl.kill();
    };
  }, [entered]);

  const initYTPlayers = useCallback(() => {
    if (typeof window === 'undefined' || !(window as any).YT || !(window as any).YT.Player) return;
    
    // 1. Initialize Ambient Player
    if (!ambientPlayerRef.current) {
      try {
        ambientPlayerRef.current = new (window as any).YT.Player('ambient-player-element', {
          videoId: 'FxIYRYhGZXo',
          playerVars: {
            autoplay: 1,
            controls: 0,
            loop: 1,
            playlist: 'FxIYRYhGZXo',
            playsinline: 1
          },
          events: {
            onReady: (event: any) => {
              event.target.setVolume(50);
              event.target.playVideo();
            },
            onStateChange: (event: any) => {
              setAmbientPlaying(event.data === 1);
            }
          }
        });
      } catch (e) {
        console.log('Ambient Player init failed:', e);
      }
    }

    // 2. Initialize Voyager Golden Record Player
    if (!ytPlayerRef.current) {
      try {
        ytPlayerRef.current = new (window as any).YT.Player('yt-player-element', {
          videoId: 'ELnn9V01EiI',
          playerVars: {
            autoplay: 0,
            controls: 0,
            loop: 1,
            playlist: 'ELnn9V01EiI',
            playsinline: 1
          },
          events: {
            onReady: (event: any) => {
              event.target.setVolume(100);
            },
            onStateChange: (event: any) => {
              const playing = event.data === 1;
              setIsPlaying(playing);
              
              // Cross-fade volume logic!
              if (playing) {
                if (ambientPlayerRef.current && typeof ambientPlayerRef.current.setVolume === 'function') {
                  ambientPlayerRef.current.setVolume(6); // dim ambient to focus on Voyager!
                }
              } else {
                if (ambientPlayerRef.current && typeof ambientPlayerRef.current.setVolume === 'function') {
                  ambientPlayerRef.current.setVolume(50); // restore ambient
                }
              }
            }
          }
        });
      } catch (e) {
        console.log('Voyager Player init failed:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const prevCallback = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initYTPlayers();
      };

      if ((window as any).YT && (window as any).YT.Player) {
        initYTPlayers();
      }
    }

    // Force play ambient once user interacts (modern browsers block autoplays without click)
    const handleAutoplayForce = () => {
      if (ambientPlayerRef.current && typeof ambientPlayerRef.current.playVideo === 'function') {
        ambientPlayerRef.current.playVideo();
        window.removeEventListener('click', handleAutoplayForce);
      }
    };
    window.addEventListener('click', handleAutoplayForce);

    // Fallback standard audio greeting
    audioRef.current = new Audio('https://upload.wikimedia.org/wikipedia/commons/6/69/Voyager_Golden_Record_greeting_in_English.ogg');
    audioRef.current.loop = true;

    return () => {
      window.removeEventListener('click', handleAutoplayForce);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
        try { ytPlayerRef.current.destroy(); } catch (e) {}
      }
      if (ambientPlayerRef.current && typeof ambientPlayerRef.current.destroy === 'function') {
        try { ambientPlayerRef.current.destroy(); } catch (e) {}
      }
    };
  }, [initYTPlayers]);

  const togglePlayback = () => {
    const player = ytPlayerRef.current;
    if (player && typeof player.getPlayerState === 'function') {
      try {
        const state = player.getPlayerState();
        if (state === 1) {
          player.pauseVideo();
          setIsPlaying(false);
        } else {
          player.playVideo();
          setIsPlaying(true);
        }
        return;
      } catch (e) {
        console.log('YT player toggle failed, trying standard fallback:', e);
      }
    }

    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.log('Audio playback failed:', err));
      setIsPlaying(true);
    }
  };

  const toggleAmbientPlayback = () => {
    const player = ambientPlayerRef.current;
    if (player && typeof player.getPlayerState === 'function') {
      try {
        const state = player.getPlayerState();
        if (state === 1) {
          player.pauseVideo();
          setAmbientPlaying(false);
        } else {
          player.playVideo();
          setAmbientPlaying(true);
        }
      } catch (e) {
        console.log('Ambient toggle failed:', e);
      }
    }
  };

  /* ─── Cursor ──────────────────────────────────────────────── */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
    if (cursorRef.current) {
      cursorRef.current.style.left = `${e.clientX}px`;
      cursorRef.current.style.top  = `${e.clientY}px`;
    }
  }, []);

  const handleScroll = useCallback(() => {
    scrollRef.current = window.scrollY;
  }, []);

  /* ─── Particles ───────────────────────────────────────────── */
  const spawnParticle = useCallback((x: number, y: number) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 1.2 + 0.2;
    particlesRef.current.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      radius: Math.random() * 1.8 + 0.4,
      life: 0,
      maxLife: Math.random() * 70 + 30,
    });
    if (particlesRef.current.length > 100) particlesRef.current.shift();
  }, []);

  /* ─── RAF loop ────────────────────────────────────────────── */
  const animate = useCallback(() => {
    rafRef.current = requestAnimationFrame(animate);
    const scene = sceneRef.current;
    if (!scene) return;

    const { width, height } = scene.getBoundingClientRect();
    const cx = width  / 2;
    const cy = height / 2;

    /* Scroll progress — mapped to the full 250vh (2.5 * vh) sticky scroll depth! */
    const scrollY  = scrollRef.current;
    const vh       = window.innerHeight;
    const progress = Math.min(Math.max(scrollY / (2.5 * vh), 0), 1);
    const eased    = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    /* Scene blur — no uniform scale */
    scene.style.filter = `blur(${eased * 8}px)`;

    const entrance = entranceProgressRef.current;

    /* Content fade + rise */
    if (contentRef.current) {
      contentRef.current.style.opacity   = `${Math.max(1 - eased * 1.5, 0)}`;
      contentRef.current.style.transform = `translateY(${eased * -50}px)`;
    }

    /* Smooth cursor ring */
    targetRef.current.x += (mouseRef.current.x - targetRef.current.x) * 0.1;
    targetRef.current.y += (mouseRef.current.y - targetRef.current.y) * 0.1;
    if (cursorRingRef.current) {
      cursorRingRef.current.style.left = `${targetRef.current.x}px`;
      cursorRingRef.current.style.top  = `${targetRef.current.y}px`;
    }

    /* Per-layer: mouse parallax + independent scroll zoom + cinematic entrance */
    const dx = (mouseRef.current.x - cx) * entrance.parallaxStrength;
    const dy = (mouseRef.current.y - cy) * entrance.parallaxStrength;
    layerRefs.current.forEach((el, i) => {
      if (!el) return;
      const { mouseFactor, scrollZoom } = LAYER_DEPTH[i];
      const zoom = 1 + eased * scrollZoom;

      if (i === 0) {
        // Layer 1 — BG/Stars
        const finalScale = entrance.bgScale * zoom;
        el.style.opacity = `${entrance.bgOpacity}`;
        el.style.transform = `translate3d(${dx * mouseFactor}px, ${dy * mouseFactor}px, 0) scale(${finalScale})`;
      } else if (i === 1) {
        // Layer 2 — Spaceship Console Window Frame
        const finalScale = entrance.midScale * zoom;
        el.style.opacity = `${entrance.midOpacity}`;
        el.style.filter = `blur(${entrance.midBlur}px)`;
        el.style.transform = `translate3d(${dx * mouseFactor}px, ${dy * mouseFactor}px, 0) scale(${finalScale})`;
      } else if (i === 2) {
        // Layer 3 — Dreamcatcher
        const finalScale = entrance.foreScale * zoom;
        el.style.opacity = `${entrance.foreOpacity}`;
        el.style.filter = `blur(${entrance.foreBlur}px)`;
        el.style.transform = `translate3d(${dx * mouseFactor}px, ${dy * mouseFactor}px, 0) scale(${finalScale})`;
      } else if (i === 3) {
        // Layer 4 — Close foreground console panel
        const finalScale = entrance.dashScale * zoom;
        const finalY = dy * mouseFactor + entrance.dashY;
        el.style.opacity = `${entrance.dashOpacity}`;
        el.style.filter = `blur(${entrance.dashBlur}px)`;
        el.style.transform = `translate3d(${dx * mouseFactor}px, ${finalY}px, 0) scale(${finalScale})`;
      }
      
      el.style.transformOrigin = 'center center';
    });

    /* Magnetic hologram — snaps toward cursor + cinematic entrance recordY/Scale */
    if (holoRef.current) {
      const holoRect  = holoRef.current.getBoundingClientRect();
      const holoCx    = holoRect.left + holoRect.width  / 2;
      const holoCy    = holoRect.top  + holoRect.height / 2;
      const distX     = (mouseRef.current.x - holoCx) * entrance.parallaxStrength;
      const distY     = (mouseRef.current.y - holoCy) * entrance.parallaxStrength;
      const maxMag    = 18; // px magnetic pull limit
      const strength  = 0.12;

      holoTarget.current.x += (Math.max(-maxMag, Math.min(maxMag, distX * strength)) - holoTarget.current.x) * 0.08;
      holoTarget.current.y += (Math.max(-maxMag, Math.min(maxMag, distY * strength)) - holoTarget.current.y) * 0.08;

      const finalY = holoTarget.current.y + entrance.recordY;
      holoRef.current.style.transform =
        `translate3d(${holoTarget.current.x}px, ${finalY}px, 0) scale(${entrance.recordScale})`;
      holoRef.current.style.opacity = `${entrance.recordOpacity}`;
    }

    /* Particles */
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width; canvas.height = height;
    }
    ctx.clearRect(0, 0, width, height);

    if (Math.random() < 0.2) spawnParticle(Math.random() * width, Math.random() * height);

    particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife);
    for (const p of particlesRef.current) {
      p.x += p.vx; p.y += p.vy; p.life++;
      p.alpha = 1 - p.life / p.maxLife;
      const isTeal = p.radius > 1.2;
      const color  = isTeal
        ? `rgba(94,234,212,${p.alpha * 0.5})`
        : `rgba(167,139,250,${p.alpha * 0.45})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle   = color;
      ctx.shadowBlur  = 6;
      ctx.shadowColor = color;
      ctx.fill();
    }
  }, [spawnParticle]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll',    handleScroll,    { passive: true });
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll',    handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, handleScroll, animate]);

  return (
    <>
      {/* Entry Transition Flash Overlay */}
      {entered && (
        <div 
          className={`${styles.flashOverlay} ${!flashActive ? styles.flashOverlayHidden : ''}`} 
          style={{ background: '#ffffff' }}
          aria-hidden="true" 
        />
      )}

      <div ref={cursorRef}     className={styles.cursor}     aria-hidden="true" />
      <div ref={cursorRingRef} className={styles.cursorRing} aria-hidden="true" />

      {/* Invisible YouTube Iframe Targets */}
      <div id="yt-player-element" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '1px', height: '1px', zIndex: -999 }} />
      <div id="ambient-player-element" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '1px', height: '1px', zIndex: -999 }} />

      <div ref={containerRef} className={styles.heroContainer}>
        <div ref={sceneRef} className={styles.hero} aria-label="Hero">

          {/* Layer 1 — BG */}
          <div ref={el => { layerRefs.current[0] = el; }}
               className={`${styles.layer} ${styles.layerStars}`} aria-hidden="true" />

          {/* Layer 2 — Console */}
          <div ref={el => { layerRefs.current[1] = el; }}
               className={`${styles.layer} ${styles.layerPlanet}`} aria-hidden="true" />

          {/* Layer 3 — Dreamcatcher */}
          <div ref={el => { layerRefs.current[2] = el; }}
               className={`${styles.layer} ${styles.layerDreamcatcher}`} aria-hidden="true" />

          {/* Layer 4 — Console (foreground) */}
          <div ref={el => { layerRefs.current[3] = el; }}
               className={`${styles.layer} ${styles.layerConsole}`} aria-hidden="true" />

          {/* Overlays */}
          <div className={styles.atmosphereOverlay} aria-hidden="true" />
          <div className={styles.vignette}          aria-hidden="true" />
          <div className={styles.gridOverlay}       aria-hidden="true" />
          <div className={styles.scanlines}         aria-hidden="true" />

          {/* Glow orbs */}
          <div className={`${styles.glowOrb} ${styles.glowOrbPurple}`} aria-hidden="true" />
          <div className={`${styles.glowOrb} ${styles.glowOrbTeal}`}   aria-hidden="true" />

          {/* Particle canvas */}
          <canvas ref={canvasRef} className={styles.particleCanvas} aria-hidden="true" />

          {/* Corners */}
          <div className={`${styles.cornerDecor} ${styles.cornerTopLeft}`}     aria-hidden="true" />
          <div className={`${styles.cornerDecor} ${styles.cornerTopRight}`}    aria-hidden="true" />
          <div className={`${styles.cornerDecor} ${styles.cornerBottomLeft}`}  aria-hidden="true" />
          <div className={`${styles.cornerDecor} ${styles.cornerBottomRight}`} aria-hidden="true" />

          {/* Nav with scramble text */}
          <nav className={styles.nav} aria-label="Main navigation">
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                className={`${styles.navLink} ${link.active ? styles.navLinkActive : ''}`}
                onMouseEnter={e => scramble(e.currentTarget, link.label, 350)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Hero copy — bottom-left anchor like reference */}
          <div ref={contentRef} className={styles.content}>
            <div className={styles.headerCopy}>
              <h1 className={styles.heroTitle}>Zuraverse</h1>
              <p className={styles.heroSubtitle}>A Transmedia Universe of Hippie Aliens</p>
            </div>

            {/* 3D Floating spinning Vinyl Record hologram */}
            <div ref={holoRef} className={styles.holoCenter} aria-hidden="true">
              {/* Holographic light emitter beam */}
              <div className={styles.vinylHoloBeam} />
              
              {/* 3D Perspective Chamber */}
              <div 
                className={`${styles.vinylContainer3D} ${isPlaying ? styles.isPlaying : ''}`}
                onClick={togglePlayback}
                role="button"
                aria-label={isPlaying ? "Pause Golden Record Audio" : "Play Golden Record Audio"}
              >
                {/* Sonic expansion waves */}
                <div className={styles.sonicWave} />
                <div className={styles.sonicWave} style={{ animationDelay: '0.6s' }} />

                <div className={styles.vinylDiskWrapper}>
                  {/* Spinning vinyl record disc */}
                  <div className={styles.vinylDisk}>
                    {/* Front Side: Sounds of Earth */}
                    <div className={`${styles.vinylFace} ${styles.vinylFaceFront}`}>
                      <div className={styles.vinylShineOverlay} />
                    </div>
                    
                    {/* Back Side: Voyager Scientific Diagrams */}
                    <div className={`${styles.vinylFace} ${styles.vinylFaceBack}`}>
                      <div className={styles.vinylShineOverlay} />
                    </div>
                  </div>

                  {/* Play/Pause Hover/Active HUD Overlay */}
                  <div className={styles.playOverlay}>
                    <span className={styles.playIcon}>{isPlaying ? '‖' : '▶'}</span>
                    <span className={styles.playLabel}>{isPlaying ? 'PAUSE' : 'LISTEN'}</span>
                  </div>
                </div>
              </div>
              
              {/* Outer orbital rings (keeps the high-tech sci-fi vibe) */}
              <div className={styles.holoRing1} />
              <div className={styles.holoRing2} />
            </div>

            <div className={styles.ctaGroup}>
              <button
                className={styles.btnPrimary}
                onMouseEnter={e => scramble(e.currentTarget, 'Watch Episode 1', 300)}
              >
                [ Watch Episode 1 ]
              </button>
              <button
                className={styles.btnSecondary}
                onMouseEnter={e => scramble(e.currentTarget, 'Explore Lore', 300)}
              >
                Explore Lore
              </button>
            </div>
          </div>

           {/* Scroll hint */}
          <div className={styles.scrollIndicator} aria-hidden="true">
            <span className={styles.scrollLabel}>Scroll</span>
            <div className={styles.scrollLine} />
          </div>

        </div>
      </div>

      {/* Persistent global audio control rendered outside of the parallax container */}
      {entered && (
        <div className={styles.ambientHudPersistent}>
          <button 
            className={styles.ambientMuteBtn} 
            onClick={toggleAmbientPlayback}
            aria-label={ambientPlaying ? "Mute Ambient Soundtrack" : "Play Ambient Soundtrack"}
          >
            {ambientPlaying ? (
              <div className={styles.audioWaveVisualizer}>
                <span className={styles.visualizerBar} />
                <span className={styles.visualizerBar} style={{ animationDelay: '0.25s' }} />
                <span className={styles.visualizerBar} style={{ animationDelay: '0.5s' }} />
              </div>
            ) : (
              <span className={styles.muteIcon}>▶</span>
            )}
          </button>
          <div className={styles.ambientInfo}>
            <span className={styles.ambientLabel}>AMBIENT SIGNAL</span>
            <span className={`${styles.ambientStatus} ${ambientPlaying ? styles.statusActive : ''}`}>
              {ambientPlaying ? 'ONLINE' : 'MUTED'}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
