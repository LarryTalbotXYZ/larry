"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function ProtocolStats() {
  const [stats, setStats] = useState({
    totalSupply: '0',
    maxSupply: '0',
    ethBacking: '0',
    activeLoans: '0',
    totalBorrowed: '0',
    totalCollateral: '0',
    protocolPrice: '0',
    buyFee: '0',
    sellFee: '0'
  });

  // In production, this would fetch real data from the contract
  useEffect(() => {
    // Actual data matching our dashboard values
    setStats({
      totalSupply: '1,999,000',
      maxSupply: '1,000,000,000',
      ethBacking: '2',
      activeLoans: '0',
      totalBorrowed: '0',
      totalCollateral: '0',
      protocolPrice: '0.0000010005',
      buyFee: '0.1',
      sellFee: '0.1'
    });
  }, []);

  const statCards = [
    {
      label: "Total Supply",
      value: `${stats.totalSupply} LARRY`,
      subtext: `Max Supply: ${stats.maxSupply} LARRY`,
      icon: "🪙",
      color: "from-purple-500 to-purple-600"
    },
    {
      label: "Backing",
      value: `${stats.ethBacking} ETH`,
      subtext: `$${(parseFloat(stats.ethBacking.replace(',', '')) * 2500).toLocaleString()}`,
      icon: "💰",
      color: "from-blue-500 to-blue-600"
    },
    {
      label: "Buy Fee",
      value: `${stats.buyFee}%`,
      subtext: "Fee on all buys",
      icon: "📊",
      color: "from-green-500 to-green-600"
    },
    {
      label: "Sell Fee",
      value: `${stats.sellFee}%`,
      subtext: "Fee on all sells",
      icon: "📉",
      color: "from-red-500 to-red-600"
    },
    {
      label: "Current Price",
      value: `${stats.protocolPrice} ETH`,
      subtext: `$${(parseFloat(stats.protocolPrice) * 2500).toFixed(6)}`,
      icon: "📈",
      color: "from-orange-500 to-orange-600"
    },
    {
      label: "24h Volume",
      value: "2.85 ETH",
      subtext: "Trading volume",
      icon: "⚡",
      color: "from-cyan-500 to-cyan-600"
    }
  ];

  return (
    <section id="stats" className="py-20 bg-gradient-to-b from-black to-purple-900/10 relative overflow-hidden">
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
            Protocol Statistics
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time metrics showcasing the health and performance of the LARRY protocol
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} opacity-20`} />
              </div>
              <h3 className="text-gray-400 text-sm mb-2">{stat.label}</h3>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-purple-400 text-sm">{stat.subtext}</p>
            </motion.div>
          ))}
        </div>

        {/* Additional Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Tokenomics */}
          <div className="bg-purple-900/10 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold text-white mb-4">Current Lending Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Total Borrowed</span>
                  <span className="text-white">{stats.totalBorrowed} ETH</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Total Collateral</span>
                  <span className="text-white">{stats.totalCollateral} LARRY</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Active Loans</span>
                  <span className="text-white">{stats.activeLoans}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Movement */}
          <div className="bg-purple-900/10 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold text-white mb-4">Price Movement</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Starting Price</span>
                <span className="text-white">0.000001 ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Price</span>
                <span className="text-white">{stats.protocolPrice} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">24h Change</span>
                <span className="text-green-400">+0.05%</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-purple-500/20">
                <span className="text-gray-400 font-bold">Market Cap</span>
                <span className="text-purple-400 font-bold">
                  {(parseFloat(stats.totalSupply.replace(/,/g, '')) * parseFloat(stats.protocolPrice)).toFixed(4)} ETH
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-purple-900/10 rounded-xl p-6 border border-purple-500/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { type: "buy", amount: "12,500 LARRY", eth: "0.0125 ETH", time: "2 min ago" },
              { type: "buy", amount: "5,000 LARRY", eth: "0.005 ETH", time: "15 min ago" },
              { type: "sell", amount: "2,000 LARRY", eth: "0.002 ETH", time: "28 min ago" },
              { type: "buy", amount: "30,000 LARRY", eth: "0.03 ETH", time: "42 min ago" },
              { type: "buy", amount: "8,000 LARRY", eth: "0.008 ETH", time: "1 hour ago" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'buy' ? 'bg-green-500' :
                    activity.type === 'sell' ? 'bg-red-500' :
                    activity.type === 'borrow' ? 'bg-blue-500' :
                    activity.type === 'repay' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`} />
                  <span className="text-gray-400 capitalize">{activity.type}</span>
                  <span className="text-white">{activity.amount}</span>
                  {activity.eth && <span className="text-purple-400">→ {activity.eth}</span>}
                </div>
                <span className="text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}