
import React, { useState } from 'react';
import { Copy, Check, QrCode, CreditCard, Banknote, Smartphone } from 'lucide-react';

const DepositInterface = () => {
  const [copied, setCopied] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('wallet');
  const [selectedCurrency, setSelectedCurrency] = useState('cNGN');
  
  const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";
  
  const depositMethods = [
    { id: 'wallet', name: 'Crypto Wallet', icon: Copy, description: 'Transfer from any crypto wallet' },
    { id: 'card', name: 'Debit/Credit Card', icon: CreditCard, description: 'Instant deposit with card' },
    { id: 'bank', name: 'Bank Transfer', icon: Banknote, description: 'Wire transfer from bank account' },
    { id: 'mobile', name: 'Mobile Money', icon: Smartphone, description: 'M-Pesa, Airtel Money, etc.' }
  ];

  const currencies = [
    { code: 'cNGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
    { code: 'cGHS', name: 'Ghanaian Cedi', symbol: '₵', flag: '🇬🇭' },
    { code: 'cKES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪' },
    { code: 'cZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
    { code: 'ETH', name: 'Ethereum', symbol: 'ETH', flag: '⚡' },
    { code: 'USDC', name: 'USD Coin', symbol: 'USDC', flag: '💵' }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateQRCode = () => {
    // In a real app, this would generate an actual QR code
    alert('QR Code generated! (This would show a QR code in a real app)');
  };

  const handleDeposit = () => {
    switch (selectedMethod) {
      case 'wallet':
        alert('Wallet address copied! Send your crypto to this address.');
        break;
      case 'card':
        alert('Redirecting to secure card payment...');
        break;
      case 'bank':
        alert('Bank transfer details will be provided via email.');
        break;
      case 'mobile':
        alert('Mobile money instructions sent to your phone.');
        break;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Deposit Funds</h1>
        <p className="text-stone-600">Add money to your AfriRemit wallet</p>
      </div>

      {/* Currency Selection */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Select Currency</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {currencies.map(currency => (
            <button
              key={currency.code}
              onClick={() => setSelectedCurrency(currency.code)}
              className={`p-3 rounded-xl border transition-colors ${
                selectedCurrency === currency.code
                  ? 'border-terracotta bg-terracotta/10 text-terracotta'
                  : 'border-stone-200 hover:border-stone-300 text-stone-700'
              }`}
            >
              <div className="text-center">
                <div className="text-lg mb-1">{currency.flag}</div>
                <div className="font-medium text-sm">{currency.code}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Deposit Methods */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Choose Deposit Method</h3>
        <div className="space-y-3">
          {depositMethods.map(method => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full p-4 rounded-xl border transition-colors text-left ${
                selectedMethod === method.id
                  ? 'border-terracotta bg-terracotta/5'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedMethod === method.id ? 'bg-terracotta/20' : 'bg-stone-100'
                }`}>
                  <method.icon className={`w-5 h-5 ${
                    selectedMethod === method.id ? 'text-terracotta' : 'text-stone-600'
                  }`} />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-800">{method.name}</h4>
                  <p className="text-stone-600 text-sm">{method.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Deposit Details */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">
          {selectedMethod === 'wallet' ? 'Wallet Address' : 'Deposit Details'}
        </h3>
        
        {selectedMethod === 'wallet' && (
          <div className="space-y-4">
            <div className="bg-stone-50 rounded-xl p-4">
              <p className="text-stone-600 text-sm mb-2">Send {selectedCurrency} to this address:</p>
              <div className="flex items-center space-x-2 mb-3">
                <code className="flex-1 bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm font-mono break-all">
                  {walletAddress}
                </code>
                <button
                  onClick={() => copyToClipboard(walletAddress)}
                  className="p-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={generateQRCode}
                className="flex items-center space-x-2 text-sage hover:text-sage/80 transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span className="text-sm">Show QR Code</span>
              </button>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Only send {selectedCurrency} to this address</li>
                <li>• Minimum deposit: 10 {selectedCurrency}</li>
                <li>• Deposits usually take 5-15 minutes to confirm</li>
                <li>• Network fees may apply</li>
              </ul>
            </div>
          </div>
        )}

        {selectedMethod === 'card' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  placeholder="100"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-stone-700 text-sm font-medium mb-2">Currency</label>
                <input
                  type="text"
                  value={selectedCurrency}
                  readOnly
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50"
                />
              </div>
            </div>
            <p className="text-stone-600 text-sm">
              You'll be redirected to a secure payment processor to complete your deposit.
            </p>
          </div>
        )}

        {selectedMethod === 'bank' && (
          <div className="space-y-4">
            <div className="bg-stone-50 rounded-xl p-4">
              <h4 className="font-semibold text-stone-800 mb-3">Bank Transfer Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Account Name:</span>
                  <span className="font-medium">AfriRemit Ltd</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Account Number:</span>
                  <span className="font-medium">1234567890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Bank:</span>
                  <span className="font-medium">First Bank of Africa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Reference:</span>
                  <span className="font-medium">Your wallet address</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'mobile' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="p-4 border border-stone-300 rounded-xl hover:border-sage transition-colors">
                <div className="text-center">
                  <div className="font-semibold text-stone-800">M-Pesa</div>
                  <div className="text-stone-600 text-sm">Kenya</div>
                </div>
              </button>
              <button className="p-4 border border-stone-300 rounded-xl hover:border-sage transition-colors">
                <div className="text-center">
                  <div className="font-semibold text-stone-800">Airtel Money</div>
                  <div className="text-stone-600 text-sm">Multiple countries</div>
                </div>
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleDeposit}
          className="w-full mt-6 bg-gradient-to-r from-terracotta to-sage text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
        >
          {selectedMethod === 'wallet' ? 'Copy Address' : 'Continue Deposit'}
        </button>
      </div>

      {/* Recent Deposits */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Recent Deposits</h3>
        <div className="space-y-3">
          {[
            { amount: 500, currency: 'cNGN', method: 'Wallet', status: 'completed', date: '2 hours ago' },
            { amount: 1000, currency: 'USDC', method: 'Card', status: 'pending', date: '1 day ago' },
            { amount: 250, currency: 'cKES', method: 'M-Pesa', status: 'completed', date: '3 days ago' }
          ].map((deposit, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
              <div>
                <p className="font-medium text-stone-800">+{deposit.amount} {deposit.currency}</p>
                <p className="text-stone-500 text-sm">{deposit.method} • {deposit.date}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                deposit.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {deposit.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepositInterface;
