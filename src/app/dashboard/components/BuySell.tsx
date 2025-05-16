"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getContract, formatEther, parseEther } from '../utils/web3Config';
import { useWallet } from '../providers/WalletProvider';

export default function BuySell() {
  const { connected, address, signer, connect, chainId } = useWallet();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState({
    input: '0',
    output: '0',
    fee: '0',
  });

  useEffect(() => {
    if (amount) {
      calculatePreview();
    } else {
      setPreview({ input: '0', output: '0', fee: '0' });
    }
  }, [amount, activeTab]);

  const calculatePreview = async () => {
    try {
      const contract = await getContract();
      const inputAmount = parseEther(amount);
      
      if (activeTab === 'buy') {
        // Get the buy fee
        const buyFee = await contract.buy_fee();
        const feePercent = ((10000 - Number(buyFee)) / 100);
        
        // Use the contract's ETHtoLARRY function which should match the actual buy result
        let larryAmount;
        try {
          // This should be the most accurate as it's what the contract uses internally
          larryAmount = await contract.ETHtoLARRY(inputAmount);
        } catch (e) {
          // Fallback to getBuyLARRY if ETHtoLARRY fails
          try {
            larryAmount = await contract.getBuyLARRY(inputAmount);
          } catch (e2) {
            // Final fallback
            larryAmount = inputAmount;
          }
        }
        
        // Log for debugging
        console.log(`Buy preview - Input: ${amount} ETH, Output: ${formatEther(larryAmount.toString())} LARRY, Fee: ${feePercent}%`);
        
        setPreview({
          input: amount,
          output: formatEther(larryAmount.toString()),
          fee: feePercent.toFixed(2),
        });
      } else {
        // Calculate sell preview
        const ethAmount = await contract.LARRYtoETH(inputAmount);
        const sellFee = await contract.sell_fee();
        const feePercent = ((10000 - Number(sellFee)) / 100);
        
        setPreview({
          input: amount,
          output: formatEther(ethAmount.toString()),
          fee: feePercent.toFixed(2),
        });
      }
    } catch (error) {
      console.error('Preview calculation error:', error);
    }
  };

  const handleTransaction = async () => {
    if (!connected || !amount || !signer) return;
    
    // Check if on Base Sepolia
    if (chainId !== '0x14a34') {
      alert('Please switch to Base Sepolia network');
      return;
    }
    
    setLoading(true);
    try {
      const contract = await getContract(signer);
      
      let tx;
      if (activeTab === 'buy') {
        // Buy transaction
        const value = parseEther(amount);
        tx = await contract.buy(address, { value });
      } else {
        // Sell transaction
        const larryAmount = parseEther(amount);
        tx = await contract.sell(larryAmount);
      }
      
      // Wait for transaction
      const receipt = await tx.wait();
      
      // Get the actual amount received from events (if available)
      if (receipt.logs) {
        // Try to parse Transfer events to show actual amount received
        for (const log of receipt.logs) {
          try {
            const parsedLog = contract.interface.parseLog(log);
            if (parsedLog && parsedLog.name === 'Transfer' && parsedLog.args.to === address) {
              const actualAmount = formatEther(parsedLog.args.value);
              console.log(`Actual amount received: ${actualAmount} LARRY`);
              console.log(`Predicted amount: ${preview.output} LARRY`);
              console.log(`Difference: ${parseFloat(actualAmount) - parseFloat(preview.output)} LARRY`);
            }
          } catch (e) {}
        }
      }
      
      // Reset form
      setAmount('');
      setPreview({ input: '0', output: '0', fee: '0' });
      
      // Show success
      alert(`Transaction successful! Hash: ${tx.hash}`);
    } catch (error: any) {
      console.error('Transaction error:', error);
      alert(`Transaction failed: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-purple-900/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20"
    >
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
        Trade $LARRY
      </h2>

      {/* Tab Switcher */}
      <div className="flex space-x-1 mb-6 bg-purple-800/20 p-1 rounded-lg">
        {['buy', 'sell'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'buy' | 'sell')}
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

      {connected ? (
        <>
          {/* Chain Warning */}
          {chainId !== '0x14a34' && (
            <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
              ⚠️ Please switch to Base Sepolia network to trade
            </div>
          )}

          {/* Amount Input */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">
              Amount ({activeTab === 'buy' ? 'ETH' : 'LARRY'})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              step="0.000001"
              min="0"
              className="w-full px-4 py-3 bg-purple-800/20 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>

          {/* Preview */}
          {amount && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-purple-800/10 rounded-lg space-y-2"
            >
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">You pay</span>
                <span className="text-white">
                  {preview.input} {activeTab === 'buy' ? 'ETH' : 'LARRY'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">You receive (estimated)</span>
                <span className="text-green-400">
                  ~{parseFloat(preview.output).toFixed(6)} {activeTab === 'buy' ? 'LARRY' : 'ETH'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Fee</span>
                <span className="text-yellow-400">{preview.fee}%</span>
              </div>
              <div className="text-xs text-gray-500 italic">
                *Actual amount may vary slightly due to contract calculations
              </div>
            </motion.div>
          )}

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTransaction}
            disabled={loading || !amount || chainId !== '0x14a34'}
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              loading || !amount || chainId !== '0x14a34'
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : activeTab === 'buy'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              `${activeTab === 'buy' ? 'Buy' : 'Sell'} $LARRY`
            )}
          </motion.button>

          {/* Wallet Info */}
          <div className="mt-4 text-center text-sm text-gray-400">
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        </>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={connect}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          Connect Wallet
        </motion.button>
      )}
    </motion.div>
  );
}