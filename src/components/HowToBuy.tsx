"use client";

import { motion } from 'framer-motion';
import { FaEthereum, FaWallet, FaRocket, FaChartLine } from 'react-icons/fa';
import Link from 'next/link';

export default function HowToBuy() {
  const steps = [
    {
      icon: FaWallet,
      title: "Connect Wallet",
      description: "Use any Web3 wallet like MetaMask or WalletConnect on Base Network"
    },
    {
      icon: FaEthereum,
      title: "Choose Amount",
      description: "Enter ETH amount to trade or LARRY to borrow against"
    },
    {
      icon: FaChartLine,
      title: "Execute Trade",
      description: "Confirm transaction through the dashboard with instant execution"
    }
  ];

  const tradingOptions = [
    {
      title: "Direct Buy/Sell",
      description: "Trade LARRY instantly through the protocol's bonding curve",
      features: ["0.05% trading fee", "No slippage concerns", "Real-time pricing"],
      icon: "💱"
    },
    {
      title: "Borrowing",
      description: "Use LARRY as collateral to borrow ETH",
      features: ["3.9% APR", "Up to 365 days", "No liquidation risk"],
      icon: "🏦"
    },
    {
      title: "Leverage Trading", 
      description: "Open leveraged positions with minimal capital",
      features: ["Up to 99% LTV", "Automated collateral", "Flash close option"],
      icon: "📈"
    }
  ];

  return (
    <section id="how-to-buy" className="py-20 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/stars.png')] opacity-5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Start Trading <span className="text-purple-400">$LARRY</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Access the LARRY protocol through our intuitive dashboard interface
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-purple-900/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
                  <step.icon className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trading Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-8">Trading Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tradingOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-b from-purple-900/20 to-purple-800/10 rounded-xl p-6 border border-purple-500/20"
              >
                <div className="text-4xl mb-4">{option.icon}</div>
                <h4 className="text-xl font-bold text-white mb-3">{option.title}</h4>
                <p className="text-gray-400 mb-4">{option.description}</p>
                <ul className="space-y-2">
                  {option.features.map((feature, i) => (
                    <li key={i} className="text-purple-300 text-sm flex items-center gap-2">
                      <span className="text-purple-400">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contract Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-purple-900/10 rounded-xl p-8 border border-purple-500/20 mb-12"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-6">Contract Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-purple-400 font-semibold mb-2">Contract Address (Base)</h4>
              <code className="text-white text-sm break-all bg-black/40 p-2 rounded block">
                0x8F85710fEf0f3c024B9E21B98d8D7F4D3f4d96aE
              </code>
            </div>
            <div>
              <h4 className="text-purple-400 font-semibold mb-2">Token Symbol</h4>
              <code className="text-white text-sm bg-black/40 p-2 rounded block">
                LARRY
              </code>
            </div>
            <div>
              <h4 className="text-purple-400 font-semibold mb-2">Decimals</h4>
              <code className="text-white text-sm bg-black/40 p-2 rounded block">
                18
              </code>
            </div>
            <div>
              <h4 className="text-purple-400 font-semibold mb-2">Network</h4>
              <code className="text-white text-sm bg-black/40 p-2 rounded block">
                Base Mainnet
              </code>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <Link href="/dashboard">
            <button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-medium text-xl transition-all duration-300 transform hover:scale-105">
              Launch Dashboard
              <FaRocket className="w-6 h-6" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
