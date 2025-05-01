import { useEffect } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "@/App";
import { useBird } from "@/lib/stores/useBird";
import { useGame } from "@/lib/stores/useGame";
import { useAudio } from "@/lib/stores/useAudio";

export const useControls = () => {
  const [subscribeKeys, getKeys] = useKeyboardControls<Controls>();
  const { flap } = useBird();
  const { phase, start } = useGame();
  const { playHit } = useAudio();
  
  // Subscribe to keyboard input only - we handle touch separately in GameUI
  useEffect(() => {
    // Subscribe to the flap control (keyboard)
    const unsubscribeFlap = subscribeKeys(
      (state) => state.flap,
      (pressed) => {
        if (pressed) {
          handleFlap();
        }
      }
    );
    
    return () => {
      unsubscribeFlap();
    };
  }, [phase]);
  
  const handleFlap = () => {
    if (phase === "ready") {
      start(); // เริ่มเกม
    }
  };
    
    // If playing, make the bird flap
    if (phase === "playing") {
      flap();
      playHit(); // Play flap sound
    }
  };
  
  const handleInput = () => {
    // This is called from the game loop
    // We don't need to do anything here because we're using subscriptions
  };
  
  return { handleInput, handleFlap };
};
