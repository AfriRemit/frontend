import React from 'react';
import { ArrowUpRight, ArrowLeftRight, DollarSign, PiggyBank, Gift, Wallet, AlertCircle, Globe, TrendingUp, Users, Shield } from 'lucide-react';
import { DollarSignIcon } from "lucide-react";
import { motion } from 'framer-motion';

interface WalletNotConnectedProps {
  exchangeRates: {[key: string]: { rate: number, change: number, positive: boolean | null }};
}

const WalletNotConnected: React.FC<WalletNotConnectedProps> = ({ exchangeRates }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 bg-amber-50 border border-amber-200 rounded-full px-6 py-3 text-amber-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Connect your wallet to get started</span>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Get Started in Minutes</h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.18
                }
              }
            }}
          >
            {[
              { step: '1', title: 'Connect Wallet', desc: 'Link your digital wallet securely', color: 'orange', icon: Wallet },
              { step: '2', title: 'Add Funds', desc: 'Buy stablecoins or transfer assets', color: 'green', icon: DollarSign },
              { step: '3', title: 'Start Trading', desc: 'Send, swap, and save with ease', color: 'yellow', icon: ArrowLeftRight }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  className="text-center group"
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60, damping: 18 } }
                  }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Main Hero Section (Stats) */}
        <div className="grid grid-cols-1 md:grid-cols-4 mt-20 gap-6 max-w-5xl mx-auto">
          <div className="group text-center">
            <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-3xl p-8 hover:bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Globe className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">8+</div>
              <div className="text-gray-600 text-base">Supported Tokens</div>
            </div>
          </div>
          <div className="group text-center">
            <div className="bg-white/80 backdrop-blur-sm border border-green-100 rounded-3xl p-8 hover:bg-white hover:border-green-200 hover:shadow-xl hover:shadow-green-100/50 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 border border-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">$2M+</div>
              <div className="text-gray-600 text-base">Total Volume</div>
            </div>
          </div>
          <div className="group text-center">
            <div className="bg-white/80 backdrop-blur-sm border border-teal-100 rounded-3xl p-8 hover:bg-white hover:border-teal-200 hover:shadow-xl hover:shadow-teal-100/50 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 border border-teal-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors duration-300">0+</div>
              <div className="text-gray-600 text-base">Active Users</div>
            </div>
                </div>
          <div className="group text-center">
            <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-3xl p-8 hover:bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">100%</div>
              <div className="text-gray-600 text-base">Secure</div>
            </div>
          </div>
        </div>

      

        {/* Live Exchange Rates */}
        <div className="bg-white/60 backdrop-blur-xl border mt-10 border-slate-200/50 rounded-3xl p-8 mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-emerald-500/50"></div>
              <h2 className="text-2xl font-bold text-slate-800">Live Exchange Rates</h2>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-700 font-medium">Real-time</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(exchangeRates).length > 0 ? (
              Object.entries(exchangeRates).slice(0, 4).map(
                ([currency, data], index) => {
                  const typedData = data as { rate: number, change: number, positive: boolean | null };
                  return (
                    <div key={index} className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-medium text-slate-700">{currency}</span>
                        <div className={`w-2 h-2 rounded-full ${typedData.positive === true ? 'bg-emerald-500' : typedData.positive === false ? 'bg-red-500' : 'bg-slate-400'}`}></div>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mb-2">${typedData.rate.toFixed(2)}</div>
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

      </div>
    </div>
  );
};

export default WalletNotConnected;