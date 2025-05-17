"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, getProvider } from '../utils/web3Config';

// Base network chain info
const BASE_CHAIN_ID = '0x2105'; // 8453
const BASE_CONFIG = {
  chainId: BASE_CHAIN_ID,
  chainName: 'Base',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [
    'https://mainnet.base.org',
    'https://base.gateway.tenderly.co',
    'https://base-rpc.publicnode.com',
    'https://base.llamarpc.com'
  ],
  blockExplorerUrls: ['https://basescan.org/'],
};

interface WalletContextType {
  connected: boolean;
  address: string;
  balance: string;
  chainId: string;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  address: '',
  balance: '0',
  chainId: '',
  provider: null,
  signer: null,
  connect: async () => {},
  disconnect: () => {},
  switchToBase: async () => {},
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    checkConnection();
    
    // Listen for wallet events
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const ethereum = (window as any).ethereum;
      
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const ethereum = (window as any).ethereum;
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        
        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(ethereum);
          const signer = await provider.getSigner();
          const network = await provider.getNetwork();
          
          setConnected(true);
          setAddress(accounts[0]);
          setProvider(provider);
          setSigner(signer);
          setChainId(`0x${network.chainId.toString(16)}`);
          
          // Get balance
          const balance = await provider.getBalance(accounts[0]);
          setBalance(ethers.formatEther(balance));
        }
      } catch (error) {
        console.error('Connection check error:', error);
      }
    }
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setAddress(accounts[0]);
      await checkConnection();
    }
  };

  const handleChainChanged = (chainId: string) => {
    setChainId(chainId);
    // Reload the page to avoid state issues
    window.location.reload();
  };

  const connect = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      alert('Please install MetaMask to use this feature!');
      return;
    }

    try {
      const ethereum = (window as any).ethereum;
      
      // Request account access
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      // Setup provider and signer
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      
      setConnected(true);
      setAddress(accounts[0]);
      setProvider(provider);
      setSigner(signer);
      setChainId(`0x${network.chainId.toString(16)}`);
      
      // Get balance with error handling
      try {
        const balance = await provider.getBalance(accounts[0]);
        setBalance(ethers.formatEther(balance));
      } catch (balanceError: any) {
        console.error('Error getting balance:', balanceError);
        // Set a default balance if RPC fails
        setBalance('0');
      }
      
      // Switch to Base if not on it
      if (network.chainId !== 8453n) {
        await switchToBase();
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      
      // Handle specific Ankr error
      if (error.message && error.message.includes('ankr.com')) {
        alert('RPC connection error. Please try again or check your network settings.');
      } else if (error.code === 4001) {
        alert('You rejected the connection request');
      } else {
        alert('Error connecting wallet: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const disconnect = () => {
    setConnected(false);
    setAddress('');
    setBalance('0');
    setChainId('');
    setProvider(null);
    setSigner(null);
  };

  const switchToBase = async () => {
    if (!provider) return;

    try {
      const ethereum = (window as any).ethereum;
      
      // Try to switch to Base
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_CHAIN_ID }],
      });
    } catch (error: any) {
      // If the chain doesn't exist, add it
      if (error.code === 4902) {
        try {
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BASE_CONFIG],
          });
        } catch (addError) {
          console.error('Error adding Base network:', addError);
          alert('Could not add Base network to wallet');
        }
      } else {
        console.error('Error switching to Base network:', error);
        alert('Could not switch to Base network');
      }
    }
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        address,
        balance,
        chainId,
        provider,
        signer,
        connect,
        disconnect,
        switchToBase,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);