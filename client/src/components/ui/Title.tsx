import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Center } from "@react-three/drei";

const Title = () => {
  return (
    <div 
      className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full sm:w-2/3 h-1/3"
      style={{ zIndex: 20 }}
    >
      <h1 className="text-4xl md:text-6xl text-center font-bold text-yellow-400 drop-shadow-[0_2px_8px_rgba(255,136,0,0.8)]">
        PROPY BIRD
      </h1>
      
      {/* Animated bird below title */}
      <div className="flex justify-center mt-4">
        <AnimatedBird />
      </div>
    </div>
  );
};

// Animated bird using CSS animation
const AnimatedBird = () => {
  return (
    <div className="w-24 h-24 relative animate-float">
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-md"
      >
        {/* Bird body */}
        <ellipse cx="50" cy="50" rx="25" ry="20" fill="#FFDD00" />
        
        {/* Right wing */}
        <ellipse 
          cx="30" cy="50" rx="15" ry="10" fill="#FFAA00"
          className="origin-[40px_50px] animate-flap"
        />
        
        {/* Left wing */}
        <ellipse 
          cx="70" cy="50" rx="15" ry="10" fill="#FFAA00"
          className="origin-[60px_50px] animate-flap"
          style={{ animationDirection: 'alternate-reverse' }}
        />
        
        {/* Beak */}
        <polygon points="80,50 90,45 90,55" fill="#FF6B00" />
        
        {/* Eye */}
        <circle cx="70" cy="45" r="5" fill="white" />
        <circle cx="72" cy="45" r="2" fill="black" />
      </svg>
    </div>
  );
};

export default Title;
