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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="https://i.ibb.co/sv1n1sW/OIP.jpg"
              alt="Larry Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              $LARRY Dashboard
            </span>
          </Link>
          
          <motion.div
            className="text-2xl absolute left-1/2 transform -translate-x-1/2"
            animate={{ rotate: moonPhase * 45 }}
            transition={{ duration: 0.5 }}
          >
            {moonPhases[moonPhase]}
          </motion.div>

          <div className="flex items-center space-x-4">
            {connected ? (
              <>
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
                  {chainId === '0x1' ? (
                    'Ethereum Mainnet'
                  ) : (
                    <span className="flex items-center">
                      Wrong Network
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  )}
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
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
                >
                  {address.slice(0, 6)}...{address.slice(-4)}
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={connect}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
              >
                Connect Wallet
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}