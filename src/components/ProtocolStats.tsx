"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function ProtocolStats() {
  const [stats, setStats] = useState({
    totalSupply: '0',
    ethBacking: '0',
    activeLoans: '0',
    totalBorrowed: '0',
    protocolPrice: '0',
    apy: '0'
  });

  // In production, this would fetch real data from the contract
  useEffect(() => {
    // Simulated data - replace with actual contract calls
    setStats({
      totalSupply: '1,000,000',
      ethBacking: '2,543.67',
      activeLoans: '187',
      totalBorrowed: '1,892.45',
      protocolPrice: '0.002544',
      apy: '3.9'
    });
  }, []);

  const statCards = [
    {
      label: "Total Value Locked",
      value: `${stats.ethBacking} ETH`,
      subtext: `$${(parseFloat(stats.ethBacking.replace(',', '')) * 2500).toLocaleString()}`,
      icon: "💰",
      color: "from-purple-500 to-purple-600"
    },
    {
      label: "LARRY Supply",
      value: `${stats.totalSupply}`,
      subtext: "Total circulating",
      icon: "🪙",
      color: "from-blue-500 to-blue-600"
    },
    {
      label: "Active Loans",
      value: stats.activeLoans,
      subtext: `${stats.totalBorrowed} ETH borrowed`,
      icon: "📊",
      color: "from-green-500 to-green-600"
    },
    {
      label: "Current Price",
      value: `${stats.protocolPrice} ETH`,
      subtext: `$${(parseFloat(stats.protocolPrice) * 2500).toFixed(2)}`,
      icon: "📈",
      color: "from-orange-500 to-orange-600"
    },
    {
      label: "Protocol APY",
      value: `${stats.apy}%`,
      subtext: "Annual yield",
      icon: "💎",
      color: "from-purple-500 to-pink-600"
    },
    {
      label: "Utilization Rate",
      value: "74.3%",
      subtext: "Capital efficiency",
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
          {/* Loan Distribution */}
          <div className="bg-purple-900/10 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold text-white mb-4">Loan Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Normal Loans</span>
                  <span className="text-white">62%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '62%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Leveraged Positions</span>
                  <span className="text-white">38%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '38%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Fee Distribution */}
          <div className="bg-purple-900/10 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold text-white mb-4">Protocol Revenue (24h)</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Trading Fees</span>
                <span className="text-white">12.4 ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Borrowing Interest</span>
                <span className="text-white">8.7 ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Origination Fees</span>
                <span className="text-white">2.1 ETH</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-purple-500/20">
                <span className="text-gray-400 font-bold">Total Revenue</span>
                <span className="text-purple-400 font-bold">23.2 ETH</span>
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
              { type: "buy", amount: "1,500 LARRY", eth: "3.81 ETH", time: "2 min ago" },
              { type: "borrow", amount: "10 ETH", collateral: "4,000 LARRY", time: "5 min ago" },
              { type: "sell", amount: "500 LARRY", eth: "1.27 ETH", time: "8 min ago" },
              { type: "repay", amount: "5.2 ETH", time: "12 min ago" },
              { type: "leverage", amount: "25 ETH", leverage: "10x", time: "15 min ago" }
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
                  {activity.collateral && <span className="text-purple-400">(Collateral: {activity.collateral})</span>}
                  {activity.leverage && <span className="text-purple-400">({activity.leverage})</span>}
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