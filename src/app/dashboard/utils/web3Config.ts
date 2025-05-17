import { ethers } from 'ethers';
import contractData from './larryContract.json';

export const CONTRACT_ADDRESS = contractData.address;
export const CONTRACT_ABI = contractData.abi;

// Ethereum Mainnet RPC URLs with public fallbacks
const RPC_URLS = [
  'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  'https://eth-mainnet.public.blastapi.io',
  'https://ethereum-rpc.publicnode.com',
  'https://eth.llamarpc.com',
  'https://rpc.flashbots.net'
];

export const getProvider = () => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    return new ethers.BrowserProvider((window as any).ethereum);
  }
  
  // Try each RPC URL until one works
  for (const url of RPC_URLS) {
    try {
      return new ethers.JsonRpcProvider(url);
    } catch (e) {
      console.warn(`Failed to connect to ${url}, trying next...`);
    }
  }
  
  // If all fail, return the first one anyway (it will error later)
  return new ethers.JsonRpcProvider(RPC_URLS[0]);
};

export const getContract = async (signer?: ethers.Signer) => {
  const provider = getProvider();
  let contractSigner = signer;
  
  if (!contractSigner && typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      const browserProvider = provider as ethers.BrowserProvider;
      contractSigner = await browserProvider.getSigner();
    } catch (e) {
      // User hasn't connected wallet, use provider for read-only operations
    }
  }
  
  return new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    contractSigner || provider
  );
};

export const formatEther = (value: bigint | string) => {
  return ethers.formatEther(value);
};

export const parseEther = (value: string) => {
  return ethers.parseEther(value);
};

export const formatUnits = (value: bigint | string, decimals: number = 18) => {
  return ethers.formatUnits(value, decimals);
};
