
import React, { useState } from 'react';
import { Droplets, Clock, CheckCircle, AlertCircle, Wallet, Copy } from 'lucide-react';

const Faucet = () => {
  const [claimStatus, setClaimStatus] = useState<'idle' | 'claiming' | 'success' | 'error'>('idle');
  const [lastClaim, setLastClaim] = useState<string | null>(null);
  const [nextClaimTime, setNextClaimTime] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const faucetInfo = {
    dailyLimit: 100,
    claimed: 25,
    nextClaimIn: '18h 32m',
    totalUsers: 12845,
    totalDistributed: '2.5M'
  };

  const handleConnectWallet = () => {
    // Simulate wallet connection
    setIsConnected(true);
    setWalletAddress('0x742d35Cc6cF55532a7532687d391c5f5C3F4a9e3');
  };

  const handleClaimTokens = async () => {
    if (!isConnected && !walletAddress) {
      setClaimStatus('error');
      setTimeout(() => setClaimStatus('idle'), 3000);
      return;
    }

    setClaimStatus('claiming');
    
    // Simulate API call
    setTimeout(() => {
      setClaimStatus('success');
      setLastClaim(new Date().toISOString());
      setNextClaimTime(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()); // 24 hours from now
      setTimeout(() => setClaimStatus('idle'), 3000);
    }, 2000);
  };

  const canClaim = claimStatus === 'idle' && !nextClaimTime && (isConnected || walletAddress);

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  return (
    <div className="space-y-6">
      <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Droplets className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">AFRI Token Faucet</h2>
        <p className="text-stone-600 mb-6">
          Claim free AFRI tokens for testing and experiencing the platform
        </p>
        
        <div className="bg-white rounded-xl p-6 mb-6">
          {/* Wallet Connection Section */}
          {!isConnected && (
            <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-stone-800 mb-4 flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-blue-600" />
                <span>Connect Your Wallet</span>
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Wallet Address (Optional - you can also connect wallet)
                  </label>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="0x742d35Cc6cF55532a7532687d391c5f5C3F4a9e3"
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-stone-600 text-sm mb-3">Or</p>
                  <button
                    onClick={handleConnectWallet}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Connected Wallet Display */}
          {isConnected && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">Wallet Connected</span>
                </div>
                <button
                  onClick={copyAddress}
                  className="flex items-center space-x-2 text-green-600 hover:text-green-700"
                >
                  <span className="text-sm font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{faucetInfo.dailyLimit}</p>
              <p className="text-stone-600 text-sm">Daily Limit</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{faucetInfo.claimed}</p>
              <p className="text-stone-600 text-sm">Claimed Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{faucetInfo.totalUsers.toLocaleString()}</p>
              <p className="text-stone-600 text-sm">Total Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{faucetInfo.totalDistributed}</p>
              <p className="text-stone-600 text-sm">Total Distributed</p>
            </div>
          </div>

          {claimStatus === 'success' && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700">Successfully claimed 25 AFRI tokens!</span>
            </div>
          )}

          {claimStatus === 'error' && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700">Please connect your wallet or provide a wallet address to claim tokens.</span>
            </div>
          )}

          {nextClaimTime && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-3">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-700">Next claim available in: {faucetInfo.nextClaimIn}</span>
            </div>
          )}

          <button
            onClick={handleClaimTokens}
            disabled={!canClaim}
            className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${
              canClaim
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg'
                : 'bg-stone-200 text-stone-500 cursor-not-allowed'
            }`}
          >
            {claimStatus === 'claiming' ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Claiming Tokens...</span>
              </div>
            ) : canClaim ? (
              'Claim 25 AFRI Tokens'
            ) : !isConnected && !walletAddress ? (
              'Connect Wallet to Claim'
            ) : (
              'Claim Limit Reached'
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="font-semibold text-stone-800 mb-2">How it works</h4>
            <ul className="text-stone-600 text-sm space-y-1">
              <li>• Connect wallet or provide address</li>
              <li>• Claim up to 100 AFRI tokens daily</li>
              <li>• Use tokens to test all platform features</li>
              <li>• Reset every 24 hours</li>
            </ul>
          </div>
          <div className="bg-indigo-50 rounded-xl p-4">
            <h4 className="font-semibold text-stone-800 mb-2">Fair Usage</h4>
            <ul className="text-stone-600 text-sm space-y-1">
              <li>• One claim per wallet per day</li>
              <li>• Tokens are for testing only</li>
              <li>• Help us improve the platform</li>
              <li>• Report bugs and issues</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Claims */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Recent Claims</h3>
        <div className="space-y-3">
          {[
            { amount: 25, time: '2 hours ago', status: 'completed', wallet: '0x742d...a9e3' },
            { amount: 25, time: '1 day ago', status: 'completed', wallet: '0x742d...a9e3' },
            { amount: 25, time: '2 days ago', status: 'completed', wallet: '0x742d...a9e3' }
          ].map((claim, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-800">+{claim.amount} AFRI</p>
                  <p className="text-stone-500 text-sm">{claim.wallet} • {claim.time}</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                {claim.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faucet;
