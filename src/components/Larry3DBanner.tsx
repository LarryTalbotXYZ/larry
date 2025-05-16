"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Banner {
  text: string;
  color: string;
  wolfStyle: 'fierce' | 'howling' | 'cool' | 'focused' | 'proud' | 'nice';
}

export default function Larry3DBanner() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  
  const banners: Banner[] = [
    { text: "FRIENDLY WOLF INC", color: "from-cyan-400 to-cyan-600", wolfStyle: 'nice' },
    { text: "ETH-BACKED DEFI", color: "from-purple-400 to-purple-600", wolfStyle: 'proud' },
    { text: "0% LIQUIDATION RISK", color: "from-green-400 to-green-600", wolfStyle: 'cool' },
    { text: "99% MAX LEVERAGE", color: "from-blue-400 to-blue-600", wolfStyle: 'fierce' },
    { text: "INSTANT LIQUIDITY", color: "from-yellow-400 to-yellow-600", wolfStyle: 'focused' },
    { text: "PROTOCOL OWNED", color: "from-pink-400 to-pink-600", wolfStyle: 'howling' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [banners.length]);

  const currentBanner = banners[currentBannerIndex];

  const getWolfPath = (style: string) => {
    switch(style) {
      case 'fierce':
        return {
          head: "M100 25 C80 25 65 35 55 50 L45 65 C40 75 40 85 43 95 L50 115 C53 125 57 135 65 140 L70 150 C75 160 80 165 90 170 L100 175 L110 170 C120 165 125 160 130 150 L135 140 C143 135 147 125 150 115 L157 95 C160 85 160 75 155 65 L145 50 C135 35 120 25 100 25 Z",
          mouth: "M100 105 L100 115 M100 115 L85 120 M100 115 L115 120",
          fangs: "M83 120 L88 130 L93 120 M107 120 L112 130 L117 120",
          eyeGlow: "#ff4500"
        };
      case 'howling':
        return {
          head: "M100 20 C85 20 70 30 60 45 L50 60 C45 70 45 80 48 90 L55 110 C58 120 62 130 70 135 L80 145 C85 155 90 160 95 165 L100 170 L105 165 C110 160 115 155 120 145 L130 135 C138 130 142 120 145 110 L152 90 C155 80 155 70 150 60 L140 45 C130 30 115 20 100 20 Z",
          mouth: "M100 100 L100 125 C100 135 95 140 95 140 M100 125 C100 135 105 140 105 140",
          fangs: "M90 130 L92 135 L94 130 M106 130 L108 135 L110 130",
          eyeGlow: "#9370db"
        };
      case 'cool':
        return {
          head: "M100 30 C85 30 72 38 62 50 L52 62 C47 72 47 82 50 92 L57 110 C60 120 64 128 72 133 L75 143 C80 153 85 158 95 163 L100 168 L105 163 C115 158 120 153 125 143 L128 133 C136 128 140 120 143 110 L150 92 C153 82 153 72 148 62 L138 50 C128 38 115 30 100 30 Z",
          mouth: "M100 110 L100 120 M100 120 L92 122 M100 120 L108 122",
          fangs: "M88 122 L90 127 L92 122 M108 122 L110 127 L112 122",
          eyeGlow: "#00ff00"
        };
      case 'focused':
        return {
          head: "M100 30 C85 30 70 38 60 52 L50 65 C45 75 45 85 48 95 L55 112 C58 122 62 130 70 135 L75 145 C80 155 85 160 95 165 L100 170 L105 165 C115 160 120 155 125 145 L130 135 C138 130 142 122 145 112 L152 95 C155 85 155 75 150 65 L140 52 C130 38 115 30 100 30 Z",
          mouth: "M100 108 L100 118 M100 118 L90 123 M100 118 L110 123",
          fangs: "M85 123 L87 128 L89 123 M111 123 L113 128 L115 123",
          eyeGlow: "#ffd700"
        };
      case 'nice':
        return {
          head: "M100 20 C80 20 65 30 55 45 L48 60 C42 70 40 80 43 90 L40 95 L43 100 L48 115 C50 125 55 135 65 145 L70 155 C75 165 85 175 95 180 L100 182 L105 180 C115 175 125 165 130 155 L135 145 C145 135 150 125 152 115 L157 100 L160 95 L157 90 C160 80 158 70 152 60 L145 45 C135 30 120 20 100 20 Z",
          mouth: "M90 120 Q100 125 110 120 M95 122 L105 122",
          fangs: "",
          eyeGlow: "#20b2aa"
        };
      case 'proud':
      default:
        return {
          head: "M100 25 C85 25 70 35 60 50 L50 65 C45 75 45 85 48 95 L55 115 C58 125 62 135 70 140 L75 150 C80 160 85 165 95 170 L100 175 L105 170 C115 165 120 160 125 150 L130 140 C138 135 142 125 145 115 L152 95 C155 85 155 75 150 65 L140 50 C130 35 115 25 100 25 Z",
          mouth: "M100 110 L100 120 M100 120 L90 125 M100 120 L110 125",
          fangs: "M88 125 L90 130 L92 125 M108 125 L110 130 L112 125",
          eyeGlow: "#9400d3"
        };
    }
  };

  const wolfData = getWolfPath(currentBanner.wolfStyle);

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[600px] px-4">
      {/* Main Container with 3D perspective */}
      <div className="relative h-full perspective-1000">
        <motion.div
          className="relative w-full h-full preserve-3d flex items-center justify-center"
          animate={{
            rotateY: [0, 10, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* 3D Wolf Container */}
          <motion.div
            className="relative"
            animate={{
              rotateX: [0, -5, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Wolf Head using SVG */}
            <div className="relative w-[400px] h-[500px]">
              <svg
                viewBox="0 0 200 250"
                className="absolute inset-0 w-full h-full"
                style={{ filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))' }}
              >
                {/* Wolf head outline */}
                <motion.path
                  d={wolfData.head}
                  fill="url(#wolfGradient)"
                  stroke="#333"
                  strokeWidth="2"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  key={`wolf-head-${currentBannerIndex}`}
                />
                
                {/* Ears */}
                <motion.path
                  d="M60 45 L55 20 L70 30 Z"
                  fill="url(#earGradient)"
                  stroke="#333"
                  strokeWidth="2"
                  animate={{ rotate: currentBanner.wolfStyle === 'howling' ? -15 : 0 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.path
                  d="M140 45 L145 20 L130 30 Z"
                  fill="url(#earGradient)"
                  stroke="#333"
                  strokeWidth="2"
                  animate={{ rotate: currentBanner.wolfStyle === 'howling' ? 15 : 0 }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Inner ears */}
                <path d="M62 40 L60 28 L68 33 Z" fill="#ffb6c1" />
                <path d="M138 40 L140 28 L132 33 Z" fill="#ffb6c1" />
                
                {/* Eyes with different colors based on wolf style */}
                <motion.circle 
                  cx="75" 
                  cy="70" 
                  r={currentBanner.wolfStyle === 'fierce' ? "10" : "8"} 
                  fill={wolfData.eyeGlow}
                  animate={{
                    opacity: [1, 0.3, 1],
                  }}
                  transition={{
                    duration: currentBanner.wolfStyle === 'fierce' ? 2 : 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.circle 
                  cx="125" 
                  cy="70" 
                  r={currentBanner.wolfStyle === 'fierce' ? "10" : "8"} 
                  fill={wolfData.eyeGlow}
                  animate={{
                    opacity: [1, 0.3, 1],
                  }}
                  transition={{
                    duration: currentBanner.wolfStyle === 'fierce' ? 2 : 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.1
                  }}
                />
                <circle cx="75" cy="70" r="4" fill="#000" />
                <circle cx="125" cy="70" r="4" fill="#000" />
                
                {/* Snout */}
                <motion.path
                  d="M100 95
                     C90 95 85 100 85 105
                     L85 115
                     C85 125 90 130 100 130
                     C110 130 115 125 115 115
                     L115 105
                     C115 100 110 95 100 95 Z"
                  fill="url(#snoutGradient)"
                  stroke="#333"
                  strokeWidth="2"
                  animate={{
                    scale: currentBanner.wolfStyle === 'howling' ? 1.1 : 1
                  }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Nose */}
                <ellipse cx="100" cy="110" rx="6" ry="4" fill="#000" />
                
                {/* Mouth with different expressions */}
                <motion.path
                  d={wolfData.mouth}
                  stroke="#333"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                  key={`wolf-mouth-${currentBannerIndex}`}
                />
                
                {/* Fangs with different sizes */}
                <motion.path 
                  d={wolfData.fangs} 
                  fill="#fff"
                  animate={{
                    scale: currentBanner.wolfStyle === 'fierce' ? 1.2 : 1
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Gradients */}
                <defs>
                  <linearGradient id="wolfGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6b7280" />
                    <stop offset="100%" stopColor="#374151" />
                  </linearGradient>
                  <linearGradient id="earGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#9ca3af" />
                    <stop offset="100%" stopColor="#6b7280" />
                  </linearGradient>
                  <linearGradient id="snoutGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#9ca3af" />
                    <stop offset="100%" stopColor="#6b7280" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Mouth Area with Banner */}
              <motion.div
                className="absolute bottom-[180px] left-1/2 transform -translate-x-1/2 z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.1, 1],
                  opacity: [0, 1, 1]
                }}
                transition={{
                  duration: 0.5,
                  ease: "backOut"
                }}
                key={`banner-${currentBannerIndex}`}
              >
                <div className={`relative px-8 py-4 rounded-full bg-gradient-to-r ${currentBanner.color} shadow-2xl transform perspective-500 rotateX-15`}>
                  <motion.span
                    className="text-white font-bold text-xl whitespace-nowrap block"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {currentBanner.text}
                  </motion.span>
                  
                  {/* Speech Bubble Tail */}
                  <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 
                    border-l-[15px] border-l-transparent 
                    border-t-[15px] border-t-current
                    border-r-[15px] border-r-transparent`} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* 3D Shadow */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-80 h-20 bg-purple-900/10 rounded-[50%] blur-2xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => {
        // Generate deterministic value based on index
        const seed = (i * 7 + 3) % 11;
        const xPosition = (seed / 11) * 600 - 300;
        
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-3 h-3 bg-purple-400/30 rounded-full"
            initial={{
              x: xPosition,
              y: 0,
              opacity: 0
            }}
            animate={{
              y: [-100, -400],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut"
            }}
            style={{
              left: '50%',
              bottom: '20%',
            }}
          />
        );
      })}
    </div>
  );
}