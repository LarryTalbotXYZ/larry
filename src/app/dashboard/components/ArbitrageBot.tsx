'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../providers/WalletProvider';
import { ethers } from 'ethers';
import { TrendingUp, Play, Pause, RefreshCw, Info, DollarSign, Activity, Shield } from 'lucide-react';
import arbitrageLarryV3ABI from '../utils/arbitrageLarryV3ABI.json';

interface KyberRoute {
  routeSummary: {
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
    amountOut: string;
    gas: string;
    gasPrice: string;
    gasUsd: string;
    amountInUsd: string;
    amountOutUsd: string;
  };
}

interface ArbitrageOpportunity {
  direction: boolean;
  directionName: string;
  route: any;
  expectedReturn: string;
  principalAmount: string;
  estimatedProfit?: string;
  actualEthReturn?: string;
}

interface BotStats {
  volumeGenerated: string;
  gasRebated: string;
  tradesExecuted: number;
  totalGasReimbursed: string;
}

export default function ArbitrageBot() {
  const { connected, connect, signer, address } = useWallet();
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [opportunity, setOpportunity] = useState<ArbitrageOpportunity | null>(null);
  const [botStats, setBotStats] = useState<BotStats>({
    volumeGenerated: '0',
    gasRebated: '0',
    tradesExecuted: 0,
    totalGasReimbursed: '0'
  });
  const [tradeAmount, setTradeAmount] = useState('0.002');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [txHistory, setTxHistory] = useState<any[]>([]);
  const [profitRecipient, setProfitRecipient] = useState<string>('');
  const [gasReimbursementAmount, setGasReimbursementAmount] = useState<string>('0.00005');
  const [checkingDirection, setCheckingDirection] = useState<'both' | 'kyber-to-larry' | 'larry-to-kyber'>('kyber-to-larry');

  // V3 Arbitrage contract - Principal Protected with Gas Reimbursement
  const ARBITRAGE_CONTRACT = '0x7Bee2beF4adC5504CD747106924304d26CcFBd94';
  const LARRY_ADDRESS = '0x888d81e3ea5E8362B5f69188CBCF34Fa8da4b888';
  const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
  const WETH_ADDRESS = '0x4200000000000000000000000000000000000006'; // Base WETH

  // Load contract info on mount
  useEffect(() => {
    const loadContractInfo = async () => {
      if (!signer) return;
      
      try {
        const contract = new ethers.Contract(ARBITRAGE_CONTRACT, arbitrageLarryV3ABI, signer);
        const gasReimbursement = await contract.gasReimbursement();
        const recipient = await contract.profitRecipient();
        
        setGasReimbursementAmount(ethers.formatEther(gasReimbursement));
        setProfitRecipient(recipient);
      } catch (error) {
        console.error('Error loading contract info:', error);
      }
    };

    loadContractInfo();
  }, [signer]);

  // Get KyberSwap route
  const getKyberSwapRoute = async (tokenIn: string, tokenOut: string, amountIn: string): Promise<KyberRoute | null> => {
    try {
      const amountInWei = ethers.parseEther(amountIn).toString();
      const url = `https://aggregator-api.kyberswap.com/base/api/v1/routes`;
      const params = new URLSearchParams({
        tokenIn,
        tokenOut,
        amountIn: amountInWei
      });

      console.log('Fetching KyberSwap route:', {
        tokenIn,
        tokenOut,
        amountIn: amountIn,
        amountInWei,
        url: `${url}?${params}`
      });

      const response = await fetch(`${url}?${params}`);
      const data = await response.json();
      
      if (response.ok && data.data) {
        console.log('KyberSwap route found:', data.data.routeSummary);
        return data.data;
      } else {
        console.warn('KyberSwap route not found:', data);
        return null;
      }
    } catch (error) {
      console.error('Error getting KyberSwap route:', error);
      return null;
    }
  };

  // Build KyberSwap swap data
  const buildKyberSwapData = async (routeSummary: any): Promise<string | null> => {
    try {
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      
      console.log('Building swap data for route:', {
        tokenIn: routeSummary.tokenIn,
        tokenOut: routeSummary.tokenOut,
        amountIn: routeSummary.amountIn,
        amountOut: routeSummary.amountOut
      });
      
      const response = await fetch('https://aggregator-api.kyberswap.com/base/api/v1/route/build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          routeSummary,
          sender: ARBITRAGE_CONTRACT,
          recipient: ARBITRAGE_CONTRACT,
          slippageTolerance: 500, // 5% - increased for better execution
          deadline
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.data?.data;
      } else {
        const errorData = await response.text();
        console.error('KyberSwap API error:', errorData);
      }
      return null;
    } catch (error) {
      console.error('Error building swap data:', error);
      return null;
    }
  };

  // Check for arbitrage opportunities
  const checkOpportunity = useCallback(async () => {
    if (!signer || !connected) return;
    
    setIsChecking(true);
    try {
      let bestOpportunity: ArbitrageOpportunity | null = null;
      
      // Check Kyber -> Larry direction (Buy LARRY on Kyber, sell on Larry DEX)
      if (checkingDirection === 'kyber-to-larry' || checkingDirection === 'both') {
        // Try with ETH address first, then WETH if that fails
        let kyberRoute = await getKyberSwapRoute(ETH_ADDRESS, LARRY_ADDRESS, tradeAmount);
        
        // If no route found with ETH address, try WETH
        if (!kyberRoute || !kyberRoute.routeSummary) {
          console.log('No route found with ETH address, trying WETH...');
          kyberRoute = await getKyberSwapRoute(WETH_ADDRESS, LARRY_ADDRESS, tradeAmount);
        }
        
        if (kyberRoute && kyberRoute.routeSummary) {
          const larryAmountFromKyber = ethers.formatUnits(kyberRoute.routeSummary.amountOut, 18);
          
          // Now check how much ETH we'd get selling this LARRY on Larry DEX
          // We need to call the contract to get the actual return amount
          try {
            const larryAmountWei = ethers.parseUnits(larryAmountFromKyber, 18);
            
            // Get quote from Larry DEX for selling LARRY
            const larryContract = new ethers.Contract(LARRY_ADDRESS, ['function LARRYtoETH(uint256 value) view returns (uint256)'], signer);
            const ethReturnFromLarry = await larryContract.LARRYtoETH(larryAmountWei);
            const ethReturnFormatted = ethers.formatEther(ethReturnFromLarry);
            
            const requiredReturn = parseFloat(tradeAmount) + parseFloat(gasReimbursementAmount);
            const estimatedProfit = parseFloat(ethReturnFormatted) - requiredReturn;
            
            console.log('Kyber->Larry Direction:', {
              inputETH: tradeAmount,
              larryFromKyber: larryAmountFromKyber,
              ethFromLarryDex: ethReturnFormatted,
              profit: estimatedProfit
            });
            
            // Store the opportunity even if not profitable, so we can show it
            bestOpportunity = {
              direction: true,
              directionName: 'ETH → LARRY (Kyber) → ETH (Larry)',
              route: kyberRoute.routeSummary,
              expectedReturn: larryAmountFromKyber,
              principalAmount: tradeAmount,
              estimatedProfit: estimatedProfit.toFixed(6),
              actualEthReturn: ethReturnFormatted
            };
          } catch (error) {
            console.error('Error getting Larry DEX quote:', error);
          }
        }
      }
      
      // Check Larry -> Kyber direction (Buy LARRY on Larry DEX, sell on Kyber)
      if (checkingDirection === 'larry-to-kyber' || checkingDirection === 'both') {
        try {
          const ethAmountWei = ethers.parseEther(tradeAmount);
          
          // Get quote from Larry DEX for buying LARRY with ETH
          const larryContract = new ethers.Contract(LARRY_ADDRESS, ['function getBuyLARRY(uint256 amount) view returns (uint256)'], signer);
          
          // Use getBuyLARRY which calculates: (amount * totalSupply * buy_fee) / backing / FEE_BASE_10000
          const larryAmountFromDex = await larryContract.getBuyLARRY(ethAmountWei);
          
          // Larry DEX gives exactly what it shows, no slippage needed
          const larryAmountFormatted = ethers.formatUnits(larryAmountFromDex, 18);
          
          // Now check Kyber price for selling this adjusted LARRY amount
          let kyberRoute = await getKyberSwapRoute(LARRY_ADDRESS, ETH_ADDRESS, larryAmountFormatted);
          
          // If no route found with ETH address, try WETH
          if (!kyberRoute || !kyberRoute.routeSummary) {
            console.log('No route found with ETH address for selling, trying WETH...');
            kyberRoute = await getKyberSwapRoute(LARRY_ADDRESS, WETH_ADDRESS, larryAmountFormatted);
          }
          
          if (kyberRoute && kyberRoute.routeSummary) {
            const ethReturnFromKyber = ethers.formatUnits(kyberRoute.routeSummary.amountOut, 18);
            const requiredReturn = parseFloat(tradeAmount) + parseFloat(gasReimbursementAmount);
            const estimatedProfit = parseFloat(ethReturnFromKyber) - requiredReturn;
            
            console.log('Larry->Kyber Direction:', {
              inputETH: tradeAmount,
              larryFromDex: larryAmountFormatted,
              ethFromKyber: ethReturnFromKyber,
              profit: estimatedProfit
            });
            
            // Store the opportunity if it's better than what we have (or if we have none)
            if (!bestOpportunity || estimatedProfit > parseFloat(bestOpportunity.estimatedProfit || '0')) {
              bestOpportunity = {
                direction: false,
                directionName: 'ETH → LARRY (Larry) → ETH (Kyber)',
                route: kyberRoute.routeSummary,
                expectedReturn: ethReturnFromKyber,
                principalAmount: tradeAmount,
                estimatedProfit: estimatedProfit.toFixed(6)
              };
            }
          }
        } catch (error) {
          console.error('Error getting Larry DEX quote:', error);
        }
      }
      
      setOpportunity(bestOpportunity);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Error checking opportunity:', error);
      setOpportunity(null);
    } finally {
      setIsChecking(false);
    }
  }, [signer, connected, tradeAmount, checkingDirection, gasReimbursementAmount]);

  // Execute arbitrage trade
  const executeArbitrage = async () => {
    if (!signer || !opportunity || !connected) return;
    
    setIsExecuting(true);
    try {
      // Build swap data
      const swapData = await buildKyberSwapData(opportunity.route);
      if (!swapData) {
        throw new Error('Failed to build swap data');
      }

      const contract = new ethers.Contract(ARBITRAGE_CONTRACT, arbitrageLarryV3ABI, signer);
      const valueInWei = ethers.parseEther(opportunity.principalAmount);
      
      // Remove '0x' prefix from swapData if present
      const swapDataBytes = swapData.startsWith('0x') ? swapData.slice(2) : swapData;
      
      console.log('Executing arbitrage:', {
        direction: opportunity.direction,
        directionName: opportunity.directionName,
        principalAmount: opportunity.principalAmount,
        expectedReturn: opportunity.expectedReturn,
        estimatedProfit: opportunity.estimatedProfit,
        swapDataLength: swapDataBytes.length
      });
      
      // For Larry->Kyber direction, we need to check if the contract can handle the swap
      if (!opportunity.direction) {
        // Simulate the trade first
        try {
          const larryAmountExpected = ethers.parseUnits(opportunity.route.amountIn, 18);
          console.log('Expected LARRY amount for Kyber swap:', ethers.formatUnits(larryAmountExpected, 18));
          
          // The contract will buy LARRY first, let's check if it matches what Kyber expects
          const larryContract = new ethers.Contract(LARRY_ADDRESS, ['function getBuyLARRY(uint256 amount) view returns (uint256)'], signer);
          const actualLarryAmount = await larryContract.getBuyLARRY(valueInWei);
          console.log('Actual LARRY from Larry DEX:', ethers.formatUnits(actualLarryAmount, 18));
          
          if (actualLarryAmount < larryAmountExpected) {
            console.warn('Warning: Larry DEX will provide less LARRY than Kyber expects. Adjusting slippage might help.');
          }
        } catch (error) {
          console.error('Simulation check failed:', error);
        }
      }
      
      // Execute the arbitrage
      const tx = await contract.executePrincipalProtectedArbitrage(
        '0x' + swapDataBytes,
        opportunity.direction,
        {
          value: valueInWei,
          gasLimit: 800000
        }
      );
      
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        // Update stats
        setBotStats(prev => ({
          volumeGenerated: (parseFloat(prev.volumeGenerated) + parseFloat(opportunity.principalAmount) * 2).toFixed(4),
          gasRebated: (parseFloat(prev.gasRebated) + parseFloat(gasReimbursementAmount)).toFixed(6),
          tradesExecuted: prev.tradesExecuted + 1,
          totalGasReimbursed: (parseFloat(prev.totalGasReimbursed) + parseFloat(gasReimbursementAmount)).toFixed(6)
        }));
        
        // Add to history
        setTxHistory(prev => [{
          timestamp: new Date(),
          principalReturned: opportunity.principalAmount,
          gasReimbursed: gasReimbursementAmount,
          direction: opportunity.directionName,
          txHash: receipt.hash,
          volumeGenerated: (parseFloat(opportunity.principalAmount) * 2).toFixed(4)
        }, ...prev].slice(0, 10));
      }
      
    } catch (error: any) {
      console.error('Error executing arbitrage:', error);
      
      let errorMessage = 'Unknown error';
      if (error?.reason) {
        errorMessage = error.reason;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Parse common contract errors
      if (errorMessage.includes('TRANSFER_FROM_FAILED')) {
        errorMessage = 'Token transfer failed. This usually happens when the DEX prices have changed. Please try again.';
      } else if (errorMessage.includes('insufficient return')) {
        errorMessage = 'Trade would not be profitable after gas costs. Waiting for better market conditions.';
      }
      
      alert(`Arbitrage failed: ${errorMessage}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Auto-check when bot is running
  useEffect(() => {
    if (!isBotRunning) return;
    
    checkOpportunity();
    const interval = setInterval(checkOpportunity, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [isBotRunning, checkOpportunity]);

  // Auto-execute when profitable opportunity is found and bot is running
  useEffect(() => {
    if (!opportunity || !isBotRunning || isExecuting) return;
    if (!opportunity.estimatedProfit || parseFloat(opportunity.estimatedProfit) <= 0) return;
    
    executeArbitrage();
  }, [opportunity, isBotRunning]);

  return (
    <div className="space-y-6">
      {/* Show message if wallet not connected */}
      {!connected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/10 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20"
        >
          <div className="flex items-center gap-3">
            <Info className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-yellow-400 font-semibold">Wallet Not Connected</p>
              <p className="text-gray-300 text-sm mt-1">Please connect your wallet using the button in the header to use the arbitrage bot.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bot Status Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">V3 Arbitrage Bot</h2>
            <p className="text-gray-400">Principal Protected + Gas Reimbursement</p>
            {opportunity && (
              <p className={`text-sm mt-1 ${parseFloat(opportunity.estimatedProfit || '0') > 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                {parseFloat(opportunity.estimatedProfit || '0') > 0 
                  ? '✓ Profitable opportunity available' 
                  : '⚠ Waiting for profitable conditions'}
              </p>
            )}
          </div>
          
          <button
            onClick={() => setIsBotRunning(!isBotRunning)}
            disabled={isExecuting || !connected}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              isBotRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isBotRunning ? (
              <>
                <Pause className="w-5 h-5" />
                Stop Bot
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start Bot
              </>
            )}
          </button>
        </div>

        {/* Bot Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-purple-500/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Volume Generated</p>
            <p className="text-2xl font-bold text-white">{botStats.volumeGenerated} ETH</p>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Gas Reimbursed</p>
            <p className="text-2xl font-bold text-green-400">{botStats.totalGasReimbursed} ETH</p>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Trades Executed</p>
            <p className="text-2xl font-bold text-white">{botStats.tradesExecuted}</p>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Per Trade Rebate</p>
            <p className="text-2xl font-bold text-blue-400">{gasReimbursementAmount} ETH</p>
          </div>
        </div>
      </motion.div>

      {/* Principal Protection Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20"
      >
        <div className="flex items-start gap-4">
          <Shield className="w-8 h-8 text-green-400 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Principal Protected Trading</h3>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                Your principal ({tradeAmount} ETH) is always returned
              </p>
              <p className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Plus {gasReimbursementAmount} ETH gas reimbursement per trade
              </p>
              <p className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                Any profits go to: {profitRecipient ? `${profitRecipient.slice(0, 6)}...${profitRecipient.slice(-4)}` : 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Trade Configuration</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Trade Amount (ETH)
            </label>
            <input
              type="number"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(e.target.value)}
              step="0.001"
              min="0.001"
              disabled={isBotRunning}
              className="w-full px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
            />
            <p className="text-sm text-gray-400 mt-1">Minimum: 0.001 ETH</p>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Arbitrage Direction
            </label>
            <select
              value={checkingDirection}
              onChange={(e) => setCheckingDirection(e.target.value as any)}
              disabled={isBotRunning}
              className="w-full px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
            >
              <option value="kyber-to-larry">Kyber→Larry: Buy LARRY on Kyber, Sell on Larry DEX</option>
              <option value="larry-to-kyber">Larry→Kyber: Buy LARRY on Larry DEX, Sell on Kyber</option>
              <option value="both">Check Both Directions</option>
            </select>
            <p className="text-sm text-gray-400 mt-1">Direction to check for arbitrage opportunities</p>
          </div>
        </div>
      </motion.div>

      {/* Current Route */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Current Route</h3>
          <button
            onClick={checkOpportunity}
            disabled={isChecking || !connected || isBotRunning}
            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            Check Now
          </button>
        </div>

        {opportunity ? (
          <div className="space-y-4">
            <div className="bg-purple-500/10 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Route</p>
              <p className="text-lg font-bold text-white">{opportunity.directionName}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-purple-500/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Input</p>
                <p className="text-xl font-bold text-white">{opportunity.principalAmount} ETH</p>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">{opportunity.direction ? 'LARRY from Kyber' : 'LARRY from DEX'}</p>
                <p className="text-xl font-bold text-white">
                  {opportunity.direction 
                    ? `${parseFloat(opportunity.expectedReturn).toFixed(2)}`
                    : `${parseFloat(opportunity.route.amountIn).toFixed(2)}`
                  }
                </p>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Final ETH Return</p>
                <p className="text-xl font-bold text-white">
                  {opportunity.actualEthReturn || opportunity.expectedReturn} ETH
                </p>
              </div>
            </div>

            <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
              <p className="text-gray-400 text-sm mb-1">Guaranteed Returns</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-green-400">{opportunity.principalAmount} ETH + {gasReimbursementAmount} ETH</p>
                <span className="text-sm text-gray-400">Principal + Gas</span>
              </div>
            </div>
            
            {opportunity.estimatedProfit && parseFloat(opportunity.estimatedProfit) > 0 ? (
              <div className="bg-purple-500/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Estimated Additional Profit</p>
                <p className="text-xl font-bold text-purple-400">{opportunity.estimatedProfit} ETH</p>
                <p className="text-xs text-gray-400 mt-1">Goes to: {profitRecipient ? `${profitRecipient.slice(0, 6)}...${profitRecipient.slice(-4)}` : 'Loading...'}</p>
              </div>
            ) : (
              <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-semibold">No Profitable Opportunity</p>
                    <p className="text-sm text-gray-300 mt-1">
                      Current market conditions show insufficient return to cover gas costs.
                      The trade would result in a loss after gas reimbursement.
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Waiting for better market conditions...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isBotRunning && opportunity.estimatedProfit && parseFloat(opportunity.estimatedProfit) > 0 && (
              <button
                onClick={executeArbitrage}
                disabled={isExecuting}
                className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-5 h-5" />
                    Execute Trade
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-gray-800/50 rounded-lg p-6 inline-block">
              <RefreshCw className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 font-semibold mb-2">No Routes Checked</p>
              {lastCheck ? (
                <p className="text-sm text-gray-500">Last checked: {lastCheck.toLocaleTimeString()}</p>
              ) : (
                <p className="text-sm text-gray-500">Click "Check Now" to scan for opportunities</p>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Recent Transactions</h3>
        
        {txHistory.length > 0 ? (
          <div className="space-y-2">
            {txHistory.map((tx, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-semibold">Volume: {tx.volumeGenerated} ETH</p>
                    <p className="text-gray-400 text-sm">{tx.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">+{tx.gasReimbursed} ETH</p>
                  <a
                    href={`https://basescan.org/tx/${tx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 text-sm hover:text-purple-300"
                  >
                    View TX
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-400">No transactions yet</p>
        )}
      </motion.div>
    </div>
  );
}