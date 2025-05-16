"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getContract, formatEther } from '../utils/web3Config';

interface PriceData {
  time: number;
  price: number;
  volume: number;
}

export default function PriceChart() {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [currentPrice, setCurrentPrice] = useState('0');
  const [priceChange, setPriceChange] = useState('0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPriceData();
    const interval = setInterval(loadPriceData, 15000); // Update every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const loadPriceData = async () => {
    try {
      const contract = await getContract();
      
      // Get current price
      const lastPrice = await contract.lastPrice();
      const formattedPrice = formatEther(lastPrice.toString());
      setCurrentPrice(formattedPrice);
      
      // Since we can't access historical price data from the contract,
      // we'll simulate it for demo purposes
      const now = Date.now();
      const mockData: PriceData[] = [];
      const basePrice = parseFloat(formattedPrice);
      
      // Generate 24 hours of mock data
      for (let i = 23; i >= 0; i--) {
        const time = now - (i * 3600000); // Hours ago
        const variance = (Math.random() - 0.5) * 0.1; // ±5% variance
        const price = basePrice * (1 + variance);
        const volume = Math.random() * 10; // Random volume 0-10 ETH
        
        mockData.push({ time, price, volume });
      }
      
      // Add current data point
      mockData.push({
        time: now,
        price: basePrice,
        volume: 0,
      });
      
      setPriceData(mockData);
      
      // Calculate price change (last 24h)
      if (mockData.length > 1) {
        const oldPrice = mockData[0].price;
        const change = ((basePrice - oldPrice) / oldPrice * 100).toFixed(2);
        setPriceChange(change);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading price data:', error);
      setLoading(false);
    }
  };

  const getChartPath = () => {
    if (priceData.length < 2) return '';
    
    const width = 400;
    const height = 200;
    const padding = 20;
    
    const minPrice = Math.min(...priceData.map(d => d.price));
    const maxPrice = Math.max(...priceData.map(d => d.price));
    const priceRange = maxPrice - minPrice || 1;
    
    const xScale = (width - 2 * padding) / (priceData.length - 1);
    const yScale = (height - 2 * padding) / priceRange;
    
    const points = priceData.map((data, index) => {
      const x = padding + index * xScale;
      const y = height - padding - ((data.price - minPrice) * yScale);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-purple-900/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Price Chart
          </h2>
          <p className="text-gray-400 text-sm mt-1">24h Price Movement</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {parseFloat(currentPrice).toFixed(6)} ETH
          </div>
          <div className={`text-sm font-medium ${
            parseFloat(priceChange) >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {parseFloat(priceChange) >= 0 ? '+' : ''}{priceChange}%
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="relative h-48">
          <svg
            viewBox="0 0 400 200"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={`h-${i}`}
                x1="20"
                y1={20 + i * 40}
                x2="380"
                y2={20 + i * 40}
                stroke="rgba(139, 92, 246, 0.1)"
                strokeWidth="1"
              />
            ))}
            
            {/* Price line */}
            <motion.path
              d={getChartPath()}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />
            
            {/* Area fill */}
            <motion.path
              d={`${getChartPath()} L 380,180 L 20,180 Z`}
              fill="url(#areaGradient)"
              opacity="0.2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
            
            {/* Gradients */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#7e22ce" />
              </linearGradient>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#7e22ce" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Price points */}
          <div className="absolute inset-0">
            {priceData.slice(-12).map((data, index) => {
              const x = 20 + (index / 11) * 360;
              const minPrice = Math.min(...priceData.map(d => d.price));
              const maxPrice = Math.max(...priceData.map(d => d.price));
              const priceRange = maxPrice - minPrice || 1;
              const y = 180 - ((data.price - minPrice) / priceRange) * 160;
              
              return (
                <motion.div
                  key={index}
                  className="absolute w-2 h-2 bg-purple-500 rounded-full"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                />
              );
            })}
          </div>
        </div>
      )}
      
      {/* Volume indicator */}
      <div className="mt-4 text-sm text-gray-400">
        24h Volume: {priceData.reduce((sum, d) => sum + d.volume, 0).toFixed(2)} ETH
      </div>
    </motion.div>
  );
}