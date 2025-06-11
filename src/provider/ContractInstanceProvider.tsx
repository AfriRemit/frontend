import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useActiveAccount, useActiveWallet, useActiveWalletChain} from 'thirdweb/react';
import { PRICE_ABI } from '../lib/ABI/PriceAPI_ABI.ts';
import { Token_ABI} from '../lib/ABI/TestToken_ABI.ts';
import { SWAP_ABI } from '../lib/ABI/Swap_ABI.ts';
import { AfriStable_ABI } from '@/lib/ABI/AfriStable_ABI.ts';
import {Saving_ABI} from '@/lib/ABI/Saving_ABI.ts'
import tokens from '@/lib/Tokens/tokens.ts';

// Import or define the Token type
import type { Token } from '@/lib/Tokens/tokens.ts';

// Contract addresses - replace with your actual contract addresses
export const CONTRACT_ADDRESSES = {
  swapAddress: '0xdf4381E3D3D040575f297F7478BD5D71ca97Aeac',
  priceFeedAddress: '0xF7147Ee61060e3A33DBEd03207413c9C456004BC',
  afriStableAddress: '0xc5737615ed39b6B089BEDdE11679e5e1f6B9E768',
  savingAddress: '0xe85b044a579e8787afFfBF46691a01E7052cF6D0'
};

// Lisk Sepolia chain ID
const LISK_SEPOLIA_CHAIN_ID = 4202;

// Enhanced context interface with Thirdweb integration
interface ContractInstancesContextType {
  fetchBalance: (faucetAddress: string) => Promise<string | undefined>;
  SWAP_CONTRACT_INSTANCE: () => Promise<ethers.Contract | null>;
  AFRISTABLE_CONTRACT_INSTANCE: () => Promise<ethers.Contract | null>;
  TEST_TOKEN_CONTRACT_INSTANCE: (tokenAddress: string) => Promise<ethers.Contract | null>;
  PRICEAPI_CONTRACT_INSTANCE: () => Promise<ethers.Contract | null>;
  SAVING_CONTRACT_INSTANCE: () => Promise<ethers.Contract | null>;
  signer: ethers.Signer | null;
  address: string | null;
  nativeBalance: string | null;
  tokenList: Token[];
  isConnected: boolean;
  isCorrectNetwork: boolean;
  networkError: string | null;
  connectionError: string | null;
}

export const ContractInstances = createContext<ContractInstancesContextType | undefined>(undefined);

interface ContractInstanceProviderProps {
  children: ReactNode;
}

// Provider component with updated Thirdweb integration
export const ContractInstanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Thirdweb hooks
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const activeChain = useActiveWalletChain();

  // Local state
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [nativeBalance, setNativeBalance] = useState<string>('0');
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Derived state
  const address = account?.address || null;
  const isConnected = !!account && !!wallet;
  const isCorrectNetwork = activeChain?.id === LISK_SEPOLIA_CHAIN_ID;

  // Effect to create signer from active account
  useEffect(() => {
    const createSignerFromAccount = async () => {
      if (account && wallet && isConnected && isCorrectNetwork) {
        try {
          // Check if the browser has ethereum provider
          if (typeof window !== 'undefined' && window.ethereum) {
            // Create provider and get signer
            const provider = new ethers.BrowserProvider(window.ethereum);
            const ethSigner = await provider.getSigner();
            
            // Verify the signer address matches the account
            const signerAddress = await ethSigner.getAddress();
            if (signerAddress.toLowerCase() === account.address.toLowerCase()) {
              setSigner(ethSigner);
              setConnectionError(null);
            } else {
              console.warn('Signer address mismatch with account');
              setSigner(null);
              setConnectionError('Address mismatch between wallet and signer');
            }
          } else {
            console.warn('No ethereum provider found');
            setSigner(null);
            setConnectionError('No ethereum provider available');
          }
        } catch (error) {
          console.error('Failed to create signer from account:', error);
          setSigner(null);
          setConnectionError('Failed to create signer');
        }
      } else {
        setSigner(null);
      }
    };

    createSignerFromAccount();
  }, [account, wallet, isConnected, isCorrectNetwork]);

  // Effect to fetch native balance when signer is available
  useEffect(() => {
    const fetchNativeBalance = async () => {
      if (signer && address && isConnected && isCorrectNetwork) {
        try {
          const provider = signer.provider;
          if (provider) {
            const balance = await provider.getBalance(address);
            setNativeBalance(ethers.formatEther(balance));
          }
        } catch (error) {
          console.error('Failed to fetch native balance:', error);
          setNativeBalance('0');
        }
      } else {
        setNativeBalance('0');
      }
    };

    fetchNativeBalance();
  }, [signer, address, isConnected, isCorrectNetwork]);

  // Effect to handle network changes
  useEffect(() => {
    if (isConnected && activeChain?.id && activeChain.id !== LISK_SEPOLIA_CHAIN_ID) {
      setNetworkError(`Connected to wrong network. Please switch to Lisk Sepolia (Chain ID: ${LISK_SEPOLIA_CHAIN_ID}).`);
    } else if (isConnected && isCorrectNetwork) {
      setNetworkError(null);
    }
  }, [activeChain?.id, isConnected, isCorrectNetwork]);

  // Effect to clear state when disconnected
  useEffect(() => {
    if (!isConnected) {
      setConnectionError(null);
      setNetworkError(null);
      setSigner(null);
      setNativeBalance('0');
    }
  }, [isConnected]);

  // Fetch balance function
