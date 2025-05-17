"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../providers/WalletProvider';
import Image from 'next/image';
import Link from 'next/link';

export default function WalletHeader() {
  const { connected, address, balance, chainId, connect, disconnect, switchToEthMainnet } = useWallet();
  const [moonPhase, setMoonPhase] = useState(0);
  const moonPhases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];

  useEffect(() => {
    const interval = setInterval(() => {
      setMoonPhase((prev) => (prev + 1) % moonPhases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/80 backdrop-blur-sm border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <Image
              src="https://i.ibb.co/sv1n1sW/OIP.jpg"
              alt="Larry Logo"
              width={32}
              height={32}
              className="rounded-full sm:w-10 sm:h-10"
            />
            <span className="text-sm sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              <span className="hidden sm:inline">$LARRY Dashboard</span>
              <span className="sm:hidden">LARRY</span>
            </span>
          </Link>
          
          {/* Moon Phase - Hidden on mobile */}
          <motion.div
            className="text-xl sm:text-2xl absolute left-1/2 transform -translate-x-1/2 hidden md:block"
            animate={{ rotate: moonPhase * 45 }}
            transition={{ duration: 0.5 }}
          >
            {moonPhases[moonPhase]}
          </motion.div>

          {/* Wallet Section */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-shrink-0">
            {connected ? (
              <>
                {/* Mobile Layout - Compact */}
                <div className="flex items-center gap-1 sm:hidden">
                  {chainId === '0x1' ? (
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  ) : (
                    <motion.button
                      onClick={switchToEthMainnet}
                      className="px-2 py-1 bg-red-900/20 text-red-400 border border-red-500/30 rounded text-xs"
                    >
                      Wrong Net
                    </motion.button>
                  )}
                  <span className="text-xs text-gray-400">{parseFloat(balance).toFixed(2)}</span>
                  <motion.button
                    onClick={disconnect}
                    className="px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded text-white text-xs font-medium"
                  >
                    {address.slice(0, 4)}...{address.slice(-3)}
                  </motion.button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center space-x-2">
                  {/* Network Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      chainId === '0x1'
                        ? 'bg-green-900/20 text-green-400 border border-green-500/30'
                        : 'bg-red-900/20 text-red-400 border border-red-500/30 cursor-pointer'
                    }`}
                    onClick={chainId !== '0x1' ? switchToEthMainnet : undefined}
                  >
                    {chainId === '0x1' ? 'Ethereum Mainnet' : 'Wrong Network'}
                  </motion.div>

                  {/* Balance */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1 bg-purple-900/20 rounded-full text-sm text-purple-400 border border-purple-500/30"
                  >
                    {parseFloat(balance).toFixed(4)} ETH
                  </motion.div>

                  {/* Address */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={disconnect}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors text-base"
                  >
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </motion.button>
                </div>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={connect}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors text-xs sm:text-base"
              >
                <span className="hidden sm:inline">Connect Wallet</span>
                <span className="sm:hidden">Connect</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}