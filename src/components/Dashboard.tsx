import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownLeft, Copy, Eye, EyeOff, ArrowLeftRight, PiggyBank, Users, Gift } from 'lucide-react';
import { useState } from 'react';

interface DashboardProps {
  onPageChange?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('cNGN');

  const walletAddress = "0x1234...5678";
  
  const balances = {
    'cNGN': { amount: 1250000, usdValue: 780.00, symbol: '₦' },
    'cGHS': { amount: 5000, usdValue: 416.67, symbol: '₵' },
    'cKES': { amount: 125000, usdValue: 833.33, symbol: 'KSh' },
    'cZAR': { amount: 15000, usdValue: 833.33, symbol: 'R' }
  };

  const currentBalance = balances[selectedCurrency as keyof typeof balances];
  const portfolioGrowth = 12.5;

  const currencies = [
    { code: 'cNGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
    { code: 'cGHS', name: 'Ghanaian Cedi', symbol: '₵', flag: '🇬🇭' },
    { code: 'cKES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪' },
    { code: 'cZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' }
  ];

  const recentTransactions = [
    {
      id: 1,
      type: 'send',
      amount: -100,
      currency: 'AFRC',
      recipient: 'John Doe',
      date: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'swap',
      amount: 250,
      currency: 'AFRC',
      recipient: 'ETH → AFRC',
      date: '1 day ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'save',
      amount: 500,
      currency: 'AFRC',
      recipient: '365-day Savings',
      date: '3 days ago',
      status: 'earning'
    }
  ];

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickAction = (action: string) => {
    if (onPageChange) {
      onPageChange(action);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReceiveClick = () => {
    if (onPageChange) {
      onPageChange('deposit');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Mobile-First Wallet Overview */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-800">Your Wallet</h2>
          
          {/* Mobile-optimized controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm min-w-0 flex-shrink-0"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            
            <button
              onClick={copyAddress}
              className="flex items-center space-x-2 text-stone-500 hover:text-stone-700 transition-colors min-w-0"
            >
              <span className="text-sm truncate max-w-24 sm:max-w-none">{walletAddress}</span>
              <Copy className="w-4 h-4 flex-shrink-0" />
            </button>
            
            {copied && (
              <span className="text-green-600 text-sm font-medium">Copied!</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-2">
              <p className="text-stone-600 text-sm">Total Balance</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-800 break-all">
                {balanceVisible ? `${currentBalance.symbol}${currentBalance.amount.toLocaleString()} ${selectedCurrency}` : '••••••'}
              </p>
              <p className="text-stone-500 text-sm sm:text-base">
                {balanceVisible ? `≈ $${currentBalance.usdValue.toLocaleString()} USD` : '≈ $••••••'}
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-sage/10 to-gold/10 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-sage" />
              <p className="text-stone-600 text-sm">Portfolio Growth</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-sage">+{portfolioGrowth}%</p>
            <p className="text-stone-500 text-sm">This month</p>
          </div>
        </div>
      </div>

      {/* Mobile-First Quick Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
        <button 
          onClick={() => handleQuickAction('send')}
          className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-stone-200 hover:shadow-md transition-all duration-200 group active:scale-95"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-terracotta/20 transition-colors">
            <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-terracotta" />
          </div>
          <h3 className="font-semibold text-stone-800 mb-1 text-sm sm:text-base">Send</h3>
          <p className="text-stone-500 text-xs sm:text-sm leading-tight">Transfer money</p>
        </button>

        <button 
          onClick={handleReceiveClick}
          className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-stone-200 hover:shadow-md transition-all duration-200 group active:scale-95"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sage/10 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-sage/20 transition-colors">
            <ArrowDownLeft className="w-5 h-5 sm:w-6 sm:h-6 text-sage" />
          </div>
          <h3 className="font-semibold text-stone-800 mb-1 text-sm sm:text-base">Receive</h3>
          <p className="text-stone-500 text-xs sm:text-sm leading-tight">Deposit funds</p>
        </button>

        <button 
          onClick={() => handleQuickAction('swap')}
          className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-stone-200 hover:shadow-md transition-all duration-200 group active:scale-95"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-gold/20 transition-colors">
            <ArrowLeftRight className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
          </div>
          <h3 className="font-semibold text-stone-800 mb-1 text-sm sm:text-base">Swap</h3>
          <p className="text-stone-500 text-xs sm:text-sm leading-tight">Exchange</p>
        </button>

        <button 
          onClick={() => handleQuickAction('savings')}
          className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-stone-200 hover:shadow-md transition-all duration-200 group active:scale-95"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-emerald-500/20 transition-colors">
            <PiggyBank className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-stone-800 mb-1 text-sm sm:text-base">Save</h3>
          <p className="text-stone-500 text-xs sm:text-sm leading-tight">Earn 8% APY</p>
        </button>

        <button 
          onClick={() => handleQuickAction('family')}
          className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-stone-200 hover:shadow-md transition-all duration-200 group active:scale-95"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-purple-500/20 transition-colors">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-stone-800 mb-1 text-sm sm:text-base">Family</h3>
          <p className="text-stone-500 text-xs sm:text-sm leading-tight">Auto-send</p>
        </button>

        <button 
          onClick={() => handleQuickAction('referral')}
          className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-stone-200 hover:shadow-md transition-all duration-200 group active:scale-95"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500/10 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-pink-500/20 transition-colors">
            <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
          </div>
          <h3 className="font-semibold text-stone-800 mb-1 text-sm sm:text-base">Invite</h3>
          <p className="text-stone-500 text-xs sm:text-sm leading-tight">Earn rewards</p>
        </button>

        <button 
          onClick={() => handleQuickAction('withdraw')}
          className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-stone-200 hover:shadow-md transition-all duration-200 group active:scale-95"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-red-500/20 transition-colors">
            <ArrowDownLeft className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
          </div>
          <h3 className="font-semibold text-stone-800 mb-1 text-sm sm:text-base">Cash Out</h3>
          <p className="text-stone-500 text-xs sm:text-sm leading-tight">To bank</p>
        </button>
      </div>

      {/* Mobile-Optimized Exchange Rates */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-stone-200">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Live Exchange Rates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { currency: '🇳🇬 cNGN/USD', rate: '$0.000625', change: '+0.02%', positive: true },
            { currency: '🇬🇭 cGHS/USD', rate: '$0.083', change: '-0.15%', positive: false },
            { currency: '🇰🇪 cKES/USD', rate: '$0.0067', change: '+0.08%', positive: true },
            { currency: '🇿🇦 cZAR/USD', rate: '$0.056', change: '0.00%', positive: null }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-stone-50 rounded-xl">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-stone-600 truncate">{item.currency}</p>
                <p className="text-lg sm:text-xl font-bold text-stone-800">{item.rate}</p>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className={`text-sm ${
                  item.positive === true ? 'text-green-600' : 
                  item.positive === false ? 'text-red-600' : 'text-stone-600'
                }`}>
                  {item.change}
                </p>
                <p className="text-xs text-stone-500">24h</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile-Optimized Recent Transactions */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-stone-200">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Recent Transactions</h3>
        <div className="space-y-3 sm:space-y-4">
          {[
            { id: 1, type: 'send', amount: -100, currency: 'AFRC', recipient: 'John Doe', date: '2 hours ago', status: 'completed' },
            { id: 2, type: 'swap', amount: 250, currency: 'AFRC', recipient: 'ETH → AFRC', date: '1 day ago', status: 'completed' },
            { id: 3, type: 'save', amount: 500, currency: 'AFRC', recipient: '365-day Savings', date: '3 days ago', status: 'earning' }
          ].map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 sm:p-4 hover:bg-stone-50 rounded-xl transition-colors">
              <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  tx.type === 'send' ? 'bg-red-100' : 
                  tx.type === 'swap' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {tx.type === 'send' ? (
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  ) : tx.type === 'swap' ? (
                    <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  ) : (
                    <PiggyBank className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-stone-800 text-sm sm:text-base truncate">{tx.recipient}</p>
                  <p className="text-stone-500 text-xs sm:text-sm">{tx.date}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className={`font-semibold text-sm sm:text-base ${tx.amount > 0 ? 'text-green-600' : 'text-stone-800'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount} {tx.currency}
                </p>
                <p className={`text-xs px-2 py-1 rounded-full ${
                  tx.status === 'completed' ? 'bg-green-100 text-green-700' : 
                  tx.status === 'earning' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {tx.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
