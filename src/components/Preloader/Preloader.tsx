'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import styles from './Preloader.module.css';

const BOOT_LINES = [
  { label: 'Neural Link',       value: 'ONLINE',      delay: 400  },
  { label: 'Quantum Drive',     value: 'CALIBRATED',  delay: 900  },
  { label: 'Bridge Systems',    value: 'STANDBY',     delay: 1400 },
  { label: 'Biosync Protocol',  value: 'ACTIVE',      delay: 1900 },
];

interface PreloaderProps {
  onEnter: () => void;
}

// Spline path defining the bent, curved trumpet wormhole corridor
class FunnelSplinePath extends THREE.Curve<THREE.Vector3> {
  getPoint(t: number, optionalTarget = new THREE.Vector3()) {
    const segments = [
      new THREE.Vector3(-14.0, 10.0, 20.0),   // Mouth opening upper-left, close to viewport
      new THREE.Vector3(-7.0, 5.0, -10.0),
      new THREE.Vector3(0.0, 0.0, -35.0),
      new THREE.Vector3(5.5, -4.0, -58.0),   // Deep plunge right side corridor
      new THREE.Vector3(7.0, -5.2, -68.0)    // Ultimate singularity target endpoint
    ];
    const curve = new THREE.CatmullRomCurve3(segments);
    return curve.getPointAt(t, optionalTarget);
  }
}

