"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const [windowSize, setWindowSize] = useState({ width: 1000, height: 800 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });

      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        yoyo: Infinity
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-purple-900/10 via-black to-black">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/stars.png')] bg-cover opacity-10" />
        
        {/* Floating Elements */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 bg-purple-400/20 rounded-full"
            animate={{
              x: [
                Math.random() * (windowSize.width || 1000),
                Math.random() * (windowSize.width || 1000)
              ],
              y: [
                Math.random() * (windowSize.height || 800),
                Math.random() * (windowSize.height || 800)
              ],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 1.5 
            }}
            className="relative w-32 h-32 mx-auto mb-8"
          >
            <Image
              src="/images/logo32x32.png"
              alt="Larry Talbot Logo"
              width={128}
              height={128}
              className="rounded-full border-4 border-purple-500/30 shadow-lg shadow-purple-500/10"
              priority
            />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-purple-400/30"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            ETH-Backed{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
              DeFi Protocol
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto"
          >
            LARRY is a revolutionary DeFi token backed by ETH reserves. Trade, borrow, and leverage with guaranteed liquidity and zero liquidation risk for lenders.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <Link href="/dashboard">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-lg transition-colors shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
              >
                Launch Dashboard
              </motion.button>
            </Link>
            
            <motion.a
              href="https://basescan.org/address/YOUR_CONTRACT_ADDRESS"
              target="_blank"
              rel="noopener noreferrer"
              variants={buttonVariants}
              whileHover="hover"
              className="px-8 py-4 bg-transparent border-2 border-purple-500 text-white rounded-lg font-bold text-lg transition-colors hover:bg-purple-500/10"
            >
              View Contract
            </motion.a>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20">
            {[
              {
                title: "ETH-Backed",
                description: "Every LARRY token is backed by ETH in the protocol treasury",
                icon: "🔐",
                stat: "100% Backed"
              },
              {
                title: "0% Liquidation",
                description: "Lenders never face liquidation risk - protocol guarantees repayment",
                icon: "🛡️",
                stat: "Zero Risk"
              },
              {
                title: "Instant Liquidity",
                description: "Trade in and out instantly with automated market making",
                icon: "⚡",
                stat: "24/7 Trading"
              },
              {
                title: "Leverage Up",
                description: "Access up to 99% leverage on your positions",
                icon: "📈",
                stat: "99% LTV"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-6 rounded-xl bg-purple-900/10 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 mb-3 text-sm">
                  {feature.description}
                </p>
                <div className="text-purple-400 font-bold text-lg">
                  {feature.stat}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
