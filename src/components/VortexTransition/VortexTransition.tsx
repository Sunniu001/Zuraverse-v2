'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import gsap from 'gsap';
import styles from './VortexTransition.module.css';

type VortexTheme = 'bze' | 'aze';

interface VortexContextType {
  triggerTransition: (url: string, theme: VortexTheme) => void;
  hasEntered: boolean;
  setHasEntered: (val: boolean) => void;
}

const VortexContext = createContext<VortexContextType | undefined>(undefined);

export const useVortex = () => {
  const context = useContext(VortexContext);
  if (!context) {
    throw new Error('useVortex must be used within a VortexProvider');
  }
  return context;
};

// Spline path defining the bent, curved trumpet wormhole corridor (exact same path!)
class FunnelSplinePath extends THREE.Curve<THREE.Vector3> {
  constructor() {
    super();
  }
  
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

export default function VortexProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [theme, setTheme] = useState<VortexTheme>('bze');
  const [hasEntered, setHasEntered] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const journeyProgressRef = useRef(0);

  // Sound Engine
  const triggerWarpSonicSwoosh = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      
      const sweepOsc = audioContext.createOscillator();
      const sweepGain = audioContext.createGain();
      
      sweepOsc.type = 'triangle';
      sweepOsc.frequency.setValueAtTime(150, audioContext.currentTime);
      // Exponential rise over 1.8 seconds!
      sweepOsc.frequency.exponentialRampToValueAtTime(1100, audioContext.currentTime + 1.8);
      
