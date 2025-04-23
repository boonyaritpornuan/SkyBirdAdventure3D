import { useEffect } from "react";
import { useBird } from "@/lib/stores/useBird";
import { usePipes, type Pipe } from "@/lib/stores/usePipes";
import { useGame } from "@/lib/stores/useGame";

// Type for bird state from useBird store
interface BirdStateType {
  x: number;
  y: number;
  velocity: number;
  gravity: number;
  flapStrength: number;
  updateBird: (delta: number) => void;
  flap: () => void;
  resetBird: () => void;
}

export const useCollision = () => {
  const { end } = useGame();
  
  const handleCollision = (bird: BirdStateType, pipes: Pipe[]): boolean => {
    // Bird collision radius
    const birdRadius = 0.4;
    const birdX = bird.x;
    const birdY = bird.y;
    
    // Check collision with each pipe
    for (const pipe of pipes) {
      const pipeX = pipe.x;
      const topPipeY = pipe.gapY + pipe.gapHeight / 2;
      const bottomPipeY = pipe.gapY - pipe.gapHeight / 2;
      
      // Width and height of pipe collision box
      const pipeWidth = 1.5;
      const halfPipeWidth = pipeWidth / 2;
      
      // Check if bird is within pipe's x-range (with some forgiveness)
      if (
        birdX + birdRadius * 0.7 > pipeX - halfPipeWidth &&
        birdX - birdRadius * 0.7 < pipeX + halfPipeWidth
      ) {
        // Check if bird is outside the gap (collision) - make collision check more forgiving
        if (
          birdY - birdRadius * 0.7 < bottomPipeY || 
          birdY + birdRadius * 0.7 > topPipeY
        ) {
          // Collision detected!
          end();
          return true;
        }
      }
    }
    
    // No collision
    return false;
  };
  
  return { handleCollision };
};
