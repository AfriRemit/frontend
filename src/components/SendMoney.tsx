
import React, { useState } from 'react';
import { ArrowRight, Check, User, DollarSign, Clock } from 'lucide-react';

const SendMoney = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('AFRC');
  const [step, setStep] = useState(1);

  const exchangeRate = 1.00; // AFRC to USD
  const transactionFee = 2.00;
  const estimatedTime = '2-5 minutes';

  const handleSend = () => {
    if (step === 1 && recipient && amount) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const resetForm = () => {
    setStep(1);
    setRecipient('');
    setAmount('');
  };

  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Transaction Sent!</h2>
          <p className="text-stone-600 mb-6">
            Your transfer of {amount} {currency} has been successfully sent to {recipient}
          </p>
          <div className="bg-stone-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-stone-600 mb-2">Transaction ID</p>
            <p className="font-mono text-stone-800">0x1234567890abcdef...</p>
          </div>
          <button
            onClick={resetForm}
            className="bg-gradient-to-r from-terracotta to-sage text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Send Another Transfer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Send Money</h1>
        <p className="text-stone-600">Transfer AFRC to anywhere in the world</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step >= 1 ? 'bg-terracotta text-white' : 'bg-stone-200 text-stone-500'
        }`}>
          1
        </div>
        <div className={`w-16 h-1 ${step >= 2 ? 'bg-terracotta' : 'bg-stone-200'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step >= 2 ? 'bg-terracotta text-white' : 'bg-stone-200 text-stone-500'
        }`}>
          2
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
          <h2 className="text-xl font-semibold text-stone-800 mb-6">Transfer Details</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Recipient Address or Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                  placeholder="0x... or john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                >
                  <option value="AFRC">AFRC</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            {amount && (
              <div className="bg-stone-50 rounded-xl p-4">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-stone-600">You send</span>
                  <span className="font-medium">{amount} {currency}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-stone-600">Exchange rate</span>
                  <span className="font-medium">1 AFRC = ${exchangeRate}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-stone-600">Transaction fee</span>
                  <span className="font-medium">${transactionFee}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center font-semibold">
                  <span>Recipient receives</span>
                  <span>{currency === 'AFRC' ? amount : (parseFloat(amount || '0') / exchangeRate).toFixed(2)} AFRC</span>
                </div>
              </div>
            )}

            <button
              onClick={handleSend}
              disabled={!recipient || !amount}
              className="w-full bg-gradient-to-r from-terracotta to-sage text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
          <h2 className="text-xl font-semibold text-stone-800 mb-6">Confirm Transfer</h2>
          
          <div className="space-y-6">
            <div className="bg-stone-50 rounded-xl p-6">
              <h3 className="font-semibold text-stone-800 mb-4">Transfer Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-stone-600">To</span>
                  <span className="font-medium">{recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Amount</span>
                  <span className="font-medium">{amount} {currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Fee</span>
                  <span className="font-medium">${transactionFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Estimated time</span>
                  <span className="font-medium flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {estimatedTime}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{(parseFloat(amount || '0') + transactionFee).toFixed(2)} {currency}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-stone-100 text-stone-700 py-3 rounded-lg hover:bg-stone-200 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSend}
                className="flex-1 bg-gradient-to-r from-terracotta to-sage text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendMoney;
