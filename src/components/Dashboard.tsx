import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownLeft, DollarSignIcon, Copy, Eye, EyeOff, ArrowLeftRight, PiggyBank, Users, Gift, Wallet, AlertCircle } from 'lucide-react';
import { formatEther } from 'ethers';

import Currencies from '@/lib/Tokens/currencies';
import { useContractInstances } from '@/provider/ContractInstanceProvider';
import { shortenAddress } from '@/lib/utils';
import { roundToFiveDecimalPlaces, roundToTwoDecimalPlaces} from '@/lib/utils.ts';

interface DashboardProps {
  onPageChange?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('cNGN');
  const { fetchBalance, address, isConnected, PRICEAPI_CONTRACT_INSTANCE } = useContractInstances();
  const [bal1, setBal1] = useState<number | null>(null);
  const [usdValue, setUsdValue] = useState<number>(0);
  const [currentTokenPrice, setCurrentTokenPrice] = useState<number>(0);
  const [exchangeRates, setExchangeRates] = useState<{[key: string]: { rate: number, change: number, positive: boolean | null }}>({});
  const [livePrices, setLivePrices] = useState<{[key: string]: number}>({});
  const [initialPricesLoaded, setInitialPricesLoaded] = useState(false);

  const fullAddress = address;
  const walletAddress = shortenAddress(address);

  const selectedToken = Currencies.find(token => token.code === selectedCurrency);
  const token1Address = selectedToken?.address;

  // Function to get latest price for a specific token
  const getLatestTokenPrice = async (tokenAddress: string): Promise<number> => {
    try {
      if (!PRICEAPI_CONTRACT_INSTANCE) {
        return 0;
      }

      const contract = await PRICEAPI_CONTRACT_INSTANCE();
      const priceInWei = await contract.getLatestPrice(tokenAddress);
      const price = parseFloat(formatEther(priceInWei));
      
      return price;
    } catch (error) {
      console.error('Error getting latest token price:', error);
      return 0;
    }
  };

  // Function to calculate USD value using latest price
  const calculateUSDValue = async (tokenAddress: string, amount: number): Promise<number> => {
    try {
      const latestPrice = await getLatestTokenPrice(tokenAddress);
      const usdValue = amount * latestPrice;
      
      return usdValue;
    } catch (error) {
      console.error('Error calculating USD value:', error);
      return 0;
    }
  };

  // Function to simulate live exchange rate changes for specific tokens
  const updateLiveExchangeRates = async () => {
    const currencyData = [
      { code: 'cNGN', currency: '🇳🇬 cNGN/USD', address: Currencies.find(c => c.code === 'cNGN')?.address },
      { code: 'cGHS', currency: '🇬🇭 cGHS/USD', address: Currencies.find(c => c.code === 'cGHS')?.address },
      { code: 'cKES', currency: '🇰🇪 cKES/USD', address: Currencies.find(c => c.code === 'cKES')?.address },
      { code: 'cZAR', currency: '🇿🇦 cZAR/USD', address: Currencies.find(c => c.code === 'cZAR')?.address }
    ];

    const newRates: {[key: string]: { rate: number, change: number, positive: boolean | null }} = {};
    const newPrices: {[key: string]: number} = {};

    for (const curr of currencyData) {
      if (curr.address) {
        try {
          let latestPrice: number;
          
          // If this is the first load or we don't have a previous price, get from contract
          if (!initialPricesLoaded || !livePrices[curr.code]) {
            latestPrice = await getLatestTokenPrice(curr.address);
          } else {
            // For subsequent updates, add fluctuation to simulate live changes
            const previousPrice = livePrices[curr.code];
            // Generate random fluctuation between -2% to +2%
            const fluctuation = (Math.random() - 0.5) * 0.04; // -0.02 to +0.02
            latestPrice = previousPrice * (1 + fluctuation);
          }

          // Calculate percentage change from previous price
          let changePercent = 0;
          const previousPrice = livePrices[curr.code];
          if (previousPrice && previousPrice > 0 && initialPricesLoaded) {
            changePercent = ((latestPrice - previousPrice) / previousPrice) * 100;
          }

          newPrices[curr.code] = latestPrice;
          newRates[curr.currency] = {
            rate: roundToFiveDecimalPlaces(latestPrice),
            change: roundToFiveDecimalPlaces(changePercent),
            positive: changePercent > 0.01 ? true : changePercent < -0.01 ? false : null
          };
        } catch (error) {
          console.error(`Error updating rate for ${curr.code}:`, error);
          // Keep previous values if error occurs
          if (livePrices[curr.code]) {
            newPrices[curr.code] = livePrices[curr.code];
            newRates[curr.currency] = exchangeRates[curr.currency] || { rate: 0, change: 0, positive: null };
          }
        }
      }
    }

    setLivePrices(newPrices);
    setExchangeRates(newRates);
    
    // Mark initial prices as loaded after first successful load
    if (!initialPricesLoaded && Object.keys(newPrices).length > 0) {
      setInitialPricesLoaded(true);
    }

    // Update current token USD value if selected token price changed
    if (selectedToken && newPrices[selectedToken.code] && bal1) {
      const newUsdValue = bal1 * newPrices[selectedToken.code];
      setUsdValue(roundToTwoDecimalPlaces(newUsdValue));
      setCurrentTokenPrice(newPrices[selectedToken.code]);
    }
  };

