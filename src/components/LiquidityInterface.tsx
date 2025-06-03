
import React, { useState } from 'react';
import { Plus, Minus, Info, Droplets } from 'lucide-react';

const LiquidityInterface = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [token1, setToken1] = useState('ETH');
  const [token2, setToken2] = useState('AFRC');
  const [amount1, setAmount1] = useState('');
  const [amount2, setAmount2] = useState('');

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', balance: 0.5 },
    { symbol: 'USDC', name: 'USD Coin', balance: 1000 },
    { symbol: 'AFRC', name: 'AfriCoin', balance: 1250 },
  ];

  const liquidityPools = [
    {
      pair: 'ETH/AFRC',
      userLiquidity: 1250.50,
      totalLiquidity: 125000,
      userShare: 1.0,
      fees24h: 12.50
    },
    {
      pair: 'USDC/AFRC',
      userLiquidity: 500.00,
      totalLiquidity: 50000,
      userShare: 1.0,
      fees24h: 5.25
    }
  ];

  const getTokenBalance = (symbol: string) => {
    return tokens.find(t => t.symbol === symbol)?.balance || 0;
  };

  const calculateAmount2 = (value: string) => {
    if (!value) return '';
    // Simulate price ratio (1 ETH = 2150 AFRC)
    const ratio = token1 === 'ETH' && token2 === 'AFRC' ? 2150 : 1;
    return (parseFloat(value) * ratio).toFixed(6);
  };

  const handleAmount1Change = (value: string) => {
    setAmount1(value);
    setAmount2(calculateAmount2(value));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8 space-y-8">
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Liquidity</h1>
        <p className="text-stone-600">Add liquidity to earn fees from swaps</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-stone-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('add')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'add'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Add Liquidity
        </button>
        <button
          onClick={() => setActiveTab('remove')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'remove'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Remove Liquidity
        </button>
        <button
          onClick={() => setActiveTab('pools')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'pools'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Your Pools
        </button>
      </div>

      {activeTab === 'add' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <h3 className="text-lg font-semibold text-stone-800 mb-4">Add Liquidity</h3>
          
          <div className="space-y-4">
            {/* Token 1 */}
            <div className="bg-stone-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-stone-600 text-sm">Token 1</span>
                <span className="text-stone-500 text-sm">
                  Balance: {getTokenBalance(token1)} {token1}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={amount1}
                  onChange={(e) => handleAmount1Change(e.target.value)}
                  className="flex-1 text-2xl font-semibold bg-transparent border-none outline-none"
                  placeholder="0.0"
                />
                
                <select
                  value={token1}
                  onChange={(e) => setToken1(e.target.value)}
                  className="bg-white border border-stone-300 rounded-lg px-3 py-2 font-medium"
                >
                  {tokens.map(token => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <Plus className="w-5 h-5 text-stone-400" />
            </div>

            {/* Token 2 */}
            <div className="bg-stone-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-stone-600 text-sm">Token 2</span>
                <span className="text-stone-500 text-sm">
                  Balance: {getTokenBalance(token2)} {token2}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={amount2}
                  readOnly
                  className="flex-1 text-2xl font-semibold bg-transparent border-none outline-none text-stone-800"
                  placeholder="0.0"
                />
                
                <select
                  value={token2}
                  onChange={(e) => setToken2(e.target.value)}
                  className="bg-white border border-stone-300 rounded-lg px-3 py-2 font-medium"
                >
                  {tokens.map(token => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {amount1 && (
            <div className="mt-6 p-4 bg-stone-50 rounded-xl">
              <div className="flex items-center space-x-2 mb-3">
                <Info className="w-4 h-4 text-stone-500" />
                <span className="text-stone-600 text-sm font-medium">Liquidity Details</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Pool Share</span>
                  <span className="font-medium">~0.01%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">LP Tokens</span>
                  <span className="font-medium">{Math.sqrt(parseFloat(amount1) * parseFloat(amount2 || '0')).toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Estimated APY</span>
                  <span className="font-medium text-green-600">15.2%</span>
                </div>
              </div>
            </div>
          )}

          <button
            disabled={!amount1 || parseFloat(amount1) <= 0}
            className="w-full mt-6 bg-gradient-to-r from-terracotta to-sage text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!amount1 ? 'Enter amount' : 'Add Liquidity'}
          </button>
        </div>
      )}

      {activeTab === 'pools' && (
        <div className="space-y-4">
          {liquidityPools.map((pool, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-terracotta to-sage rounded-full flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-800">{pool.pair}</h3>
                    <p className="text-stone-600 text-sm">{pool.userShare}% pool share</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-stone-800">${pool.userLiquidity.toLocaleString()}</p>
                  <p className="text-stone-600 text-sm">Your liquidity</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-stone-600">24h Fees Earned</p>
                  <p className="font-semibold text-green-600">${pool.fees24h}</p>
                </div>
                <div>
                  <p className="text-stone-600">Total Pool Liquidity</p>
                  <p className="font-semibold text-stone-800">${pool.totalLiquidity.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-4">
                <button className="flex-1 bg-terracotta text-white py-2 rounded-lg hover:bg-terracotta/90 transition-colors">
                  Add More
                </button>
                <button className="flex-1 bg-stone-100 text-stone-700 py-2 rounded-lg hover:bg-stone-200 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'remove' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <h3 className="text-lg font-semibold text-stone-800 mb-4">Remove Liquidity</h3>
          <p className="text-stone-600 text-center py-8">
            Select a pool from "Your Pools" tab to remove liquidity
          </p>
        </div>
      )}
    </div>
    </div>
  );
};

export default LiquidityInterface;
