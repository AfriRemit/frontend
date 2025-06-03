import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import { PRICE_ABI } from '../lib/ABI/PriceAPI_ABI.ts';
import { Token_ABI} from '../lib/ABI/TestToken_ABI.ts';
import { SWAP_ABI } from '../lib/ABI/Swap_ABI.ts';
import tokens from '@/lib/Tokens/tokens.ts';

// Import or define the Token type
import type { Token } from '@/lib/Tokens/tokens.ts';

// Add this declaration to let TypeScript know about window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}



// Contract addresses - replace with your actual contract addresses
const CONTRACT_ADDRESSES = {
  swapAddress: '0x...', // Replace with actual Swap contract address
  priceFeedAddress: '0x...', // Replace with actual Price Feed contract address
};



// Context interface
interface ContractInstancesContextType {
  fetchBalance: (faucetAddress: string) => Promise<string | undefined>;
  SWAP_CONTRACT_INSTANCE: () => Promise<ethers.Contract>;
  TEST_TOKEN_CONTRACT_INSTANCE: (tokenAddress: string) => Promise<ethers.Contract>;
  PRICEAPI_CONTRACT_INSTANCE: () => Promise<ethers.Contract>;
  connectWallet: () => Promise<void>;
  signer: ethers.Signer | null;
  address: string | null;
  nativeBalance: string | null;
  tokenList: Token[];
  isConnected: boolean;
}

export const ContractInstances = createContext<ContractInstancesContextType | undefined>(undefined);

interface ContractInstanceProviderProps {
  children: ReactNode;
}

const ContractInstanceProvider: React.FC<ContractInstanceProviderProps> = ({ children }) => {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [nativeBalance, setNativeBalance] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Lisk Sepolia network configuration
  const LISK_SEPOLIA_CONFIG = {
    chainId: '0x106A', // 4202 in hex
    chainName: 'Lisk Sepolia Testnet',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.sepolia-api.lisk.com'],
    blockExplorerUrls: ['https://sepolia-blockscout.lisk.com'],
  };

  // Connect wallet function
  const connectWallet = async (): Promise<void> => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Web3 wallet');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const web3Provider = new BrowserProvider(window.ethereum);
      const network = await web3Provider.getNetwork();

      // Check if already on Lisk Sepolia
      if (network.chainId !== 4202n) {
        try {
          // Try to switch to Lisk Sepolia
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: LISK_SEPOLIA_CONFIG.chainId }],
          });
        } catch (switchError: any) {
          // If the chain hasn't been added to MetaMask, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [LISK_SEPOLIA_CONFIG],
            });
          } else {
            throw switchError;
          }
        }
      }

      // Get the signer after network is correct
      const web3Signer = await web3Provider.getSigner();
      const userAddress = await web3Signer.getAddress();
      
      // Get native balance
      const balance = await web3Provider.getBalance(userAddress);
      const formattedBalance = ethers.formatEther(balance);

      // Update state
      setProvider(web3Provider);
      setSigner(web3Signer);
      setAddress(userAddress);
      setNativeBalance(formattedBalance);
      setIsConnected(true);

      console.log('Successfully connected to Lisk Sepolia:', userAddress);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setIsConnected(false);
      throw error;
    }
  };

  const fetchBalance = async (faucetAddress: string): Promise<string | undefined> => {
    try {
      if (!provider || !address) {
        throw new Error('Provider or address not available');
      }

      // Check if it's the native token
      const nativeToken = tokens.find(token => token.address === faucetAddress);
      if (nativeToken && nativeToken.symbol === 'ETH') {
        return nativeBalance || '0';
      } else {
        // For ERC20 tokens
        const TOKEN_CONTRACT = await TEST_TOKEN_CONTRACT_INSTANCE(faucetAddress);
        const balance = await TOKEN_CONTRACT.balanceOf(address);
        const formattedBalance = ethers.formatEther(balance);
        return formattedBalance;
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      return undefined;
    }
  };

  const SWAP_CONTRACT_INSTANCE = async (): Promise<ethers.Contract> => {
    if (!signer) {
      throw new Error('Signer not available');
    }
    return new ethers.Contract(CONTRACT_ADDRESSES.swapAddress, SWAP_ABI, signer);
  };

  const PRICEAPI_CONTRACT_INSTANCE = async (): Promise<ethers.Contract> => {
    if (!signer) {
      throw new Error('Signer not available');
    }
    return new ethers.Contract(CONTRACT_ADDRESSES.priceFeedAddress, PRICE_ABI, signer);
  };

  const TEST_TOKEN_CONTRACT_INSTANCE = async (TOKEN_ADDRESS: string): Promise<ethers.Contract> => {
    if (!signer) {
      throw new Error('Signer not available');
    }
    return new ethers.Contract(TOKEN_ADDRESS, Token_ABI, signer);
  };

  const contextValue: ContractInstancesContextType = {
    fetchBalance,
    SWAP_CONTRACT_INSTANCE,
    TEST_TOKEN_CONTRACT_INSTANCE,
    PRICEAPI_CONTRACT_INSTANCE,
    connectWallet,
    signer,
    address,
    nativeBalance,
    tokenList: tokens,
    isConnected,
  };

  return (
    <ContractInstances.Provider value={contextValue}>
      {children}
    </ContractInstances.Provider>
  );
};

export default ContractInstanceProvider;

// Custom hook to use the context
export const useContractInstances = (): ContractInstancesContextType => {
  const context = React.useContext(ContractInstances);
  if (context === undefined) {
    throw new Error('useContractInstances must be used within a ContractInstanceProvider');
  }
  return context;
};