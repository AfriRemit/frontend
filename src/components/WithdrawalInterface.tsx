
import React, { useState } from 'react';
import { Banknote, CreditCard, Smartphone, ArrowDownLeft, Clock } from 'lucide-react';

const WithdrawalInterface = () => {
  const [withdrawalMethod, setWithdrawalMethod] = useState('bank');
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('cNGN');

  const withdrawalMethods = [
    // 
  ];

  const recentWithdrawals = [
    {
      id: 1,
      amount: 50000,
      currency: 'cNGN',
      method: 'Bank Transfer',
      status: 'completed',
      date: '2 days ago',
      fee: 750
    },
    {
      id: 2,
      amount: 25000,
      currency: 'cGHS',
      method: 'Mobile Money',
      status: 'pending',
      date: '1 hour ago',
      fee: 250
    }
  ];

  const exchangeRates = {
    'cNGN': { rate: 1600, symbol: '₦' },
    'cGHS': { rate: 12, symbol: '₵' },
    'cKES': { rate: 150, symbol: 'KSh' },
    'cZAR': { rate: 18, symbol: 'R' }
  };

  const selectedMethod = withdrawalMethods.find(m => m.id === withdrawalMethod);
  const selectedRate = exchangeRates[selectedCurrency as keyof typeof exchangeRates];
  const localAmount = amount ? (parseFloat(amount) * selectedRate.rate).toLocaleString() : '0';
  const fee = amount && selectedMethod ? (parseFloat(amount) * parseFloat(selectedMethod.fee) / 100).toFixed(2) : '0';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Cash Out</h1>
        <p className="text-stone-600">Convert your digital currency to local cash</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Withdrawal Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
            <h2 className="text-xl font-semibold text-stone-800 mb-6">Withdrawal Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Amount to Withdraw</label>
                <div className="flex space-x-3">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                    placeholder="100"
                  />
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                  >
                    <option value="cNGN">cNGN</option>
                    <option value="cGHS">cGHS</option>
                    <option value="cKES">cKES</option>
                    <option value="cZAR">cZAR</option>
                  </select>
                </div>
                {amount && (
                  <p className="text-stone-600 text-sm mt-1">
                    ≈ {selectedRate.symbol}{localAmount} at current rate
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">Withdrawal Method</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {withdrawalMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setWithdrawalMethod(method.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          withdrawalMethod === method.id
                            ? 'border-terracotta bg-terracotta/5'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mb-2 ${
                          withdrawalMethod === method.id ? 'text-terracotta' : 'text-stone-600'
                        }`} />
                        <h3 className="font-medium text-stone-800">{method.name}</h3>
                        <p className="text-stone-600 text-xs">{method.description}</p>
                        <div className="mt-2 text-xs">
                          <span className="text-terracotta font-medium">Fee: {method.fee}</span>
                          <span className="text-stone-500 ml-2">• {method.time}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {amount && selectedMethod && (
                <div className="bg-stone-50 rounded-xl p-4">
                  <h4 className="font-semibold text-stone-800 mb-3">Withdrawal Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-stone-600">Amount</span>
                      <span className="font-medium">{amount} {selectedCurrency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">Exchange Rate</span>
                      <span className="font-medium">1 {selectedCurrency} = {selectedRate.symbol}{selectedRate.rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">Fee ({selectedMethod.fee})</span>
                      <span className="font-medium">{fee} {selectedCurrency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">Processing Time</span>
                      <span className="font-medium">{selectedMethod.time}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>You'll Receive</span>
                      <span className="text-sage">{selectedRate.symbol}{((parseFloat(amount) - parseFloat(fee)) * selectedRate.rate).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full bg-gradient-to-r from-terracotta to-sage text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue Withdrawal
              </button>
            </div>
          </div>
        </div>

        {/* Recent Withdrawals */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">Recent Withdrawals</h3>
            <div className="space-y-4">
              {recentWithdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="border-b border-stone-100 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <ArrowDownLeft className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-stone-800">
                        {withdrawal.amount.toLocaleString()} {withdrawal.currency}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      withdrawal.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {withdrawal.status}
                    </span>
                  </div>
                  <p className="text-stone-600 text-sm">{withdrawal.method}</p>
                  <div className="flex justify-between text-xs text-stone-500 mt-1">
                    <span>Fee: {withdrawal.fee} {withdrawal.currency}</span>
                    <span>{withdrawal.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-sage/10 to-terracotta/10 rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-5 h-5 text-sage" />
              <h3 className="font-semibold text-stone-800">Processing Times</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Mobile Money</span>
                <span className="font-medium">5-10 mins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Bank Transfer</span>
                <span className="font-medium">1-3 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Debit Card</span>
                <span className="font-medium">Instant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalInterface;
