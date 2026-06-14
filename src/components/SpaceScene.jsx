"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SpaceScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Track responsiveness
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1440;
    
    // Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    // Create nebula background clouds via dark space fog
    scene.fog = new THREE.FogExp2(0x020408, 0.015);
    
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    // Initial camera placement
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Global ambient light
    const ambientLight = new THREE.AmbientLight(0x061224, 1.5);
    scene.add(ambientLight);

    // Directional light (acting as the Sun, illuminating the planet)
    const sunLight = new THREE.DirectionalLight(0x00f5ff, 2.5);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const purpleLight = new THREE.DirectionalLight(0xbf00ff, 1.5);
    purpleLight.position.set(-5, -3, -5);
    scene.add(purpleLight);

    // --- 1. PERSISTENT STARFIELD (8000+ Stars) ---
    const starCount = isMobile ? 1500 : isTablet ? 4000 : 8000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      // Spread stars around a large sphere
      const radius = 80 + Math.random() * 120;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = radius * Math.cos(phi);

      // Star colors: mixed cyan, white, and violet
      const rColor = Math.random();
      if (rColor < 0.4) {
        // Cyan stars
        starColors[i] = 0.5;
        starColors[i + 1] = 0.95;
        starColors[i + 2] = 1.0;
      } else if (rColor < 0.8) {
        // Violet stars
        starColors[i] = 0.75;
        starColors[i + 1] = 0.2;
        starColors[i + 2] = 1.0;
      } else {
        // Pure White
        starColors[i] = 1.0;
        starColors[i + 1] = 1.0;
        starColors[i + 2] = 1.0;
      }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    // Custom star texture using Canvas
    const createStarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(0, 245, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
      return new THREE.CanvasTexture(canvas);
    };

    const starMaterial = new THREE.PointsMaterial({
      size: 0.65,
      map: createStarTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const starfield = new THREE.Points(starGeometry, starMaterial);
    scene.add(starfield);

    // --- 2. HERO: Atmospheric Planet, Saturn Ring & Asteroids ---
    const heroGroup = new THREE.Group();
    // Positioned slightly to the right for the Hero layout
    heroGroup.position.set(2.2, 0, 0);
    scene.add(heroGroup);

    // Planet core
    const planetGeometry = new THREE.SphereGeometry(1.6, 64, 64);
    
    // Custom shader-like materials or highly reflective standard materials
    const planetMaterial = new THREE.MeshStandardMaterial({
      color: 0x051329,
      roughness: 0.4,
      metalness: 0.8,
      bumpScale: 0.05,
      flatShading: false
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    heroGroup.add(planet);

    // Add glowing atmosphere shell
    const atmosGeometry = new THREE.SphereGeometry(1.7, 32, 32);
    const atmosMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosGeometry, atmosMaterial);
    heroGroup.add(atmosphere);

    // Saturn Ring
    const ringGeometry = new THREE.RingGeometry(2.1, 3.2, 64);
    // Rotate ring to be horizontal and then tilt it
    ringGeometry.rotateX(Math.PI / 2);
    
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xbf00ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
      roughness: 0.5,
      metalness: 0.5,
      blending: THREE.AdditiveBlending
    });
    const saturnRing = new THREE.Mesh(ringGeometry, ringMaterial);
    saturnRing.rotation.z = Math.PI / 6; // Tilt the ring
    heroGroup.add(saturnRing);

    // Asteroid belt
    const asteroidCount = isMobile ? 20 : isTablet ? 50 : 100;
    const asteroids = [];
    const asteroidGroup = new THREE.Group();
    heroGroup.add(asteroidGroup);

    for (let i = 0; i < asteroidCount; i++) {
      const size = 0.03 + Math.random() * 0.06;
      const astGeo = new THREE.IcosahedronGeometry(size, 0);
      const astMat = new THREE.MeshStandardMaterial({
        color: 0x4a5d78,
        roughness: 0.9,
        metalness: 0.1
      });
      const asteroid = new THREE.Mesh(astGeo, astMat);
      
      // Ring distribution
      const angle = Math.random() * Math.PI * 2;
      const distance = 2.3 + Math.random() * 0.8;
      
      asteroid.position.set(
        Math.cos(angle) * distance,
        (Math.random() - 0.5) * 0.2, // Small thickness
        Math.sin(angle) * distance
      );

      // Random tilts and rotations
      asteroid.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      
      // Speed multiplier
      asteroid.userData = {
        angle,
        distance,
        speed: 0.002 + Math.random() * 0.003
      };
      
      asteroidGroup.add(asteroid);
      asteroids.push(asteroid);
    }
    // Tilt the whole asteroid group to match the ring tilt
    asteroidGroup.rotation.z = Math.PI / 6;

    // --- 3. ABOUT: Wireframe Icosahedron & SR initials & Orbiting dots ---
    const aboutGroup = new THREE.Group();
    // Positioned below the Hero section (Y offset mapped to scroll)
    aboutGroup.position.set(-2.2, -10, 0);
    scene.add(aboutGroup);

    // Outer rotating icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(1.5, 1);
    const icoMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    aboutGroup.add(icosahedron);

    // Glowing wireframe initials "SR" inside
    const initialsGroup = new THREE.Group();
    
    // Draw "S" wireframe
    const sMaterial = new THREE.LineBasicMaterial({ color: 0x00f5ff, linewidth: 2 });
    const sPoints = [
      new THREE.Vector3(-0.4, 0.4, 0),
      new THREE.Vector3(-0.8, 0.4, 0),
      new THREE.Vector3(-0.8, 0.0, 0),
      new THREE.Vector3(-0.4, 0.0, 0),
      new THREE.Vector3(-0.4, -0.4, 0),
      new THREE.Vector3(-0.8, -0.4, 0)
    ];
    const sGeo = new THREE.BufferGeometry().setFromPoints(sPoints);
    const sLine = new THREE.Line(sGeo, sMaterial);
    initialsGroup.add(sLine);

    // Draw "R" wireframe
    const rMaterial = new THREE.LineBasicMaterial({ color: 0x00f5ff, linewidth: 2 });
    const rPoints = [
      new THREE.Vector3(0.4, -0.4, 0),
      new THREE.Vector3(0.4, 0.4, 0),
      new THREE.Vector3(0.8, 0.4, 0),
      new THREE.Vector3(0.8, 0.0, 0),
      new THREE.Vector3(0.4, 0.0, 0),
      new THREE.Vector3(0.8, -0.4, 0)
    ];
    const rGeo = new THREE.BufferGeometry().setFromPoints(rPoints);
    const rLine = new THREE.Line(rGeo, rMaterial);
    initialsGroup.add(rLine);

    // Center the initials inside the icosahedron
    initialsGroup.position.set(0.1, 0, 0);
    aboutGroup.add(initialsGroup);

    // Orbiting electron dots
    const electronCount = 3;
    const electrons = [];
    
    for (let i = 0; i < electronCount; i++) {
      const elecGeo = new THREE.SphereGeometry(0.06, 16, 16);
      const elecMat = new THREE.MeshBasicMaterial({
        color: 0xbf00ff,
        transparent: true,
        opacity: 0.9
      });
      const electron = new THREE.Mesh(elecGeo, elecMat);
      
      const orbitSpeed = 0.015 + i * 0.005;
      const radiusX = 1.9 + i * 0.25;
      const radiusY = 1.2 + i * 0.25;
      
      electron.userData = {
        angle: (i * Math.PI * 2) / electronCount,
        speed: orbitSpeed,
        radiusX,
        radiusY,
        axis: new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize()
      };
      
      aboutGroup.add(electron);
      electrons.push(electron);
    }

    // --- 4. CONTACT: Rotating Spiral Galaxy ---
    const contactGroup = new THREE.Group();
    // Positioned further down the viewport
    contactGroup.position.set(0, -22, -2);
    scene.add(contactGroup);

    const galaxyCount = isMobile ? 800 : isTablet ? 1500 : 2500;
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyPositions = new Float32Array(galaxyCount * 3);
    const galaxyColors = new Float32Array(galaxyCount * 3);

    const arms = 3;
    const galaxyColorCenter = new THREE.Color(0xbf00ff); // Violet core
    const galaxyColorEdge = new THREE.Color(0x00f5ff);   // Cyan arms

    for (let i = 0; i < galaxyCount; i++) {
      const r = Math.pow(Math.random(), 2.5) * 5.0; // Distribution concentrated at core
      const armAngle = ((i % arms) * 2 * Math.PI) / arms;
      const spiralAngle = r * 1.5; // Spiral torsion
      
      const angle = armAngle + spiralAngle;
      
      // Random spreads for volume depth
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * r;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.15 * r;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * r;

      galaxyPositions[i * 3] = Math.cos(angle) * r + randomX;
      galaxyPositions[i * 3 + 1] = randomY; // Y is height (flat galaxy)
      galaxyPositions[i * 3 + 2] = Math.sin(angle) * r + randomZ;

      // Color interpolation from core to edges
      const mixedColor = galaxyColorCenter.clone().lerp(galaxyColorEdge, r / 5.0);
      galaxyColors[i * 3] = mixedColor.r;
      galaxyColors[i * 3 + 1] = mixedColor.g;
      galaxyColors[i * 3 + 2] = mixedColor.b;
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));

    const galaxyMaterial = new THREE.PointsMaterial({
      size: 0.18,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
    galaxyPoints.rotation.x = Math.PI / 8; // Slight rotation
    contactGroup.add(galaxyPoints);

    // --- SCROLL INTERACTION & CAMERA PATH ---
    let targetScrollY = 0;
    let currentScrollY = 0;

    const onScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // --- MOUSE PARALLAX & CAMERA SHAKE ---
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const onMouseMove = (e) => {
      // Normalized coordinates -0.5 to 0.5
      targetMouseX = (e.clientX / window.innerWidth) - 0.5;
      targetMouseY = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Camera shake effect triggers
    let shakeDuration = 0;
    let shakeIntensity = 0;
    const triggerCameraShake = (duration = 0.5, intensity = 0.3) => {
      shakeDuration = duration;
      shakeIntensity = intensity;
    };

    // Listen to global custom events for triggers
    const handleActionClick = () => {
      triggerCameraShake(0.8, 0.45);
    };
    window.addEventListener('hero-cta-click', handleActionClick);

    // Speed up and shift color logic on Hovering About section
    let hoverState = false;
    const handleAboutHover = (e) => {
      const inAbout = e.detail.hovered;
      hoverState = inAbout;
    };
    window.addEventListener('about-hover', handleAboutHover);

    // --- ANIMATION RENDER LOOP ---
    const clock = new THREE.Clock();
    let animFrameId;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // 1. Slow drift stars
      starfield.rotation.y = elapsedTime * 0.005;

      // 2. Rotate planet + orbit ring + orbit asteroids
      planet.rotation.y = elapsedTime * 0.04;
      saturnRing.rotation.y = -elapsedTime * 0.02;

      asteroids.forEach((asteroid) => {
        const data = asteroid.userData;
        data.angle += data.speed;
        asteroid.position.set(
          Math.cos(data.angle) * data.distance,
          asteroid.position.y,
          Math.sin(data.angle) * data.distance
        );
        // Spin asteroids
        asteroid.rotation.y += 0.01;
      });

      // 3. About mesh rotations (Faster on hover)
      const icoSpeed = hoverState ? 0.4 : 0.08;
      icosahedron.rotation.y += icoSpeed * delta;
      icosahedron.rotation.x += (icoSpeed * 0.5) * delta;
      initialsGroup.rotation.y -= (icoSpeed * 0.5) * delta;

      // Change icosahedron color based on hover
      const targetColor = hoverState ? new THREE.Color(0xbf00ff) : new THREE.Color(0x00f5ff);
      icoMaterial.color.lerp(targetColor, 0.1);
      sMaterial.color.lerp(targetColor, 0.1);
      rMaterial.color.lerp(targetColor, 0.1);

      // Orbit electrons
      electrons.forEach((electron) => {
        const data = electron.userData;
        data.angle += data.speed * (hoverState ? 2.5 : 1.0);
        
        // Elliptical coordinate projection
        const x = Math.cos(data.angle) * data.radiusX;
        const z = Math.sin(data.angle) * data.radiusY;
        
        // Apply relative axis rotations
        const position = new THREE.Vector3(x, 0, z).applyAxisAngle(data.axis, data.angle * 0.25);
        electron.position.copy(position);
      });

      // 4. Contact Galaxy Rotation
      galaxyPoints.rotation.y = elapsedTime * 0.03;

      // 5. Scroll interpolation & Camera tracking
      currentScrollY += (targetScrollY - currentScrollY) * 0.08;
      
      // Map scroll progress to global camera paths
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
      const scrollPct = currentScrollY / maxScroll;

      // Camera coordinates trajectory matching pages
      const targetCameraY = -scrollPct * 22; // Glides down the sections
      camera.position.y = targetCameraY;

      // 6. Smooth Mouse Parallax
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Perspective offsets relative to mouse positions
      camera.position.x = currentMouseX * 3;
      // Combine parallax Y offset with scroll height position
      camera.position.y = targetCameraY - (currentMouseY * 3);

      // Look slightly towards the center path
      camera.lookAt(0, targetCameraY, -5);

      // 7. Camera Shake processing
      if (shakeDuration > 0) {
        shakeDuration -= delta;
        const currentIntensity = shakeIntensity * (shakeDuration / 0.8);
        camera.position.x += (Math.random() - 0.5) * currentIntensity;
        camera.position.y += (Math.random() - 0.5) * currentIntensity;
        camera.position.z += (Math.random() - 0.5) * currentIntensity;
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- RESIZE EVENT HANDLER ---
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // --- CLEANUP ---
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('hero-cta-click', handleActionClick);
      window.removeEventListener('about-hover', handleAboutHover);
      cancelAnimationFrame(animFrameId);
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose materials & geometries
      starGeometry.dispose();
      starMaterial.dispose();
      planetGeometry.dispose();
      planetMaterial.dispose();
      atmosGeometry.dispose();
      atmosMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      icoGeometry.dispose();
      icoMaterial.dispose();
      sGeo.dispose();
      sMaterial.dispose();
      rGeo.dispose();
      rMaterial.dispose();
      electrons.forEach(e => e.geometry.dispose());
      elecMat.dispose();
      galaxyGeometry.dispose();
      galaxyMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div id="bg-canvas" ref={containerRef} />;
}
