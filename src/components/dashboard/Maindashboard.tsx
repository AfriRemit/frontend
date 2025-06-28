import React, { useState, useEffect } from 'react';
import { formatEther, JsonRpcProvider } from 'ethers';

import Currencies from '@/lib/Tokens/currencies';
import { useContractInstances } from '@/provider/ContractInstanceProvider';
import { shortenAddress } from '@/lib/utils';
import { roundToFiveDecimalPlaces, roundToTwoDecimalPlaces} from '@/lib/utils.ts';
import tokens from '@/lib/Tokens/tokens';

// Import the separated components
import WalletNotConnected from './Notconnected';
import ConnectedDashboard from './ConnectedDashboard';

interface DashboardProps {
  onPageChange?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('cNGN');
  const { fetchBalance, address, isConnected, PRICEAPI_CONTRACT_INSTANCE, signer, TEST_TOKEN_CONTRACT_INSTANCE, AFRISTABLE_CONTRACT_INSTANCE } = useContractInstances();
  const [bal1, setBal1] = useState<number | null>(null);
  const [usdValue, setUsdValue] = useState<number>(0);
  const [currentTokenPrice, setCurrentTokenPrice] = useState<number>(0);
  const [portfolioGrowth, setPortfolioGrowth] = useState<number>(0);
  const [exchangeRates, setExchangeRates] = useState<{[key: string]: { rate: number, change: number, positive: boolean | null }}>({});
  const [transactions, setTransactions] = useState<any[]>([]);
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [txError, setTxError] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<any>(null);

  // Get selected token based on currency
  useEffect(() => {
    const token = tokens.find(t => t.symbol === selectedCurrency);
    setSelectedToken(token || null);
  }, [selectedCurrency]);

  // Fetch balance and price data
  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected || !address || !selectedToken) return;

      try {
        // Fetch balance
        const balance = await fetchBalance(selectedToken.address);
        if (balance !== undefined) {
          setBal1(parseFloat(balance));
        }

        // Fetch token price
        const priceContract = await PRICEAPI_CONTRACT_INSTANCE();
        if (priceContract) {
          const price = await priceContract.getTokenPrice(selectedToken.address);
          const priceInUSD = parseFloat(formatEther(price));
          setCurrentTokenPrice(priceInUSD);
          
          // Calculate USD value
          if (balance !== undefined) {
            setUsdValue(parseFloat(balance) * priceInUSD);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [isConnected, address, selectedToken, fetchBalance, PRICEAPI_CONTRACT_INSTANCE]);

  // Fetch exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      const priceContract = await PRICEAPI_CONTRACT_INSTANCE();
      if (!priceContract) return;

      try {
        const rates: {[key: string]: { rate: number, change: number, positive: boolean | null }} = {};
        
        for (const token of tokens) {
          try {
            const price = await priceContract.getTokenPrice(token.address);
            const priceInUSD = parseFloat(formatEther(price));
            
            // Simulate price change (in real app, this would come from historical data)
            const change = (Math.random() - 0.5) * 2; // -1% to +1%
            const positive = change > 0 ? true : change < 0 ? false : null;
            
            rates[token.symbol] = {
              rate: priceInUSD,
              change: Math.abs(change),
              positive
            };
          } catch (error) {
            console.error(`Error fetching price for ${token.symbol}:`, error);
          }
        }
        
        setExchangeRates(rates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
    
    // Update rates every 30 seconds
    const interval = setInterval(fetchExchangeRates, 30000);
    return () => clearInterval(interval);
  }, [PRICEAPI_CONTRACT_INSTANCE]);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!isConnected || !address) return;

      setTxLoading(true);
      setTxError(null);

      try {
        // Simulate fetching transactions (in real app, this would come from blockchain events)
        const mockTransactions = [
          {
            hash: '0x1234567890abcdef1234567890abcdef12345678',
            direction: 'sent' as const,
            amount: '100.00',
            token: 'cNGN',
            counterparty: '0xabcdef1234567890abcdef1234567890abcdef12',
            timestamp: Math.floor(Date.now() / 1000) - 3600
          },
          {
            hash: '0xabcdef1234567890abcdef1234567890abcdef12',
            direction: 'received' as const,
            amount: '50.00',
            token: 'cNGN',
            counterparty: '0x1234567890abcdef1234567890abcdef12345678',
            timestamp: Math.floor(Date.now() / 1000) - 7200
          }
        ];

        setTransactions(mockTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setTxError('Failed to load transactions');
      } finally {
        setTxLoading(false);
      }
    };

    fetchTransactions();
  }, [isConnected, address]);

  // Calculate portfolio growth (simulated)
  useEffect(() => {
    // Simulate portfolio growth calculation
    const growth = Math.random() * 10; // 0-10% growth
    setPortfolioGrowth(roundToTwoDecimalPlaces(growth));
  }, [usdValue]);

  // Copy address to clipboard
  const handleCopyAddress = async () => {
    if (!address) return;
    
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  // Handle quick actions
  const handleQuickAction = (action: string) => {
    if (onPageChange) {
      onPageChange(action);
    }
  };

  // Render based on connection status
  if (!isConnected) {
    return <WalletNotConnected exchangeRates={exchangeRates} />;
  }

  return (
    <ConnectedDashboard
      selectedCurrency={selectedCurrency}
      setSelectedCurrency={setSelectedCurrency}
      balanceVisible={balanceVisible}
      setBalanceVisible={setBalanceVisible}
      walletAddress={address || ''}
      copied={copied}
      onCopyAddress={handleCopyAddress}
      selectedToken={selectedToken}
      bal1={bal1}
      usdValue={usdValue}
      currentTokenPrice={currentTokenPrice}
      portfolioGrowth={portfolioGrowth}
      onQuickAction={handleQuickAction}
      exchangeRates={exchangeRates}
      transactions={transactions}
      txLoading={txLoading}
      txError={txError}
    />
  );
};

export default Dashboard;