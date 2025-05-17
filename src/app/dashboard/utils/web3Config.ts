import { ethers } from 'ethers';
import contractData from './larryContract.json';

export const CONTRACT_ADDRESS = contractData.address;
export const CONTRACT_ABI = contractData.abi;

// Ethereum Mainnet RPC URLs - only public endpoints that don't require API keys
const RPC_URLS = [
  'https://eth.llamarpc.com',
  'https://rpc.flashbots.net',
  'https://ethereum-rpc.publicnode.com',
  'https://cloudflare-eth.com',
  'https://eth-mainnet.public.blastapi.io',
  'https://api.zmok.io/mainnet/oaen6dy8ff6hju9k',
  'https://uk.rpc.blxrbdn.com',
  'https://virginia.rpc.blxrbdn.com',
  'https://singapore.rpc.blxrbdn.com'
];

export const getProvider = () => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    return new ethers.BrowserProvider((window as any).ethereum);
  }
  
  // Try each RPC URL until one works
  for (const url of RPC_URLS) {
    try {
      const provider = new ethers.JsonRpcProvider(url);
      // Test the connection by making a simple call
      provider.getNetwork().catch(() => {});
      return provider;
    } catch (e) {
      console.warn(`Failed to connect to ${url}, trying next...`);
    }
  }
  
  // If all fail, return the first one anyway (it will error later)
  console.warn('All RPC endpoints failed, using first one as fallback');
  return new ethers.JsonRpcProvider(RPC_URLS[0]);
};

export const getContract = async (signer?: ethers.Signer) => {
  let provider;
  let contractSigner = signer;
  
  try {
    provider = getProvider();
  } catch (e) {
    console.error('Failed to get provider, using fallback');
    // Use a known good public RPC as fallback
    provider = new ethers.JsonRpcProvider('https://cloudflare-eth.com');
  }
  
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
