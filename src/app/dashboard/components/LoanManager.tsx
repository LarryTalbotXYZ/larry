"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getContract, formatEther, parseEther, formatUnits } from '../utils/web3Config';
import { useWallet } from '../providers/WalletProvider';

export default function LoanManager() {
  const { connected, address, signer, connect } = useWallet();
  const [activeTab, setActiveTab] = useState<'borrow' | 'manage'>('borrow');
  const [loading, setLoading] = useState(false);
  
  // Borrow form state
  const [borrowAmount, setBorrowAmount] = useState('');
  const [borrowDays, setBorrowDays] = useState('7');
  const [borrowPreview, setBorrowPreview] = useState({
    collateral: '0',
    interestFee: '0',
    leverageFee: '0',
  });
  
  // Current loan state
  const [currentLoan, setCurrentLoan] = useState({
    collateral: '0',
    borrowed: '0',
    endDate: '0',
    numberOfDays: '0',
    hasLoan: false,
  });
  
  // Repay form state
  const [repayAmount, setRepayAmount] = useState('');

  useEffect(() => {
    if (connected && address) {
      loadLoanData();
    }
  }, [connected, address]);

  useEffect(() => {
    if (borrowAmount && borrowDays) {
      calculateBorrowPreview();
    }
  }, [borrowAmount, borrowDays]);


  const loadLoanData = async () => {
    try {
      const contract = await getContract();
      const loan = await contract.Loans(address);
      
      setCurrentLoan({
        collateral: formatUnits(loan.collateral.toString()),
        borrowed: formatEther(loan.borrowed.toString()),
        endDate: loan.endDate.toString(),
        numberOfDays: loan.numberOfDays.toString(),
        hasLoan: loan.borrowed > 0n,
      });
    } catch (error) {
      console.error('Error loading loan data:', error);
    }
  };

  const calculateBorrowPreview = async () => {
    try {
      const contract = await getContract();
      const ethAmount = parseEther(borrowAmount);
      const days = BigInt(borrowDays);
      
      // Get collateral requirement (LARRY needed)
      const collateral = await contract.ETHtoLARRYNoTradeCeil(ethAmount);
      
      // Get interest fee
      const interestFee = await contract.getInterestFee(ethAmount, days);
      
      // Get leverage fee
      const leverageFee = await contract.leverageFee(ethAmount, days);
      
      setBorrowPreview({
        collateral: formatUnits(collateral.toString()),
        interestFee: formatEther(interestFee.toString()),
        leverageFee: formatEther(leverageFee.toString()),
      });
    } catch (error) {
      console.error('Preview calculation error:', error);
    }
  };

  const handleBorrow = async () => {
    if (!connected || !borrowAmount || !borrowDays || !signer) return;
    
    setLoading(true);
    try {
      const contract = await getContract(signer);
      
      const ethAmount = parseEther(borrowAmount);
      const days = BigInt(borrowDays);
      
      // Calculate total payment (ETH + fees)
      const leverageFee = await contract.leverageFee(ethAmount, days);
      const totalPayment = ethAmount + leverageFee;
      
      // Execute leverage transaction
      const tx = await contract.leverage(ethAmount, days, { value: totalPayment });
      await tx.wait();
      
      // Reset form and reload data
      setBorrowAmount('');
      setBorrowDays('7');
      loadLoanData();
      
      console.log('Borrow successful:', tx.hash);
    } catch (error) {
      console.error('Borrow error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRepay = async () => {
    if (!connected || !currentLoan.hasLoan || !signer) return;
    
    setLoading(true);
    try {
      const contract = await getContract(signer);
      
      // Use the input amount or full borrowed amount
      const amount = repayAmount ? parseEther(repayAmount) : parseEther(currentLoan.borrowed);
      
      const tx = await contract.repay({ value: amount });
      await tx.wait();
      
      // Reset form and reload data
      setRepayAmount('');
      loadLoanData();
      
      console.log('Repay successful:', tx.hash);
    } catch (error) {
      console.error('Repay error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePosition = async () => {
    if (!connected || !currentLoan.hasLoan || !signer) return;
    
    setLoading(true);
    try {
      const contract = await getContract(signer);
      
      const tx = await contract.closePosition();
      await tx.wait();
      
      loadLoanData();
      console.log('Position closed:', tx.hash);
    } catch (error) {
      console.error('Close position error:', error);
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
        Leverage Manager
      </h2>

      {connected ? (
        <>
          {/* Tab Switcher */}
          <div className="flex space-x-1 mb-6 bg-purple-800/20 p-1 rounded-lg">
            {['borrow', 'manage'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'borrow' | 'manage')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-purple-600/20'
                }`}
              >
                {tab === 'borrow' ? 'New Loan' : 'Manage Loan'}
              </button>
            ))}
          </div>

          {activeTab === 'borrow' ? (
            <div className="space-y-4">
              {/* ETH Amount */}
              <div>
                <label className="block text-gray-400 mb-2">
                  ETH to Borrow
                </label>
                <input
                  type="number"
                  value={borrowAmount}
                  onChange={(e) => setBorrowAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-4 py-3 bg-purple-800/20 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>

              {/* Days */}
              <div>
                <label className="block text-gray-400 mb-2">
                  Loan Duration (Days)
                </label>
                <select
                  value={borrowDays}
                  onChange={(e) => setBorrowDays(e.target.value)}
                  className="w-full px-4 py-3 bg-purple-800/20 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors"
                >
                  <option value="1">1 Day</option>
                  <option value="3">3 Days</option>
                  <option value="7">7 Days</option>
                  <option value="14">14 Days</option>
                  <option value="30">30 Days</option>
                  <option value="60">60 Days</option>
                  <option value="90">90 Days</option>
                </select>
              </div>

              {/* Preview */}
              {borrowAmount && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-purple-800/10 rounded-lg space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Required Collateral</span>
                    <span className="text-white">
                      {borrowPreview.collateral} LARRY
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Interest Fee</span>
                    <span className="text-yellow-400">
                      {borrowPreview.interestFee} ETH
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Leverage Fee</span>
                    <span className="text-yellow-400">
                      {borrowPreview.leverageFee} ETH
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-400">Total Payment</span>
                    <span className="text-purple-400">
                      {(parseFloat(borrowAmount || '0') + parseFloat(borrowPreview.leverageFee)).toFixed(6)} ETH
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Borrow Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBorrow}
                disabled={loading || !borrowAmount || currentLoan.hasLoan}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  loading || !borrowAmount || currentLoan.hasLoan
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {loading ? 'Processing...' : currentLoan.hasLoan ? 'Existing Loan Active' : 'Create Leverage Position'}
              </motion.button>
            </div>
          ) : (
            <div className="space-y-4">
              {currentLoan.hasLoan ? (
                <>
                  {/* Current Loan Info */}
                  <div className="p-4 bg-purple-800/10 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Collateral</span>
                      <span className="text-white">{currentLoan.collateral} LARRY</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Borrowed</span>
                      <span className="text-white">{currentLoan.borrowed} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Days</span>
                      <span className="text-white">{currentLoan.numberOfDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">End Date</span>
                      <span className="text-white">
                        {new Date(Number(currentLoan.endDate) * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Repay Amount */}
                  <div>
                    <label className="block text-gray-400 mb-2">
                      Repay Amount (ETH)
                    </label>
                    <input
                      type="number"
                      value={repayAmount}
                      onChange={(e) => setRepayAmount(e.target.value)}
                      placeholder={currentLoan.borrowed}
                      className="w-full px-4 py-3 bg-purple-800/20 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleRepay}
                      disabled={loading}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      {loading ? 'Processing...' : 'Repay Loan'}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClosePosition}
                      disabled={loading}
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                      {loading ? 'Processing...' : 'Close Position'}
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No active loans. Create a new leverage position in the "New Loan" tab.
                </div>
              )}
            </div>
          )}
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