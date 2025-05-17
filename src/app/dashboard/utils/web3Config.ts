import { ethers } from 'ethers';
import contractData from './larryContract.json';

export const CONTRACT_ADDRESS = contractData.address;
export const CONTRACT_ABI = contractData.abi;

// Ethereum Mainnet RPC URL
export const RPC_URL = 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';

export const getProvider = () => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    return new ethers.BrowserProvider((window as any).ethereum);
  }
  return new ethers.JsonRpcProvider(RPC_URL);
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
