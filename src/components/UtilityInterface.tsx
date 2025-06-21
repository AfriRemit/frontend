import React, { useState, useEffect } from 'react';
import { 
  ArrowUpDown, 
  Settings, 
  Info, 
  X, 
  CreditCard, 
  Banknote, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  Smartphone,
  Zap,
  Wifi,
  Tv,
  Car,
  GraduationCap,
  Building,
  Phone,
  Home
} from 'lucide-react';

import tokens from '@/lib/Tokens/tokens';
import { useContractInstances } from '@/provider/ContractInstanceProvider';
import { CONTRACT_ADDRESSES } from '@/provider/ContractInstanceProvider';

// Mock contract functions
const mockContractCall = async (delay = 2000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ hash: '0x' + Math.random().toString(16).substr(2, 8) });
    }, delay);
  });
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

const UtilityPaymentInterface = () => {
  const [selectedService, setSelectedService] = useState('airtime');
  const [selectedCrypto, setSelectedCrypto] = useState('cNGN');
  const [amount, setAmount] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');

  const [meterNumber, setMeterNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });
 
   const { TEST_TOKEN_CONTRACT_INSTANCE, AFRISTABLE_CONTRACT_INSTANCE, isConnected,address } = useContractInstances();
  
    const filteredTokens = tokens.filter(t => t.id >= 5);
  const services = [
    { 
      id: 'airtime', 
      name: 'Airtime Recharge', 
      icon: Smartphone, 
      description: 'Buy airtime for mobile phones',
      fee: '1%',
      minAmount: 100,
      maxAmount: 50000
    },
    { 
      id: 'electricity', 
      name: 'Electricity Bills', 
      icon: Zap, 
      description: 'Pay electricity bills instantly',
      fee: '0.5%',
      minAmount: 500,
      maxAmount: 100000
    },
    { 
      id: 'internet', 
      name: 'Internet Data', 
      icon: Wifi, 
      description: 'Buy internet data bundles',
      fee: '1%',
      minAmount: 200,
      maxAmount: 20000
    },
    { 
      id: 'cable', 
      name: 'Cable TV', 
      icon: Tv, 
      description: 'Pay for cable TV subscriptions',
      fee: '0.5%',
      minAmount: 1000,
      maxAmount: 50000
    },
    
   { 
  id: 'education', 
  name: 'Exam PINs', 
  icon: GraduationCap, 
  description: 'Buy exam result checker PINs',
  fee: '0.2%',
  minAmount: 500,
  maxAmount: 5000
}
  ];

  const providers = {
    airtime: [
      { id: 'mtn', name: 'MTN', logo: 'https://www.vtpass.com/resources/products/200X200/MTN-Airtime-VTU.jpg' },
      { id: 'airtel', name: 'Airtel', logo: 'https://www.vtpass.com/resources/products/200X200/Airtel-Airtime-VTU.jpg' },
      { id: 'glo', name: 'Glo', logo: 'https://www.vtpass.com/resources/products/200X200/GLO-Airtime.jpg' },
      { id: '9mobile', name: '9mobile', logo: 'https://www.vtpass.com/resources/products/200X200/9mobile-Airtime.jpg' }
    ],
    electricity: [
      { id: 'ekedc', name: 'Eko Electric', logo: 'https://www.vtpass.com/resources/products/200X200/Eko-Electric-Payment-PHCN.jpg' },
      { id: 'ikedc', name: 'Ikeja Electric', logo: 'https://www.vtpass.com/resources/products/200X200/Ikeja-Electric-Payment-PHCN.jpg' },
      { id: 'kedco', name: 'Kano Electric', logo: 'https://www.vtpass.com/resources/products/200X200/Kano-Electric.jpg' },
      { id: 'aedc', name: 'Abuja Electric', logo: 'https://www.vtpass.com/resources/products/200X200/Abuja-Electric.jpg' }
    ],
    internet: [
      { id: 'mtn_data', name: 'MTN Data', logo: 'https://www.vtpass.com/resources/products/200X200/MTN-Airtime-VTU.jpg' },
      { id: 'airtel_data', name: 'Airtel Data', logo: 'https://www.vtpass.com/resources/products/200X200/Airtel-Airtime-VTU.jpg' },
      { id: 'glo_data', name: 'Glo Data', logo: 'https://www.vtpass.com/resources/products/200X200/GLO-Airtime.jpg' },
  
    ],
    cable: [
      { id: 'dstv', name: 'DStv', logo: 'https://www.vtpass.com/resources/products/200X200/Pay-DSTV-Subscription.jpg' },
      { id: 'gotv', name: 'GOtv', logo: 'https://www.vtpass.com/resources/products/200X200/Gotv-Payment.jpg' },
      { id: 'startimes', name: 'StarTimes', logo: 'https://www.vtpass.com/resources/products/200X200/Startimes-Subscription.jpg' },
      { id: 'showmax', name: 'Showmax', logo: 'https://www.vtpass.com/resources/products/200X200/ShowMax.jpg' }
    ],
   education: [
  { id: 'waec', name: 'WAEC Result Checker PIN', logo: 'https://www.vtpass.com/resources/products/200X200/WAEC-Result-Checker-PIN.jpg' },
  { id: 'neco', name: 'NECO Result Checker PIN', logo: 'https://neco.gov.ng/assets/neco-logo.df6f9256.png' },

  { id: 'nabteb', name: 'NABTEB Result Checker PIN', logo: 'https://nabteb.gov.ng/wp-content/uploads/2021/09/logo.png' }
]
  };

  const fiatCurrencies = [
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', crypto: 'cNGN' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', crypto: 'cZAR' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', crypto: 'cKES' },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', crypto: 'cGHS' }
  ];

  

  // Auto-sync crypto with service selection
  useEffect(() => {
    if (selectedService && selectedCrypto === 'AFX') {
      setSelectedCrypto('cNGN'); // Default to cNGN for utility payments
    }
  }, [selectedService]);

  

  // Reset provider when service changes
 
  const getCurrentService = () => {
    return services.find(s => s.id === selectedService);
  };

  const getCurrentCurrency = () => {
    const cryptoToCurrency = {
      'cNGN': 'NGN',
      'cKES': 'KES', 
      'cGHS': 'GHS',
      'cZAR': 'ZAR',
      'AFX': 'NGN'
    };
    return fiatCurrencies.find(f => f.code === cryptoToCurrency[selectedCrypto]);
  };

  const getCurrencySymbol = () => {
    const currency = getCurrentCurrency();
    return currency?.symbol || '₦';
  };

  const calculateFees = () => {
    if (!amount) return { fee: 0, total: 0 };
    
    const service = getCurrentService();
    const amountValue = parseFloat(amount);
    const feePercentage = parseFloat(service?.fee || '0%') / 100;
    const fee = amountValue * feePercentage;
    const total = amountValue + fee;
    
    return { fee: fee.toFixed(2), total: total.toFixed(2) };
  };

  const getTokenImage = (symbol) => {
    const token = filteredTokens.find(t => t.symbol === symbol);
    return token?.img || '/api/placeholder/32/32';
  };

 

   
  const makePayment = async () => {
  try {
    setIsProcessing(true);

    // Step 1: Perform blockchain payment
    const blockchainSuccess = await processBlockchainPayment();

    // Step 2: If blockchain payment failed, stop
    
    if (!blockchainSuccess) {
      console.error('Blockchain payment failed');
      setIsProcessing(false);
      return false;
    }

    // Step 3: If blockchain succeeded and service is 'airtime', purchase airtime
    if (selectedService === 'airtime') {
      const airtimeSuccess = await purchaseAirtime();
      if (!airtimeSuccess) {
        console.error('Airtime purchase failed');
        setIsProcessing(false);
        return false;
      }
    }

    setIsProcessing(false);
    return true;

  } catch (error) {
    console.error('Payment error:', error);
    setIsProcessing(false);
    return false;
  }
};


