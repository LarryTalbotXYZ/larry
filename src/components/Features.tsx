"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Features() {
  const [activeTab, setActiveTab] = useState('borrow');

  const features = {
    borrow: {
      title: "Flexible Borrowing Options",
      subtitle: "Access ETH liquidity using your LARRY tokens",
      features: [
        {
          icon: "💰",
          title: "Collateralized Loans",
          description: "Borrow ETH using LARRY as collateral with competitive rates"
        },
        {
          icon: "🚀",
          title: "Leveraged Positions",
          description: "Open leveraged positions with up to 99% LTV ratio"
        },
        {
          icon: "🔄",
          title: "Borrow More",
          description: "Add to existing loans without closing positions"
        },
        {
          icon: "⏰",
          title: "Flexible Terms",
          description: "Choose loan duration from 1 day to 365 days"
        }
      ]
    },
    lend: {
      title: "Zero-Risk Lending",
      subtitle: "Earn yield with complete capital protection",
      features: [
        {
          icon: "🛡️",
          title: "No Liquidation Risk",
          description: "Protocol guarantees full repayment - lenders never lose"
        },
        {
          icon: "📈",
          title: "Competitive APY",
          description: "Earn attractive yields from borrower interest rates"
        },
        {
          icon: "💎",
          title: "ETH-Backed Security",
          description: "Every loan is overcollateralized with protocol backing"
        },
        {
          icon: "⚡",
          title: "Instant Access",
          description: "Deposit and withdraw anytime with no lock-up periods"
        }
      ]
    },
    trade: {
      title: "Advanced Trading",
      subtitle: "Trade LARRY with guaranteed liquidity",
      features: [
        {
          icon: "🔧",
          title: "Automated Market Making",
          description: "Always-on liquidity with algorithmic price discovery"
        },
        {
          icon: "💸",
          title: "Low Fees",
          description: "0.05% buy fee and 0.05% sell fee"
        },
        {
          icon: "📊",
          title: "Price Stability",
          description: "ETH backing provides intrinsic value floor"
        },
        {
          icon: "🔒",
          title: "MEV Protection",
          description: "Fair pricing with protection against sandwich attacks"
        }
      ]
    }
  };

  const currentFeatures = features[activeTab as keyof typeof features];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-black to-purple-900/10 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/images/stars.png')] bg-cover opacity-5" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powerful DeFi Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the next generation of decentralized finance with LARRY's innovative protocol mechanics
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg bg-purple-900/20 p-1 backdrop-blur-sm border border-purple-500/20">
            {Object.keys(features).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-purple-600/20'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              {currentFeatures.title}
            </h3>
            <p className="text-gray-300 text-lg">
              {currentFeatures.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentFeatures.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-purple-900/10 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature Highlights */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 rounded-xl p-6 border border-purple-500/20"
            >
              <h4 className="text-lg font-bold text-white mb-2">Interest Rates</h4>
              <p className="text-3xl font-bold text-purple-400 mb-2">3.9%</p>
              <p className="text-gray-400 text-sm">Annual base rate + 0.1% origination</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 rounded-xl p-6 border border-purple-500/20"
            >
              <h4 className="text-lg font-bold text-white mb-2">Collateral Ratio</h4>
              <p className="text-3xl font-bold text-purple-400 mb-2">101%</p>
              <p className="text-gray-400 text-sm">Minimum for borrowing</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 rounded-xl p-6 border border-purple-500/20"
            >
              <h4 className="text-lg font-bold text-white mb-2">Max Duration</h4>
              <p className="text-3xl font-bold text-purple-400 mb-2">365 Days</p>
              <p className="text-gray-400 text-sm">Maximum loan term</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}