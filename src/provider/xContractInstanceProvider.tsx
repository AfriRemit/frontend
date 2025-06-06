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
export const CONTRACT_ADDRESSES = {
  swapAddress: '0x1E6E21b0F8a9c6A0840c8CC3aa1b97f921027708', // Replace with actual Swap contract address
  priceFeedAddress: '0x82683F9Fe41B395931a86CEF97D76CE3A737E704', // Replace with actual Price Feed contract address
};



// Context interface
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

// Create context
const ContractInstanceContext = createContext<ContractInstancesContextType | undefined>(undefined);

// Helper function to create timeout promise
const createTimeoutPromise = (ms: number, errorMessage: string) => {
  return new Promise((_, reject) => 
    setTimeout(() => reject(new Error(errorMessage)), ms)
  );
};

// Provider component
export const ContractInstanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState('');
  const [nativeBalance, setNativeBalance] = useState('0');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Connect wallet function with improved error handling
  const connectWallet = async (): Promise<void> => { 
    setIsConnecting(true);
    
    try { 
      if (!window.ethereum) { 
        throw new Error('Please install MetaMask or another Web3 wallet'); 
      } 

      // Request account access with timeout
      const accountsPromise = window.ethereum.request({ method: 'eth_requestAccounts' });
      const timeoutPromise = createTimeoutPromise(30000, 'Connection request timed out');
      
      await Promise.race([accountsPromise, timeoutPromise]);

      const web3Provider = new BrowserProvider(window.ethereum); 
      const network = await web3Provider.getNetwork(); 

      // Check if already on Lisk Sepolia 
      if (network.chainId !== 4202n) { 
        try { 
          // Try to switch to Lisk Sepolia with timeout
          const switchPromise = window.ethereum.request({ 
            method: 'wallet_switchEthereumChain', 
            params: [{ chainId: LISK_SEPOLIA_CONFIG.chainId }], 
          });
          const switchTimeoutPromise = createTimeoutPromise(15000, 'Network switch timed out');
          
          await Promise.race([switchPromise, switchTimeoutPromise]);
        } catch (switchError: any) { 
          // If the chain hasn't been added to MetaMask, add it 
          if (switchError.code === 4902) { 
            const addNetworkPromise = window.ethereum.request({ 
              method: 'wallet_addEthereumChain', 
              params: [LISK_SEPOLIA_CONFIG], 
            });
            const addTimeoutPromise = createTimeoutPromise(15000, 'Add network timed out');
            
            await Promise.race([addNetworkPromise, addTimeoutPromise]);
          } else if (!switchError.message.includes('timed out')) {
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
    } catch (error: any) { 
      console.error('Failed to connect wallet:', error); 
      
      // Reset all connection states on error
      setIsConnected(false);
      setProvider(null);
      setSigner(null);
      setAddress('');
      setNativeBalance('0');
      
      throw error; 
    } finally {
      setIsConnecting(false);
    }
  };

  // Manual reset function for stuck states
  const resetWalletConnection = () => {
    setIsConnecting(false);
    setIsConnected(false);
    setAddress('');
    setProvider(null);
    setSigner(null);
    setNativeBalance('0');
    console.log('Wallet connection state reset');
  };

  // Add useEffect for cleanup and event listeners
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected wallet
          resetWalletConnection();
          console.log('Wallet disconnected');
        } else if (accounts[0] !== address && address) {
          // Account changed, reconnect
          setIsConnecting(false);
          connectWallet();
        }
      };

      const handleChainChanged = (chainId: string) => {
        // Reset connection state when chain changes
        setIsConnecting(false);
        console.log('Chain changed to:', chainId);
        
        // If not on Lisk Sepolia, reset connection
        if (chainId !== LISK_SEPOLIA_CONFIG.chainId) {
          setIsConnected(false);
          setProvider(null);
          setSigner(null);
        }
      };

      const handleDisconnect = () => {
        resetWalletConnection();
      };

      // Add event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      // Cleanup on unmount
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
          window.ethereum.removeListener('disconnect', handleDisconnect);
        }
        
        // Reset connecting state on component unmount
        setIsConnecting(false);
      };
    }
  }, [address, isConnected]);

  // Check if wallet was previously connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            // Wallet was previously connected, try to reconnect silently
            const web3Provider = new BrowserProvider(window.ethereum);
            const network = await web3Provider.getNetwork();
            
            if (network.chainId === 4202n) {
              const web3Signer = await web3Provider.getSigner();
              const userAddress = await web3Signer.getAddress();
              const balance = await web3Provider.getBalance(userAddress);
              const formattedBalance = ethers.formatEther(balance);

              setProvider(web3Provider);
              setSigner(web3Signer);
              setAddress(userAddress);
              setNativeBalance(formattedBalance);
              setIsConnected(true);
              
              console.log('Auto-reconnected to wallet:', userAddress);
            }
          }
        } catch (error) {
          console.log('Auto-reconnection failed:', error);
        }
      }
    };

    checkConnection();
  }, []);

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
    isConnecting,
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