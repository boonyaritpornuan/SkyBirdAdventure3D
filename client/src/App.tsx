import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import { useGame } from "./lib/stores/useGame";
import "@fontsource/inter";

// Import game components
import GameScene from "./components/game/GameScene";
import GameUI from "./components/ui/GameUI";
import Title from "./components/ui/Title";

// Define control keys for the game
export enum Controls {
  flap = 'flap',
}

const keyMap = [
  { name: Controls.flap, keys: ["Space", "KeyW", "ArrowUp"] },
];

// Main App component
function App() {
  const { phase } = useGame();
  const [showCanvas, setShowCanvas] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);
  const [hitSound, setHitSound] = useState<HTMLAudioElement | null>(null);
  const [successSound, setSuccessSound] = useState<HTMLAudioElement | null>(null);
  const { setBackgroundMusic: storeBackgroundMusic, setHitSound: storeHitSound, setSuccessSound: storeSuccessSound } = useAudio();

  // Initialize sounds
  useEffect(() => {
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);
    storeBackgroundMusic(bgMusic);

    const hit = new Audio("/sounds/hit.mp3");
    hit.volume = 0.5;
    setHitSound(hit);
    storeHitSound(hit);

    const success = new Audio("/sounds/success.mp3");
    success.volume = 0.5;
    setSuccessSound(success);
    storeSuccessSound(success);

    // Show the canvas once everything is loaded
    setShowCanvas(true);

    return () => {
      bgMusic.pause();
      hit.pause();
      success.pause();
    };
  }, []);

  return (
    <div className="game-container" style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {showCanvas && (
        <KeyboardControls map={keyMap}>
          <Canvas
            style={{ position: 'absolute', top: 0, left: 0 }}
            gl={{ 
              antialias: true, 
              alpha: true,
              powerPreference: 'high-performance',
              depth: true,
              stencil: false
            }}
            camera={{ position: [0, 0, 15], fov: 60, near: 0.1, far: 1000 }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <GameScene />
            </Suspense>
          </Canvas>
          
          {/* UI elements rendered outside of Canvas */}
          <GameUI />
          {phase === "ready" && <Title />}
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;
