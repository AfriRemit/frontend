import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Settings, Info, X, CreditCard, Banknote, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import tokens from '@/lib/Tokens/tokens';
import { useContractInstances } from '@/provider/ContractInstanceProvider';

// Global type declaration for Paystack
declare global {
  interface Window {
    PaystackPop: any;
  }
}

const PaystackButton = ({ email, amount, currency = 'NGN', onSuccess, onClose }) => {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  const amountInKobo = amount * 100;

  const handlePayment = () => {
    if (!window.PaystackPop) {
      alert('Paystack is not loaded. Please refresh the page.');
      return;
    }

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: email,
      amount: amountInKobo,
      currency: currency,
      callback: function (response) {
        onSuccess(response);
      },
      onClose: function () {
        onClose();
      },
    });

    handler.openIframe();
  };

  return (
    <button
      onClick={handlePayment}
      disabled={!amount || amount <= 0}
      className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
    >
      Pay Now - {currency === 'NGN' ? '₦' : currency === 'KES' ? 'KSh' : currency === 'GHS' ? '₵' : 'R'}{amount.toLocaleString()}
    </button>
  );
};

// Success Modal Component
const SuccessModal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-xl">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
        <p className="text-stone-600 text-center mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const OnrampOfframpInterface = () => {
  const [activeTab, setActiveTab] = useState('onramp');
  const [selectedCrypto, setSelectedCrypto] = useState('cNGN');
  const [selectedFiat, setSelectedFiat] = useState('NGN');
  const [fiatAmount, setFiatAmount] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [faucet, setFaucet] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });
  
  const { TEST_TOKEN_CONTRACT_INSTANCE, AFRISTABLE_CONTRACT_INSTANCE, isConnected,address } = useContractInstances();
  
  const filteredTokens = tokens.filter(t => t.id >= 5);

  const fiatCurrencies = [
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', crypto: 'cNGN' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', crypto: 'cZAR' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', crypto: 'cKES' },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', crypto: 'cGHS' }
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, fee: '3.5%' },
    { id: 'bank', name: 'Bank Transfer', icon: Banknote, fee: '1.0%' },
    { id: 'wallet', name: 'Digital Wallet', icon: DollarSign, fee: '2.0%' }
  ];

  // Auto-sync crypto with fiat selection (1:1 peg)
  useEffect(() => {
    const matchingFiat = fiatCurrencies.find(f => f.code === selectedFiat);
    if (matchingFiat && matchingFiat.crypto !== selectedCrypto) {
      // Special handling for AFX - if NGN is selected, don't auto-change from AFX
      if (selectedCrypto !== 'AFX' || selectedFiat !== 'NGN') {
        setSelectedCrypto(matchingFiat.crypto);
      }
    }
  }, [selectedFiat]);

  // Auto-sync fiat with crypto selection (1:1 peg)
  useEffect(() => {
    if (selectedCrypto === 'AFX') {
      // AFX is pegged to NGN
      setSelectedFiat('NGN');
    } else {
      const matchingCrypto = fiatCurrencies.find(f => f.crypto === selectedCrypto);
      if (matchingCrypto && matchingCrypto.code !== selectedFiat) {
        setSelectedFiat(matchingCrypto.code);
      }
    }
  }, [selectedCrypto]);

  const getCurrentPrice = () => {
    return 1;
  };

  const calculateConversion = (amount, isFromFiat) => {
    if (!amount) return '';
    
    if (isFromFiat) {
      return parseFloat(amount).toFixed(0);
    } else {
      return parseFloat(amount).toFixed(0);
    }
  };

  const handleFiatAmountChange = (e) => {
    const value = e.target.value;
    setFiatAmount(value);
    setCryptoAmount(calculateConversion(value, true));
  };

  const handleCryptoAmountChange = (e) => {
    const value = e.target.value;
    setCryptoAmount(value);
    setFiatAmount(calculateConversion(value, false));
  };

  const getPaymentMethodFee = () => {
    const method = paymentMethods.find(m => m.id === paymentMethod);
    return method ? method.fee : '0%';
  };

  const calculateFees = () => {
    if (!fiatAmount) return { fee: 0, total: 0 };
    
    const amount = parseFloat(fiatAmount);
    const feePercentage = parseFloat(getPaymentMethodFee()) / 100;
    const fee = amount * feePercentage;
    const total = activeTab === 'onramp' ? amount + fee : amount - fee;
    
    return { fee: fee.toFixed(2), total: total.toFixed(2) };
  };

  // Faucet function for crypto purchase
  const getFaucet = async (tokenAddress, tokenAmount) => {
    try {
      setFaucet(true);
      const TOKEN_CONTRACT = await TEST_TOKEN_CONTRACT_INSTANCE(tokenAddress);
      const GET_FAUCET = await TOKEN_CONTRACT.buyToken(tokenAmount);
      console.log(`Loading - ${GET_FAUCET.hash}`);
      await GET_FAUCET.wait();
      console.log(`Success - ${GET_FAUCET.hash}`);
      setFaucet(false);
      return true;
    } catch (error) {
      setFaucet(false);
      console.log(error);
      return false;
    }
  };

  // AFX deposit function for buying AFX with fiat
  const depositFiatAndMintAFX = async (ngnAmount, userAddress) => {
    try {
      setFaucet(true);
      const AFRISTABLE_CONTRACT = await AFRISTABLE_CONTRACT_INSTANCE();
      // Convert NGN amount to wei (1 NGN = 1 AFX)
      const ngnAmountInWei = (parseFloat(ngnAmount) * Math.pow(10, 18)).toString();
      const DEPOSIT_MINT = await AFRISTABLE_CONTRACT.depositFiatAndMint(ngnAmountInWei, userAddress);
      console.log(`AFX Deposit Loading - ${DEPOSIT_MINT.hash}`);
      await DEPOSIT_MINT.wait();
      console.log(`AFX Deposit Success - ${DEPOSIT_MINT.hash}`);
      setFaucet(false);
      return true;
    } catch (error) {
      setFaucet(false);
      console.log('AFX Deposit Error:', error);
      return false;
    }
  };

  // Transfer function for crypto selling cyms  kano central  
  const transferTokens = async (tokenAddress, amount, recipientAddress) => {
    try {
      setIsProcessing(true);
      const TOKEN_CONTRACT = await TEST_TOKEN_CONTRACT_INSTANCE(tokenAddress);
      const TRANSFER = await TOKEN_CONTRACT.transfer(recipientAddress, amount);
      console.log(`Transfer Loading - ${TRANSFER.hash}`);
      await TRANSFER.wait();
      console.log(`Transfer Success - ${TRANSFER.hash}`);
      setIsProcessing(false);
      return true;
    } catch (error) {
      setIsProcessing(false);
      console.log(error);
      return false;
    }
  };

  // AFX approve and sell function
  const approveAndSellAFX = async (amount, selectedAfirAddress) => {
    try {
      setIsProcessing(true);
      const AFRISTABLE_CONTRACT = await AFRISTABLE_CONTRACT_INSTANCE();
      
      // Convert amount to wei
      const amountInWei = (parseFloat(amount) * Math.pow(10, 18)).toString();
      
      // Approve the selected AFIR address to spend AFX tokens
      const APPROVE_TX = await AFRISTABLE_CONTRACT.approve(selectedAfirAddress, amountInWei);
      console.log(`AFX Approval Loading - ${APPROVE_TX.hash}`);
      await APPROVE_TX.wait();
      console.log(`AFX Approval Success - ${APPROVE_TX.hash}`);
      
      setIsProcessing(false);
      return true;
    } catch (error) {
      setIsProcessing(false);
      console.log('AFX Approve Error:', error);
      return false;
    }
  };

  const handleBuyCrypto = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    const selectedToken = filteredTokens.find(t => t.symbol === selectedCrypto);
    if (!selectedToken) return;

    let success = false;

    // Special handling for AFX token
    if (selectedCrypto === 'AFX') {
      // Get user's wallet address (you'll need to get this from your wallet connection)
   console.log('AFX selected, depositing fiat and minting AFX');
      success = await depositFiatAndMintAFX(cryptoAmount, address);
    } else {
      // Regular token purchase
      success = await getFaucet(selectedToken.address, cryptoAmount);
    }

    if (success) {
      setSuccessMessage({
        title: 'Purchase Successful!',
        message: `${cryptoAmount} ${selectedCrypto} has been deposited to your wallet.`
      });
      setShowSuccessModal(true);
      setFiatAmount('');
      setCryptoAmount('');
    }
  };

  const handleSellCrypto = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    const selectedToken = filteredTokens.find(t => t.symbol === selectedCrypto);
    if (!selectedToken) return;

    let success = false;

    // Special handling for AFX token
    if (selectedCrypto === 'AFX') {
      // For AFX, use approve function instead of transfer
      // You'll need to specify the selected AFIR address
      const selectedAfirAddress = selectedToken.address; // or get from somewhere else
      success = await approveAndSellAFX(cryptoAmount, selectedAfirAddress);
    } else {
      // Regular token sale
      const exchangeAddress = selectedToken.address;
      const tokenAmount = parseFloat(cryptoAmount) * Math.pow(10, 18);
      success = await transferTokens(selectedToken.address, tokenAmount.toString(), exchangeAddress);
    }

    if (success) {
      setSuccessMessage({
        title: 'Sale Successful!',
        message: `Your ${getCurrencySymbol(selectedFiat)}${calculateFees().total} will be sent to your bank account within 1-3 business days.`
      });
      setShowSuccessModal(true);
      setFiatAmount('');
      setCryptoAmount('');
    }
  };

  const handleProcess = async () => {
    if (activeTab === 'onramp') {
      console.log('onramp selected');
      await handleBuyCrypto();
    } else {
      await handleSellCrypto();
    }
  };

  const getTokenImage = (symbol) => {
    // Special handling for AFX - use cNGN image since AFX is pegged to NGN
    if (symbol === 'AFX') {
      const cNGNToken = filteredTokens.find(t => t.symbol === 'cNGN');
      return cNGNToken?.img || '/api/placeholder/32/32';
    }
    
    const token = filteredTokens.find(t => t.symbol === symbol);
    return token?.img || '/api/placeholder/32/32';
  };

  const getCurrencySymbol = (code) => {
    const currency = fiatCurrencies.find(f => f.code === code);
    return currency?.symbol || code;
  };

  const isPaystackSupported = () => {
    return selectedFiat === 'NGN';
  };

  const getSelectedToken = () => {
    return filteredTokens.find(t => t.symbol === selectedCrypto);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          {activeTab === 'onramp' ? 'Buy Crypto' : 'Sell Crypto'}
        </h1>
        <p className="text-stone-600">
          {activeTab === 'onramp' 
            ? 'Purchase cryptocurrency with fiat currency' 
            : 'Convert cryptocurrency to fiat currency'
          }
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-stone-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('onramp')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-1 ${
            activeTab === 'onramp'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Buy</span>
        </button>
        <button
          onClick={() => setActiveTab('offramp')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-1 ${
            activeTab === 'offramp'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Banknote className="w-4 h-4" />
          <span>Sell</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        {/* Settings */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-stone-800">
            {activeTab === 'onramp' ? 'Buy Crypto' : 'Sell Crypto'}
          </h2>
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
              <h3 className="font-semibold text-stone-800">Settings</h3>
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
                  Payment Method
                </label>
                <div className="space-y-2">
                  {paymentMethods.map(method => {
                    const IconComponent = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                          paymentMethod === method.id
                            ? 'border-orange-400 bg-orange-50'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-5 h-5 text-stone-600" />
                          <span className="font-medium">{method.name}</span>
                        </div>
                        <span className="text-sm text-stone-500">{method.fee}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Warning for unsupported currencies */}
        {!isPaystackSupported() && activeTab === 'onramp' && selectedCrypto !== 'AFX' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Payment Not Available</p>
                <p>
                  Paystack doesn't support {selectedFiat} payments yet. This feature is coming soon!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Interface */}
        <div className="space-y-4">
          {/* Fiat Input */}
          <div className="bg-stone-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-stone-600 text-sm">
                {activeTab === 'onramp' ? 'You pay' : 'You receive'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                value={fiatAmount}
                onChange={handleFiatAmountChange}
                className="w-full sm:w-24 text-2xl font-semibold bg-transparent border-none outline-none"
                placeholder="0.00"
              />

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <img
                  src={getTokenImage(selectedCrypto)}
                  alt={selectedFiat}
                  className="w-8 h-8 rounded-full"
                />
                <select
                  value={selectedFiat}
                  onChange={(e) => setSelectedFiat(e.target.value)}
                  className="bg-white border border-stone-300 rounded-lg px-3 py-2 font-medium w-full sm:w-auto min-w-[120px] text-base"
                  disabled={selectedCrypto === 'AFX'}
                >
                  {fiatCurrencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center">
            <div className="p-2 bg-white border-2 border-stone-200 rounded-xl">
              <ArrowUpDown className="w-5 h-5 text-stone-600" />
            </div>
          </div>

          {/* Crypto Input */}
          <div className="bg-stone-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-stone-600 text-sm">
                {activeTab === 'onramp' ? 'You receive' : 'You pay'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <input
                type="text"
                pattern="[0-9]*[.,]?[0-9]*"
                value={cryptoAmount}
                onChange={handleCryptoAmountChange}
                className="w-full sm:w-24 text-2xl font-semibold bg-transparent border-none outline-none"
                placeholder="0.0"
              />

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <img
                  src={getTokenImage(selectedCrypto)}
                  alt={selectedCrypto}
                  className="w-8 h-8 rounded-full"
                />

                <select
                  value={selectedCrypto}
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                  className="bg-white border border-stone-300 rounded-lg px-3 py-2 font-medium w-full sm:w-auto min-w-[120px] text-base"
                >
                  {filteredTokens.map(token => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        {fiatAmount && (
          <div className="mt-6 p-4 bg-stone-50 rounded-xl">
            <div className="flex items-center space-x-2 mb-3">
              <Info className="w-4 h-4 text-stone-500" />
              <span className="text-stone-600 text-sm font-medium">Transaction Details</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Exchange Rate</span>
                <span className="font-medium">
                  1 {selectedCrypto} = {getCurrencySymbol(selectedFiat)}1 (1:1 Peg)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Payment Method</span>
                <span className="font-medium">
                  {paymentMethods.find(m => m.id === paymentMethod)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Processing Fee</span>
                <span className="font-medium">
                  {getCurrencySymbol(selectedFiat)}{calculateFees().fee}
                </span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 mt-2">
                <span className="text-stone-800 font-medium">
                  {activeTab === 'onramp' ? 'Total Cost' : 'You Receive'}
                </span>
                <span className="font-semibold">
                  {getCurrencySymbol(selectedFiat)}{calculateFees().total}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {activeTab === 'onramp' ? (
          <>
            {/* Direct Buy Button (for non-NGN currencies or when Paystack is not available) */}
            {(!isPaystackSupported() || !isConnected) && selectedCrypto !== 'AFX' && (
              <button
                onClick={!isPaystackSupported() ? undefined : handleProcess}
                disabled={!fiatAmount || parseFloat(fiatAmount) <= 0 || faucet || !isConnected}
                className={`w-full mt-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                  !isPaystackSupported()
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-green-600 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {!isConnected
                  ? 'Connect Wallet First'
                  : !isPaystackSupported()
                  ? 'Coming Soon'
                  : faucet
                  ? 'Processing...'
                  : !fiatAmount
                  ? 'Enter amount'
                  : `Buy ${selectedCrypto}`
                }
              </button>
            )}

            {/* Paystack Payment Button - Show for NGN (including AFX since it's pegged to NGN) */}
            {isPaystackSupported() && fiatAmount && parseFloat(fiatAmount) > 0 && isConnected && (
              <PaystackButton
                email="user@example.com"
                amount={parseFloat(String(calculateFees().total))}
                currency={selectedFiat}
                onSuccess={async (response) => {
                  console.log('Payment successful:', response);
                  await handleBuyCrypto();
                }}
                onClose={() => {
                  console.log('Payment modal closed');
                }}
              />
            )}
          </>
        ) : (
          /* Sell Button */
          <button
            onClick={handleProcess}
            disabled={!fiatAmount || parseFloat(fiatAmount) <= 0 || isProcessing || !isConnected}
            className="w-full mt-6 bg-gradient-to-r from-orange-500 to-green-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isConnected
              ? 'Connect Wallet First'
              : isProcessing
              ? 'Processing...'
              : !fiatAmount
              ? 'Enter amount'
              : `${selectedCrypto === 'AFX' ? 'Approve' : 'Sell'} ${selectedCrypto}`
            }
          </button>
        )}
      </div>

      {/* Exchange Rates Widget */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200">
        <h3 className="font-semibold text-stone-800 mb-3">Current Prices (1:1 Peg)</h3>
        <div className="space-y-2">
          {filteredTokens.map(token => {
            const matchingFiat = fiatCurrencies.find(f => f.crypto === token.symbol);
            // Special handling for AFX - show NGN symbol
            const displaySymbol = token.symbol === 'AFX' ? '₦' : matchingFiat?.symbol || '';
            
            return (
              <div key={token.symbol} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <img
                    src={getTokenImage(token.symbol)}
                    alt={token.symbol}
                    className="w-6 h-6 rounded-full bg-stone-200"
                  />
                  <span className="text-stone-600">{token.name}</span>
                </div>
                <span className="font-medium">
                  {displaySymbol}1
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-2">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Security Notice</p>
            <p>
              {activeTab === 'onramp' 
                ? 'Your payment information is encrypted and secure. Crypto will be deposited to your connected wallet.'
                : selectedCrypto === 'AFX'
                ? 'AFX tokens will be approved for transfer. Fiat will be transferred within 1-3 business days.'
                : 'Ensure your bank details are correct. Fiat will be transferred within 1-3 business days.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={successMessage.title}
        message={successMessage.message}
      />
    </div>
  );
};

export default OnrampOfframpInterface;