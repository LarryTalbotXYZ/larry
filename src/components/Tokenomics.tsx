"use client";

import { motion } from 'framer-motion';

export default function Tokenomics() {
  const protocolMechanics = [
    {
      title: "ETH Backing",
      value: "100%",
      description: "Every LARRY token is backed by ETH in the protocol treasury, providing intrinsic value",
      icon: "🔐",
      highlight: true
    },
    {
      title: "Max Supply",
      value: "1B LARRY",
      description: "Fixed maximum supply of 1,000,000,000 tokens ensures scarcity",
      icon: "💎"
    },
    {
      title: "Trading Fees",
      value: "0.05%",
      description: "Ultra-low trading fees on both buy and sell transactions",
      icon: "💸"
    },
    {
      title: "Team Allocation",
      value: "5%",
      description: "Small team allocation ensures community-first approach",
      icon: "👥"
    }
  ];

  const feeStructure = [
    {
      type: "Buy Fee",
      rate: "0.05%",
      description: "Minimal fee on token purchases",
      icon: "📈"
    },
    {
      type: "Sell Fee",
      rate: "0.05%",
      description: "Minimal fee on token sales",
      icon: "📉"
    },
    {
      type: "Borrow Interest",
      rate: "3.9% APR",
      description: "Annual interest rate for borrowers",
      icon: "💰"
    },
    {
      type: "Origination Fee",
      rate: "0.1%",
      description: "One-time fee on new loans",
      icon: "📋"
    }
  ];

  const protocolFeatures = [
    {
      title: "Price Stability",
      description: "ETH backing creates a price floor that prevents token value from going to zero",
      icon: "⚖️"
    },
    {
      title: "Automatic Liquidation",
      description: "Expired loans are automatically liquidated, maintaining protocol health",
      icon: "🔄"
    },
    {
      title: "Over-Collateralization",
      description: "All loans require minimum 101% collateral for protocol security",
      icon: "🛡️"
    },
    {
      title: "Flash Loan Capability",
      description: "Close positions instantly using flash loans without external capital",
      icon: "⚡"
    }
  ];

  return (
    <section id="tokenomics" className="py-24 bg-gradient-to-b from-purple-900/10 to-black relative overflow-hidden">
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
            Protocol Economics
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            LARRY's innovative tokenomics create a sustainable, ETH-backed ecosystem with aligned incentives for all participants
          </p>
        </motion.div>

        {/* Core Mechanics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {protocolMechanics.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-purple-900/10 backdrop-blur-sm rounded-xl p-6 border ${
                item.highlight ? 'border-purple-400' : 'border-purple-500/20'
              } hover:border-purple-500/40 transition-all duration-300`}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-3xl font-bold text-purple-400 mb-2">{item.value}</p>
              <p className="text-gray-400 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Fee Structure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8">Fee Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feeStructure.map((fee, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-purple-900/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{fee.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-bold text-white">{fee.type}</h4>
                      <span className="text-xl font-bold text-purple-400">{fee.rate}</span>
                    </div>
                    <p className="text-gray-400">{fee.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Protocol Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8">Protocol Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {protocolFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 rounded-xl p-6 border border-purple-500/20"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl mt-1">{feature.icon}</div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 rounded-2xl p-8 border border-purple-500/20"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              The LARRY Advantage
            </h3>
            <p className="text-gray-300 max-w-3xl mx-auto mb-6">
              Unlike traditional DeFi protocols, LARRY combines the best of both worlds: the upside potential of a token with the downside protection of ETH backing. Our innovative bonding curve ensures that each token always has intrinsic value, creating a sustainable ecosystem for traders, borrowers, and lenders alike.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-purple-900/40 rounded-lg px-4 py-2 border border-purple-500/20">
                <span className="text-purple-400 font-bold">Zero Liquidation Risk</span> for Lenders
              </div>
              <div className="bg-purple-900/40 rounded-lg px-4 py-2 border border-purple-500/20">
                <span className="text-purple-400 font-bold">100% ETH Backed</span> Token Value
              </div>
              <div className="bg-purple-900/40 rounded-lg px-4 py-2 border border-purple-500/20">
                <span className="text-purple-400 font-bold">Automated</span> Market Making
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
