import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGame } from "@/lib/stores/useGame";

interface PipeProps {
  id: number;
  x: number;
  gapY: number;
  gapHeight: number;
}

const Pipe: React.FC<PipeProps> = ({ x, gapY, gapHeight, id }) => {
  const { phase } = useGame();
  
  const topPipeRef = useRef<THREE.Mesh>(null);
  const bottomPipeRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate pipe colors with a slight gradient
  const pipeColor = useMemo(() => {
    return new THREE.Color(0.1, 0.8, 0.3);
  }, []);
  
  // Calculate pipe heights
  const topPipeHeight = useMemo(() => {
    return 15 - gapY - gapHeight / 2;
  }, [gapY, gapHeight]);
  
  const bottomPipeHeight = useMemo(() => {
    return gapY - gapHeight / 2 + 15;
  }, [gapY, gapHeight]);
  
  useFrame(() => {
    if (!groupRef.current) return;
    
    // Update pipe position
    groupRef.current.position.x = x;
    
    // Add subtle animation to the pipes
    if (phase === "playing") {
      if (topPipeRef.current) {
        topPipeRef.current.rotation.z = Math.sin(Date.now() * 0.001 + id * 0.5) * 0.02;
      }
      if (bottomPipeRef.current) {
        bottomPipeRef.current.rotation.z = Math.sin(Date.now() * 0.001 + id * 0.5) * 0.02;
      }
    }
  });
  
  return (
    <group ref={groupRef} position={[x, 0, 0]}>
      {/* Top pipe */}
      <group position={[0, gapY + gapHeight / 2, 0]}>
        <mesh ref={topPipeRef} position={[0, topPipeHeight / 2, 0]}>
          <boxGeometry args={[1.5, topPipeHeight, 1.5]} />
          <meshStandardMaterial color={pipeColor} />
        </mesh>
        
        {/* Pipe cap */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 0.5, 2]} />
          <meshStandardMaterial color={pipeColor.clone().multiplyScalar(0.8)} />
        </mesh>
      </group>
      
      {/* Bottom pipe */}
      <group position={[0, gapY - gapHeight / 2, 0]}>
        <mesh ref={bottomPipeRef} position={[0, -bottomPipeHeight / 2, 0]}>
          <boxGeometry args={[1.5, bottomPipeHeight, 1.5]} />
          <meshStandardMaterial color={pipeColor} />
        </mesh>
        
        {/* Pipe cap */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 0.5, 2]} />
          <meshStandardMaterial color={pipeColor.clone().multiplyScalar(0.8)} />
        </mesh>
      </group>
    </group>
  );
};

export default Pipe;