      sweepGain.gain.setValueAtTime(0, audioContext.currentTime);
      sweepGain.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.3);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2.3);

      sweepOsc.connect(sweepGain);
      sweepGain.connect(audioContext.destination);
      
      sweepOsc.start();
      sweepOsc.stop(audioContext.currentTime + 2.5);
    } catch (e) {}
  };

  const triggerTransition = (url: string, selectedTheme: VortexTheme) => {
    if (isTransitioning) return;
    setTheme(selectedTheme);
    setIsTransitioning(true);
    journeyProgressRef.current = 0;

    // Trigger audio swoop
    triggerWarpSonicSwoosh();

    // Sucking into the wormhole vortex (majestic 2.5 seconds flight!)
    // Wrapped in a brief timeout to let React render the DOM overlays first!
    setTimeout(() => {
      const progressObj = { value: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          // Swap pages under cover of full flash
          router.push(url);
          
          // Dissolve event horizon flash back to transparent
          gsap.to(flashRef.current, {
            opacity: 0,
            duration: 0.6,
            delay: 0.2,
            onComplete: () => {
              setIsTransitioning(false);
            }
          });
        }
      });

      // Animate camera down spline tunnel over exactly 2.5 seconds
      tl.to(progressObj, {
        value: 1.0,
        duration: 2.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          journeyProgressRef.current = progressObj.value;
        }
      });

      // Blinding white transition flash (synchronizes with singularity entry at 1.8s)
      tl.to(flashRef.current, {
        opacity: 1,
        duration: 0.7,
        ease: 'power1.in'
      }, 1.8); // starts at 1.8s, peaks at 2.5s
    }, 50);
  };

  // Three.js 3D WebGL Wormhole Engine Mounting
  useEffect(() => {
    if (!isTransitioning) return;
    
    // Tiny delay to guarantee canvas DOM node is fully resolved
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      let animationFrameId: number;

      // 1. Scene & Camera Setup
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x000000, 0.007);

      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: false
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);

      const setupCameraObserverPosition = () => {
        camera.position.set(-5.0, 5.0, 24.0);
        camera.lookAt(1.5, -1.5, -15.0);
      };
      setupCameraObserverPosition();

      // 2. Neon Color-Theme Adaptive Grid Texture
      const gridColor = theme === 'bze' ? '#00f3ff' : '#fbbf24';
      
      const createProceduralGridTexture = (colorHex: string) => {
        const size = 1024;
        const texCanvas = document.createElement('canvas');
        texCanvas.width = size;
        texCanvas.height = size;
        const ctx = texCanvas.getContext('2d');
        if (!ctx) return null;

        ctx.clearRect(0, 0, size, size);
        ctx.strokeStyle = colorHex;
        ctx.lineWidth = 20;
        ctx.shadowColor = colorHex;
        ctx.shadowBlur = 24;
        ctx.strokeRect(0, 0, size, size);

        const texture = new THREE.CanvasTexture(texCanvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.repeat.set(10, 42); // Clean grid columns

        return texture;
      };

      // 3. Build Tapered Geometric Funnel
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

      const gridTexture = createProceduralGridTexture(gridColor);
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

      // 4. Parallax Starfield Background
      const starCount = 350;
      const starGeometry = new THREE.BufferGeometry();
      const starPositions = new Float32Array(starCount * 3);
      const starColors = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount; i++) {
        const idx = Math.floor(Math.random() * segmentsY);
        const point = points[idx];
        const normal = frames.normals[idx];
        const binormal = frames.binormals[idx];

        const angle = Math.random() * Math.PI * 2;
        const radius = 6 + Math.random() * 75;

        starPositions[i * 3]     = point.x + (normal.x * Math.cos(angle) + binormal.x * Math.sin(angle)) * radius;
        starPositions[i * 3 + 1] = point.y + (normal.y * Math.cos(angle) + binormal.y * Math.sin(angle)) * radius;
        starPositions[i * 3 + 2] = point.z + (normal.z * Math.cos(angle) + binormal.z * Math.sin(angle)) * radius;

        const rand = Math.random();
        if (theme === 'bze') {
          // BZE: Cyan spectrum stars
          starColors[i * 3]     = rand * 0.3;
          starColors[i * 3 + 1] = 0.8 + rand * 0.2;
          starColors[i * 3 + 2] = 1.0;
        } else {
          // AZE: Amber spectrum stars
          starColors[i * 3]     = 1.0;
          starColors[i * 3 + 1] = 0.6 + rand * 0.4;
          starColors[i * 3 + 2] = rand * 0.3;
        }
      }
      starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

      // Glow rounded particle texture
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

      // 5. Animation Core Clock Loop
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const journeyProgress = journeyProgressRef.current;

        // Swirling forward velocity increases as progress increases
        const speedFactor = 0.5 + Math.pow(journeyProgress, 2.5) * 8.5;
        if (gridTexture) {
          gridTexture.offset.y -= delta * 1.25 * speedFactor;
          gridTexture.offset.x -= delta * 0.35 * speedFactor;
        }

        // Camera routing plunge down Catmull spline
        if (journeyProgress > 0.1) {
          const pathT = 0.9 - ((journeyProgress - 0.1) / 0.9) * 0.9;
          const clampedT = Math.max(0.001, Math.min(0.999, pathT));

          const curvePosition = curve.getPointAt(clampedT);
          const targetLookAt = curve.getPointAt(Math.max(0.0, clampedT - 0.05));

          const cameraLerpSpeed = 0.04 + (journeyProgress * 0.05);
          camera.position.lerp(curvePosition, cameraLerpSpeed);

          const currentTarget = new THREE.Vector3();
          camera.getWorldDirection(currentTarget);
          currentTarget.add(camera.position);
          currentTarget.lerp(targetLookAt, cameraLerpSpeed);
          camera.lookAt(currentTarget);
        } else {
          setupCameraObserverPosition();
        }

        starfieldPoints.rotation.y += 0.0004;

        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // Cleanup WebGL instance on unmount
      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        
        geometry.dispose();
        material.dispose();
        if (gridTexture) gridTexture.dispose();
        singularityGeom.dispose();
        singularityMat.dispose();
        starGeometry.dispose();
        starMaterial.dispose();
        starTexture.dispose();
        renderer.dispose();
      };
    }, 50);

    return () => clearTimeout(timer);
  }, [isTransitioning]);

  return (
    <VortexContext.Provider value={{ triggerTransition, hasEntered, setHasEntered }}>
      {children}
      {isTransitioning && (
        <div className={styles.overlay}>
          {/* WebGL Canvas */}
          <canvas ref={canvasRef} className={styles.wormholeCanvas} aria-hidden="true" />
          
          {/* Lens-flare blinding entry/exit flash */}
          <div 
            ref={flashRef} 
            className={`
              ${styles.transitionFlash} 
              ${theme === 'bze' ? styles.flashBze : styles.flashAze}
            `} 
            aria-hidden="true" 
          />
        </div>
      )}
    </VortexContext.Provider>
  );
}
