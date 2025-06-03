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
                  {balanceVisible ? `${currentBalance.symbol}${currentBalance.amount.toLocaleString()} ${selectedCurrency}` : '••••••'}
                </p>
                <p className="text-stone-500 text-lg">
                  {balanceVisible ? `≈ $${currentBalance.usdValue.toLocaleString()} USD` : '≈ $••••••'}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6">
          {[
            { key: 'send', title: 'Send', subtitle: 'Transfer money', icon: ArrowUpRight, color: 'terracotta' },
            { key: 'deposit', title: 'Receive', subtitle: 'Deposit funds', icon: ArrowDownLeft, color: 'sage' },
            { key: 'swap', title: 'Swap', subtitle: 'Exchange', icon: ArrowLeftRight, color: 'gold' },
            { key: 'savings', title: 'Save', subtitle: 'Earn 8% APY', icon: PiggyBank, color: 'emerald-600' },
            { key: 'family', title: 'Family', subtitle: 'Auto-send', icon: Users, color: 'purple-600' },
            { key: 'referral', title: 'Invite', subtitle: 'Earn rewards', icon: Gift, color: 'pink-600' },
            { key: 'withdraw', title: 'Cash Out', subtitle: 'To bank', icon: ArrowDownLeft, color: 'red-600' }
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
          <h3 className="text-lg font-semibold text-stone-800 mb-6">Live Exchange Rates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { currency: '🇳🇬 cNGN/USD', rate: '$0.000625', change: '+0.02%', positive: true },
              { currency: '🇬🇭 cGHS/USD', rate: '$0.083', change: '-0.15%', positive: false },
              { currency: '🇰🇪 cKES/USD', rate: '$0.0067', change: '+0.08%', positive: true },
              { currency: '🇿🇦 cZAR/USD', rate: '$0.056', change: '0.00%', positive: null }
            ].map((item, index) => (
              <div key={index} className="bg-stone-50 rounded-xl p-6">
                <p className="text-sm text-stone-600 mb-2">{item.currency}</p>
                <p className="text-xl font-bold text-stone-800 mb-1">{item.rate}</p>
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${
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

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
          <h3 className="text-lg font-semibold text-stone-800 mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-stone-50 rounded-xl transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'send' ? 'bg-red-100' : 
                    tx.type === 'swap' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {tx.type === 'send' ? (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    ) : tx.type === 'swap' ? (
                      <ArrowLeftRight className="w-5 h-5 text-blue-600" />
                    ) : (
                      <PiggyBank className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-stone-800">{tx.recipient}</p>
                    <p className="text-stone-500 text-sm">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-stone-800'}`}>
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
    </div>
  );
};

export default Dashboard;
