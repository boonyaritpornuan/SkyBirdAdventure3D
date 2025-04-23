import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useGame } from "./useGame";

// Available bird skins
export type BirdSkin = "yellow" | "blue";

interface BirdState {
  x: number;
  y: number;
  velocity: number;
  gravity: number;
  flapStrength: number;
  skin: BirdSkin;
  
  // Actions
  updateBird: (delta: number) => void;
  flap: () => void;
  resetBird: () => void;
  setSkin: (skin: BirdSkin) => void;
}

const INITIAL_BIRD_Y = 2;

export const useBird = create<BirdState>()(
  subscribeWithSelector((set, get) => ({
    // Initial bird state
    x: -4,
    y: INITIAL_BIRD_Y,
    velocity: 0,
    gravity: 12, // Reduced gravity for smoother gameplay
    flapStrength: 5.5, // Adjusted flap strength for better control
    skin: "yellow" as BirdSkin, // Default skin
    
    updateBird: (delta) => {
      const { phase } = useGame.getState();
      if (phase !== "playing") return;
      
      set(state => {
        // Apply gravity to velocity
        const velocity = state.velocity + state.gravity * delta;
        
        // Update position based on velocity
        let y = state.y - velocity * delta;
        
        // Check if bird hit ceiling or ground
        if (y > 10) {
          y = 10;
        } else if (y < -8) {
          y = -8;
          useGame.getState().end();
          return { y, velocity: 0 };
        }
        
        return { y, velocity };
      });
    },
    
    flap: () => {
      const { phase } = useGame.getState();
      if (phase !== "playing") return;
      
      set(state => ({
        velocity: -state.flapStrength
      }));
    },
    
    resetBird: () => {
      set({
        y: INITIAL_BIRD_Y,
        velocity: 0
      });
    },
    
    setSkin: (skin: BirdSkin) => {
      set({ skin });
      console.log(`Changed bird skin to: ${skin}`);
    }
  }))
);
