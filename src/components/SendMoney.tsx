import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, User, DollarSign, Clock, AlertCircle, FishSymbolIcon } from 'lucide-react';
import { useContractInstances } from '@/provider/ContractInstanceProvider';
import tokens from '@/lib/Tokens/tokens.ts';
import { ethers, formatEther, parseEther, parseUnits } from 'ethers';
import { roundToTwoDecimalPlaces } from '@/lib/utils';
// For ethers v6, use BrowserProvider directly (no need for Web3Provider variable)]

const SendMoney = () => {
  const { isConnected, TEST_TOKEN_CONTRACT_INSTANCE, AFRISTABLE_CONTRACT_INSTANCE, fetchBalance, address } = useContractInstances();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenList, setTokenList] = useState(tokens);
  const [selectedToken, setSelectedToken] = useState(tokens[2]); 
  const [step, setStep] = useState(1);
  const [isTransacting, setIsTransacting] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [error, setError] = useState('');
  const [loadingBalances, setLoadingBalances] = useState(false);

  const transactionFee = 0.001; // ETH for gas
  const estimatedTime = '2-5 minutes';

  // Fetch balances for all tokens
  const updateTokenBalances = async () => {
    if (!isConnected || !address) return;
    
    setLoadingBalances(true);
    try {
      const updatedTokens = await Promise.all(
        tokens.map(async (token) => {
          try {
            let balance;
            if (token.id === 1) {
             const  balanceWei = await fetchBalance(token.address);
           balance = roundToTwoDecimalPlaces(balanceWei);
            } else {
              // For ERC20 tokens, use fetchBalance
              const balanceWei = await fetchBalance(token.address);
              balance = roundToTwoDecimalPlaces(balanceWei)
            }
            return { ...token, balance };
          } catch (error) {
            console.error(`Error fetching balance for ${token.symbol}:`, error);
            return { ...token, balance: 0 };
          }
        })
      );
      
      setTokenList(updatedTokens);
      
      // Update selected token with new balance
      const updatedSelectedToken = updatedTokens.find(t => t.id === selectedToken.id);
      if (updatedSelectedToken) {
        setSelectedToken(updatedSelectedToken);
      }
    } catch (error) {
      console.error('Error updating token balances:', error);
    } finally {
      setLoadingBalances(false);
    }
  };

  // Fetch balances on component mount and when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      updateTokenBalances();
    }
  }, [isConnected, address]);

  const handleTokenChange = (tokenId) => {
    const token = tokens.find(t => t.id === parseInt(tokenId));
    setSelectedToken(token);
  };

  const validateTransfer = () => {
    if (!recipient) {
      setError('Please enter recipient address');
      return false;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    if (parseFloat(amount) > selectedToken.balance) {
      setError('Insufficient balance');
      return false;
    }
    if (!isConnected) {
      setError('Please connect your wallet');
      return false;
    }
    setError('');
    return true;
  };

  const executeTransfer = async () => {
    if (!validateTransfer()) return;

    setIsTransacting(true);
    setError('');

    try {
      let txHash;

      if (selectedToken.id === 1) {
        // Native ETH transfer - use provider directly
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const tx = await signer.sendTransaction({
          to: recipient,
          value: ethers.parseEther(amount.toString())
        });
        txHash = tx.hash;
        await tx.wait();
      } else {
        // ERC20 token transfer using contract instances
        let contractInstance;

        // Use AFRISTABLE_CONTRACT_INSTANCE for AFRC token, TEST_TOKEN_CONTRACT_INSTANCE for others
        if (selectedToken.symbol === 'AFX') {
          contractInstance = await AFRISTABLE_CONTRACT_INSTANCE();
        } else {
          contractInstance = await TEST_TOKEN_CONTRACT_INSTANCE(selectedToken.address);
        }

        if (!contractInstance) {
          throw new Error('Contract instance not available');
        }

        // Convert amount to wei (assuming 18 decimals)
        const transferAmount = ethers.parseUnits(amount.toString(), 18);
       
        const tx = await contractInstance.transfer(recipient, transferAmount);
        txHash = tx.hash;
        await tx.wait();
      }

      setTransactionHash(txHash);
      
      // Refresh balances after successful transfer
      await updateTokenBalances();
      
      setStep(3);
    } catch (error) {
      console.error('Transaction failed:', error);
      if (error.code === 4001) {
        setError('Transaction rejected by user');
      } else if (error.code === -32603) {
        setError('Transaction failed - insufficient funds for gas');
      } else {
        setError(`Transaction failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsTransacting(false);
    }
  };

  const handleSend = () => {
    if (step === 1 && validateTransfer()) {
      setStep(2);
    } else if (step === 2) {
      executeTransfer();
    }
  };

  const resetForm = () => {
    setStep(1);
    setRecipient('');
    setAmount('');
    setError('');
    setTransactionHash('');
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
            Your transfer of {amount} {selectedToken.symbol} has been successfully sent to {recipient}
          </p>
          <div className="bg-stone-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-stone-600 mb-2">Transaction Hash</p>
            <p className="font-mono text-stone-800 text-sm break-all">{transactionHash}</p>
          </div>
          <button
            onClick={resetForm}
            className="bg-gradient-to-r from-orange-500 to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
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
        <p className="text-stone-600">Transfer tokens to anywhere in the world</p>
      </div>

      {/* Wallet Connection */}
      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div className="flex-1">
              <p className="text-yellow-800 font-medium">Wallet not connected</p>
              <p className="text-yellow-600 text-sm">Please connect your wallet to send tokens</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step >= 1 ? 'bg-orange-500 text-white' : 'bg-stone-200 text-stone-500'
        }`}>
          1
        </div>
        <div className={`w-16 h-1 ${step >= 2 ? 'bg-orange-500' : 'bg-stone-200'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step >= 2 ? 'bg-orange-500 text-white' : 'bg-stone-200 text-stone-500'
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
                Recipient Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0x..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Select Token
              </label>
              <div className="relative">
                <select
                  value={selectedToken.id}
                  onChange={(e) => handleTokenChange(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {tokens.map(token => (
                    <option key={token.id} value={token.id}>
                      {token.symbol} - Balance: {loadingBalances ? 'Loading...' : token.balance}
                    </option>
                  ))}
                </select>
                {loadingBalances && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-stone-300 border-t-orange-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

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
                  max={selectedToken.balance}
                  step="0.000001"
                  className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0.1"
                />
              </div>
              <p className="text-sm text-stone-500 mt-1">
                Available: {loadingBalances ? 'Loading...' : selectedToken.balance} {selectedToken.symbol}
                {!loadingBalances && (
                  <button
                    onClick={updateTokenBalances}
                    className="ml-2 text-orange-500 hover:text-orange-600 text-xs underline"
                  >
                    Refresh
                  </button>
                )}
              </p>
            </div>

            {amount && (
              <div className="bg-stone-50 rounded-xl p-4">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-stone-600">You send</span>
                  <span className="font-medium">{amount} {selectedToken.symbol}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-stone-600">Network fee (estimated)</span>
                  <span className="font-medium">{transactionFee} ETH</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center font-semibold">
                  <span>Recipient receives</span>
                  <span>{amount} {selectedToken.symbol}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleSend}
              disabled={!recipient || !amount || !isConnected}
              className="w-full bg-gradient-to-r from-orange-500 to-green-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
                  <span className="text-stone-600">From</span>
                  <span className="font-medium font-mono text-sm">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">To</span>
                  <span className="font-medium font-mono text-sm">
                    {recipient.slice(0, 6)}...{recipient.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Token</span>
                  <span className="font-medium">{selectedToken.name} ({selectedToken.symbol})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Amount</span>
                  <span className="font-medium">{amount} {selectedToken.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Network fee (estimated)</span>
                  <span className="font-medium">{transactionFee} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Estimated time</span>
                  <span className="font-medium flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {estimatedTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep(1)}
                disabled={isTransacting}
                className="flex-1 bg-stone-100 text-stone-700 py-3 rounded-lg hover:bg-stone-200 transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleSend}
                disabled={isTransacting}
                className="flex-1 bg-gradient-to-r from-orange-500 to-green-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {isTransacting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Confirm & Send'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendMoney;