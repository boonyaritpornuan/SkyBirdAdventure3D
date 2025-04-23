import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useBird } from "@/lib/stores/useBird";
import { useGame } from "@/lib/stores/useGame";
import * as THREE from "three";

const Bird = () => {
  const birdState = useBird();
  const { x, y, velocity, flap, skin } = birdState;
  const { phase } = useGame();
  const meshRef = useRef<THREE.Mesh>(null);
  const wingRef = useRef<THREE.Mesh>(null);
  
  // Animation timing
  const flapAnimationRef = useRef(0);
  const idleAnimationRef = useRef(0);

  useEffect(() => {
    // When transitioning to playing, give an initial flap
    if (phase === "playing") {
      flap();
    }
  }, [phase, flap]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    // Update position based on bird state
    meshRef.current.position.y = y;
    
    // Determine rotation based on velocity
    const targetRotation = THREE.MathUtils.clamp(
      velocity * 0.1, 
      -Math.PI / 4, 
      Math.PI / 3
    );
    
    // Smooth rotation
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      targetRotation,
      delta * 10
    );
    
    // Handle wing flapping animation
    if (wingRef.current) {
      if (phase === "playing") {
        // Flutter wings more quickly when flapping upward
        const flapSpeed = velocity < 0 ? 15 : 8;
        flapAnimationRef.current += delta * flapSpeed;
        wingRef.current.rotation.z = Math.sin(flapAnimationRef.current) * 0.3;
      } else {
        // Idle flapping animation
        idleAnimationRef.current += delta * 5;
        wingRef.current.rotation.z = Math.sin(idleAnimationRef.current) * 0.2;
        
        // Gentle hovering in ready state
        if (phase === "ready" && meshRef.current) {
          meshRef.current.position.y = Math.sin(idleAnimationRef.current * 0.5) * 0.2 + 2;
        }
      }
    }
  });

  return (
    <group position={[x, y, 0]}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        {/* Bird body */}
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          color={skin === "yellow" ? "#FFDD00" : "#4AA5FF"} 
          roughness={0.3} 
          metalness={0.2}
        />
        
        {/* Bird eye */}
        <mesh position={[0.25, 0.15, 0.28]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color="white" />
          
          {/* Pupil */}
          <mesh position={[0.06, 0, 0.06]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="black" />
          </mesh>
        </mesh>
        
        {/* Bird beak */}
        <mesh position={[0.5, -0.05, 0]} rotation={[0, 0, 0.1]}>
          <coneGeometry args={[0.1, 0.4, 16]} />
          <meshStandardMaterial color={skin === "yellow" ? "#FF6B00" : "#FF4D6B"} />
        </mesh>
        
        {/* Wing */}
        <mesh 
          ref={wingRef} 
          position={[-0.1, 0, 0.3]} 
          rotation={[0, 0, 0]}
        >
          <planeGeometry args={[0.5, 0.3]} />
          <meshStandardMaterial 
            color={skin === "yellow" ? "#FFAA00" : "#2D88DD"} 
            side={THREE.DoubleSide} 
          />
        </mesh>
        
        {/* Back wing */}
        <mesh position={[-0.1, 0, -0.3]} rotation={[0, 0, 0.2]}>
          <planeGeometry args={[0.4, 0.25]} />
          <meshStandardMaterial 
            color={skin === "yellow" ? "#FFAA00" : "#2D88DD"} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      </mesh>
    </group>
  );
};

export default Bird;
