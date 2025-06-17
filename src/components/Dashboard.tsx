import { DollarSignIcon } from "lucide-react";
import { title } from "process";

import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownLeft, DollarSign, Copy, Eye, EyeOff, ArrowLeftRight, PiggyBank, Users, Gift, Wallet, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-green-600/20 to-yellow-600/20 blur-3xl opacity-30 rounded-full"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-orange-600 via-green-600 to-yellow-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-orange-600/20">
              <Wallet className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-6 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text">
            Welcome to AfriRemit
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your gateway to seamless cross-border payments and digital asset management across Africa. 
            Connect your wallet to unlock the full potential of decentralized finance.
          </p>
          <div className="inline-flex items-center space-x-3 bg-amber-50 border border-amber-200 rounded-full px-6 py-3 text-amber-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Connect your wallet to get started</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
          {[
            { key: 'send', title: 'Send Money', subtitle: 'Instant transfers', icon: ArrowUpRight, gradient: 'from-orange-500 to-red-500' },
            { key: 'swap', title: 'Currency Swap', subtitle: 'Real-time exchange', icon: ArrowLeftRight, gradient: 'from-yellow-500 to-orange-500' },
            { key: 'Buy/Sell', title: 'Buy & Sell', subtitle: 'Fiat on/off ramp', icon: DollarSignIcon, gradient: 'from-purple-500 to-pink-500' },
            { key: 'savings', title: 'Smart Savings', subtitle: 'Rotating pools', icon: PiggyBank, gradient: 'from-green-500 to-emerald-500' },
            { key: 'utility', title: 'Bill Payments', subtitle: 'Utilities & services', icon: Gift, gradient: 'from-blue-500 to-cyan-500' },
          ].map((feature) => (
            <div key={feature.key} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r item-center justify opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-not-allowed opacity-75">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl ml-10 flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="w-7 h-7  text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Live Exchange Rates */}
        <div className="bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-8 shadow-xl mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
              <h2 className="text-2xl font-bold text-slate-800">Live Exchange Rates</h2>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-700 font-medium">Real-time</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(exchangeRates).length > 0 ? (
              Object.entries(exchangeRates).map(
                ([currency, data], index) => {
                  const typedData = data as { rate: number, change: number, positive: boolean | null };
                  return (
                    <div key={index} className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-medium text-slate-700">{currency}</span>
                        <div className={`w-2 h-2 rounded-full ${typedData.positive === true ? 'bg-emerald-500' : typedData.positive === false ? 'bg-red-500' : 'bg-slate-400'}`}></div>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mb-2">${typedData.rate.toFixed(6)}</div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                          typedData.positive === true ? 'text-emerald-700 bg-emerald-100' : 
                          typedData.positive === false ? 'text-red-700 bg-red-100' : 'text-slate-600 bg-slate-100'
                        }`}>
                          {typedData.positive === true ? '+' : typedData.positive === false ? '' : ''}{typedData.change.toFixed(2)}%
                        </span>
                        <span className="text-xs text-slate-400 font-medium">5s ago</span>
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl p-6 animate-pulse">
                  <div className="h-5 bg-slate-200 rounded-lg mb-3"></div>
                  <div className="h-8 bg-slate-200 rounded-lg mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded-lg w-2/3"></div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Get Started in Minutes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Connect Wallet', desc: 'Link your digital wallet securely', color: 'orange' },
              { step: '2', title: 'Add Funds', desc: 'Buy stablecoins or transfer assets', color: 'green' },
              { step: '3', title: 'Start Trading', desc: 'Send, swap, and save with ease', color: 'yellow' }
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className={`w-16 h-16 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white font-bold text-xl">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Connected Wallet Dashboard
  const ConnectedDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
              <p className="text-slate-600">Manage your digital assets with confidence</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full sm:w-auto bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {Currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="p-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {balanceVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={copyAddress}
                  className="flex-1 sm:flex-none flex items-center justify-between sm:justify-start space-x-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3 text-slate-600 hover:text-slate-900 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <span className="text-sm font-mono font-medium truncate">{walletAddress}</span>
                  <Copy className="w-4 h-4 flex-shrink-0" />
                </button>

                {copied && (
                  <div className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg animate-pulse">
                    Copied!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-slate-300">Total Balance</h2>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">
                {balanceVisible
                  ? `${selectedToken?.symbol || ''} ${bal1?.toLocaleString() || 0}`
                  : '••••••••'}
              </div>
              <div className="text-slate-300 text-lg">
                {balanceVisible 
                  ? `≈ $${usdValue.toLocaleString()} USD`
                  : '≈ $••••••••'
                }
              </div>
              <div className="text-sm text-slate-400">
                {balanceVisible && `Rate: $${currentTokenPrice.toFixed(6)}`}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-3xl p-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-emerald-800">Portfolio Growth</h3>
                <p className="text-sm text-emerald-600">This month</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-emerald-700">+{portfolioGrowth}%</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[
            { key: 'send', title: 'Send', subtitle: 'Transfer money', icon: ArrowUpRight, gradient: 'from-orange-500 to-red-500' },
            { key: 'swap', title: 'Swap', subtitle: 'Exchange currencies', icon: ArrowLeftRight, gradient: 'from-yellow-500 to-orange-500' },
            { key: 'Buy/Sell', title: 'Buy/Sell', subtitle: 'Fiat gateway', icon: DollarSignIcon, gradient: 'from-purple-500 to-pink-500' },
            { key: 'savings', title: 'Save', subtitle: 'Earn rewards', icon: PiggyBank, gradient: 'from-green-500 to-emerald-500' },
            { key: 'utility', title: 'Bills', subtitle: 'Pay utilities', icon: Gift, gradient: 'from-blue-500 to-cyan-500' },
          ].map((action) => (
            <button 
              key={action.key}
              onClick={() => handleQuickAction(action.key)}
              className="group bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1 text-sm">{action.title}</h3>
              <p className="text-slate-500 text-xs">{action.subtitle}</p>
            </button>
          ))}
        </div>

        {/* Exchange Rates */}
        <div className="bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-8 shadow- mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
              <h2 className="text-xl font-bold text-slate-800">Live Exchange Rates</h2>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-2 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-emerald-700 font-medium">Live</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(exchangeRates).map(([currency, data], index) => {
              const typedData = data as { rate: number, change: number, positive: boolean | null };
              return (
                <div key={index} className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-slate-700">{currency}</span>
                    <div className={`w-2 h-2 rounded-full ${typedData.positive === true ? 'bg-emerald-500' : typedData.positive === false ? 'bg-red-500' : 'bg-slate-400'}`}></div>
                  </div>
                  <div className="text-xl font-bold text-slate-900 mb-2">${typedData.rate.toFixed(6)}</div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      typedData.positive === true ? 'text-emerald-700 bg-emerald-100' : 
                      typedData.positive === false ? 'text-red-700 bg-red-100' : 'text-slate-600 bg-slate-100'
                    }`}>
                      {typedData.positive === true ? '+' : typedData.positive === false ? '' : ''}{typedData.change.toFixed(2)}%
                    </span>
                    <span className="text-xs text-slate-400">5s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Activity</h2>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowLeftRight className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 mb-4">No transactions yet</p>
            <p className="text-sm text-slate-400">Your transaction history will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );

  return isConnected ? <ConnectedDashboard /> : <WalletNotConnected />;
};

export default Dashboard;