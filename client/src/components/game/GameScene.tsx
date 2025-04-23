import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGame } from "@/lib/stores/useGame";
import { usePipes } from "@/lib/stores/usePipes";
import { useBird } from "@/lib/stores/useBird";
import { useScore } from "@/lib/stores/useScore";
import { useAudio } from "@/lib/stores/useAudio";
import { useCollision } from "@/lib/hooks/useCollision";
import { useControls } from "@/lib/hooks/useControls";

import BirdComponent from "./Bird";
import Pipe from "./Pipe";
import Background from "./Background";
import Particles from "./Particles";

const GameScene = () => {
  const { phase } = useGame();
  const birdState = useBird();
  const { resetBird, updateBird } = birdState;
  const { pipes, addPipe, resetPipes, movePipes } = usePipes();
  const { score, resetScore, incrementScore } = useScore();
  const { playHit, playSuccess } = useAudio();
  const { handleCollision } = useCollision();
  const { handleInput } = useControls();
  
  const { scene } = useThree();
  const timeRef = useRef(0);
  const pipeIntervalRef = useRef(0);
  const lastPipeScored = useRef<number | null>(null);

  // Reset game on phase change
  useEffect(() => {
    if (phase === "ready") {
      resetBird();
      resetPipes();
      resetScore();
      lastPipeScored.current = null;
    }
  }, [phase]);

  // Handle input and collision detection
  useFrame((state, delta) => {
    if (phase !== "playing") return;
    
    // Handle input (flapping)
    handleInput();
    
    // Update bird position with physics
    updateBird(delta);
    
    // Move pipes
    movePipes(delta, score);
    
    // Generate new pipes at intervals
    timeRef.current += delta;
    const pipeInterval = Math.max(1.5, 2.5 - score * 0.05);
    
    if (timeRef.current > pipeInterval) {
      addPipe();
      timeRef.current = 0;
    }
    
    // Check for collision with pipes or ground/ceiling
    if (handleCollision(birdState, pipes)) {
      playHit();
      // Game over
      return;
    }
    
    // Check for passing through pipes to score points
    pipes.forEach(pipe => {
      // Bird is positioned at x=-4, check when pipe passes bird position
      const birdPassedPipe = pipe.x < -4; 
      const pipeIsRecent = pipe.x > -6; // Don't score pipes that are too far off-screen
      const pipeNotScoredYet = lastPipeScored.current !== pipe.id;
      
      // Score the point when all conditions are met
      if (birdPassedPipe && pipeIsRecent && pipeNotScoredYet) {
        console.log(`Scoring point for pipe ${pipe.id}`);
        incrementScore();
        lastPipeScored.current = pipe.id;
        playSuccess();
      }
    });
  });

  return (
    <>
      <Background />
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* The bird */}
      <BirdComponent />
      
      {/* Pipes */}
      {pipes.map((pipe) => (
        <Pipe key={pipe.id} {...pipe} />
      ))}
      
      {/* Particles */}
      <Particles />
    </>
  );
};

export default GameScene;
