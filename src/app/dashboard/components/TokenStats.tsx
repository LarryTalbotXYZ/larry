"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getContract, formatEther, formatUnits } from '../utils/web3Config';
import { useWallet } from '../providers/WalletProvider';

interface TokenStatsProps {
  detailed?: boolean;
}

export default function TokenStats({ detailed = false }: TokenStatsProps) {
  const { connected, address, connect } = useWallet();
  const [stats, setStats] = useState({
    totalSupply: '0',
    maxSupply: '0',
    buyFee: '0',
    sellFee: '0',
    backing: '0',
    lastPrice: '0',
    totalBorrowed: '0',
    totalCollateral: '0',
    walletBalance: '0',
    connected: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const contract = await getContract();
      
      // Fetch contract data
      const [
        totalSupply,
        maxSupply,
        buyFee,
        sellFee,
        backing,
        lastPrice,
        totalBorrowed,
        totalCollateral,
      ] = await Promise.all([
        contract.totalSupply(),
        contract.maxSupply(),
        contract.buy_fee(),
        contract.sell_fee(),
        contract.getBacking(),
        contract.lastPrice(),
        contract.getTotalBorrowed(),
        contract.getTotalCollateral(),
      ]);

      // Get wallet balance if connected
      let walletBalance = '0';
      if (connected && address) {
        try {
          walletBalance = await contract.balanceOf(address);
        } catch (e) {
          console.error('Error getting balance:', e);
        }
      }

      setStats({
        totalSupply: formatUnits(totalSupply.toString()),
        maxSupply: formatUnits(maxSupply.toString()),
        buyFee: ((10000 - Number(buyFee)) / 100).toString(),
        sellFee: ((10000 - Number(sellFee)) / 100).toString(),
        backing: formatEther(backing.toString()),
        lastPrice: formatEther(lastPrice.toString()),
        totalBorrowed: formatEther(totalBorrowed.toString()),
        totalCollateral: formatUnits(totalCollateral.toString()),
        walletBalance: formatUnits(walletBalance.toString()),
        connected,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error loading stats:', error);
      setLoading(false);
    }
  };

  const statItems = [
    { label: 'Total Supply', value: stats.totalSupply, suffix: 'LARRY' },
    { label: 'Max Supply', value: stats.maxSupply, suffix: 'LARRY' },
    { label: 'Buy Fee', value: stats.buyFee, suffix: '%' },
    { label: 'Sell Fee', value: stats.sellFee, suffix: '%' },
    { label: 'Backing', value: stats.backing, suffix: 'ETH' },
    { label: 'Price', value: stats.lastPrice, suffix: 'ETH' },
  ];

  if (detailed) {
    statItems.push(
      { label: 'Total Borrowed', value: stats.totalBorrowed, suffix: 'ETH' },
      { label: 'Total Collateral', value: stats.totalCollateral, suffix: 'LARRY' },
    );
  }

  if (stats.connected) {
    statItems.push({ label: 'Your Balance', value: stats.walletBalance, suffix: 'LARRY' });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-purple-900/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-purple-500/20"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
        Token Statistics
      </h2>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-purple-700/20 rounded w-1/3"></div>
              <div className="h-4 bg-purple-700/20 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {statItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex justify-between items-center text-sm sm:text-base"
            >
              <span className="text-gray-400">{item.label}</span>
              <span className="text-white font-medium text-right">
                {item.label === 'Price' 
                  ? parseFloat(item.value).toLocaleString(undefined, {
                      minimumFractionDigits: 7,
                      maximumFractionDigits: 10,
                    }) 
                  : item.label === 'Your Balance'
                    ? parseFloat(item.value).toLocaleString(undefined, {
                        minimumFractionDigits: 4,
                        maximumFractionDigits: 6,
                      })
                    : parseFloat(item.value).toLocaleString(undefined, {
                        maximumFractionDigits: 4,
                      })}{' '}
                <span className="text-purple-400 text-xs sm:text-sm">{item.suffix}</span>
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {!connected && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={connect}
          className="w-full mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          Connect Wallet
        </motion.button>
      )}
    </motion.div>
  );
}