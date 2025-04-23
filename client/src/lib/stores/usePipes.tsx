import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface Pipe {
  id: number;
  x: number;
  gapY: number;
  gapHeight: number;
}

interface PipesState {
  pipes: Pipe[];
  nextPipeId: number;
  baseSpeed: number;
  
  // Actions
  addPipe: () => void;
  movePipes: (delta: number, score: number) => void;
  resetPipes: () => void;
  removePipe: (id: number) => void;
}

export const usePipes = create<PipesState>()(
  subscribeWithSelector((set, get) => ({
    pipes: [],
    nextPipeId: 1,
    baseSpeed: 4, // Reduced speed for easier gameplay
    
    addPipe: () => {
      set(state => {
        // Create a random gap for the pipes (less extreme positions)
        const gapY = Math.random() * 6 - 3; // Position between -3 and 3 (more centered)
        const gapHeight = 5; // Larger gap height for easier gameplay
        
        const newPipe: Pipe = {
          id: state.nextPipeId,
          x: 15, // Start off-screen to the right
          gapY,
          gapHeight
        };
        
        return {
          pipes: [...state.pipes, newPipe],
          nextPipeId: state.nextPipeId + 1
        };
      });
    },
    
    movePipes: (delta, score) => {
      set(state => {
        // Calculate speed increase based on score
        const speedMultiplier = 1 + Math.min(score * 0.05, 1); // Up to 2x speed at score 20
        const speed = state.baseSpeed * speedMultiplier;
        
        // Move all pipes and filter out ones that are off-screen
        const updatedPipes = state.pipes
          .map(pipe => ({
            ...pipe,
            x: pipe.x - speed * delta
          }))
          .filter(pipe => pipe.x > -10); // Remove pipes that are far off-screen
        
        return { pipes: updatedPipes };
      });
    },
    
    resetPipes: () => {
      set({
        pipes: [],
        nextPipeId: 1
      });
    },
    
    removePipe: (id) => {
      set(state => ({
        pipes: state.pipes.filter(pipe => pipe.id !== id)
      }));
    }
  }))
);
