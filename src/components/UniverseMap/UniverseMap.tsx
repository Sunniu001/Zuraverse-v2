'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import styles from './UniverseMap.module.css';

export default function UniverseMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Top Label Refs
  const l0tRef = useRef<HTMLDivElement>(null);
  const l1tRef = useRef<HTMLDivElement>(null);
  const l2tRef = useRef<HTMLDivElement>(null);
  const l3tRef = useRef<HTMLDivElement>(null);
  const l4tRef = useRef<HTMLDivElement>(null);

  // Bottom Label Refs
  const l0bRef = useRef<HTMLDivElement>(null);
  const l1bRef = useRef<HTMLDivElement>(null);
  const l2bRef = useRef<HTMLDivElement>(null);
  const l3bRef = useRef<HTMLDivElement>(null);
  const l4bRef = useRef<HTMLDivElement>(null);

  // Corridor Label Refs
  const lc0Ref = useRef<HTMLDivElement>(null);
  const lc1Ref = useRef<HTMLDivElement>(null);
  const lc2Ref = useRef<HTMLDivElement>(null);
  const lcWormholeLeftRef = useRef<HTMLDivElement>(null);

  // Locked Corridors Refs
  const lockedRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Active Focus Target and Camera Position Refs for Three.js animations
  const focusTargetRef = useRef<THREE.Vector3 | null>(null);
  const focusCamPosRef = useRef<THREE.Vector3 | null>(null);

  // Selected locked corridor state
  const [selectedCorridor, setSelectedCorridor] = React.useState<any>(null);

  // Locked Corridors Data
  const LOCKED_CORRIDORS_DATA = [
      {
          id: 0,
          name: 'COSMIC SURFER #1842',
          sub: 'CHANNEL ENCRYPTED',
          start: new THREE.Vector3(-30, 8, -12),
          end: new THREE.Vector3(-12, 10, -6),
          details: {
              type: 'Gravitational Shear Rift',
              instability: '94.2%',
              epoch: '3042 CE',
              coordinates: 'α: -30.0 / β: 8.0 / γ: -12.0',
              payload: 'Quantum Memory Fragment [Corrupted]',
              description: 'A violent tear in the local space-time fabric emitting high-frequency chronal radiation. Decryption protocols required to establish safe transit.'
          }
      },
      {
          id: 1,
          name: 'HACK RUN #1243',
          sub: 'FIREWALL RESTRICTION',
          start: new THREE.Vector3(-22, -12, 6),
          end: new THREE.Vector3(-2, -9, 8),
          details: {
              type: 'Chronos Firewall Anomaly',
              instability: '88.7%',
              epoch: '2158 CE',
              coordinates: 'α: -22.0 / β: -12.0 / γ: 6.0',
              payload: 'Encrypted Sentinel Core Logs',
              description: 'Artificial quantum barrier erected during the Great Uplink War. The gateway remains locked by obsolete but active security scripts.'
          }
      },
      {
          id: 2,
          name: 'HACK RUN #4342',
          sub: 'CORRIDOR ISOLATED',
          start: new THREE.Vector3(4, 11, -8),
          end: new THREE.Vector3(24, 8, -10),
          details: {
              type: 'Sub-space Vector Collapse',
              instability: '99.1%',
              epoch: '4201 CE',
              coordinates: 'α: 4.0 / β: 11.0 / γ: -8.0',
              payload: 'Anomaly Telemetry Matrix',
              description: 'A completely isolated corridor showing signs of matter-antimatter inversion. Safe traversal window currently zero.'
          }
      },
      {
          id: 3,
          name: 'COSMIC SURFER #8854',
          sub: 'DECRYPTION FAILURE',
          start: new THREE.Vector3(12, -10, 8),
          end: new THREE.Vector3(30, -7, 6),
          details: {
              type: 'Tachyon Drift Wavefront',
              instability: '76.4%',
              epoch: '1987 CE (Historical)',
              coordinates: 'α: 12.0 / β: -10.0 / γ: 8.0',
              payload: 'Supernova Echo Signature',
              description: 'A tachyon-rich feedback loop originating from a historical supernova event. Highly unstable temporal resonance makes entry lethal without containment field.'
          }
      }
  ];

  const handleCorridorClick = (data: any) => {
    setSelectedCorridor(data);
    const midPoint = new THREE.Vector3().addVectors(data.start, data.end).multiplyScalar(0.5);
    focusTargetRef.current = midPoint;
    focusCamPosRef.current = new THREE.Vector3(midPoint.x, midPoint.y + 1.0, 16.0);
  };

  const handleActiveCorridorClick = (name: string, sub: string, xPos: number, details: any) => {
    setSelectedCorridor({
      name,
      sub,
      details,
      isActiveCorridor: true
    });
    const midPoint = new THREE.Vector3(xPos, 0, 0);
    focusTargetRef.current = midPoint;
    focusCamPosRef.current = new THREE.Vector3(xPos, 1.0, 16.0);
  };

  const handleCloseDetail = () => {
    setSelectedCorridor(null);
    focusTargetRef.current = null;
    focusCamPosRef.current = null;
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Sequence mapping
    const NODES_DATA = [
        { id: 0, x: -36, y: 0, z: 0 }, // Dzo'nari System
        { id: 1, x: -18, y: 0, z: 0 }, // Suun-Khyrr
        { id: 2, x: 0,   y: 0, z: 0 }, // Voyager Discovery Node
        { id: 3, x: 18,  y: 0, z: 0 }, // Titania Base
        { id: 4, x: 36,  y: 0, z: 0 }  // Earth
    ];

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x010409, 0.015);

    // Initial width/height will be updated by ResizeObserver
    let width = container.clientWidth || 1;
    let height = container.clientHeight || 1;

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
    
    // Horizontal framing layout replication
    const defaultCamPos = new THREE.Vector3(0, 0, 35.0);
    const defaultCamTarget = new THREE.Vector3(0, -0.5, 0);
    camera.position.copy(defaultCamPos);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 120;
    controls.minDistance = 10;
    controls.enableZoom = false;
    controls.target.copy(defaultCamTarget);

    // Ambient global illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Subtle spotlight to illuminate planet surfaces
    const spotLight = new THREE.PointLight(0xffffff, 2.5, 200);
    spotLight.position.set(0, 20, 40);
    scene.add(spotLight);

    // Headlight directional light to perfectly illuminate the front faces
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(0, 10, 50);
    scene.add(dirLight);

    // Generates planet noise maps dynamically in memory
    function createNoiseTexture(baseColor: string, detailColor: string, isMoon = false) {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if(!ctx) return new THREE.CanvasTexture(canvas);
        
        // Base fill
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, 1024, 512);

        // Add soft lighting gradient to the flat texture itself to give spherical 3D volumetric warmth
        const ambientGrad = ctx.createLinearGradient(0, 0, 1024, 0);
        ambientGrad.addColorStop(0, 'rgba(0,0,0,0.4)');
        ambientGrad.addColorStop(0.5, 'rgba(255,255,255,0.05)');
        ambientGrad.addColorStop(1, 'rgba(0,0,0,0.6)');
        ctx.fillStyle = ambientGrad;
        ctx.fillRect(0, 0, 1024, 512);

        if (isMoon) {
            // Suun-Khyrr (Moon Corridor World)
            // 1. Draw organic planetary surface dust (lunar maria)
            ctx.fillStyle = detailColor;
            for (let i = 0; i < 2000; i++) {
                const x = Math.random() * 1024;
                const y = Math.random() * 512;
                const r = Math.random() * 4 + 0.5;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }

            // 2. High-fidelity craters with directional shadows for realistic 3D depth
            for (let j = 0; j < 45; j++) {
                const cx = Math.random() * 1024;
                const cy = Math.random() * 512;
                const cr = Math.random() * 25 + 5;
                
                // Shadow rim (dark)
                ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
                ctx.beginPath();
                ctx.arc(cx - 2, cy - 2, cr, 0, Math.PI * 2);
                ctx.fill();

                // Highlight rim (light)
                ctx.fillStyle = 'rgba(226, 232, 240, 0.25)';
                ctx.beginPath();
                ctx.arc(cx + 2, cy + 2, cr, 0, Math.PI * 2);
                ctx.fill();

                // Crater basin (dark slate)
                ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
                ctx.beginPath();
                ctx.arc(cx, cy, cr * 0.85, 0, Math.PI * 2);
                ctx.fill();

                // Subtle inner ray system for crater impacts
                ctx.strokeStyle = 'rgba(226, 232, 240, 0.08)';
                ctx.lineWidth = 1;
                for (let ray = 0; ray < 8; ray++) {
                    const angle = (ray / 8) * Math.PI * 2;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(cx + Math.cos(angle) * cr * 2, cy + Math.sin(angle) * cr * 2);
                    ctx.stroke();
                }
            }

            // 3. Holographic/Cybernetic neon rilles running across the moon's surface
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)'; // Neon cyan glow
            ctx.shadowColor = 'rgba(34, 211, 238, 0.8)';
            ctx.shadowBlur = 4;
            ctx.lineWidth = 1.5;
            for (let k = 0; k < 6; k++) {
                let sx = Math.random() * 1024;
                let sy = Math.random() * 512;
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                for (let step = 0; step < 6; step++) {
                    sx += (Math.random() - 0.5) * 80;
                    sy += (Math.random() - 0.5) * 50;
                    ctx.lineTo(sx, sy);
                }
                ctx.stroke();
            }
            ctx.shadowBlur = 0; // reset
        } else {
            // Titania Base (Uranus Gas Giant)
            // 1. Sleek horizontal flowing gas bands with atmospheric wave distortion
            for (let y = 0; y < 512; y += 2) {
                const t = y / 512;
                const waveOffset = Math.sin(t * Math.PI * 6) * 20;
                
                // Dynamic colors matching cyan/deep teal
                ctx.fillStyle = y % 6 === 0 
                    ? 'rgba(34, 211, 238, 0.12)' 
                    : y % 15 === 0 
                        ? 'rgba(8, 145, 178, 0.18)' 
                        : 'rgba(14, 116, 144, 0.05)';

                ctx.beginPath();
                ctx.moveTo(0, y + waveOffset);
                for (let x = 0; x <= 1024; x += 32) {
                    const wave = Math.sin(x * 0.01 + t * 4) * 6;
                    ctx.lineTo(x, y + waveOffset + wave);
                }
                ctx.lineTo(1024, 512);
                ctx.lineTo(0, 512);
                ctx.fill();
            }

            // 2. Swirling storms (cyclones) using soft radial spot blends
            for (let s = 0; s < 6; s++) {
                const sx = Math.random() * 1024;
                const sy = Math.random() * 512;
                const sr = Math.random() * 45 + 15;
                const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
                grad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
                grad.addColorStop(0.5, 'rgba(34, 211, 238, 0.12)');
                grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.ellipse(sx, sy, sr * 1.6, sr * 0.6, Math.PI / 12, 0, Math.PI * 2);
                ctx.fill();
            }

            // 3. Layered fine atmospheric particle noise
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            for (let i = 0; i < 800; i++) {
                const x = Math.random() * 1024;
                const y = Math.random() * 512;
                ctx.fillRect(x, y, 1.5, 1.5);
            }
        }

        return new THREE.CanvasTexture(canvas);
    }

    function createEarthTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if(!ctx) return new THREE.CanvasTexture(canvas);
        
        // Scale down all drawing coordinates by 0.5 dynamically to use 1024x512 resolution safely
        ctx.scale(0.5, 0.5);

        // Deep blue oceans with visual depth radial gradient
        const oceanGrad = ctx.createRadialGradient(1024, 512, 100, 1024, 512, 900);
        oceanGrad.addColorStop(0, '#0a1d37');
        oceanGrad.addColorStop(1, '#020617');
        ctx.fillStyle = oceanGrad;
        ctx.fillRect(0, 0, 2048, 1024);

        // Draw detailed high-fidelity landmasses using premium green-teal linear gradients
        function drawContinent(points: {x: number, y: number}[]) {
            if(!ctx) return;
            ctx.beginPath();
            
            // Draw path with gentle micro-jitter for organic shorelines
            points.forEach((pt, idx) => {
                let jitterX = (Math.random() - 0.5) * 5;
                let jitterY = (Math.random() - 0.5) * 5;
                let cx = pt.x + jitterX;
                let cy = pt.y + jitterY;
                if (idx === 0) ctx.moveTo(cx, cy);
                else ctx.lineTo(cx, cy);
            });
            ctx.closePath();
            
            // Premium linear gradient for realistic surface terrain depth
            const landGrad = ctx.createLinearGradient(points[0].x, 0, points[2]?.x || points[0].x + 300, 1024);
            landGrad.addColorStop(0, '#10b981'); // emerald green
            landGrad.addColorStop(0.4, '#059669'); // forest green
            landGrad.addColorStop(0.8, '#047857'); // dark pine
            landGrad.addColorStop(1, '#064e3b'); // deep shadow green
            
            ctx.fillStyle = landGrad;
            ctx.fill();

            // Glowing coastlines
            ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)';
            ctx.lineWidth = 2.5;
            ctx.stroke();
        }

        // Exact scaled polygons for Earth's landmasses on 2048x1024 canvas space (scaled by 0.5)
        // North America
        drawContinent([
            { x: 100, y: 150 }, { x: 300, y: 120 }, { x: 500, y: 100 }, { x: 750, y: 120 }, 
            { x: 800, y: 220 }, { x: 700, y: 380 }, { x: 580, y: 460 }, { x: 520, y: 480 }, 
            { x: 480, y: 450 }, { x: 450, y: 380 }, { x: 380, y: 350 }, { x: 250, y: 320 }
        ]);

        // South America
        drawContinent([
            { x: 560, y: 490 }, { x: 680, y: 520 }, { x: 780, y: 580 }, { x: 740, y: 720 }, 
            { x: 680, y: 880 }, { x: 600, y: 950 }, { x: 570, y: 920 }, { x: 550, y: 700 },
            { x: 510, y: 550 }
        ]);

        // Africa
        drawContinent([
            { x: 920, y: 460 }, { x: 1100, y: 450 }, { x: 1200, y: 520 }, { x: 1250, y: 640 }, 
            { x: 1280, y: 720 }, { x: 1220, y: 820 }, { x: 1180, y: 850 }, { x: 1120, y: 820 }, 
            { x: 1060, y: 660 }, { x: 960, y: 580 }, { x: 900, y: 540 }
        ]);

        // Eurasia
        drawContinent([
            { x: 900, y: 120 }, { x: 1150, y: 80 }, { x: 1400, y: 60 }, { x: 1850, y: 100 }, 
            { x: 1950, y: 150 }, { x: 1920, y: 380 }, { x: 1800, y: 460 }, { x: 1650, y: 580 }, 
            { x: 1520, y: 520 }, { x: 1420, y: 440 }, { x: 1300, y: 480 }, { x: 1100, y: 420 }, 
            { x: 980, y: 320 }
        ]);

        // Australia
        drawContinent([
            { x: 1620, y: 660 }, { x: 1820, y: 680 }, { x: 1860, y: 780 }, { x: 1780, y: 860 }, 
            { x: 1650, y: 840 }, { x: 1580, y: 740 }
        ]);

        // 3. High-Tech Cybernetic Overlays directly on Earth texture
        // Fine Lat/Lon grid lines
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 1;
        for (let lat = 100; lat < 1024; lat += 100) {
            ctx.beginPath();
            ctx.moveTo(0, lat);
            ctx.lineTo(2048, lat);
            ctx.stroke();
        }
        for (let lon = 200; lon < 2048; lon += 200) {
            ctx.beginPath();
            ctx.moveTo(lon, 0);
            ctx.lineTo(lon, 1024);
            ctx.stroke();
        }

        // Glowing tactical markers & coordinate text readouts
        ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
        ctx.font = 'bold 20px monospace';
        const markers = [
            { x: 420, y: 280, label: 'LOC: 37.77 / SF_HQ' },
            { x: 1020, y: 220, label: 'LOC: 51.50 / LON_HUB' },
            { x: 1720, y: 750, label: 'LOC: -33.86 / SYD_NODE' }
        ];

        markers.forEach(mk => {
            // Solid telemetry point
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(mk.x, mk.y, 6, 0, Math.PI * 2);
            ctx.fill();

            // Outer radar pulse
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(mk.x, mk.y, 16, 0, Math.PI * 2);
            ctx.stroke();

            // Telemetry Text
            ctx.fillStyle = 'rgba(226, 232, 240, 0.8)';
            ctx.fillText(mk.label, mk.x + 24, mk.y + 6);
        });

        return new THREE.CanvasTexture(canvas);
    }

    function createCloudTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if(!ctx) return new THREE.CanvasTexture(canvas);
        
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, 1024, 512);

        // Volumetric, fluffy wispy clouds using alpha gradients
        for (let i = 0; i < 45; i++) {
            const cx = Math.random() * 1024;
            const cy = Math.random() * 512;
            const rx = Math.random() * 140 + 40;
            const ry = rx * 0.35;
            const angle = (Math.random() - 0.5) * 0.25;

            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.38)');
            grad.addColorStop(0.5, 'rgba(240, 246, 255, 0.16)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.ellipse(cx, cy, rx, ry, angle, 0, Math.PI * 2);
            ctx.fill();
        }

        return new THREE.CanvasTexture(canvas);
    }



    // Subtle background starfield
    const starCount = 1850;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 200;
        starPositions[i + 1] = (Math.random() - 0.5) * 120;
        starPositions[i + 2] = (Math.random() - 0.5) * 100 - 30;

        starColors[i] = 0.6;
        starColors[i + 1] = 0.85;
        starColors[i + 2] = 1.0;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    
    const starMat = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.5
    });
    const starfield = new THREE.Points(starGeo, starMat);
    scene.add(starfield);

    const dzoGroup = new THREE.Group();
    dzoGroup.position.set(NODES_DATA[0].x, NODES_DATA[0].y, NODES_DATA[0].z);

    // Twin Sun A: Warm golden yellow sun
    const starAGeo = new THREE.SphereGeometry(2.0, 32, 32);
    const starAMat = new THREE.MeshBasicMaterial({ color: 0xffea9f });
    const starA = new THREE.Mesh(starAGeo, starAMat);
    dzoGroup.add(starA);

    const glowAGeo = new THREE.SphereGeometry(2.1, 16, 16);
    const glowAMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true, transparent: true, opacity: 0.2 });
    const glowA = new THREE.Mesh(glowAGeo, glowAMat);
    starA.add(glowA);

    // Twin Sun B: Blazing hot orange-red sun
    const starBGeo = new THREE.SphereGeometry(1.8, 32, 32);
    const starBMat = new THREE.MeshBasicMaterial({ color: 0xff6b6b });
    const starB = new THREE.Mesh(starBGeo, starBMat);
    dzoGroup.add(starB);

    const glowBGeo = new THREE.SphereGeometry(1.9, 16, 16);
    const glowBMat = new THREE.MeshBasicMaterial({ color: 0xe11d48, wireframe: true, transparent: true, opacity: 0.2 });
    const glowB = new THREE.Mesh(glowBGeo, glowBMat);
    starB.add(glowB);

    // Shared orbit path ring
    const orbitRingGeo = new THREE.TorusGeometry(3.8, 0.03, 8, 80);
    const orbitRingMat = new THREE.MeshBasicMaterial({ color: 0xd97706, transparent: true, opacity: 0.25 });
    const sharedOrbit = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    sharedOrbit.rotation.x = Math.PI / 2;
    dzoGroup.add(sharedOrbit);

    scene.add(dzoGroup);

    const suunGroup = new THREE.Group();
    suunGroup.position.set(NODES_DATA[1].x, NODES_DATA[1].y, NODES_DATA[1].z);

    // Parent Planet: Dzo'nari (large blue-purple planet)
    const planetGeo = new THREE.SphereGeometry(2.2, 32, 32);
    const planetMat = new THREE.MeshStandardMaterial({
        map: createNoiseTexture('#1d4ed8', '#8b5cf6', false),
        roughness: 0.8,
        metalness: 0.1
    });
    const dzoNariPlanet = new THREE.Mesh(planetGeo, planetMat);
    suunGroup.add(dzoNariPlanet);

    // Orbiting Moon: Suun-Khyrr (cratered rocky moon)
    const moonGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({
        map: createNoiseTexture('#475569', '#1e293b', true),
        roughness: 0.9,
        metalness: 0.1
    });
    const suunKhyrrMoon = new THREE.Mesh(moonGeo, moonMat);
    suunKhyrrMoon.position.x = 4.5;
    suunGroup.add(suunKhyrrMoon);

    // Moon Orbit path ring
    const moonOrbitGeo = new THREE.TorusGeometry(4.5, 0.02, 8, 80);
    const moonOrbitMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.25 });
    const moonOrbit = new THREE.Mesh(moonOrbitGeo, moonOrbitMat);
    moonOrbit.rotation.x = Math.PI / 2.2;
    suunGroup.add(moonOrbit);

    scene.add(suunGroup);

    const voyagerGroup = new THREE.Group();
    voyagerGroup.position.set(NODES_DATA[2].x, NODES_DATA[2].y, NODES_DATA[2].z);

    const nexusGeo = new THREE.SphereGeometry(1.0, 16, 16);
    const nexusMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const voyagerCore = new THREE.Mesh(nexusGeo, nexusMat);
    voyagerGroup.add(voyagerCore);

    const dodyGeo = new THREE.DodecahedronGeometry(3.2, 1);
    const dodyMat = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.7
    });
    const dodyMesh = new THREE.Mesh(dodyGeo, dodyMat);
    voyagerGroup.add(dodyMesh);

    const outerIcosGeo = new THREE.IcosahedronGeometry(4.0, 0);
    const outerIcosMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        wireframe: true,
        transparent: true,
        opacity: 0.35
    });
    const outerIcosMesh = new THREE.Mesh(outerIcosGeo, outerIcosMat);
    voyagerGroup.add(outerIcosMesh);

    scene.add(voyagerGroup);

    // Helper to generate a beautifully swirling, highly visible volumetric wormhole double-funnel
    function createWormhole(xPos: number) {
        const group = new THREE.Group();
        group.position.set(xPos, 0, 0);

        const ringCount = 7;
        const rings: THREE.Mesh[] = [];

        for (let i = 0; i < ringCount; i++) {
            const t = (i - (ringCount - 1) / 2); // -3, -2, -1, 0, 1, 2, 3
            const dx = t * 0.7; // ring spacing
            const radius = 0.5 + Math.abs(t) * 0.45; // throat is 0.5, mouths are 1.85
            
            // Increased Torus tube thickness to 0.1 for high visibility at distance
            const ringGeo = new THREE.TorusGeometry(radius, 0.1, 8, 48);
            const ringMat = new THREE.MeshBasicMaterial({ 
                color: i % 2 === 0 ? 0xd946ef : 0x8b5cf6, // neon pink & purple
                transparent: true,
                opacity: 0.75 - Math.abs(t) * 0.08,
                blending: THREE.AdditiveBlending
            });
            
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.x = dx;
            ring.rotation.y = Math.PI / 2; // align facing along the X-axis (corridor path)
            
            group.add(ring);
            rings.push(ring);
        }
        scene.add(group);
        return rings;
    }

    // Instantiate two prominent wormholes on either side of Voyager
    const leftWormholeRings = createWormhole(-9);  // Between Dzo'nari (-18) and Voyager (0)
    const rightWormholeRings = createWormhole(9);   // Between Voyager (0) and Uranus (18)

    const titaniaGroup = new THREE.Group();
    titaniaGroup.position.set(NODES_DATA[3].x, NODES_DATA[3].y, NODES_DATA[3].z);

    const gasGeo = new THREE.SphereGeometry(2.6, 32, 32);
    const gasMat = new THREE.MeshStandardMaterial({
        map: createNoiseTexture('#0e7490', '#0891b2', false),
        roughness: 0.5,
        metalness: 0.1
    });
    const titaniaBase = new THREE.Mesh(gasGeo, gasMat);
    titaniaGroup.add(titaniaBase);

    const ringGeo = new THREE.RingGeometry(3.4, 4.8, 64);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.8;
    ring.rotation.y = Math.PI / 8;
    titaniaGroup.add(ring);

    scene.add(titaniaGroup);

    const earthGroup = new THREE.Group();
    earthGroup.position.set(NODES_DATA[4].x, NODES_DATA[4].y, NODES_DATA[4].z);

    const earthCoreGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const earthCoreMat = new THREE.MeshStandardMaterial({
        map: createEarthTexture(),
        roughness: 0.7,
        metalness: 0.1
    });
    const earthMesh = new THREE.Mesh(earthCoreGeo, earthCoreMat);
    earthGroup.add(earthMesh);

    const earthCloudsGeo = new THREE.SphereGeometry(2.55, 32, 32);
    const earthCloudsMat = new THREE.MeshBasicMaterial({
        map: createCloudTexture(),
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    const earthClouds = new THREE.Mesh(earthCloudsGeo, earthCloudsMat);
    earthGroup.add(earthClouds);

    const perimeterTorus = new THREE.TorusGeometry(3.6, 0.02, 4, 64);
    const perimeterMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.5 });
    const perimeterRing = new THREE.Mesh(perimeterTorus, perimeterMat);
    perimeterRing.rotation.x = Math.PI / 2.1;
    earthGroup.add(perimeterRing);

    scene.add(earthGroup);

    const corridorPoints = NODES_DATA.map(node => new THREE.Vector3(node.x, node.y, node.z));
    const lineGeo = new THREE.BufferGeometry().setFromPoints(corridorPoints);
    const lineMat = new THREE.LineBasicMaterial({
        color: 0x10b981,
        linewidth: 2,
        transparent: true,
        opacity: 0.8
    });
    const mainCorridorLine = new THREE.Line(lineGeo, lineMat);
    scene.add(mainCorridorLine);

    // Locked Corridors Lines and Waypoints
    const lockedWaypoints: THREE.Mesh[] = [];
    LOCKED_CORRIDORS_DATA.forEach(data => {
        // Line
        const points = [data.start, data.end];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineDashedMaterial({
            color: 0xef4444, // Soft red/orange
            dashSize: 1.0,
            gapSize: 0.5,
            transparent: true,
            opacity: 0.45
        });
        const line = new THREE.Line(geometry, material);
        line.computeLineDistances();
        scene.add(line);

        // Waypoints
        const waypointGeo = new THREE.OctahedronGeometry(0.35, 1);
        const waypointMat = new THREE.MeshBasicMaterial({
            color: 0xef4444,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });

        const startMesh = new THREE.Mesh(waypointGeo, waypointMat);
        startMesh.position.copy(data.start);
        scene.add(startMesh);
        lockedWaypoints.push(startMesh);

        const endMesh = new THREE.Mesh(waypointGeo, waypointMat);
        endMesh.position.copy(data.end);
        scene.add(endMesh);
        lockedWaypoints.push(endMesh);
    });

    // Grid node connectors
    const crosshairGeo = new THREE.TorusGeometry(0.5, 0.06, 4, 4);
    const crosshairMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.7 });
    
    const indicators = [
        { x: -27, y: 0, z: 0 },
        { x: -9,  y: 0, z: 0 },
        { x: 9,   y: 0, z: 0 },
        { x: 27,  y: 0, z: 0 }
    ];

    indicators.forEach(pt => {
        const crosshair = new THREE.Mesh(crosshairGeo, crosshairMat);
        crosshair.position.set(pt.x, pt.y, pt.z);
        crosshair.rotation.z = Math.PI / 4;
        scene.add(crosshair);
    });

    // Drift flow particle simulator
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particleSpeeds: { t: number, speed: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
        particleSpeeds.push({
            t: Math.random(),
            speed: 0.001 + Math.random() * 0.0015
        });
    }

    const particleMat = new THREE.PointsMaterial({
        color: 0x34d399,
        size: 0.5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const corridorParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(corridorParticles);

    function updateFlowParticles() {
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            particleSpeeds[i].t += particleSpeeds[i].speed;
            if (particleSpeeds[i].t >= 1.0) {
                particleSpeeds[i].t = 0.0;
            }

            const progressX = THREE.MathUtils.lerp(-36, 36, particleSpeeds[i].t);
            positions[i * 3] = progressX;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }

    const tempV = new THREE.Vector3();

    function positionTrackedLabel(element: HTMLElement | null, positionVector: THREE.Vector3, offsetY: number) {
        if (!element) return;

        tempV.copy(positionVector);
        tempV.y += offsetY;
        tempV.project(camera);

        if (tempV.z > 1) {
            element.style.opacity = '0';
            return;
        }

        const x = (tempV.x * .5 + .5) * width;
        const y = (tempV.y * -.5 + .5) * height;

        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.opacity = '1';
    }

    const updateLabels = () => {
        positionTrackedLabel(l0tRef.current, dzoGroup.position, 4.4);
        positionTrackedLabel(l1tRef.current, suunGroup.position, 4.4);
        positionTrackedLabel(l2tRef.current, voyagerGroup.position, 4.4);
        positionTrackedLabel(l3tRef.current, titaniaGroup.position, 4.4);
        positionTrackedLabel(l4tRef.current, earthGroup.position, 4.4);

        positionTrackedLabel(l0bRef.current, dzoGroup.position, -4.4);
        positionTrackedLabel(l1bRef.current, suunGroup.position, -4.4);
        positionTrackedLabel(l2bRef.current, voyagerGroup.position, -4.4);
        positionTrackedLabel(l3bRef.current, titaniaGroup.position, -4.4);
        positionTrackedLabel(l4bRef.current, earthGroup.position, -4.4);

        positionTrackedLabel(lc0Ref.current, new THREE.Vector3(-27, 0, 0), 1.6);
        positionTrackedLabel(lcWormholeLeftRef.current, new THREE.Vector3(-9, 0, 0), 1.6);
        positionTrackedLabel(lc1Ref.current, new THREE.Vector3(9, 0, 0), 1.6);
        positionTrackedLabel(lc2Ref.current, new THREE.Vector3(27, 0, 0), 1.6);

        // Project locked resonance corridors labels
        LOCKED_CORRIDORS_DATA.forEach((data, idx) => {
            const midPoint = new THREE.Vector3().addVectors(data.start, data.end).multiplyScalar(0.5);
            positionTrackedLabel(lockedRefs.current[idx], midPoint, 1.2);
        });
    };

    const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
            width = entry.contentRect.width;
            height = entry.contentRect.height;
            if (width > 0 && height > 0) {
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }
        }
    });
    resizeObserver.observe(container);

    const clock = new THREE.Clock();
    let animId = 0;

    function animate() {
        animId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        starA.rotation.y += 0.002;
        starB.rotation.y += 0.003;
        dzoNariPlanet.rotation.y += 0.003;
        suunKhyrrMoon.rotation.y += 0.005;
        voyagerGroup.rotation.y += 0.004;
        dodyMesh.rotation.x += 0.001;
        titaniaBase.rotation.y += 0.004;
        earthMesh.rotation.y += 0.002;
        earthClouds.rotation.y += 0.003;

        const dzoTime = elapsed * 0.6;
        starA.position.x = Math.cos(dzoTime) * 3.8;
        starA.position.z = Math.sin(dzoTime) * 3.8;
        
        starB.position.x = -Math.cos(dzoTime) * 3.8;
        starB.position.z = -Math.sin(dzoTime) * 3.8;

        // Suun-Khyrr moon orbits Dzo'nari planet
        const moonTime = elapsed * 0.8;
        suunKhyrrMoon.position.x = Math.cos(moonTime) * 4.5;
        suunKhyrrMoon.position.z = Math.sin(moonTime) * 4.5;

        // Swirling holographic left wormhole animation
        leftWormholeRings.forEach((ring, idx) => {
            ring.rotation.z += 0.015 * (idx % 2 === 0 ? 1 : -1);
            const pulse = 1.0 + Math.sin(elapsed * 2.5 + idx) * 0.06;
            ring.scale.set(pulse, pulse, pulse);
        });

        // Swirling holographic right wormhole animation
        rightWormholeRings.forEach((ring, idx) => {
            ring.rotation.z += 0.015 * (idx % 2 === 0 ? 1 : -1);
            const pulse = 1.0 + Math.sin(elapsed * 2.5 + idx) * 0.06;
            ring.scale.set(pulse, pulse, pulse);
        });

        // Animate rotating locked waypoints
        lockedWaypoints.forEach(wp => {
            wp.rotation.x += 0.005;
            wp.rotation.y += 0.005;
        });

        // Interpolate camera zoom/focus transitions smoothly
        const targetFocus = focusTargetRef.current || defaultCamTarget;
        controls.target.lerp(targetFocus, 0.05);

        const camFocus = focusCamPosRef.current || defaultCamPos;
        camera.position.lerp(camFocus, 0.05);

        updateFlowParticles();
        updateLabels();

        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    return () => {
        cancelAnimationFrame(animId);
        resizeObserver.disconnect();
        controls.dispose();
        renderer.dispose();
        try { container.removeChild(renderer.domElement); } catch (e) {}
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      
      {/* Authentic Scanline grid overlay */}
      <div className={styles.scanlines}></div>

      {/* Background Vignette/Nebula bloom */}
      <div className={styles.bgVignette}></div>

      {/* TRACKING HUD LABELS LAYER */}
      <div className={styles.hudContainer}>
        
        {/* NODE 1: ZERARTH SYSTEM */}
        <div ref={l0tRef} className={styles.hudLabel}>
            <h2>ZERARTH SYSTEM</h2>
            <div className={styles.cyanText}>DUAL STAR SYSTEM</div>
            <div className={styles.slateText}>FUTURE ERA</div>
            <div className={styles.cyanText} style={{opacity: 0.7, fontSize: '7px'}}>
                <span style={{color: '#f59e0b', fontSize: '10px', verticalAlign: 'middle', marginRight: '2px'}}>•</span> 12.3 BILLION YEARS
            </div>
        </div>
        <div ref={l0bRef} className={styles.hudLabel}>
            <div className={styles.fuchsiaText}>DRIFT GATEWAY<br/>ORIGIN POINT</div>
        </div>

        {/* NODE 2: DZO'NÄRI */}
        <div ref={l1tRef} className={styles.hudLabel}>
            <h2>DZO'NÄRI</h2>
            <div className={styles.cyanText}>PLANET & ORBITING MOON</div>
            <div className={styles.slateText}>SUUN-KHYRR MOON SYSTEM</div>
        </div>
        <div ref={l1bRef} className={styles.hudLabel}>
            <div className={styles.fuchsiaText}>GATE BETWEEN WORLDS<br/>ONLY THROUGH, NEVER TO</div>
        </div>

        {/* NODE 3: VOYAGER DISCOVERY NODE */}
        <div ref={l2tRef} className={styles.hudLabel}>
            <h2>VOYAGER DISCOVERY NODE</h2>
            <div className={styles.cyanText}>"SILENT DRIFT"</div>
            <div className={styles.slateText}>TEMPORAL INTERSECTION</div>
            <div className={styles.slateText} style={{opacity: 0.7}}>UNKNOWN COORDINATES</div>
        </div>
        <div ref={l2bRef} className={styles.hudLabel}>
            <div className={styles.fuchsiaText}>WHERE THE GOLDEN RECORD<br/>WAS FOUND</div>
        </div>

        {/* NODE 4: URANUS */}
        <div ref={l3tRef} className={styles.hudLabel}>
            <h2>URANUS</h2>
            <div className={styles.cyanText}>URANUS SYSTEM</div>
            <div className={styles.slateText}>CALIBRATION HUB</div>
        </div>
        <div ref={l3bRef} className={styles.hudLabel}>
            <div className={styles.fuchsiaText}>POST-WORMHOLE CALIBRATION<br/>DRIFT PROTOCOL STATION</div>
        </div>

        {/* NODE 5: EARTH */}
        <div ref={l4tRef} className={styles.hudLabel}>
            <h2>EARTH</h2>
            <div className={styles.cyanText}>ORIGIN ERA</div>
            <div className={styles.slateText}>2025 CE</div>
        </div>
        <div ref={l4bRef} className={styles.hudLabel}>
            <div className={styles.fuchsiaText}>ANCESTRAL EPOCH<br/>PRIME DIRECTIVE: OBSERVE</div>
        </div>

        {/* CORRIDOR CONNECTION LABELS */}
        <div 
          ref={lc0Ref} 
          className={`${styles.hudLabel} ${styles.interactiveLabel}`}
          onClick={() => handleActiveCorridorClick(
            'DRIFT ROUTE 17', 
            'DEPT 5BC6?', 
            -27, 
            {
              type: 'Active Resonance Conduit',
              instability: '4.8% (Stable)',
              epoch: 'Current Epoch (2026 CE)',
              coordinates: 'α: -27.0 / β: 0.0 / γ: 0.0',
              payload: 'Standard Data Stream Packets',
              description: 'A secure and fully calibrated drift corridor connecting the Zerarth twin star gateway and the Dzo\'Nari orbital system. Clear passage authorized.'
            }
          )}
        >
            <div className={styles.emeraldText}>DEPT 5BC6?</div>
            <div className={styles.emeraldText} style={{opacity: 0.7, marginTop: '2px'}}>DRIFT ROUTE 17</div>
        </div>
        <div 
          ref={lcWormholeLeftRef} 
          className={`${styles.hudLabel} ${styles.interactiveLabel}`}
          onClick={() => handleActiveCorridorClick(
            'RESONANCE CORRIDOR', 
            'DEPT: AX78?', 
            -9, 
            {
              type: 'Stable Einstein-Rosen Bridge',
              instability: '12.4% (Controlled)',
              epoch: 'Temporal Slip Stream',
              coordinates: 'α: -9.0 / β: 0.0 / γ: 0.0',
              payload: 'Bi-Directional Chronon Feed',
              description: 'A synthetic micro-wormhole calibrated by the Voyager discovery array. Allows safe warp transit across deep interstellar sectors.'
            }
          )}
        >
            <div className={styles.emeraldText}>DEPT: AX78?</div>
            <div className={styles.emeraldText} style={{opacity: 0.7, marginTop: '2px'}}>RESONANCE CORRIDOR</div>
            <div className={styles.fuchsiaText} style={{fontSize: '6.5px', marginTop: '1px', letterSpacing: '0.1em'}}>WORMHOLE DETECTED</div>
        </div>
        <div 
          ref={lc1Ref} 
          className={`${styles.hudLabel} ${styles.interactiveLabel}`}
          onClick={() => handleActiveCorridorClick(
            'RESONANCE CORRIDOR', 
            'DEPT: AQ01?', 
            9, 
            {
              type: 'Active Gravitational Wormhole',
              instability: '14.1% (Controlled)',
              epoch: 'Temporal Slip Stream',
              coordinates: 'α: 9.0 / β: 0.0 / γ: 0.0',
              payload: 'Calibrated Drift Signal Beacons',
              description: 'Wormhole segment linking Voyager Discovery Node and the Uranus Calibration Hub. Maintains spatial coherence through active gravity emitters.'
            }
          )}
        >
            <div className={styles.emeraldText}>DEPT: AQ01?</div>
            <div className={styles.emeraldText} style={{opacity: 0.7, marginTop: '2px'}}>RESONANCE CORRIDOR</div>
            <div className={styles.fuchsiaText} style={{fontSize: '6.5px', marginTop: '1px', letterSpacing: '0.1em'}}>WORMHOLE DETECTED</div>
        </div>
        <div 
          ref={lc2Ref} 
          className={`${styles.hudLabel} ${styles.interactiveLabel}`}
          onClick={() => handleActiveCorridorClick(
            'CORRIDOR STABLE', 
            'CORRIDOR', 
            27, 
            {
              type: 'Standard Vector Path',
              instability: '0.2% (Perfect)',
              epoch: 'Ancestral Epoch (2025 CE)',
              coordinates: 'α: 27.0 / β: 0.0 / γ: 0.0',
              payload: 'Observation Telemetry Log',
              description: 'Safe, low-drift passage corridor leading directly to Ancestral Earth orbit. Strictly monitored under the non-interference directive.'
            }
          )}
        >
            <div className={styles.emeraldText}>CORRIDOR</div>
            <div className={styles.emeraldText} style={{opacity: 0.7, marginTop: '2px'}}>CORRIDOR STABLE</div>
        </div>

        {/* LOCKED RESONANCE CORRIDORS */}
        {LOCKED_CORRIDORS_DATA.map((data, idx) => (
          <div
            key={data.id}
            ref={(el) => { lockedRefs.current[idx] = el; }}
            className={`${styles.hudLabel} ${styles.interactiveLabel} ${styles.hudLabelLocked}`}
            onClick={() => handleCorridorClick(data)}
          >
            <div className={styles.redText}>🔒 {data.name}</div>
            <div className={styles.redSubText}>{data.sub} // STATUS: LOCKED</div>
          </div>
        ))}
      </div>

      {/* DETAILED SPACE TIME EVENT TELEMETRY PANEL */}
      {selectedCorridor && (
        <div className={styles.telemetryPanel}>
          <div className={styles.telemetryHeader}>
            <h3>SECURE ENVELOPE / EVENT DETECTED</h3>
            <button className={styles.closeBtn} onClick={handleCloseDetail}>✕</button>
          </div>
          <div className={styles.telemetryBody}>
            <div className={styles.telemetryRow}>
              <span className={styles.telLabel}>IDENTIFIER:</span>
              <span className={selectedCorridor.isActiveCorridor ? styles.telValGreen : styles.telValRed}>
                {selectedCorridor.name}
              </span>
            </div>
            <div className={styles.telemetryRow}>
              <span className={styles.telLabel}>EVENT CLASSIFICATION:</span>
              <span className={styles.telVal}>{selectedCorridor.details.type}</span>
            </div>
            <div className={styles.telemetryRow}>
              <span className={styles.telLabel}>TEMPORAL INSTABILITY:</span>
              <span className={styles.telValInstability}>{selectedCorridor.details.instability}</span>
            </div>
            <div className={styles.telemetryRow}>
              <span className={styles.telLabel}>EVENT CLOCK / EPOCH:</span>
              <span className={styles.telVal}>{selectedCorridor.details.epoch}</span>
            </div>
            <div className={styles.telemetryRow}>
              <span className={styles.telLabel}>SPATIAL COORDINATES:</span>
              <span className={styles.telValCode}>{selectedCorridor.details.coordinates}</span>
            </div>
            <div className={styles.telemetryDivider}></div>
            <div className={styles.telemetryDescHeader}>DECRYPTION LOG:</div>
            <p className={styles.telemetryDesc}>{selectedCorridor.details.description}</p>
            <div className={styles.telemetryPayload}>
              <div className={styles.payloadTitle}>INTERCEPTED PAYLOAD:</div>
              <div className={styles.payloadContent}>{selectedCorridor.details.payload}</div>
            </div>
            {selectedCorridor.isActiveCorridor ? (
              <div className={styles.activeSuccess}>
                <span>✓ CHRONAL DRIFT PATHWAY IS ACTIVE & STABLE. DIRECTIVE: CLEAR FOR TRANSIT.</span>
              </div>
            ) : (
              <div className={styles.lockWarning}>
                <span>⚠️ CHRONAL DRIFT PATHWAY IS CURRENTLY ENCRYPTED & LOCKED. DIRECTIVE: BYPASS CORRIDOR.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
