import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { PRICE_ABI } from '../lib/ABI/PriceAPI_ABI.ts';
import { Token_ABI} from '../lib/ABI/TestToken_ABI.ts';
import { SWAP_ABI } from '../lib/ABI/Swap_ABI.ts';
import tokens from '@/lib/Tokens/tokens.ts';

// Import or define the Token type
import type { Token } from '@/lib/Tokens/tokens.ts';

// Contract addresses - replace with your actual contract addresses
export const CONTRACT_ADDRESSES = {
  swapAddress: '0x1E6E21b0F8a9c6A0840c8CC3aa1b97f921027708',
  priceFeedAddress: '0x82683F9Fe41B395931a86CEF97D76CE3A737E704',
};

// Lisk Sepolia chain ID
const LISK_SEPOLIA_CHAIN_ID = 4202;

// Context interface - keeping the same interface for backward compatibility
interface ContractInstancesContextType {
  fetchBalance: (faucetAddress: string) => Promise<string | undefined>;
  SWAP_CONTRACT_INSTANCE: () => Promise<ethers.Contract | null>;
  TEST_TOKEN_CONTRACT_INSTANCE: (tokenAddress: string) => Promise<ethers.Contract | null>;
  PRICEAPI_CONTRACT_INSTANCE: () => Promise<ethers.Contract | null>;
  connectWallet: () => Promise<void>;
  signer: ethers.Signer | null;
  address: string | null;
  nativeBalance: string | null;
  tokenList: Token[];
  isConnected: boolean;
  isConnecting: boolean;
  resetWalletConnection: () => void;
}

export const ContractInstances = createContext<ContractInstancesContextType | undefined>(undefined);

interface ContractInstanceProviderProps {
  children: ReactNode;
}

// Provider component
export const ContractInstanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Wagmi hooks
  const { address: wagmiAddress, isConnected: wagmiIsConnected, chain } = useAccount();
  const { connect, status: connectStatus } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { data: balanceData } = useBalance({
    address: wagmiAddress,
  });

  // Local state for ethers integration
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Derived state from Wagmi - maintaining same interface
  const address = wagmiAddress || null;
  const isConnected = wagmiIsConnected && chain?.id === LISK_SEPOLIA_CHAIN_ID;
  const nativeBalance = balanceData ? ethers.formatEther(balanceData.value.toString()) : '0';

  // Connect wallet function using Wagmi
  const connectWallet = async (): Promise<void> => {
    setIsConnecting(true);
    
    try {
      // Connect using Wagmi
      await new Promise<void>((resolve, reject) => {
        connect(
          { connector: injected() },
          {
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
          }
        );
      });

      // Check if we're on the correct network
      if (chain?.id !== LISK_SEPOLIA_CHAIN_ID) {
        try {
          await switchChain({ chainId: LISK_SEPOLIA_CHAIN_ID });
        } catch (switchError: any) {
          console.error('Failed to switch to Lisk Sepolia:', switchError);
          throw new Error('Please switch to Lisk Sepolia network');
        }
      }

      console.log('Successfully connected to Lisk Sepolia:', address);
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  // Reset wallet connection
  const resetWalletConnection = () => {
    setIsConnecting(false);
    setSigner(null);
    disconnect();
    console.log('Wallet connection state reset');
  };

  // Effect to create signer when wallet is connected and on correct network
  useEffect(() => {
    const createSigner = async () => {
      if (wagmiIsConnected && wagmiAddress && chain?.id === LISK_SEPOLIA_CHAIN_ID) {
        try {
          if (typeof window !== 'undefined' && window.ethereum) {
            const provider = new BrowserProvider(window.ethereum);
            const ethSigner = await provider.getSigner();
            setSigner(ethSigner);
          }
        } catch (error) {
          console.error('Failed to create signer:', error);
          setSigner(null);
        }
      } else {
        setSigner(null);
      }
    };

    createSigner();
  }, [wagmiIsConnected, wagmiAddress, chain?.id]);

  // Update isConnecting state based on Wagmi's connection status
  useEffect(() => {
    if (connectStatus === 'pending') {
      setIsConnecting(true);
    } else if ((connectStatus === 'idle' || connectStatus === 'success' || connectStatus === 'error') && isConnecting) {
      setIsConnecting(false);
    }
  }, [connectStatus, isConnecting]);

  // Fetch balance function
  const fetchBalance = async (faucetAddress: string): Promise<string | undefined> => {
    try {
      if (!address) {
        throw new Error('Address not available');
      }

      // Check if it's the native token
      const nativeToken = tokens.find(token => token.address === faucetAddress);
      if (nativeToken && nativeToken.symbol === 'ETH') {
        return nativeBalance || '0';
      } else {
        // For ERC20 tokens
        const TOKEN_CONTRACT = await TEST_TOKEN_CONTRACT_INSTANCE(faucetAddress);
        if (!TOKEN_CONTRACT) {
          throw new Error('Unable to create token contract instance');
        }
        const balance = await TOKEN_CONTRACT.balanceOf(address);
        const formattedBalance = ethers.formatEther(balance);
        return formattedBalance;
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      return undefined;
    }
  };

  // Contract instance functions - same as before
  const SWAP_CONTRACT_INSTANCE = async (): Promise<ethers.Contract | null> => {
    if (!signer) {
      console.warn('Signer not available. Please connect your wallet first.');
      return null;
    }
    return new ethers.Contract(CONTRACT_ADDRESSES.swapAddress, SWAP_ABI, signer);
  };

  const PRICEAPI_CONTRACT_INSTANCE = async (): Promise<ethers.Contract | null> => {
    if (!signer) {
      console.warn('Signer not available. Please connect your wallet first.');
      return null;
    }
    return new ethers.Contract(CONTRACT_ADDRESSES.priceFeedAddress, PRICE_ABI, signer);
  };

  const TEST_TOKEN_CONTRACT_INSTANCE = async (TOKEN_ADDRESS: string): Promise<ethers.Contract | null> => {
    if (!signer) {
      console.warn('Signer not available. Please connect your wallet first.');
      return null;
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
    isConnecting: isConnecting || connectStatus === 'pending',
    resetWalletConnection,
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