export default function Preloader({ onEnter }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const enterWrapRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLParagraphElement>(null);
  const statusBlockRef = useRef<HTMLDivElement>(null);
  const versionTagRef = useRef<HTMLSpanElement>(null);
  const ringSystemRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const orbCoreRef = useRef<HTMLDivElement>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [btnVisible, setBtnVisible] = useState(false);
  const [wormholeActive, setWormholeActive] = useState(false);

  // State refs for animation tick (avoids React re-render lags)
  const journeyStateRef = useRef({
    progress: 0,
    active: false,
  });

  // Web Audio refs for the quantum warp drive sound engine
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lowHumRef = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  /* ─── Staggered boot sequence ─────────────────────────────── */
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setVisibleLines(prev => [...prev, i]);
      }, line.delay));
    });

    // Show button after last line
    timers.push(setTimeout(() => setBtnVisible(true), 2600));

    return () => timers.forEach(clearTimeout);
  }, []);

  /* ─── Web Audio API Procedural Synthesizer ───────────────── */
  const initAudioEngine = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioCtxRef.current = audioContext;

      // Master channel
      const masterGainNode = audioContext.createGain();
      masterGainNode.gain.setValueAtTime(0, audioContext.currentTime);
      masterGainRef.current = masterGainNode;

      // Deep space reactor hum
      const lowHumNode = audioContext.createOscillator();
      lowHumNode.type = 'sawtooth';
      lowHumNode.frequency.setValueAtTime(50, audioContext.currentTime);
      lowHumRef.current = lowHumNode;

      const resonanceNode = audioContext.createOscillator();
      resonanceNode.type = 'sine';
      resonanceNode.frequency.setValueAtTime(100, audioContext.currentTime);

      const filterNode = audioContext.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(100, audioContext.currentTime);
      filterNode.Q.setValueAtTime(8.0, audioContext.currentTime);
      filterRef.current = filterNode;

      const modulationLfo = audioContext.createOscillator();
      modulationLfo.type = 'sine';
      modulationLfo.frequency.setValueAtTime(0.1, audioContext.currentTime);

      const lfoGain = audioContext.createGain();
      lfoGain.gain.setValueAtTime(40, audioContext.currentTime);

      // White noise buffer for solar wind sweeping sound
      const bufferSize = audioContext.sampleRate * 2;
      const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoiseNode = audioContext.createBufferSource();
      whiteNoiseNode.buffer = noiseBuffer;
      whiteNoiseNode.loop = true;

      const windFilter = audioContext.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(320, audioContext.currentTime);
      windFilter.Q.setValueAtTime(2.0, audioContext.currentTime);

      const windGain = audioContext.createGain();
      windGain.gain.setValueAtTime(0.015, audioContext.currentTime);

      // Route nodes
      modulationLfo.connect(lfoGain);
      lfoGain.connect(filterNode.frequency);

      lowHumNode.connect(filterNode);
      resonanceNode.connect(filterNode);
      filterNode.connect(masterGainNode);

      whiteNoiseNode.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(masterGainNode);

      masterGainNode.connect(audioContext.destination);

      lowHumNode.start();
      resonanceNode.start();
      modulationLfo.start();
      whiteNoiseNode.start();

      // Fade hum in
      masterGainNode.gain.linearRampToValueAtTime(0.6, audioContext.currentTime + 1.0);
    } catch (e) {
      console.warn("Sonic engine blocked by browser play policy:", e);
    }
  };

  const modulateSynthHum = (progress: number) => {
    const audioContext = audioCtxRef.current;
    const lowHumNode = lowHumRef.current;
    const filterNode = filterRef.current;
    if (!audioContext || !lowHumNode || !filterNode) return;

    // Pitch rises as camera plunges
    const mult = 1 + progress;
    lowHumNode.frequency.setTargetAtTime(50 * mult, audioContext.currentTime, 0.4);
    filterNode.frequency.setTargetAtTime(100 + (progress * 350), audioContext.currentTime, 0.3);
  };

  const triggerWarpSonicSwoosh = () => {
    const audioContext = audioCtxRef.current;
    if (!audioContext) return;
    try {
      const sweepOsc = audioContext.createOscillator();
      const sweepGain = audioContext.createGain();
      
      sweepOsc.type = 'triangle';
      sweepOsc.frequency.setValueAtTime(150, audioContext.currentTime);
      sweepOsc.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.7);
      
      sweepGain.gain.setValueAtTime(0, audioContext.currentTime);
      sweepGain.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.1);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.9);

      sweepOsc.connect(sweepGain);
      sweepGain.connect(audioContext.destination);
      
      sweepOsc.start();
      sweepOsc.stop(audioContext.currentTime + 1.0);
    } catch (e) {}
  };

  /* ─── Three.js 3D WebGL Wormhole Funnel Simulation ───────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;

    // 1. Scene & Render Engine Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.007); // Slightly softer fog density

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: false
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Initial camera observer position looking down the deep 80-unit long curved corridor
    const setupCameraObserverPosition = () => {
      camera.position.set(-5.0, 5.0, 24.0);
      camera.lookAt(1.5, -1.5, -15.0);
    };
    setupCameraObserverPosition();

    // 2. Procedural High-Contrast Grid Texture Builder
    const createProceduralGridTexture = (colorHex: string) => {
      const size = 1024;
      const texCanvas = document.createElement('canvas');
      texCanvas.width = size;
      texCanvas.height = size;
      const ctx = texCanvas.getContext('2d');
      if (!ctx) return null;

      ctx.clearRect(0, 0, size, size); // ensure absolute alpha transparency in the backdrop!

      ctx.strokeStyle = colorHex;
      ctx.lineWidth = 20; // thicker neon beams
      ctx.shadowColor = colorHex;
      ctx.shadowBlur = 24; // beautiful glowing laser beam drop shadow!
      ctx.strokeRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(texCanvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      
      // Anisotropic filtering to keep lines razor-sharp at high depth compression
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.repeat.set(10, 42); // Greatly reduced lines for a clean grid layout!

      return texture;
    };

    // 3. Build Tapered Geometric Funnel Trumpet Mesh
    const curve = new FunnelSplinePath();
    const segmentsX = 64;
    const segmentsY = 160;

    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const points = curve.getPoints(segmentsY);
    const frames = curve.computeFrenetFrames(segmentsY, false);

    for (let i = 0; i <= segmentsY; i++) {
      const t = i / segmentsY;
      const point = points[i];
      const tangent = frames.tangents[i];
      const normal = frames.normals[i];
      const binormal = frames.binormals[i];

      // Flared trumpet radius using exponent 3.2
      const minRadius = 0.30;
      const maxRadius = 14.5;
      const radius = minRadius + (maxRadius - minRadius) * Math.pow(t, 3.2);

      for (let j = 0; j <= segmentsX; j++) {
        const theta = (j / segmentsX) * Math.PI * 2;
        const sin = Math.sin(theta);
        const cos = Math.cos(theta);

        const vx = point.x + radius * (cos * normal.x + sin * binormal.x);
        const vy = point.y + radius * (cos * normal.y + sin * binormal.y);
        const vz = point.z + radius * (cos * normal.z + sin * binormal.z);

        positions.push(vx, vy, vz);
        uvs.push(j / segmentsX, t);
      }
    }

    for (let i = 0; i < segmentsY; i++) {
      for (let j = 0; j < segmentsX; j++) {
        const a = i * (segmentsX + 1) + j;
        const b = i * (segmentsX + 1) + j + 1;
        const c = (i + 1) * (segmentsX + 1) + j;
        const d = (i + 1) * (segmentsX + 1) + j + 1;

        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const gridTexture = createProceduralGridTexture('#00f3ff'); // Futuristic neon cyan glowing grid lines!
    const material = new THREE.MeshBasicMaterial({
      map: gridTexture || undefined,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: true,
      opacity: 1.0
    });

    const wormholeMesh = new THREE.Mesh(geometry, material);
    scene.add(wormholeMesh);

    // Singularity blocker
    const singularityGeom = new THREE.SphereGeometry(0.4, 32, 32);
    const singularityMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const blackHoleMesh = new THREE.Mesh(singularityGeom, singularityMat);
    blackHoleMesh.position.set(7.0, -5.2, -68.0);
    scene.add(blackHoleMesh);

    // 4. Parallax Space Starfield Background — Distributed along the spline path!
    const starCount = 350;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Scatter along the pre-computed segment path to guarantee zero NaN values and perfect coordinate alignment!
      const idx = Math.floor(Math.random() * segmentsY);
      const point = points[idx];
      const normal = frames.normals[idx];
      const binormal = frames.binormals[idx];

      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 75; // wide scatter outside the tube

      starPositions[i * 3]     = point.x + (normal.x * Math.cos(angle) + binormal.x * Math.sin(angle)) * radius;
      starPositions[i * 3 + 1] = point.y + (normal.y * Math.cos(angle) + binormal.y * Math.sin(angle)) * radius;
      starPositions[i * 3 + 2] = point.z + (normal.z * Math.cos(angle) + binormal.z * Math.sin(angle)) * radius;

      // Rich, vibrant sci-fi palette: cyan, violet, rose gold, pure neon white
      const rand = Math.random();
      if (rand < 0.28) {
        // Deep Cyan
        starColors[i * 3]     = 0.0;
        starColors[i * 3 + 1] = 0.95;
        starColors[i * 3 + 2] = 1.0;
      } else if (rand < 0.55) {
        // Cosmic Pink/Violet
        starColors[i * 3]     = 0.93;
        starColors[i * 3 + 1] = 0.35;
        starColors[i * 3 + 2] = 1.0;
      } else if (rand < 0.78) {
        // Soft Golden Amber
        starColors[i * 3]     = 1.0;
        starColors[i * 3 + 1] = 0.85;
        starColors[i * 3 + 2] = 0.45;
      } else {
        // Brilliant White
        starColors[i * 3]     = 1.0;
        starColors[i * 3 + 1] = 1.0;
        starColors[i * 3 + 2] = 1.0;
      }
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    // Glowy round star particle canvas generator
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 32;
    starCanvas.height = 32;
    const starCtx = starCanvas.getContext('2d');
    if (starCtx) {
      const grad = starCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1.0)');
      grad.addColorStop(0.2, 'rgba(255,255,255,0.8)');
      grad.addColorStop(1, 'rgba(255,255,255,0.0)');
      starCtx.fillStyle = grad;
      starCtx.fillRect(0, 0, 32, 32);
    }
    const starTexture = new THREE.CanvasTexture(starCanvas);

    const starMaterial = new THREE.PointsMaterial({
      size: 0.55,
      map: starTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    const starfieldPoints = new THREE.Points(starGeometry, starMaterial);
    scene.add(starfieldPoints);

    // 4b. Distant Gaseous Nebulas & Galaxies along the flight spline!
    const nebulaCount = 4;
    const nebulaGeometry = new THREE.PlaneGeometry(65, 65);
    const nebulaMaterials: THREE.MeshBasicMaterial[] = [];
    const nebulaTextures: THREE.CanvasTexture[] = [];

    const createNebulaTexture = (colorHex: string) => {
      const size = 512;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
      grad.addColorStop(0, colorHex + 'dd'); // high core glow
      grad.addColorStop(0.25, colorHex + '3a'); // soft fadeout radial dust
      grad.addColorStop(0.6, colorHex + '0a'); // extremely soft outer dust
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      return new THREE.CanvasTexture(canvas);
    };

    const nebulaColors = ['#00ffff', '#ff00ff', '#a78bfa', '#00f3ff', '#db2777'];

    for (let i = 0; i < nebulaCount; i++) {
      const color = nebulaColors[i % nebulaColors.length];
      const texture = createNebulaTexture(color);
      if (!texture) continue;
      nebulaTextures.push(texture);

      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      nebulaMaterials.push(mat);

      const nebulaMesh = new THREE.Mesh(nebulaGeometry, mat);

      // Scatter nebulas at various intervals along the pre-computed segment funnel curve
      const progress = 0.15 + (i / nebulaCount) * 0.75;
      const idx = Math.floor(progress * segmentsY);
      const point = points[idx];
      const normal = frames.normals[idx];
      const binormal = frames.binormals[idx];

      const offsetDist = 42 + Math.random() * 15;
      const angle = Math.random() * Math.PI * 2;

      nebulaMesh.position.set(
        point.x + (normal.x * Math.cos(angle) + binormal.x * Math.sin(angle)) * offsetDist,
        point.y + (normal.y * Math.cos(angle) + binormal.y * Math.sin(angle)) * offsetDist,
        point.z + (normal.z * Math.cos(angle) + binormal.z * Math.sin(angle)) * offsetDist
      );

      nebulaMesh.lookAt(point); // look towards core path
      scene.add(nebulaMesh);
    }

    // 5. Simulation core clock and loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const journeyProgress = journeyStateRef.current.progress;

      // Accelerate flowing speed during launch
      const speedFactor = 0.5 + Math.pow(journeyProgress, 2) * 6.5;
      if (gridTexture) {
        // Slide along the length (creating concentric rings shrinking/expanding)
        gridTexture.offset.y -= delta * 0.85 * speedFactor;
        // Swirl around the circumference (turns grid lines into swirling spirals)
        gridTexture.offset.x -= delta * 0.22 * speedFactor;
      }

      // Camera routing: holds observer angle or plunges down path
      if (journeyStateRef.current.active && journeyProgress > 0.22) {
        // Maps the progress from 0.22 - 1.0 into standard [0.9 to 0.0] spline coordinates
        const pathT = 0.9 - ((journeyProgress - 0.22) / 0.78) * 0.9;
        const clampedT = Math.max(0.001, Math.min(0.999, pathT));

        const curvePosition = curve.getPointAt(clampedT);
        const targetLookAt = curve.getPointAt(Math.max(0.0, clampedT - 0.05));

        const cameraLerpSpeed = 0.04 + (journeyProgress * 0.04);
        camera.position.lerp(curvePosition, cameraLerpSpeed);

        const currentTarget = new THREE.Vector3();
        camera.getWorldDirection(currentTarget);
        currentTarget.add(camera.position);
        currentTarget.lerp(targetLookAt, cameraLerpSpeed);
        camera.lookAt(currentTarget);
      } else {
        // Static observer perspective
        setupCameraObserverPosition();
      }

      // Rotate starfield slowly
      starfieldPoints.rotation.y += 0.0002;
      starfieldPoints.rotation.z += 0.00005;

      // Modulate quantum sonic hum
      modulateSynthHum(journeyProgress);

      renderer.render(scene, camera);
    };
    animate();

    // 6. Handle Resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      // Clean up WebGL memories
      geometry.dispose();
      material.dispose();
      if (gridTexture) gridTexture.dispose();
      singularityGeom.dispose();
      singularityMat.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      starTexture.dispose();
      nebulaGeometry.dispose();
      nebulaMaterials.forEach(m => m.dispose());
      nebulaTextures.forEach(t => t.dispose());
      renderer.dispose();

      // Clean up Audio Context completely to remove hum on landing
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  /* ─── Trigger Wormhole Plunge & Sonic Acceleration ──────── */
  const handleEnter = () => {
    // 1. Ignite Procedural Quantum Synthesizer (autoplay unlocked on button interaction!)
    initAudioEngine();

    // Fade the 3D WebGL wormhole canvas in smoothly using GSAP
    setWormholeActive(true);
    if (canvasRef.current) {
      gsap.fromTo(canvasRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 2.0, ease: 'power2.inOut' }
      );
    }

    // 2. Set WebGL flight coordinates active
    journeyStateRef.current.active = true;

    const tl = gsap.timeline();

    // 3. Fade out textual console HUD overlays quickly
    tl.to([
      wordmarkRef.current,
      statusBlockRef.current,
      enterWrapRef.current,
      versionTagRef.current
    ], {
      y: -24,
      opacity: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: 'power3.in',
    });

    // 4. Shrink and accelerate central geometric orb
    tl.to(orbCoreRef.current, {
      scale: 0.1,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.in',
    }, 0.1);

    tl.to(orbRef.current, {
      scale: 0.1,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.in',
    }, 0.1);

    tl.to(ringSystemRef.current, {
      scale: 0.2,
      opacity: 0,
      rotation: '+=360',
      duration: 1.3,
      ease: 'power3.in',
    }, 0.1);

    // 5. Plunge camera down spline neck over exactly 8.5s
    tl.to(journeyStateRef.current, {
      progress: 1.0,
      duration: 8.5,
      ease: 'none', // Linear progression matches delta accumulation
    }, 0.0);

    // 6. Trigger high-velocity sonic swoosh and fade out hum right before exiting
    tl.add(() => {
      triggerWarpSonicSwoosh();

      const audioContext = audioCtxRef.current;
      const masterGainNode = masterGainRef.current;
      if (audioContext && masterGainNode) {
        masterGainNode.gain.setValueAtTime(masterGainNode.gain.value, audioContext.currentTime);
        masterGainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.7);
      }
    }, 7.8);

    // 7. Blinding white mystical lens-flare flash
    tl.to(flashRef.current, {
      opacity: 1,
      duration: 0.7,
      ease: 'power2.inOut',
    }, 7.8); // Activates near end of plunge depth

    // 8. Exit warp gate and swap pages
    tl.add(() => {
      onEnter();
    }, 8.5);
  };

  return (
    <div ref={containerRef} className={styles.preloader}>
      {/* Background scanlines */}
      <div className={styles.scanLine} />

      {/* Fullscreen Three.js WebGL canvas */}
      <canvas 
        ref={canvasRef} 
        className={`${styles.wormholeCanvas} ${wormholeActive ? styles.active : ''}`}
        aria-hidden="true" 
      />

      {/* Blinding warp flash overlay */}
      <div ref={flashRef} className={styles.transitionFlash} aria-hidden="true" />

      <p ref={wordmarkRef} className={styles.wordmark}>Zuraverse — Portal Conduit</p>

      {/* Animated ring system */}
      <div ref={ringSystemRef} className={styles.ringSystem}>
        <div className={styles.ring + ' ' + styles.ring1} />
        <div className={styles.ring + ' ' + styles.ring2} />
        <div className={styles.ring + ' ' + styles.ring3} />
        <div ref={orbRef} className={styles.orb}>
          <div ref={orbCoreRef} className={styles.orbCore} />
        </div>
      </div>

      {/* Boot status lines */}
      <div ref={statusBlockRef} className={styles.statusBlock}>
        {BOOT_LINES.map((line, i) => (
          <div
            key={line.label}
            className={`${styles.statusLine} ${visibleLines.includes(i) ? styles.visible : ''}`}
          >
            <span className={styles.statusLabel}>{line.label}</span>
            <span className={styles.statusDots} />
            <span className={styles.statusValue}>{line.value}</span>
          </div>
        ))}
      </div>

      {/* Enter button */}
      <div
        ref={enterWrapRef}
        className={`${styles.enterWrap} ${btnVisible ? styles.visible : ''}`}
      >
        <button className={styles.enterBtn} onClick={handleEnter}>
          [ Enter Zuraverse ]
        </button>
      </div>

      <span ref={versionTagRef} className={styles.versionTag}>v0.1.0 — ALPHA</span>
    </div>
  );
}
