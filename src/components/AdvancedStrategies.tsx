"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Strategy {
  title: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Medium-High';
  description: string;
  steps: string[];
  rewards: string[];
  risks: string[];
  tips: string[];
}

export default function AdvancedStrategies() {
  const [selectedStrategy, setSelectedStrategy] = useState<string>('leverage-cycling');

  const strategies: Record<string, Strategy> = {
    'leverage-cycling': {
      title: 'Leverage Cycling',
      riskLevel: 'High',
      description: 'Amplify your exposure to LARRY price appreciation through recursive leveraging',
      steps: [
        'Use leverage function to borrow ETH using LARRY collateral',
        'Use a portion of borrowed ETH to buy more LARRY tokens',
        'Put those tokens up as collateral for another loan',
        'Repeat the process until desired exposure is reached',
        'Monitor positions closely and unwind before loan expiry'
      ],
      rewards: [
        'Exponentially amplified returns if LARRY price increases',
        'Access to liquidity while maintaining token exposure',
        'Compound position growth through multiple cycles'
      ],
      risks: [
        'Amplified losses if price decreases',
        'Multiple loans to manage with different expiry dates',
        'Gas costs can add up with multiple transactions',
        'Liquidation cascade risk if unable to repay'
      ],
      tips: [
        'Start small and test with one cycle first',
        'Keep detailed records of all loan positions',
        'Set reminders for loan expiry dates',
        'Always maintain some ETH for repayment'
      ]
    },
    'liquidation-hunting': {
      title: 'Liquidation Hunting',
      riskLevel: 'Medium',
      description: 'Profit from automatic liquidations that increase token value',
      steps: [
        'Monitor upcoming loan expirations via contract events',
        'Calculate potential price impact of liquidations',
        'Buy LARRY tokens before significant liquidations',
        'Hold through the liquidation events',
        'Sell after price increases from liquidations'
      ],
      rewards: [
        'Predictable price appreciation from liquidations',
        'Lower risk compared to leveraged strategies',
        'Opportunity to compound gains over multiple events'
      ],
      risks: [
        'Liquidations might be smaller than expected',
        'Other hunters might front-run your trades',
        'Timing the market requires constant monitoring'
      ],
      tips: [
        'Use blockchain explorers to track loan data',
        'Focus on large loans nearing expiry',
        'Consider the cumulative effect of multiple liquidations',
        'Set up alerts for significant loan expirations'
      ]
    },
    'interest-arbitrage': {
      title: 'Interest Rate Arbitrage',
      riskLevel: 'Medium-High',
      description: 'Exploit interest rate differentials across DeFi platforms',
      steps: [
        'Borrow ETH from external platforms with lower rates',
        'Use borrowed ETH to buy LARRY tokens',
        'Use LARRY as collateral to borrow more ETH (if rates favorable)',
        'Use flashClosePosition when token price appreciates',
        'Repay external loan with profits'
      ],
      rewards: [
        'Profit from interest rate differentials',
        'Gain exposure to LARRY appreciation',
        'Potential for compound returns'
      ],
      risks: [
        'External platform risks and smart contract vulnerabilities',
        'Interest rate changes can affect profitability',
        'LARRY price volatility affects position value',
        'Liquidation risk on external platforms'
      ],
      tips: [
        'Compare rates across multiple platforms',
        'Factor in all fees including gas costs',
        'Monitor both positions continuously',
        'Have exit strategies for different scenarios'
      ]
    },
    'flash-loan-arbitrage': {
      title: 'Flash Loan Arbitrage',
      riskLevel: 'Medium',
      description: 'Use flash loans to capitalize on price inefficiencies',
      steps: [
        'Identify price discrepancies between LARRY and backing value',
        'Execute flash loan for large ETH amount',
        'Buy LARRY if undervalued relative to backing',
        'Immediately sell or use flashClosePosition',
        'Repay flash loan with profit'
      ],
      rewards: [
        'Risk-free profit if executed correctly',
        'No capital required upfront',
        'Can execute large trades without slippage concerns'
      ],
      risks: [
        'High gas costs for failed transactions',
        'Technical complexity in implementation',
        'Competition from other arbitrage bots'
      ],
      tips: [
        'Automate with smart contracts for speed',
        'Test thoroughly on testnet first',
        'Account for all fees in profit calculations',
        'Monitor mempool for competing transactions'
      ]
    }
  };

  const currentStrategy = strategies[selectedStrategy];

  const getRiskColor = (riskLevel: string) => {
    switch(riskLevel) {
      case 'Low': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'Medium-High': return 'text-orange-500';
      case 'High': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getRiskBgColor = (riskLevel: string) => {
    switch(riskLevel) {
      case 'Low': return 'bg-green-500/10 border-green-500/20';
      case 'Medium': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'Medium-High': return 'bg-orange-500/10 border-orange-500/20';
      case 'High': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <section id="strategies" className="py-20 bg-gradient-to-b from-purple-900/10 to-black relative overflow-hidden">
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
            Advanced Trading Strategies
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Maximize your returns with sophisticated DeFi strategies designed for experienced traders
          </p>
        </motion.div>

        {/* Strategy Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {Object.entries(strategies).map(([key, strategy]) => (
            <motion.button
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setSelectedStrategy(key)}
              className={`p-4 rounded-xl border transition-all ${
                selectedStrategy === key
                  ? 'bg-purple-600/20 border-purple-500'
                  : 'bg-purple-900/10 border-purple-500/20 hover:border-purple-500/40'
              }`}
            >
              <h3 className="font-semibold text-white mb-2">{strategy.title}</h3>
              <div className={`text-sm font-medium ${getRiskColor(strategy.riskLevel)}`}>
                Risk: {strategy.riskLevel}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Strategy Details */}
        <motion.div
          key={selectedStrategy}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Strategy Overview */}
            <div className="bg-purple-900/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">{currentStrategy.title}</h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskBgColor(currentStrategy.riskLevel)} border`}>
                  <span className={getRiskColor(currentStrategy.riskLevel)}>
                    {currentStrategy.riskLevel} Risk
                  </span>
                </div>
              </div>
              <p className="text-gray-300 mb-6">{currentStrategy.description}</p>

              {/* Steps */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Implementation Steps</h4>
                <ol className="space-y-2">
                  {currentStrategy.steps.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 font-medium">
                        {index + 1}
                      </div>
                      <p className="text-gray-300">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                <h4 className="text-lg font-semibold text-white mb-3">💡 Pro Tips</h4>
                <ul className="space-y-2">
                  {currentStrategy.tips.map((tip, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-blue-400">•</span>
                      <p className="text-gray-300">{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Example Scenario */}
            <div className="bg-purple-900/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <h4 className="text-lg font-semibold text-white mb-4">Example Scenario</h4>
              <div className="space-y-4">
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Initial Capital:</span>
                      <p className="text-white font-mono">10 ETH</p>
                    </div>
                    <div>
                      <span className="text-gray-400">LARRY Price:</span>
                      <p className="text-white font-mono">0.001 ETH</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Target Exposure:</span>
                      <p className="text-white font-mono">50 ETH worth</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Time Horizon:</span>
                      <p className="text-white font-mono">30 days</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-gray-300">
                  <p>In this scenario, using {currentStrategy.title} strategy could potentially yield:</p>
                  <div className="mt-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-green-400 font-semibold">
                      Best Case: +300% returns if LARRY appreciates 20%
                    </p>
                  </div>
                  <div className="mt-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <p className="text-red-400 font-semibold">
                      Worst Case: -90% if unable to manage loans properly
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rewards */}
            <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20">
              <h4 className="text-lg font-semibold text-white mb-4">🎯 Potential Rewards</h4>
              <ul className="space-y-2">
                {currentStrategy.rewards.map((reward, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-green-400">✓</span>
                    <p className="text-gray-300 text-sm">{reward}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20">
              <h4 className="text-lg font-semibold text-white mb-4">⚠️ Associated Risks</h4>
              <ul className="space-y-2">
                {currentStrategy.risks.map((risk, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-red-400">!</span>
                    <p className="text-gray-300 text-sm">{risk}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Management */}
            <div className="bg-purple-900/10 rounded-xl p-6 border border-purple-500/20">
              <h4 className="text-lg font-semibold text-white mb-4">🛡️ Risk Management</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Never invest more than you can afford to lose</li>
                <li>• Always have an exit strategy</li>
                <li>• Monitor positions continuously</li>
                <li>• Keep emergency ETH for loan repayments</li>
                <li>• Diversify across multiple strategies</li>
              </ul>
            </div>

            {/* Tools & Resources */}
            <div className="bg-purple-900/10 rounded-xl p-6 border border-purple-500/20">
              <h4 className="text-lg font-semibold text-white mb-4">🔧 Recommended Tools</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-purple-400 hover:text-purple-300">
                    • Loan Tracker Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="text-purple-400 hover:text-purple-300">
                    • Price Impact Calculator
                  </a>
                </li>
                <li>
                  <a href="#" className="text-purple-400 hover:text-purple-300">
                    • Liquidation Monitor
                  </a>
                </li>
                <li>
                  <a href="#" className="text-purple-400 hover:text-purple-300">
                    • Strategy Backtester
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Strategy Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 overflow-x-auto"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Strategy Comparison</h3>
          <div className="bg-purple-900/10 rounded-xl border border-purple-500/20 overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-purple-500/20">
                  <th className="px-6 py-4 text-left text-white font-semibold">Strategy</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Risk Level</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Complexity</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Capital Required</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Time Commitment</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Potential ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                <tr>
                  <td className="px-6 py-4 text-gray-300">Leverage Cycling</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-red-400">High</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-orange-400">High</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-yellow-400">Medium</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-red-400">High</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-400">200-500%</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-300">Liquidation Hunting</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-yellow-400">Medium</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-yellow-400">Medium</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-orange-400">High</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-yellow-400">Medium</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-yellow-400">20-50%</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-300">Interest Arbitrage</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-orange-400">Med-High</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-orange-400">High</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-orange-400">High</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-orange-400">High</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-yellow-400">10-30%</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-300">Flash Loan Arbitrage</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-yellow-400">Medium</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-red-400">Very High</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-400">Low</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-400">Low</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-yellow-400">5-15%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-red-500/10 rounded-xl p-6 border border-red-500/20"
        >
          <h4 className="text-lg font-semibold text-white mb-3">⚠️ Important Disclaimer</h4>
          <p className="text-gray-300 text-sm">
            These strategies carry significant financial risk and are intended for experienced DeFi users only. 
            Past performance does not guarantee future results. Always conduct your own research and never invest 
            more than you can afford to lose. Consider consulting with a financial advisor before implementing 
            any advanced trading strategies.
          </p>
        </motion.div>
      </div>
    </section>
  );
}