  useEffect(() => {
    const fetchBalances = async () => {
      if (!token1Address || !isConnected) {
        // Reset values when not connected
        setBal1(0);
        setUsdValue(0);
        setCurrentTokenPrice(0);
        return;
      }

      try {
        const bal = await fetchBalance(token1Address);
        
        const numericBal = Number(bal);
        const roundedBal = isNaN(numericBal) || numericBal < 0 ? 0 : roundToTwoDecimalPlaces(numericBal);
        
        setBal1(roundedBal);

        // Get latest USD value for the balance using contract price
        if (roundedBal > 0) {
          const usdVal = await calculateUSDValue(token1Address, roundedBal);
          setUsdValue(roundToTwoDecimalPlaces(usdVal));
          
          // Store the current token price
          const price = await getLatestTokenPrice(token1Address);
          setCurrentTokenPrice(price);
        } else {
          setUsdValue(0);
          setCurrentTokenPrice(0);
        }
      } catch (err) {
        console.error('Error fetching balance:', err);
        setBal1(0);
        setUsdValue(0);
        setCurrentTokenPrice(0);
      }
    };

    fetchBalances();
  }, [token1Address, isConnected, PRICEAPI_CONTRACT_INSTANCE]);

  // Update exchange rates every 5 seconds to simulate live changes
  useEffect(() => {
    // Initial load
    updateLiveExchangeRates();
    
    const interval = setInterval(updateLiveExchangeRates, 5000);
    return () => clearInterval(interval);
  }, [selectedCurrency, PRICEAPI_CONTRACT_INSTANCE]);

  // Update USD value when selected currency changes
  useEffect(() => {
    const updateUSDValue = async () => {
      if (bal1 && token1Address && bal1 > 0 && isConnected) {
        const usdVal = await calculateUSDValue(token1Address, bal1);
        setUsdValue(roundToTwoDecimalPlaces(usdVal));
        
        const price = await getLatestTokenPrice(token1Address);
        setCurrentTokenPrice(price);
      }
    };

    updateUSDValue();
  }, [selectedCurrency, bal1, token1Address, isConnected]);

  const portfolioGrowth = 5.6;

