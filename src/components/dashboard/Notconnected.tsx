import React from 'react';
import { ArrowUpRight, ArrowLeftRight, DollarSign, PiggyBank, Gift, Wallet, AlertCircle } from 'lucide-react';
import { DollarSignIcon } from "lucide-react";

interface WalletNotConnectedProps {
  exchangeRates: {[key: string]: { rate: number, change: number, positive: boolean | null }};
}

const WalletNotConnected: React.FC<WalletNotConnectedProps> = ({ exchangeRates }) => {
  return (
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
};

export default WalletNotConnected;