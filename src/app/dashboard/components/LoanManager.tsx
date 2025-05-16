"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getContract, formatEther, parseEther, formatUnits } from '../utils/web3Config';
import { useWallet } from '../providers/WalletProvider';

// Component for the extend loan slider
function ExtendLoanSlider({ currentLoan, extendDays, setExtendDays, extendFee }: {
  currentLoan: any;
  extendDays: string;
  setExtendDays: (days: string) => void;
  extendFee: string;
}) {
  // Calculate the maximum days that can be extended (total loan can't exceed 1 year from original start)
  const currentEndDate = new Date(Number(currentLoan.endDate) * 1000);
  
  // Calculate when the loan originally started
  // The loan started numberOfDays ago from the end date
  const loanStartDate = new Date(currentEndDate);
  loanStartDate.setDate(loanStartDate.getDate() - Number(currentLoan.numberOfDays));
  
  // Maximum total loan duration is 365 days
  const maxTotalDays = 365;
  
  // Calculate how many days the loan will have been active by its current end date
  const daysFromStartToCurrentEnd = Number(currentLoan.numberOfDays);
  
  // Maximum extension is 365 days minus the current loan duration
  const maxExtensionDays = Math.max(1, maxTotalDays - daysFromStartToCurrentEnd);
  
  return (
    <div className="space-y-4 mb-4">
      <label className="block text-gray-400">
        Extend by: <span className="text-white font-medium">{extendDays} days</span>
      </label>
      
      {/* Quick preset buttons */}
      <div className="flex gap-2 flex-wrap">
        {[1, 7, 30, 90, 180, 365]
          .filter(days => days <= maxExtensionDays)
          .filter((days, index, arr) => arr.indexOf(days) === index) // Remove duplicates
          .map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setExtendDays(days.toString())}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                extendDays === days.toString() ? 'bg-purple-600 text-white' : 'bg-purple-800/20 text-purple-400 hover:bg-purple-800/30'
              }`}
            >
              {days === maxExtensionDays ? `Max (${days} days)` : 
               days === 365 ? '1 year' : 
               days === 180 ? '6 months' : 
               days === 90 ? '3 months' : 
               days === 30 ? '1 month' : 
               days === 7 ? '1 week' : '1 day'}
            </button>
          ))}
      </div>
      
      {/* Slider */}
      <div className="relative pt-2 pb-6">
        <input
          type="range"
          min="1"
          max={maxExtensionDays}
          value={extendDays}
          onChange={(e) => setExtendDays(e.target.value)}
          className="w-full h-2 bg-purple-800/30 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${(Number(extendDays) / maxExtensionDays) * 100}%, #4c1d95 ${(Number(extendDays) / maxExtensionDays) * 100}%, #4c1d95 100%)`
          }}
        />
        <div className="absolute flex justify-between w-full px-2 top-8 text-xs text-gray-500">
          <span>1</span>
          <span>{maxExtensionDays} days max</span>
        </div>
      </div>
      
      <div className="space-y-1 text-sm">
        <p className="text-gray-400">
          Loan start date: <span className="text-white">{loanStartDate.toLocaleDateString()}</span>
        </p>
        <p className="text-gray-400">
          Current duration: <span className="text-white">{currentLoan.numberOfDays} days</span>
        </p>
        <p className="text-gray-400">
          Current end date: <span className="text-white">{currentEndDate.toLocaleDateString()}</span>
        </p>
        <p className="text-gray-400">
          New end date: <span className="text-white">
            {new Date(currentEndDate.getTime() + Number(extendDays) * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </span>
        </p>
        <p className="text-gray-400">
          Total duration after extension: <span className="text-white">{daysFromStartToCurrentEnd + Number(extendDays)} days</span>
        </p>
        <p className="text-gray-400">
          Extension fee: <span className="text-yellow-400">{extendFee} ETH</span>
        </p>
        {maxExtensionDays === 0 && (
          <p className="text-red-400">
            This loan has already reached the maximum duration of 365 days.
          </p>
        )}
      </div>
    </div>
  );
}

