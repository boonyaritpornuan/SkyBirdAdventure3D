import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGame } from "@/lib/stores/useGame";
import { useBird } from "@/lib/stores/useBird";

const Particles = () => {
  const { phase } = useGame();
  const birdState = useBird();
  const particlesRef = useRef<THREE.Points>(null);
  
  // Generate particles
  const particleCount = 100;
  
  // Create particle data
  const [positions, speeds, sizes, offsets] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);
    const offsets = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Random position in a 30x20x10 box
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
      
      // Random speeds
      speeds[i] = 0.2 + Math.random() * 0.8;
      
      // Random sizes
      sizes[i] = 0.05 + Math.random() * 0.15;
      
      // Random offset for animation
      offsets[i] = Math.random() * Math.PI * 2;
    }
    
    return [positions, speeds, sizes, offsets];
  }, []);
  
  // Geometry with custom attributes
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);
  
  // Custom particle material
  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.2,
      color: new THREE.Color(1, 1, 1),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
  }, []);
  
  // Animate particles
  useFrame((_, delta) => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      // Move particles from right to left
      positions[i * 3] -= speeds[i] * delta;
      
      // Subtle up/down movement
      positions[i * 3 + 1] += Math.sin(Date.now() * 0.001 + offsets[i]) * 0.01;
      
      // Reset particle position when it moves off-screen
      if (positions[i * 3] < -15) {
        positions[i * 3] = 15;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      }
    }
    
    // Add more particles near the bird when flapping
    if (phase === "playing" && birdState.velocity < 0) {
      for (let i = 0; i < 3; i++) {
        // Find a particle to repurpose
        const particleIndex = Math.floor(Math.random() * particleCount);
        positions[particleIndex * 3] = birdState.x - 0.5;
        positions[particleIndex * 3 + 1] = birdState.y - 0.5;
        positions[particleIndex * 3 + 2] = 1;
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={particlesRef} geometry={geometry} material={particleMaterial} />
  );
};

export default Particles;
