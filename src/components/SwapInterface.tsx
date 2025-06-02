import React, { useState } from 'react';
import { ArrowUpDown, Settings, Info, X } from 'lucide-react';

const SwapInterface = () => {
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('AFRC');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [deadline, setDeadline] = useState(20);
  const [autoRouter, setAutoRouter] = useState(true);

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', balance: 0.5 },
    { symbol: 'USDC', name: 'USD Coin', balance: 1000 },
    { symbol: 'AFRC', name: 'AfriCoin', balance: 1250 },
  ];

  const exchangeRates = {
    'ETH-AFRC': 2150,
    'USDC-AFRC': 1.00,
    'AFRC-ETH': 0.000465,
    'AFRC-USDC': 1.00,
    'ETH-USDC': 2150,
    'USDC-ETH': 0.000465,
  };

  const getCurrentRate = () => {
    const pair = `${fromToken}-${toToken}`;
    return exchangeRates[pair as keyof typeof exchangeRates] || 1;
  };

  const calculateToAmount = (amount: string) => {
    if (!amount) return '';
    const rate = getCurrentRate();
    return (parseFloat(amount) * rate).toFixed(6);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    setToAmount(calculateToAmount(value));
  };

  const swapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const getTokenBalance = (symbol: string) => {
    return tokens.find(t => t.symbol === symbol)?.balance || 0;
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Swap Tokens</h1>
        <p className="text-stone-600">Exchange tokens at the best rates</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        {/* Settings */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-stone-800">Swap</h2>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-6 p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-stone-800">Swap Settings</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-1 rounded text-stone-500 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-stone-700 text-sm font-medium mb-2">
                  Slippage Tolerance
                </label>
                <div className="flex space-x-2 mb-2">
                  {[0.1, 0.5, 1.0].map(value => (
                    <button
                      key={value}
                      onClick={() => setSlippage(value)}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        slippage === value
                          ? 'bg-terracotta text-white'
                          : 'bg-white border border-stone-300 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {value}%
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(parseFloat(e.target.value) || 0.5)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  placeholder="Custom %"
                  step="0.1"
                  min="0.1"
                  max="50"
                />
              </div>

              <div>
                <label className="block text-stone-700 text-sm font-medium mb-2">
                  Transaction Deadline
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={deadline}
                    onChange={(e) => setDeadline(parseInt(e.target.value) || 20)}
                    className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    min="1"
                    max="4320"
                  />
                  <span className="text-stone-600 text-sm">minutes</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-700 text-sm font-medium">Auto Router</span>
                <button
                  onClick={() => setAutoRouter(!autoRouter)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    autoRouter ? 'bg-terracotta' : 'bg-stone-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    autoRouter ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* From Token */}
        <div className="space-y-4">
          <div className="bg-stone-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-stone-600 text-sm">From</span>
              <span className="text-stone-500 text-sm">
                Balance: {getTokenBalance(fromToken)} {fromToken}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                className="flex-1 text-2xl font-semibold bg-transparent border-none outline-none"
                placeholder="0.0"
              />
              
              <select
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
                className="bg-white border border-stone-300 rounded-lg px-3 py-2 font-medium"
              >
                {tokens.map(token => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={() => handleFromAmountChange(getTokenBalance(fromToken).toString())}
              className="text-terracotta text-sm mt-2 hover:underline"
            >
              Max
            </button>
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center">
            <button
              onClick={swapTokens}
              className="p-2 bg-white border-2 border-stone-200 rounded-xl hover:border-terracotta transition-colors"
            >
              <ArrowUpDown className="w-5 h-5 text-stone-600" />
            </button>
          </div>

          {/* To Token */}
          <div className="bg-stone-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-stone-600 text-sm">To</span>
              <span className="text-stone-500 text-sm">
                Balance: {getTokenBalance(toToken)} {toToken}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="number"
                value={toAmount}
                readOnly
                className="flex-1 text-2xl font-semibold bg-transparent border-none outline-none text-stone-800"
                placeholder="0.0"
              />
              
              <select
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
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

        {/* Swap Details */}
        {fromAmount && (
          <div className="mt-6 p-4 bg-stone-50 rounded-xl">
            <div className="flex items-center space-x-2 mb-3">
              <Info className="w-4 h-4 text-stone-500" />
              <span className="text-stone-600 text-sm font-medium">Swap Details</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Exchange Rate</span>
                <span className="font-medium">1 {fromToken} = {getCurrentRate()} {toToken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Slippage Tolerance</span>
                <span className="font-medium">{slippage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Network Fee</span>
                <span className="font-medium">~$2.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Minimum Received</span>
                <span className="font-medium">{(parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6)} {toToken}</span>
              </div>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <button
          disabled={!fromAmount || parseFloat(fromAmount) <= 0}
          className="w-full mt-6 bg-gradient-to-r from-terracotta to-sage text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!fromAmount ? 'Enter amount' : 'Swap Tokens'}
        </button>
      </div>

      {/* Exchange Rate Widget */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200">
        <h3 className="font-semibold text-stone-800 mb-3">Live Exchange Rates</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-stone-600">ETH/AFRC</span>
            <span className="font-medium">2,150.00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-600">USDC/AFRC</span>
            <span className="font-medium">1.00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-600">ETH/USDC</span>
            <span className="font-medium">2,150.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapInterface;