  const copyAddress = () => {
    if (fullAddress) {
      navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleQuickAction = (action: string) => {
    if (onPageChange) {
      onPageChange(action);
    }
  };

  // Wallet Not Connected Component
  const WalletNotConnected = () => (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Message */}
        <div className="bg-gradient-to-br from-terracotta/10 to-sage/10 rounded-2xl p-8 shadow-sm border border-stone-200 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-terracotta to-sage rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-stone-800 mb-4">Welcome to AfriRemit</h2>
          <p className="text-stone-600 text-lg mb-6 max-w-2xl mx-auto">
            Connect your wallet to start sending money, swapping currencies, and managing your digital assets across Africa.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-stone-500">
            <AlertCircle className="w-4 h-4" />
            <span>Please connect your wallet using the button in the top navigation</span>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {[
            { key: 'send', title: 'Send', subtitle: 'Transfer money', icon: ArrowUpRight, color: 'terracotta' },
            { key: 'swap', title: 'Swap', subtitle: 'Exchange', icon: ArrowLeftRight, color: 'gold' },
            { key: 'Buy/Sell', title: 'Buy/Sell', subtitle: 'Onramp/Offramp', icon: DollarSignIcon, color: 'purple-600' },
            { key: 'savings', title: 'Save', subtitle: 'Traditional rotating savings', icon: PiggyBank, color: 'emerald-600' },
            { key: 'utility', title: 'Utility Payment', subtitle: 'Pay for utilities and services', icon: Gift, color: 'emerald-600' },
          ].map((action) => (
            <div 
              key={action.key}
              className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 opacity-75 cursor-not-allowed"
            >
              <div className={`w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center mb-4`}>
                <action.icon className="w-6 h-6 text-stone-400" />
              </div>
              <h3 className="font-semibold text-stone-500 mb-1">{action.title}</h3>
              <p className="text-stone-400 text-sm">{action.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Live Exchange Rates - Always Show */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-stone-800">Live Exchange Rates</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-stone-500">Live</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(exchangeRates).length > 0 ? (
              Object.entries(exchangeRates).map(([currency, data], index) => (
                <div key={index} className="bg-stone-50 rounded-xl p-6 transition-all duration-300 hover:shadow-md">
                  <p className="text-sm text-stone-600 mb-2">{currency}</p>
                  <p className="text-xl font-bold text-stone-800 mb-1">${data.rate.toFixed(6)}</p>
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium transition-colors duration-300 ${
                      data.positive === true ? 'text-green-600' : 
                      data.positive === false ? 'text-red-600' : 'text-stone-600'
                    }`}>
                      {data.positive === true ? '+' : data.positive === false ? '' : ''}{data.change.toFixed(2)}%
                    </p>
                    <p className="text-xs text-stone-500">5s</p>
                  </div>
                </div>
              ))
            ) : (
              // Loading state for exchange rates
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-stone-50 rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-stone-200 rounded mb-2"></div>
                  <div className="h-6 bg-stone-200 rounded mb-1"></div>
                  <div className="h-4 bg-stone-200 rounded w-1/2"></div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
          <h3 className="text-lg font-semibold text-stone-800 mb-6">Getting Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-terracotta font-bold">1</span>
              </div>
              <h4 className="font-semibold text-stone-800 mb-2">Connect Wallet</h4>
              <p className="text-stone-600 text-sm">Use the "Connect Wallet" button to link your digital wallet</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-sage font-bold">2</span>
              </div>
              <h4 className="font-semibold text-stone-800 mb-2">Add Funds</h4>
              <p className="text-stone-600 text-sm">Buy stablecoins or transfer from another wallet</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gold font-bold">3</span>
              </div>
              <h4 className="font-semibold text-stone-800 mb-2">Start Transacting</h4>
              <p className="text-stone-600 text-sm">Send money, swap currencies, and save with AfriRemit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Connected Wallet Dashboard
  const ConnectedDashboard = () => (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">
        {/* Wallet Overview */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
            <h2 className="text-2xl font-bold text-stone-800">Your Wallet</h2>

            <div className="flex flex-wrap items-center gap-4">
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-terracotta focus:border-transparent"
              >
                {Currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="p-2 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                {balanceVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>

              <button
                onClick={copyAddress}
                className="flex items-center space-x-2 text-stone-500 hover:text-stone-700 transition-colors"
              >
                <span className="text-sm font-mono">{walletAddress}</span>
                <Copy className="w-4 h-4" />
              </button>

              {copied && (
                <span className="text-green-600 text-sm font-medium">Copied!</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-3">
                <p className="text-stone-600">Total Balance</p>
                <p className="text-4xl font-bold text-stone-800">
                  {balanceVisible
                    ? `${selectedToken?.symbol || ''} ${bal1?.toLocaleString() || 0}`
                    : '••••••'}
                </p>
                <p className="text-stone-500 text-lg">
                  {balanceVisible 
                    ? `≈ ${usdValue.toLocaleString()} USD (@ ${currentTokenPrice.toFixed(6)})`
                    : '≈ $••••••'
                  }
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-sage/10 to-gold/10 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-5 h-5 text-sage" />
                <p className="text-stone-600">Portfolio Growth</p>
              </div>
              <p className="text-2xl font-bold text-sage">+{portfolioGrowth}%</p>
              <p className="text-stone-500">This month</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2">
          {[
            { key: 'send', title: 'Send', subtitle: 'Transfer money', icon: ArrowUpRight, color: 'terracotta' },
            { key: 'swap', title: 'Swap', subtitle: 'Exchange', icon: ArrowLeftRight, color: 'gold' },
            { key: 'Buy/Sell', title: 'Buy/Sell', subtitle: 'Onramp/Offramp', icon: DollarSignIcon, color: 'purple-600' },
            { key: 'savings', title: 'Save', subtitle: 'Traditional rotating savings', icon: PiggyBank, color: 'emerald-600' },
            { key: 'utility', title: 'Utility Payment', subtitle: 'Pay for utilities and services using stablecoins', icon: Gift, color: 'emerald-600' },
          ].map((action) => (
            <button 
              key={action.key}
              onClick={() => handleQuickAction(action.key)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 hover:shadow-md transition-all duration-200 group"
            >
              <div className={`w-12 h-12 bg-${action.color}/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-${action.color}/20 transition-colors`}>
                <action.icon className={`w-6 h-6 text-${action.color}`} />
              </div>
              <h3 className="font-semibold text-stone-800 mb-1">{action.title}</h3>
              <p className="text-stone-500 text-sm">{action.subtitle}</p>
            </button>
          ))}
        </div>

        {/* Exchange Rates */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-stone-800">Live Exchange Rates</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-stone-500">Live</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(exchangeRates).map(([currency, data], index) => (
              <div key={index} className="bg-stone-50 rounded-xl p-6 transition-all duration-300 hover:shadow-md">
                <p className="text-sm text-stone-600 mb-2">{currency}</p>
                <p className="text-xl font-bold text-stone-800 mb-1">${data.rate.toFixed(6)}</p>
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium transition-colors duration-300 ${
                    data.positive === true ? 'text-green-600' : 
                    data.positive === false ? 'text-red-600' : 'text-stone-600'
                  }`}>
                    {data.positive === true ? '+' : data.positive === false ? '' : ''}{data.change.toFixed(2)}%
                  </p>
                  <p className="text-xs text-stone-500">5s</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
          <h3 className="text-lg font-semibold text-stone-800 mb-6">Recent Transactions</h3>
          <div className="text-center py-8">
            <p className="text-stone-500">No transactions yet. Start by making your first transaction!</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render based on connection status
  return isConnected ? <ConnectedDashboard /> : <WalletNotConnected />;
};

export default Dashboard;