export default function LoanManager() {
  const { connected, address, signer, connect } = useWallet();
  const [activeTab, setActiveTab] = useState<'borrow' | 'manage'>('borrow');
  const [loading, setLoading] = useState(false);
  
  
  // Borrow form state
  const [borrowAmount, setBorrowAmount] = useState('');
  const [borrowDays, setBorrowDays] = useState('7');
  const [borrowType, setBorrowType] = useState<'normal' | 'leverage' | 'more'>('normal');
  const [borrowPreview, setBorrowPreview] = useState({
    collateral: '0',
    interestFee: '0',
    leverageFee: '0',
    totalPayment: '0',
    youReceive: '0',
  });
  
  // User balances
  const [userBalances, setUserBalances] = useState({
    larryBalance: '0',
    ethBalance: '0',
  });
  
  // Current loan state
  const [currentLoan, setCurrentLoan] = useState({
    collateral: '0',
    borrowed: '0',
    endDate: '0',
    numberOfDays: '0',
    hasLoan: false,
    isExpired: false,
  });
  
  // Borrowing limits
  const [borrowLimits, setBorrowLimits] = useState({
    maxNormalBorrow: '0',
    maxLeverageBorrow: '0',
    maxBorrowMore: '0',
    maxRemoveCollateral: '0',
  });
  
  // Repay form state
  const [repayAmount, setRepayAmount] = useState('');
  
  // Remove collateral form state
  const [removeAmount, setRemoveAmount] = useState('');
  
  // Extend loan state
  const [extendDays, setExtendDays] = useState('7');
  const [extendFee, setExtendFee] = useState('0');

  useEffect(() => {
    if (connected && address) {
      loadLoanData();
      loadUserBalances();
    }
  }, [connected, address]);

  useEffect(() => {
    if (borrowAmount && (borrowDays || borrowType === 'more')) {
      calculateBorrowPreview();
    }
  }, [borrowAmount, borrowDays, borrowType]);
  
  useEffect(() => {
    if (currentLoan.hasLoan && extendDays) {
      calculateExtendFee();
    }
  }, [currentLoan, extendDays]);
  
  useEffect(() => {
    calculateBorrowingLimits();
  }, [userBalances, currentLoan, borrowType]);

  const loadUserBalances = async () => {
    try {
      const contract = await getContract();
      const provider = await signer?.provider;
      
      if (provider && address) {
        const [larryBalance, ethBalance] = await Promise.all([
          contract.balanceOf(address),
          provider.getBalance(address),
        ]);
        
        setUserBalances({
          larryBalance: formatUnits(larryBalance.toString()),
          ethBalance: formatEther(ethBalance.toString()),
        });
      }
    } catch (error) {
      console.error('Error loading user balances:', error);
    }
  };

  const loadLoanData = async () => {
    try {
      const contract = await getContract();
      const loan = await contract.Loans(address);
      const isExpired = await contract.isLoanExpired(address);
      
      setCurrentLoan({
        collateral: formatUnits(loan.collateral.toString()),
        borrowed: formatEther(loan.borrowed.toString()),
        endDate: loan.endDate.toString(),
        numberOfDays: loan.numberOfDays.toString(),
        hasLoan: loan.borrowed > 0n,
        isExpired: isExpired,
      });
      
      // Set appropriate borrow type based on loan status
      if (loan.borrowed > 0n && !isExpired) {
        setBorrowType('more');
      } else {
        setBorrowType('normal');
      }
    } catch (error) {
      console.error('Error loading loan data:', error);
    }
  };
  
  const calculateBorrowingLimits = async () => {
    try {
      const contract = await getContract();
      
      if (borrowType === 'normal') {
        // For normal borrowing, limit is based on LARRY balance
        // You need LARRY collateral, so max borrow is what your LARRY can collateralize
        const larryBalance = parseEther(userBalances.larryBalance);
        if (larryBalance > 0n) {
          const maxBorrowable = await contract.LARRYtoETH(larryBalance);
          const maxAfterCollateralization = (maxBorrowable * 99n) / 100n; // 99% collateralization
          setBorrowLimits(prev => ({ ...prev, maxNormalBorrow: formatEther(maxAfterCollateralization) }));
        } else {
          setBorrowLimits(prev => ({ ...prev, maxNormalBorrow: '0' }));
        }
      } else if (borrowType === 'leverage') {
        // For leverage, limit is based on ETH balance minus fees
        const ethBalance = parseEther(userBalances.ethBalance);
        if (ethBalance > 0n) {
          // Rough estimate - actual will depend on leverage fees
          const maxLeverage = (ethBalance * 90n) / 100n; // Leave some for fees
          setBorrowLimits(prev => ({ ...prev, maxLeverageBorrow: formatEther(maxLeverage) }));
        } else {
          setBorrowLimits(prev => ({ ...prev, maxLeverageBorrow: '0' }));
        }
      } else if (borrowType === 'more' && currentLoan.hasLoan) {
        // For borrow more, calculate based on excess collateral
        const collateral = parseEther(currentLoan.collateral);
        const borrowed = parseEther(currentLoan.borrowed);
        const collateralValue = await contract.LARRYtoETH(collateral);
        const requiredCollateralValue = (borrowed * 100n) / 99n; // Required ETH value for 99% collateralization
        
        let maxAdditionalBorrow = 0n;
        
        if (collateralValue > requiredCollateralValue) {
          // We have excess collateral - calculate how much more we can borrow
          const excessValue = collateralValue - requiredCollateralValue;
          maxAdditionalBorrow = (excessValue * 99n) / 100n;
        }
        
        // Also check if user has additional LARRY balance to add as collateral
        const larryBalance = parseEther(userBalances.larryBalance);
        if (larryBalance > 0n) {
          const additionalValue = await contract.LARRYtoETH(larryBalance);
          const additionalBorrowPower = (additionalValue * 99n) / 100n;
          maxAdditionalBorrow = maxAdditionalBorrow + additionalBorrowPower;
        }
        
        setBorrowLimits(prev => ({ ...prev, maxBorrowMore: formatEther(maxAdditionalBorrow) }));
        
        // Calculate max removable collateral (maintain at least 100.5% collateralization for safety)
        const minRequiredValue = (borrowed * 1005n) / 990n; // 100.5% for safety margin
        const minRequiredCollateral = await contract.ETHtoLARRYNoTradeCeil(minRequiredValue);
        const removableCollateral = collateral > minRequiredCollateral ? collateral - minRequiredCollateral : 0n;
        setBorrowLimits(prev => ({ ...prev, maxRemoveCollateral: formatUnits(removableCollateral) }));
      }
    } catch (error) {
      console.error('Error calculating borrowing limits:', error);
    }
  };

  const calculateBorrowPreview = async () => {
    try {
      const contract = await getContract();
      const ethAmount = parseEther(borrowAmount);
      
      if (borrowType === 'normal') {
        const days = BigInt(borrowDays);
        
        // Get collateral requirement
        const collateral = BigInt(await contract.ETHtoLARRYNoTradeCeil(ethAmount));
        
        // Get interest fee
        const interestFee = await contract.getInterestFee(ethAmount, days);
        
        // Calculate you receive (99% of borrowed amount - interest fee)
        const borrowedAmount = (ethAmount * 99n) / 100n;
        const youReceive = borrowedAmount - interestFee;
        
        setBorrowPreview({
          collateral: formatUnits(collateral.toString()),
          interestFee: formatEther(interestFee.toString()),
          leverageFee: '0',
          totalPayment: '0',
          youReceive: formatEther(youReceive.toString()),
        });
      } else if (borrowType === 'leverage') {
        const days = BigInt(borrowDays);
        
        // Get leverage fee
        const leverageFee = await contract.leverageFee(ethAmount, days);
        
        // Total payment includes the ETH amount plus leverage fee
        const totalPayment = ethAmount + leverageFee;
        
        // Collateral will be minted based on the ETH amount
        const subValue = (leverageFee * 3n) / 10n + ethAmount / 100n;
        const collateral = BigInt(await contract.ETHtoLARRYLev(ethAmount, subValue));
        
        setBorrowPreview({
          collateral: formatUnits(collateral.toString()),
          interestFee: '0',
          leverageFee: formatEther(leverageFee.toString()),
          totalPayment: formatEther(totalPayment.toString()),
          youReceive: formatEther((ethAmount * 99n) / 100n),
        });
      } else if (borrowType === 'more') {
        // Borrow more on existing loan
        const endDate = BigInt(currentLoan.endDate);
        const todayMidnight = await contract.getMidnightTimestamp(Math.floor(Date.now() / 1000));
        const remainingDays = (endDate - todayMidnight) / 86400n;
        
        // Get interest fee for remaining days
        const interestFee = await contract.getInterestFee(ethAmount, remainingDays);
        
        // Calculate required collateral
        const userLARRY = BigInt(await contract.ETHtoLARRYNoTradeCeil(ethAmount));
        
        // Check if we need additional collateral from user
        const currentCollateral = parseEther(currentLoan.collateral);
        const currentBorrowed = parseEther(currentLoan.borrowed);
        const newTotalBorrowed = currentBorrowed + ethAmount;
        const requiredCollateral = BigInt(await contract.ETHtoLARRYNoTradeCeil(newTotalBorrowed));
        
        let additionalCollateralNeeded = 0n;
        if (requiredCollateral > currentCollateral) {
          additionalCollateralNeeded = userLARRY;
          
          // Check if we have excess collateral to reduce the requirement
          const currentCollateralValue = await contract.LARRYtoETH(currentCollateral);
          const requiredCollateralValue = (currentBorrowed * 100n) / 99n;
          
          if (currentCollateralValue > requiredCollateralValue) {
            const excess = currentCollateralValue - requiredCollateralValue;
            const excessInLarry = BigInt(await contract.ETHtoLARRYNoTrade(excess));
            if (excessInLarry >= userLARRY) {
              additionalCollateralNeeded = 0n;
            } else {
              additionalCollateralNeeded = userLARRY - excessInLarry;
            }
          }
        }
        
        setBorrowPreview({
          collateral: formatUnits(additionalCollateralNeeded.toString()),
          interestFee: formatEther(interestFee.toString()),
          leverageFee: '0',
          totalPayment: '0',
          youReceive: formatEther((ethAmount * 99n / 100n) - interestFee),
        });
      }
    } catch (error) {
      console.error('Preview calculation error:', error);
    }
  };
  
  const calculateExtendFee = async () => {
    try {
      const contract = await getContract();
      const fee = await contract.getInterestFee(
        parseEther(currentLoan.borrowed),
        BigInt(extendDays)
      );
      setExtendFee(formatEther(fee.toString()));
    } catch (error) {
      console.error('Extend fee calculation error:', error);
    }
  };

  const handleBorrow = async () => {
    if (!connected || !borrowAmount || !signer) return;
    if ((borrowType === 'normal' || borrowType === 'leverage') && !borrowDays) return;
    
    setLoading(true);
    try {
      const contract = await getContract(signer);
      const ethAmount = parseEther(borrowAmount);
      
      if (borrowType === 'normal') {
        const days = BigInt(borrowDays);
        
        // Execute borrow transaction - no ETH needed, just approval for LARRY transfer
        const tx = await contract.borrow(ethAmount, days);
        await tx.wait();
        
        alert('Borrow successful!');
      } else if (borrowType === 'leverage') {
        const days = BigInt(borrowDays);
        
        // Get leverage fee
        const leverageFee = await contract.leverageFee(ethAmount, days);
        const totalPayment = ethAmount + leverageFee;
        
        // Execute leverage transaction - needs ETH payment
        const tx = await contract.leverage(ethAmount, days, { value: totalPayment });
        await tx.wait();
        
        alert('Leverage position created!');
      } else if (borrowType === 'more') {
        // Execute borrow more transaction
        const tx = await contract.borrowMore(ethAmount);
        await tx.wait();
        
        alert('Additional borrow successful!');
      }
      
      // Reset form and reload data
      setBorrowAmount('');
      setBorrowDays('7');
      loadLoanData();
      loadUserBalances();
    } catch (error: any) {
      console.error('Borrow error:', error);
      alert(`Transaction failed: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const getBorrowLimit = () => {
    switch (borrowType) {
      case 'normal':
        return borrowLimits.maxNormalBorrow;
      case 'leverage':
        return borrowLimits.maxLeverageBorrow;
      case 'more':
        return borrowLimits.maxBorrowMore;
      default:
        return '0';
    }
  };

  const handleRepay = async () => {
    if (!connected || !currentLoan.hasLoan || !signer || currentLoan.isExpired) return;
    
    const amount = repayAmount || currentLoan.borrowed;
    
    setLoading(true);
    try {
      const contract = await getContract(signer);
      const repayValue = parseEther(amount);
      
      // Check if full repayment or partial
      const borrowed = parseEther(currentLoan.borrowed);
      
      if (repayValue >= borrowed) {
        // Full repayment - use closePosition
        const tx = await contract.closePosition({ value: borrowed });
        await tx.wait();
        alert('Loan fully repaid and position closed!');
      } else {
        // Partial repayment
        const tx = await contract.repay({ value: repayValue });
        await tx.wait();
        alert('Partial repayment successful!');
      }
      
      // Reset form and reload data
      setRepayAmount('');
      loadLoanData();
      loadUserBalances();
    } catch (error: any) {
      console.error('Repay error:', error);
      alert(`Repay failed: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFlashClosePosition = async () => {
    if (!connected || !currentLoan.hasLoan || !signer || currentLoan.isExpired) return;
    
    setLoading(true);
    try {
      const contract = await getContract(signer);
      
      const tx = await contract.flashClosePosition();
      await tx.wait();
      
      loadLoanData();
      loadUserBalances();
      alert('Position closed using flash loan!');
    } catch (error: any) {
      console.error('Flash close error:', error);
      alert(`Flash close failed: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveCollateral = async () => {
    if (!connected || !currentLoan.hasLoan || !signer || !removeAmount || currentLoan.isExpired) return;
    
    setLoading(true);
    try {
      const contract = await getContract(signer);
      const amount = parseEther(removeAmount);
      
      const tx = await contract.removeCollateral(amount);
      await tx.wait();
      
      setRemoveAmount('');
      loadLoanData();
      loadUserBalances();
      alert('Collateral removed successfully!');
    } catch (error: any) {
      console.error('Remove collateral error:', error);
      alert(`Remove collateral failed: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleExtendLoan = async () => {
    if (!connected || !currentLoan.hasLoan || !signer || currentLoan.isExpired) return;
    
    // Check if extension would exceed 365 days total
    const currentDuration = Number(currentLoan.numberOfDays);
    const extensionDays = Number(extendDays);
    const totalDuration = currentDuration + extensionDays;
    
    if (totalDuration > 365) {
      alert(`Cannot extend loan beyond 365 days total. Current duration: ${currentDuration} days. Maximum extension: ${365 - currentDuration} days.`);
      return;
    }
    
    setLoading(true);
    try {
      const contract = await getContract(signer);
      const days = BigInt(extendDays);
      
      // Get the calculated fee for the extension
      const fee = await contract.getInterestFee(
        parseEther(currentLoan.borrowed),
        days
      );
      
      const tx = await contract.extendLoan(days, { value: fee });
      await tx.wait();
      
      setExtendDays('7');
      loadLoanData();
      alert('Loan extended successfully!');
    } catch (error: any) {
      console.error('Extend loan error:', error);
      alert(`Extend loan failed: ${error.message || 'Unknown error'}`);
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
        Loan Manager
      </h2>

      {connected ? (
        <>
          {/* User Balances */}
          <div className="mb-6 p-4 bg-purple-800/10 rounded-lg flex justify-between text-sm">
            <div>
              <span className="text-gray-400">Your LARRY: </span>
              <span className="text-white font-medium">{parseFloat(userBalances.larryBalance).toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-400">Your ETH: </span>
              <span className="text-white font-medium">{parseFloat(userBalances.ethBalance).toFixed(4)}</span>
            </div>
          </div>

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
                {tab === 'borrow' ? 'Borrowing' : 'Manage Loan'}
              </button>
            ))}
          </div>

          {activeTab === 'borrow' ? (
            <div className="space-y-4">
              {/* Borrow Type Selector */}
              <div>
                <label className="block text-gray-400 mb-2">Loan Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setBorrowType('normal')}
                    disabled={currentLoan.hasLoan && !currentLoan.isExpired}
                    className={`px-3 py-2 rounded-lg font-medium transition-all ${
                      borrowType === 'normal'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-800/20 text-gray-400 hover:bg-purple-800/40'
                    } ${currentLoan.hasLoan && !currentLoan.isExpired ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setBorrowType('leverage')}
                    disabled={currentLoan.hasLoan && !currentLoan.isExpired}
                    className={`px-3 py-2 rounded-lg font-medium transition-all ${
                      borrowType === 'leverage'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-800/20 text-gray-400 hover:bg-purple-800/40'
                    } ${currentLoan.hasLoan && !currentLoan.isExpired ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Leverage
                  </button>
                  <button
                    onClick={() => setBorrowType('more')}
                    disabled={!currentLoan.hasLoan || currentLoan.isExpired}
                    className={`px-3 py-2 rounded-lg font-medium transition-all ${
                      borrowType === 'more'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-800/20 text-gray-400 hover:bg-purple-800/40'
                    } ${(!currentLoan.hasLoan || currentLoan.isExpired) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Borrow More
                  </button>
                </div>
              </div>

              {/* Loan Type Information */}
              <div className="p-4 bg-purple-800/10 rounded-lg text-sm">
                {borrowType === 'normal' && (
                  <div>
                    <h4 className="font-semibold text-purple-400 mb-2">Normal Borrow</h4>
                    <ul className="space-y-1 text-gray-400">
                      <li>• Requires LARRY collateral (you have: {parseFloat(userBalances.larryBalance).toFixed(2)} LARRY)</li>
                      <li>• You receive 99% of borrowed amount minus interest</li>
                      <li>• Interest rate: ~3.9% annually + 0.1% base fee</li>
                      <li>• Maximum borrow: {parseFloat(getBorrowLimit()).toFixed(4)} ETH</li>
                    </ul>
                  </div>
                )}
                {borrowType === 'leverage' && (
                  <div>
                    <h4 className="font-semibold text-purple-400 mb-2">Leverage Borrow</h4>
                    <ul className="space-y-1 text-gray-400">
                      <li>• Requires ETH payment upfront (you have: {parseFloat(userBalances.ethBalance).toFixed(4)} ETH)</li>
                      <li>• Creates leveraged position with automated collateral</li>
                      <li>• Leverage fee: {parseFloat(userBalances.ethBalance) > 0 ? "Calculated based on amount and days" : "Insufficient ETH"}</li>
                      <li>• Maximum leverage: {parseFloat(getBorrowLimit()).toFixed(4)} ETH</li>
                    </ul>
                  </div>
                )}
                {borrowType === 'more' && (
                  <div>
                    <h4 className="font-semibold text-purple-400 mb-2">Borrow More</h4>
                    <ul className="space-y-1 text-gray-400">
                      <li>• Add to existing loan (Current: {currentLoan.borrowed} ETH)</li>
                      <li>• Uses remaining loan duration ({Math.max(0, Math.floor((Number(currentLoan.endDate) - Date.now() / 1000) / 86400))} days left)</li>
                      <li>• May require additional collateral</li>
                      <li>• Maximum additional: {parseFloat(getBorrowLimit()).toFixed(4)} ETH</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* ETH Amount */}
              <div>
                <label className="block text-gray-400 mb-2">
                  ETH to {borrowType === 'more' ? 'Borrow More' : 'Borrow'}
                  <span className="text-sm ml-2">
                    (Max: {parseFloat(getBorrowLimit()).toFixed(4)} ETH)
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={borrowAmount}
                    onChange={(e) => setBorrowAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-purple-800/20 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                  <button
                    onClick={() => setBorrowAmount(getBorrowLimit())}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-xs text-white rounded font-medium transition-colors"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Loan duration slider - only for normal and leverage */}
              {(borrowType === 'normal' || borrowType === 'leverage') && (
                <div className="space-y-4">
                  <label className="block text-gray-400">
                    Loan Duration: <span className="text-white font-medium">{borrowDays} days</span>
                  </label>
                  
                  {/* Quick preset buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setBorrowDays('1')}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                        borrowDays === '1' ? 'bg-purple-600 text-white' : 'bg-purple-800/20 text-purple-400 hover:bg-purple-800/30'
                      }`}
                    >
                      1 day
                    </button>
                    <button
                      type="button"
                      onClick={() => setBorrowDays('7')}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                        borrowDays === '7' ? 'bg-purple-600 text-white' : 'bg-purple-800/20 text-purple-400 hover:bg-purple-800/30'
                      }`}
                    >
                      1 week
                    </button>
                    <button
                      type="button"
                      onClick={() => setBorrowDays('30')}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                        borrowDays === '30' ? 'bg-purple-600 text-white' : 'bg-purple-800/20 text-purple-400 hover:bg-purple-800/30'
                      }`}
                    >
                      1 month
                    </button>
                    <button
                      type="button"
                      onClick={() => setBorrowDays('90')}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                        borrowDays === '90' ? 'bg-purple-600 text-white' : 'bg-purple-800/20 text-purple-400 hover:bg-purple-800/30'
                      }`}
                    >
                      3 months
                    </button>
                    <button
                      type="button"
                      onClick={() => setBorrowDays('180')}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                        borrowDays === '180' ? 'bg-purple-600 text-white' : 'bg-purple-800/20 text-purple-400 hover:bg-purple-800/30'
                      }`}
                    >
                      6 months
                    </button>
                    <button
                      type="button"
                      onClick={() => setBorrowDays('365')}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                        borrowDays === '365' ? 'bg-purple-600 text-white' : 'bg-purple-800/20 text-purple-400 hover:bg-purple-800/30'
                      }`}
                    >
                      1 year
                    </button>
                  </div>
                  
                  {/* Slider */}
                  <div className="relative pt-2 pb-6">
                    <input
                      type="range"
                      min="1"
                      max="365"
                      value={borrowDays}
                      onChange={(e) => setBorrowDays(e.target.value)}
                      className="w-full h-2 bg-purple-800/30 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${(Number(borrowDays) / 365) * 100}%, #4c1d95 ${(Number(borrowDays) / 365) * 100}%, #4c1d95 100%)`
                      }}
                    />
                    <div className="absolute flex justify-between w-full px-2 top-8 text-xs text-gray-500">
                      <span>1</span>
                      <span>365 days</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Current Loan Info for Borrow More */}
              {borrowType === 'more' && currentLoan.hasLoan && (
                <div className="p-4 bg-purple-800/10 rounded-lg space-y-2">
                  <h4 className="text-sm font-semibold text-purple-400 mb-2">Current Loan Status</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Borrowed</span>
                    <span className="text-white">{currentLoan.borrowed} ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Collateral</span>
                    <span className="text-white">{currentLoan.collateral} LARRY</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Collateralization Ratio</span>
                    <span className="text-white">
                      {currentLoan.borrowed !== '0' ? 
                        ((parseFloat(currentLoan.collateral) * 100) / parseFloat(currentLoan.borrowed)).toFixed(2) + '%' 
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Remaining Days</span>
                    <span className="text-white">
                      {Math.max(0, Math.floor((Number(currentLoan.endDate) - Date.now() / 1000) / 86400))}
                    </span>
                  </div>
                </div>
              )}

              {/* Preview */}
              {borrowAmount && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-purple-800/10 rounded-lg space-y-2"
                >
                  <h4 className="text-sm font-semibold text-purple-400 mb-2">
                    {borrowType === 'leverage' ? 'Leverage Details' : 'Loan Details'}
                  </h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {borrowType === 'more' ? 'Additional Collateral' : 'Required Collateral'}
                    </span>
                    <span className="text-white">
                      {borrowPreview.collateral} LARRY
                    </span>
                  </div>
                  {borrowType === 'leverage' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Leverage Fee</span>
                        <span className="text-yellow-400">
                          {borrowPreview.leverageFee} ETH
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Payment</span>
                        <span className="text-purple-400">
                          {borrowPreview.totalPayment} ETH
                        </span>
                      </div>
                    </>
                  )}
                  {(borrowType === 'normal' || borrowType === 'more') && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Interest Fee</span>
                      <span className="text-yellow-400">
                        {borrowPreview.interestFee} ETH
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-400">You Receive</span>
                    <span className="text-green-400">
                      {borrowPreview.youReceive} ETH
                    </span>
                  </div>
                  {borrowType === 'more' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">New Total Borrowed</span>
                      <span className="text-purple-400">
                        {(parseFloat(currentLoan.borrowed) + parseFloat(borrowAmount)).toFixed(4)} ETH
                      </span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Borrow Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBorrow}
                disabled={loading || !borrowAmount || parseFloat(borrowAmount) > parseFloat(getBorrowLimit())}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  loading || !borrowAmount || parseFloat(borrowAmount) > parseFloat(getBorrowLimit())
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : borrowType === 'leverage'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {loading ? 'Processing...' : 
                  parseFloat(borrowAmount) > parseFloat(getBorrowLimit()) ? 'Exceeds Maximum' :
                  borrowType === 'leverage' ? 'Create Leverage Position' :
                  borrowType === 'more' ? 'Borrow More' :
                  'Borrow'
                }
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
                      <span className={currentLoan.isExpired ? 'text-red-400' : 'text-white'}>
                        {new Date(Number(currentLoan.endDate) * 1000).toLocaleDateString()}
                        {currentLoan.isExpired && ' (EXPIRED)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Removable Collateral</span>
                      <span className="text-white">{borrowLimits.maxRemoveCollateral} LARRY</span>
                    </div>
                  </div>

                  {currentLoan.isExpired ? (
                    <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400">
                      Your loan has expired. It may be liquidated. You cannot repay or manage it anymore.
                    </div>
                  ) : (
                    <>
                      {/* Repay Section */}
                      <div className="border-t border-purple-500/20 pt-4">
                        <h3 className="text-lg font-semibold mb-3 text-purple-400">Repay Loan</h3>
                        <div className="mb-3">
                          <label className="block text-gray-400 mb-2">
                            Repay Amount (ETH) 
                            <span className="text-sm ml-2">
                              Balance: {parseFloat(userBalances.ethBalance).toFixed(6)} ETH
                            </span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={repayAmount}
                              onChange={(e) => setRepayAmount(e.target.value)}
                              placeholder={currentLoan.borrowed}
                              className="w-full px-4 py-3 bg-purple-800/20 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors pr-24"
                            />
                            <button
                              onClick={() => {
                                if (parseFloat(userBalances.ethBalance) > parseFloat(currentLoan.borrowed)) {
                                  // If balance exceeds loan, set to exact loan amount
                                  setRepayAmount(currentLoan.borrowed);
                                } else {
                                  // Otherwise use all available balance
                                  setRepayAmount(userBalances.ethBalance);
                                }
                              }}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-xs text-white rounded font-medium transition-colors"
                            >
                              {parseFloat(userBalances.ethBalance) > parseFloat(currentLoan.borrowed) ? 'EXACT' : 'USE ALL'}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Leave empty to repay full loan ({currentLoan.borrowed} ETH) and close position
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setRepayAmount('');
                              handleRepay();
                            }}
                            disabled={loading}
                            className="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                          >
                            {loading ? 'Processing...' : `Repay Full (${currentLoan.borrowed} ETH)`}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={async () => {
                              if (parseFloat(userBalances.ethBalance) < parseFloat(currentLoan.borrowed)) {
                                // If balance is less than loan, use all balance
                                setRepayAmount(userBalances.ethBalance);
                                setTimeout(() => handleRepay(), 100);
                              } else {
                                // If balance is more than loan, just repay the exact loan amount
                                setRepayAmount(currentLoan.borrowed);
                                setTimeout(() => handleRepay(), 100);
                              }
                            }}
                            disabled={loading || parseFloat(userBalances.ethBalance) === 0}
                            className={`py-3 rounded-lg font-medium transition-all ${
                              loading || parseFloat(userBalances.ethBalance) === 0
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                          >
                            {loading ? 'Processing...' : 
                              parseFloat(userBalances.ethBalance) < parseFloat(currentLoan.borrowed) 
                                ? `Repay ${parseFloat(userBalances.ethBalance).toFixed(4)} ETH`
                                : `Repay Exact (${currentLoan.borrowed} ETH)`
                            }
                          </motion.button>
                        </div>
                      </div>

                      {/* Flash Close Position */}
                      <div className="border-t border-purple-500/20 pt-4">
                        <h3 className="text-lg font-semibold mb-3 text-purple-400">Flash Close</h3>
                        <p className="text-sm text-gray-400 mb-3">
                          Close your position without external ETH. Uses your collateral to repay the loan.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleFlashClosePosition}
                          disabled={loading}
                          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                        >
                          {loading ? 'Processing...' : 'Flash Close Position'}
                        </motion.button>
                      </div>

                      {/* Remove Collateral */}
                      <div className="border-t border-purple-500/20 pt-4">
                        <h3 className="text-lg font-semibold mb-3 text-purple-400">Remove Collateral</h3>
                        <div className="mb-3">
                          <label className="block text-gray-400 mb-2">
                            Amount to Remove (LARRY)
                            <span className="text-sm ml-2">
                              (Max: {borrowLimits.maxRemoveCollateral} LARRY)
                            </span>
                          </label>
                          <input
                            type="number"
                            value={removeAmount}
                            onChange={(e) => setRemoveAmount(e.target.value)}
                            placeholder="0.0"
                            className="w-full px-4 py-3 bg-purple-800/20 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Must maintain 99% collateralization ratio
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleRemoveCollateral}
                          disabled={loading || !removeAmount || parseFloat(removeAmount) > parseFloat(borrowLimits.maxRemoveCollateral)}
                          className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
                        >
                          {loading ? 'Processing...' : 'Remove Collateral'}
                        </motion.button>
                      </div>

                      {/* Extend Loan */}
                      <div className="border-t border-purple-500/20 pt-4">
                        <h3 className="text-lg font-semibold mb-3 text-purple-400">Extend Loan</h3>
                        <ExtendLoanSlider
                          currentLoan={currentLoan}
                          extendDays={extendDays}
                          setExtendDays={setExtendDays}
                          extendFee={extendFee}
                        />
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleExtendLoan}
                          disabled={loading}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                        >
                          {loading ? 'Processing...' : 'Extend Loan'}
                        </motion.button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No active loans. Create a new loan in the "Borrowing" tab.
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