const fetchBalance = async (faucetAddress: string): Promise<string | undefined> => {
  try {
    if (!address || !isConnected || !isCorrectNetwork) {
      throw new Error('Wallet not connected or wrong network');
    }

    const token = tokens.find(token => token.address === faucetAddress);
    if (!token) {
      throw new Error('Token not found');
    }

    // Check if it's the native token
    if (token.symbol === 'ETH') {
      return nativeBalance || '0';
    }

    // Special case for AFX token
    if (token.symbol === 'AFX') {
      const AFRI_CONTRACT = await AFRISTABLE_CONTRACT_INSTANCE();
      if (!AFRI_CONTRACT) {
        throw new Error('Unable to create AFX token contract instance');
      }
      const balance = await AFRI_CONTRACT.balanceOf(address);
      const formattedBalance = ethers.formatEther(balance);
      return formattedBalance;
    }

    // For other ERC20 tokens
    const TOKEN_CONTRACT = await TEST_TOKEN_CONTRACT_INSTANCE(faucetAddress);
    if (!TOKEN_CONTRACT) {
      throw new Error('Unable to create token contract instance');
    }
    const balance = await TOKEN_CONTRACT.balanceOf(address);
    const formattedBalance = ethers.formatEther(balance);
    return formattedBalance;

  } catch (error) {
    console.error('Error fetching balance:', error);
    return undefined;
  }
};


  // Contract instance functions
  const SWAP_CONTRACT_INSTANCE = async (): Promise<ethers.Contract | null> => {
    if (!signer || !isConnected || !isCorrectNetwork) {
      console.warn('Wallet not properly connected or wrong network. Please connect your wallet first.');
      return null;
    }
    return new ethers.Contract(CONTRACT_ADDRESSES.swapAddress, SWAP_ABI, signer);
  };

  const PRICEAPI_CONTRACT_INSTANCE = async (): Promise<ethers.Contract | null> => {
    if (!signer || !isConnected || !isCorrectNetwork) {
      console.warn('Wallet not properly connected or wrong network. Please connect your wallet first.');
      return null;
    }
    return new ethers.Contract(CONTRACT_ADDRESSES.priceFeedAddress, PRICE_ABI, signer);
  };

  const TEST_TOKEN_CONTRACT_INSTANCE = async (TOKEN_ADDRESS: string): Promise<ethers.Contract | null> => {
    if (!signer || !isConnected || !isCorrectNetwork) {
      console.warn('Wallet not properly connected or wrong network. Please connect your wallet first.');
      return null;
    }
    return new ethers.Contract(TOKEN_ADDRESS, Token_ABI, signer);
  };
  const AFRISTABLE_CONTRACT_INSTANCE = async (): Promise<ethers.Contract | null> => {
    if (!signer || !isConnected || !isCorrectNetwork) {
      console.warn('Wallet not properly connected or wrong network. Please connect your wallet first.');
      return null;
    }
    return new ethers.Contract(CONTRACT_ADDRESSES.afriStableAddress, AfriStable_ABI, signer);
  };
   const SAVING_CONTRACT_INSTANCE = async (): Promise<ethers.Contract | null> => {
    if (!signer || !isConnected || !isCorrectNetwork) {
      console.warn('Wallet not properly connected or wrong network. Please connect your wallet first.');
      return null;
    }
    return new ethers.Contract(CONTRACT_ADDRESSES.savingAddress, Saving_ABI, signer);
  };
  const contextValue: ContractInstancesContextType = {
    fetchBalance,
    SWAP_CONTRACT_INSTANCE,
    AFRISTABLE_CONTRACT_INSTANCE,
    TEST_TOKEN_CONTRACT_INSTANCE,
    PRICEAPI_CONTRACT_INSTANCE,
    SAVING_CONTRACT_INSTANCE,
    signer,
    address,
    nativeBalance,
    tokenList: tokens,
    isConnected,
    isCorrectNetwork,
    networkError,
    connectionError,
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