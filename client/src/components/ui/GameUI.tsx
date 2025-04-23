import { useEffect, useState } from "react";
import { useGame } from "@/lib/stores/useGame";
import { useScore } from "@/lib/stores/useScore";
import { useAudio } from "@/lib/stores/useAudio";
import { useBird, type BirdSkin } from "@/lib/stores/useBird";
import { cn } from "@/lib/utils";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

const GameUI = () => {
  const { phase, start, restart } = useGame();
  const { score, highScore } = useScore();
  const { isMuted, toggleMute } = useAudio();
  const { skin, setSkin } = useBird();
  const [animateScore, setAnimateScore] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  
  // Show instructions for gameplay
  useEffect(() => {
    // When score changes, trigger animation
    setAnimateScore(true);
    const timer = setTimeout(() => setAnimateScore(false), 300);
    
    return () => clearTimeout(timer);
  }, [score]);
  
  // Show game over with a delay
  useEffect(() => {
    if (phase === "ended") {
      const timer = setTimeout(() => {
        setShowGameOver(true);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setShowGameOver(false);
    }
  }, [phase]);
  
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
      {/* Top section - Score display */}
      <div className="flex justify-between items-start z-10">
        <div className="flex flex-col items-center">
          {phase !== "ready" && (
            <div 
              className={cn(
                "font-['Press_Start_2P'] text-2xl sm:text-4xl text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]",
                animateScore && "scale-150 transition-transform"
              )}
              style={{ 
                textShadow: "0 0 10px rgba(255,255,255,0.5)",
                transition: "transform 0.2s ease-out"
              }}
            >
              {score}
            </div>
          )}
          
          {phase === "ended" && showGameOver && (
            <div className="mt-2 font-['Press_Start_2P'] text-sm text-white">
              Best: {highScore}
            </div>
          )}
        </div>
        
        {/* Sound toggle button */}
        <Button
          onClick={toggleMute}
          className="pointer-events-auto h-10 w-10 rounded-full p-0 bg-white/20 hover:bg-white/40 text-white"
        >
          {isMuted ? (
            <VolumeX className="h-6 w-6" />
          ) : (
            <Volume2 className="h-6 w-6" />
          )}
        </Button>
      </div>
      
      {/* Middle section - Instructions */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
        {phase === "ready" && (
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center font-['Press_Start_2P'] text-white text-sm sm:text-lg mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              <span>TAP TO FLAP</span>
              <span className="text-xs mt-2 opacity-80">or press SPACE</span>
            </div>
            <div className="animate-bounce">
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                <path d="M25 5L25 45M25 45L40 30M25 45L10 30" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        )}
        
        {/* Game over screen */}
        {phase === "ended" && showGameOver && (
          <div 
            className="bg-black/40 backdrop-blur-sm p-6 rounded-xl flex flex-col items-center animate-fade-in"
          >
            <div className="font-['Press_Start_2P'] text-2xl sm:text-4xl text-white mb-6">
              GAME OVER
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex flex-col items-center">
                <div className="font-['Press_Start_2P'] text-sm text-white mb-1">
                  SCORE
                </div>
                <div className="font-['Press_Start_2P'] text-xl sm:text-3xl text-white">
                  {score}
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="font-['Press_Start_2P'] text-sm text-white mb-1">
                  BEST
                </div>
                <div className="font-['Press_Start_2P'] text-xl sm:text-3xl text-white">
                  {highScore}
                </div>
              </div>
            </div>
            
            <Button
              onClick={restart}
              className="pointer-events-auto bg-orange-500 hover:bg-orange-600 text-white font-['Press_Start_2P'] text-sm py-3 px-6 rounded-full mt-4 transition-all hover:scale-105"
            >
              PLAY AGAIN
            </Button>
          </div>
        )}
      </div>
      
      {/* Bottom section - Start button & Bird Skins */}
      <div className="flex flex-col items-center">
        {phase === "ready" && (
          <>
            {/* Bird skin selection */}
            <div className="flex gap-4 mb-6 pointer-events-auto">
              <button
                className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all pointer-events-auto ${
                  skin === "yellow" ? "bg-yellow-400 scale-110 ring-4 ring-white/50" : "bg-yellow-400/60 hover:bg-yellow-400/80"
                }`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  setSkin("yellow");
                  console.log("Selected yellow skin");
                }}
              >
                <div className="w-10 h-10 rounded-full bg-yellow-300"></div>
              </button>
              
              <button
                className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all pointer-events-auto ${
                  skin === "blue" ? "bg-blue-400 scale-110 ring-4 ring-white/50" : "bg-blue-400/60 hover:bg-blue-400/80"
                }`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  setSkin("blue");
                  console.log("Selected blue skin");
                }}
              >
                <div className="w-10 h-10 rounded-full bg-blue-300"></div>
              </button>
            </div>
            
            {/* Start button */}
            <Button
              onClick={start}
              className="pointer-events-auto bg-gradient-to-br from-orange-400 to-red-500 hover:from-orange-300 hover:to-red-400 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all hover:scale-105 animate-pulse duration-2000"
            >
              START
            </Button>
          </>
        )}
      </div>
      
      {/* Full-screen click/tap area for flapping */}
      {phase === "playing" && (
        <div 
          className="absolute inset-0 pointer-events-auto cursor-pointer"
          onClick={(e) => {
            // Direct call to flap for immediate response
            const { flap } = useBird.getState();
            const { playHit } = useAudio.getState();
            
            flap();
            playHit();
            console.log("Direct flap from UI click");
          }}
        />
      )}
      
      {/* Game Over animation added via CSS */}
    </div>
  );
};

export default GameUI;
