import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Background = () => {
  // Create refs for animated elements
  const cloudsRef = useRef<THREE.Group>(null);
  
  // Create a sky gradient
  const skyGradient = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext("2d")!;
    
    // Create gradient
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#4fa4ff"); // Light blue at top
    gradient.addColorStop(0.5, "#88c4ff"); // Mid blue
    gradient.addColorStop(1, "#b0e8c2"); // Light green at bottom
    
    // Fill with gradient
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    return texture;
  }, []);
  
  // Create clouds
  const clouds = useMemo(() => {
    const cloudPositions = [];
    const cloudCount = 20;
    const areaWidth = 60;
    const areaHeight = 20;
    
    for (let i = 0; i < cloudCount; i++) {
      const x = (Math.random() - 0.5) * areaWidth;
      const y = (Math.random() - 0.5) * areaHeight;
      const z = -5 - Math.random() * 10; // Push clouds back
      const scale = 0.5 + Math.random() * 1.5;
      const speed = 0.2 + Math.random() * 0.3;
      
      cloudPositions.push({ x, y, z, scale, speed });
    }
    
    return cloudPositions;
  }, []);
  
  // Animate clouds
  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.children.forEach((cloud, i) => {
        // Move clouds from right to left
        cloud.position.x -= clouds[i].speed * delta;
        
        // Reset cloud position when it moves off-screen
        if (cloud.position.x < -30) {
          cloud.position.x = 30;
          cloud.position.y = (Math.random() - 0.5) * 20;
        }
      });
    }
  });
  
  return (
    <>
      {/* Sky background */}
      <mesh position={[0, 0, -20]}>
        <planeGeometry args={[100, 50]} />
        <meshBasicMaterial map={skyGradient} />
      </mesh>
      
      {/* Clouds */}
      <group ref={cloudsRef}>
        {clouds.map((cloud, i) => (
          <CloudMesh 
            key={i} 
            position={[cloud.x, cloud.y, cloud.z]} 
            scale={[cloud.scale, cloud.scale, 1]} 
          />
        ))}
      </group>
    </>
  );
};

// Cloud component
const CloudMesh = ({ position, scale }: { position: [number, number, number], scale: [number, number, number] }) => {
  // Create a fluffy cloud shape
  const cloudShape = useMemo(() => {
    const shape = new THREE.Shape();
    
    // Draw a cloud-like shape
    shape.moveTo(-2, 0);
    shape.bezierCurveTo(-1.5, -0.5, -1, -0.5, 0, 0);
    shape.bezierCurveTo(0.5, 0.5, 1.5, 0.5, 2, 0);
    shape.bezierCurveTo(2.5, -0.5, 3, -0.5, 3.5, 0);
    shape.bezierCurveTo(4, 0.5, 4, 1, 3.5, 1.5);
    shape.bezierCurveTo(3, 2, 2, 2, 1, 1.5);
    shape.bezierCurveTo(0, 2, -1, 2, -1.5, 1.5);
    shape.bezierCurveTo(-2, 1, -2.5, 0.5, -2, 0);
    
    return shape;
  }, []);
  
  return (
    <mesh position={position} scale={scale}>
      <shapeGeometry args={[cloudShape]} />
      <meshBasicMaterial 
        color="#ffffff" 
        transparent={true} 
        opacity={0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default Background;
