"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TokenStats from './components/TokenStats';
import BuySell from './components/BuySell';
import PriceChart from './components/PriceChart';
import LoanManager from './components/LoanManager';
import WalletHeader from './components/WalletHeader';
import Image from 'next/image';
import Link from 'next/link';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'trading' | 'leverage' | 'stats'>('trading');
  const [moonPhase, setMoonPhase] = useState(0);
  const moonPhases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];

  useEffect(() => {
    const interval = setInterval(() => {
      setMoonPhase((prev) => (prev + 1) % moonPhases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <WalletHeader />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-purple-900/20 p-1 rounded-lg">
          {['trading', 'leverage', 'stats'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-purple-600/20'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'trading' && (
            <div className="max-w-2xl mx-auto">
              <BuySell />
            </div>
          )}

          {activeTab === 'leverage' && (
            <div className="max-w-4xl mx-auto">
              <LoanManager />
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TokenStats detailed />
              <div className="bg-purple-900/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-bold mb-4 text-purple-400">Market Stats</h3>
                <PriceChart />
              </div>
            </div>
          )}
        </motion.div>

        {/* Background Effects */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-96 -left-96 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
          <motion.div
            className="absolute -bottom-96 -right-96 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        </div>
      </div>
    </div>
  );
}