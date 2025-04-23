import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { getLocalStorage, setLocalStorage } from "../utils";

interface ScoreState {
  score: number;
  highScore: number;
  
  // Actions
  incrementScore: () => void;
  resetScore: () => void;
  updateHighScore: () => void;
}

const STORAGE_KEY = "propybird_highscore";

export const useScore = create<ScoreState>()(
  subscribeWithSelector((set, get) => ({
    score: 0,
    highScore: getLocalStorage(STORAGE_KEY) || 0,
    
    incrementScore: () => {
      set(state => {
        const newScore = state.score + 1;
        
        // Update high score if needed
        if (newScore > state.highScore) {
          setLocalStorage(STORAGE_KEY, newScore);
          return { score: newScore, highScore: newScore };
        }
        
        return { score: newScore };
      });
    },
    
    resetScore: () => {
      set(state => {
        // Check if we need to update high score
        if (state.score > state.highScore) {
          const newHighScore = state.score;
          setLocalStorage(STORAGE_KEY, newHighScore);
          return { score: 0, highScore: newHighScore };
        }
        
        return { score: 0 };
      });
    },
    
    updateHighScore: () => {
      set(state => {
        if (state.score > state.highScore) {
          const newHighScore = state.score;
          setLocalStorage(STORAGE_KEY, newHighScore);
          return { highScore: newHighScore };
        }
        return {};
      });
    }
  }))
);