const purchaseAirtime = async () => {
  console.log('🚀 Starting airtime purchase...');
  console.log('📝 Request payload:', {
    phoneNumber: phoneNumber,
    amount: amount,
    selectedCrypto: selectedCrypto
  });

  try {
    const payload = {
      phoneNumber: phoneNumber,
      amount: amount,
      selectedCrypto: selectedCrypto
    };
    console.log('📦 Payload being sent:', JSON.stringify(payload, null, 2));

    console.log('📡 Making API call to: https://remi-fi-backend.onrender.com/api/airtime/purchase');
    
    const response = await fetch('https://remi-fi-backend.onrender.com/api/airtime/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('📥 Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    const result = await response.json();
    console.log('📋 Full API Response:', JSON.stringify(result, null, 2));
    
    // Check if the airtime purchase was successful using your API's response format
    if (result.success) {
      console.log('✅ AIRTIME PURCHASE SUCCESSFUL!');
      console.log('🎉 Transaction Details:', {
        transactionId: result.data?.transactionId,
        amount: result.data?.amount,
        phoneNumber: result.data?.phoneNumber,
        discount: result.data?.discount,
        status: result.data?.status
      });
      return true;
    } else {
      console.log('❌ AIRTIME PURCHASE FAILED!');
      console.log('🚨 Error Details:', {
        success: result.success,
        error: result.error,
        message: result.message,
        canRetry: result.canRetry,
        details: result.details
      });
      
      // Log the full error object for debugging
      console.log('🔍 Full Error Response:', JSON.stringify(result, null, 2));
      return false;
    }
  } catch (error) {
    console.log('💥 CRITICAL ERROR - API Call Failed!');
    console.log('🔥 Error Type:', error.name);
    console.log('🔥 Error Message:', error.message);
    console.log('🔥 Error Stack:', error.stack);
    
    // Check if it's a network error
    if (error.message.includes('fetch')) {
      console.log('🌐 This appears to be a NETWORK ERROR');
      console.log('💡 Check if your server is running on http://localhost:3000');
    }
    
    // Check if it's a JSON parsing error
    if (error.message.includes('JSON')) {
      console.log('📝 This appears to be a JSON PARSING ERROR');
      console.log('💡 The server might be returning HTML instead of JSON');
    }
    
    console.log('🔍 Full Error Object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    return false;
  }
};




const handlePayment = async () => {
  if (!isConnected) {
    alert('Please connect your wallet first');
    return;
  }

  const validationError = validateInputs();
  if (validationError) {
    alert(validationError);
    return;
  }

  const success = await makePayment(); // Change this line from mockPayment() to makePayment()
  
  if (success) {
    const service = getCurrentService();
    const provider = providers[selectedService]?.find(p => p.id === selectedProvider);
    
    setSuccessMessage({
      title: 'Payment Successful!',
      message: `${service.name} payment of ${getCurrencySymbol()}${amount} to ${provider?.name} has been processed successfully.`
    });
    setShowSuccessModal(true);
    
    // Reset form
    setAmount('');
    setPhoneNumber('');
    setMeterNumber('');
    setAccountNumber('');
    setSelectedProvider('');
  }
};

const transferTokens = async (tokenAddress, amount, recipientAddress) => {
  try {
    setIsProcessing(true);
    
    // Find the selected token to get its details
    const selectedToken = filteredTokens.find(t => t.address === tokenAddress);
    if (!selectedToken) {
      throw new Error('Selected token not found');
    }
    
    const TOKEN_CONTRACT = await TEST_TOKEN_CONTRACT_INSTANCE(tokenAddress);
    const TRANSFER = await TOKEN_CONTRACT.transfer(address, amount);
    console.log(`${selectedToken.symbol} Transfer Loading - ${TRANSFER.hash}`);
    await TRANSFER.wait();
    console.log(`${selectedToken.symbol} Transfer Success - ${TRANSFER.hash}`);
    
    setIsProcessing(false);
    return true;
  } catch (error) {
    setIsProcessing(false);
    console.log(`Transfer Error:`, error);
    return false;
  }
};



const processBlockchainPayment = async () => {
  try {
    const amountInWei = (parseFloat(amount) * Math.pow(10, 18)).toString();
    
    if (selectedCrypto === 'AFX') {
      // Use AFX transfer for AFX payments
      const AFRISTABLE_CONTRACT = await AFRISTABLE_CONTRACT_INSTANCE();
      const TRANSFER = await AFRISTABLE_CONTRACT.transfer(CONTRACT_ADDRESSES.afriStableAddress, amountInWei);
      console.log(`AFX Transfer Loading - ${TRANSFER.hash}`);
      await TRANSFER.wait();
      console.log(`AFX Transfer Success - ${TRANSFER.hash}`);
      return true;
    } else {
      // Use TEST_TOKEN_INSTANCE for other stablecoins
      const selectedToken = filteredTokens.find(t => t.symbol === selectedCrypto);
      if (!selectedToken) {
        throw new Error('Selected token not found');
      }
      
      const success = await transferTokens(selectedToken.address, amountInWei, address);
      return success;
    }
  } catch (error) {
    console.error('Blockchain payment error:', error);
    return false;
  }
};

const debugFormState = () => {
  console.log('Form Debug State:', {
    selectedService,
    selectedProvider,
    amount,
    phoneNumber,
    meterNumber,
    accountNumber,
    isConnected,
    isProcessing
  });
};


const validateInputs = () => {
  const service = getCurrentService();
  const amountValue = parseFloat(amount);

  console.log('Validation Debug:', {
    amount,
    amountValue,
    selectedProvider,
    phoneNumber,
    meterNumber,
    accountNumber,
    selectedService
  });

  if (!amount || amountValue <= 0) return 'Enter a valid amount';
  if (amountValue < service.minAmount) return `Minimum amount is ${getCurrencySymbol()}${service.minAmount}`;
  if (amountValue > service.maxAmount) return `Maximum amount is ${getCurrencySymbol()}${service.maxAmount}`;
  if (!selectedProvider) return 'Select a service provider';

  switch (selectedService) {
    case 'airtime':
    case 'internet':
      if (!phoneNumber || phoneNumber.length < 10) return 'Enter a valid phone number';
      break;
    case 'electricity':
      if (!meterNumber || meterNumber.length < 8) return 'Enter a valid meter number';
      break;
    case 'cable':
      if (!accountNumber || accountNumber.length < 6) return 'Enter a valid account number';
      break;
    case 'education':
      if (!accountNumber || accountNumber.length < 6) return 'Enter a valid exam registration number';
      break;
  }

  return null;
};

// Also check if your button condition is too strict. Try this simpler version:
const isFormComplete = () => {
  if (!amount || !selectedProvider) return false;
  
  switch (selectedService) {
    case 'airtime':
    case 'internet':
      return phoneNumber && phoneNumber.length >= 10;
    case 'electricity':
      return meterNumber && meterNumber.length >= 8;
    case 'cable':
    case 'education':
      return accountNumber && accountNumber.length >= 6;
    default:
      return true;
  }
};

  const renderServiceInputs = () => {
    switch (selectedService) {
      case 'airtime':
      case 'internet':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-stone-700 text-sm font-medium mb-2">
                Phone Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-stone-300 bg-stone-50 text-stone-500 text-sm">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="08012345678"
                  className="flex-1 border border-stone-300 rounded-r-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 'electricity':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-stone-700 text-sm font-medium mb-2">
                Meter Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-stone-300 bg-stone-50 text-stone-500 text-sm">
                  <Home className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={meterNumber}
                  onChange={(e) => setMeterNumber(e.target.value)}
                  placeholder="12345678901"
                  className="flex-1 border border-stone-300 rounded-r-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 'cable':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-stone-700 text-sm font-medium mb-2">
                Smart Card / Account Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-stone-300 bg-stone-50 text-stone-500 text-sm">
                  <Tv className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="1234567890"
                  className="flex-1 border border-stone-300 rounded-r-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

    case 'education':
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-stone-700 text-sm font-medium mb-2">
          Exam Number / Registration Number
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-stone-300 bg-stone-50 text-stone-500 text-sm">
            <GraduationCap className="w-4 h-4" />
          </span>
          <input
            type="number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Enter exam registration number"
            className="flex-1 border border-stone-300 rounded-r-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          Utility Payments
        </h1>
        <p className="text-stone-600">
          Pay for utilities and services using stablecoins
        </p>
      </div>

      {/* Service Selection */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-stone-800">Select Service</h2>
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
              <h3 className="font-semibold text-stone-800">Payment Settings</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-1 rounded text-stone-500 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div>
              <label className="block text-stone-700 text-sm font-medium mb-2">
                Payment Currency
              </label>
              <div className="flex items-center space-x-2">
                <img
                  src={getTokenImage(selectedCrypto)}
                  alt={selectedCrypto}
                  className="w-8 h-8 rounded-full"
                />
                <select
                  value={selectedCrypto}
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                  className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-2 font-medium"
                >
                  {filteredTokens.map(token => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.symbol} - {token.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Service Grid */}
        <div className="grid grid-cols-2 gap-3">
          {services.map(service => {
            const IconComponent = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedService === service.id
                    ? 'border-orange-400 bg-orange-50 shadow-md'
                    : 'border-stone-200 hover:border-stone-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <IconComponent className={`w-6 h-6 ${
                    selectedService === service.id ? 'text-orange-600' : 'text-stone-600'
                  }`} />
                  <span className="font-semibold text-sm">{service.name}</span>
                </div>
                <p className="text-xs text-stone-500 mb-1">{service.description}</p>
                <p className="text-xs text-stone-400">Fee: {service.fee}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <h3 className="text-lg font-semibold text-stone-800 mb-6">
          {getCurrentService()?.name} Payment
        </h3>

        <div className="space-y-6">
          {/* Provider Selection */}
          <div>
            <label className="block text-stone-700 text-sm font-medium mb-3">
              Select Provider
            </label>
            <div className="grid grid-cols-2 gap-2">
              {providers[selectedService]?.map(provider => (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`p-3 rounded-lg border-2 transition-colors flex items-center space-x-2 ${
                    selectedProvider === provider.id
                      ? 'border-orange-400 bg-orange-50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <img
                    src={provider.logo}
                    alt={provider.name}
                    className="w-6 h-6 rounded"
                  />
                  <span className="text-sm font-medium">{provider.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Service-specific inputs */}
          {renderServiceInputs()}

          {/* Amount Input */}
          <div>
            <label className="block text-stone-700 text-sm font-medium mb-2">
              Amount
            </label>
            <div className="bg-stone-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-2xl font-semibold bg-transparent border-none outline-none"
                  placeholder="0"
                  min={getCurrentService()?.minAmount}
                  max={getCurrentService()?.maxAmount}
                />
                <div className="flex items-center space-x-2 ml-4">
                  <img
                    src={getTokenImage(selectedCrypto)}
                    alt={selectedCrypto}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium text-stone-600">
                    {getCurrencySymbol()}
                  </span>
                </div>
              </div>
              {getCurrentService() && (
                <div className="mt-2 text-xs text-stone-500">
                  Min: {getCurrencySymbol()}{getCurrentService().minAmount.toLocaleString()} • 
                  Max: {getCurrencySymbol()}{getCurrentService().maxAmount.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Transaction Summary */}
          {amount && selectedProvider && (
            <div className="p-4 bg-stone-50 rounded-xl">
              <div className="flex items-center space-x-2 mb-3">
                <Info className="w-4 h-4 text-stone-500" />
                <span className="text-stone-600 text-sm font-medium">Payment Summary</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Service</span>
                  <span className="font-medium">{getCurrentService()?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Provider</span>
                  <span className="font-medium">
                    {providers[selectedService]?.find(p => p.id === selectedProvider)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Amount</span>
                  <span className="font-medium">{getCurrencySymbol()}{parseFloat(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Service Fee</span>
                  <span className="font-medium">{getCurrencySymbol()}{calculateFees().fee}</span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-2 mt-2">
                  <span className="text-stone-800 font-medium">Total</span>
                  <span className="font-semibold">{getCurrencySymbol()}{calculateFees().total}</span>
                </div>
              </div>
            </div>
          )}

          {/* Pay Button */}
         <button
  onClick={handlePayment}
  disabled={isProcessing || !isConnected }
  className="w-full bg-gradient-to-r from-orange-500 to-green-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {!isConnected
    ? 'Connect Wallet First'
    : isProcessing
    ? 'Processing Payment...'
    : !isFormComplete()
    ? 'Complete Form to Pay'
    : `Pay ${getCurrencySymbol()}${calculateFees().total}`
  }
</button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-start space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">Secure & Instant</p>
            <p>
              All payments are processed instantly using blockchain technology. 
              Your payment will be confirmed within seconds.
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

export default UtilityPaymentInterface;