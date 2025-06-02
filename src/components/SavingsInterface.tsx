
import React, { useState } from 'react';
import { PiggyBank, TrendingUp, Calendar, DollarSign, Clock, CheckCircle } from 'lucide-react';

const SavingsInterface = () => {
  const [depositAmount, setDepositAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState(30);
  const [activeTab, setActiveTab] = useState('deposit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const savingsOptions = [
    { days: 30, apy: 5.0, risk: 'Low' },
    { days: 90, apy: 6.5, risk: 'Low' },
    { days: 180, apy: 7.5, risk: 'Medium' },
    { days: 365, apy: 8.0, risk: 'Medium' },
  ];

  const [currentSavings, setCurrentSavings] = useState([
    {
      id: 1,
      amount: 500,
      apy: 8.0,
      lockPeriod: 365,
      daysRemaining: 342,
      earned: 45.67,
      status: 'active'
    },
    {
      id: 2,
      amount: 250,
      apy: 5.0,
      lockPeriod: 30,
      daysRemaining: 12,
      earned: 8.22,
      status: 'active'
    }
  ]);

  const calculateEarnings = () => {
    if (!depositAmount || !lockPeriod) return 0;
    const selectedOption = savingsOptions.find(opt => opt.days === lockPeriod);
    if (!selectedOption) return 0;
    
    const principal = parseFloat(depositAmount);
    const apy = selectedOption.apy / 100;
    const timeInYears = lockPeriod / 365;
    
    return principal * apy * timeInYears;
  };

  const totalSavings = currentSavings.reduce((sum, saving) => sum + saving.amount, 0);
  const totalEarned = currentSavings.reduce((sum, saving) => sum + saving.earned, 0);

  const handleStartEarning = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const newSaving = {
        id: currentSavings.length + 1,
        amount: parseFloat(depositAmount),
        apy: savingsOptions.find(opt => opt.days === lockPeriod)?.apy || 5.0,
        lockPeriod: lockPeriod,
        daysRemaining: lockPeriod,
        earned: 0,
        status: 'active'
      };
      
      setCurrentSavings([...currentSavings, newSaving]);
      setSuccessMessage(`Successfully deposited ${depositAmount} AFRC for ${lockPeriod} days!`);
      setDepositAmount('');
      setIsProcessing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 2000);
  };

  const handleViewDetails = (savingId: number) => {
    const saving = currentSavings.find(s => s.id === savingId);
    if (saving) {
      alert(`Savings Details:\nAmount: ${saving.amount} AFRC\nAPY: ${saving.apy}%\nDays Remaining: ${saving.daysRemaining}\nTotal Earned: ${saving.earned} AFRC`);
    }
  };

  const handleWithdrawEarly = (savingId: number) => {
    const saving = currentSavings.find(s => s.id === savingId);
    if (saving && saving.daysRemaining < saving.lockPeriod) {
      const penalty = saving.earned * 0.1; // 10% penalty
      const netEarnings = saving.earned - penalty;
      
      if (window.confirm(`Early withdrawal will incur a 10% penalty on earned interest.\nPenalty: ${penalty.toFixed(2)} AFRC\nNet amount: ${(saving.amount + netEarnings).toFixed(2)} AFRC\n\nDo you want to continue?`)) {
        setCurrentSavings(currentSavings.filter(s => s.id !== savingId));
        setSuccessMessage(`Early withdrawal completed. You received ${(saving.amount + netEarnings).toFixed(2)} AFRC.`);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Save & Earn</h1>
        <p className="text-stone-600">Grow your AFRC with competitive interest rates</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Savings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-sage" />
            </div>
            <h3 className="font-semibold text-stone-800">Total Savings</h3>
          </div>
          <p className="text-2xl font-bold text-stone-800">{totalSavings.toLocaleString()} AFRC</p>
          <p className="text-stone-500 text-sm">≈ ${totalSavings.toLocaleString()} USD</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-stone-800">Total Earned</h3>
          </div>
          <p className="text-2xl font-bold text-emerald-600">+{totalEarned.toFixed(2)} AFRC</p>
          <p className="text-stone-500 text-sm">This month</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-semibold text-stone-800">Avg. APY</h3>
          </div>
          <p className="text-2xl font-bold text-stone-800">6.5%</p>
          <p className="text-stone-500 text-sm">Across all deposits</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200">
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'deposit'
                ? 'text-terracotta border-b-2 border-terracotta'
                : 'text-stone-600 hover:text-stone-800'
            }`}
          >
            New Deposit
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'active'
                ? 'text-terracotta border-b-2 border-terracotta'
                : 'text-stone-600 hover:text-stone-800'
            }`}
          >
            Active Savings ({currentSavings.length})
          </button>
        </div>

        {activeTab === 'deposit' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Deposit Form */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-stone-800">Start Earning Today</h3>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Deposit Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                      placeholder="100"
                      min="1"
                    />
                  </div>
                  <p className="text-stone-500 text-sm mt-1">Available: 1,250 AFRC</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-3">
                    Lock Period
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {savingsOptions.map((option) => (
                      <button
                        key={option.days}
                        onClick={() => setLockPeriod(option.days)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          lockPeriod === option.days
                            ? 'border-terracotta bg-terracotta/5'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="text-center">
                          <p className="font-semibold text-stone-800">{option.days} days</p>
                          <p className="text-terracotta font-bold">{option.apy}% APY</p>
                          <p className="text-stone-500 text-sm">{option.risk} risk</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {depositAmount && (
                  <div className="bg-stone-50 rounded-xl p-4">
                    <h4 className="font-semibold text-stone-800 mb-3">Earnings Projection</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-stone-600">Principal</span>
                        <span className="font-medium">{depositAmount} AFRC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-600">Lock Period</span>
                        <span className="font-medium">{lockPeriod} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-600">APY</span>
                        <span className="font-medium">{savingsOptions.find(opt => opt.days === lockPeriod)?.apy}%</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>Estimated Earnings</span>
                        <span className="text-emerald-600">+{calculateEarnings().toFixed(2)} AFRC</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleStartEarning}
                  disabled={!depositAmount || parseFloat(depositAmount) <= 0 || isProcessing}
                  className="w-full bg-gradient-to-r from-terracotta to-sage text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Start Earning'}
                </button>
              </div>

              {/* Benefits */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-stone-800">Why Save with AfriFlow?</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center mt-1">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-stone-800">Competitive Rates</h4>
                      <p className="text-stone-600 text-sm">Earn up to 8% APY on your AFRC deposits</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center mt-1">
                      <PiggyBank className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-stone-800">Secure & Transparent</h4>
                      <p className="text-stone-600 text-sm">Smart contract-based savings with full transparency</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center mt-1">
                      <Clock className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-stone-800">Flexible Terms</h4>
                      <p className="text-stone-600 text-sm">Choose from 30 to 365-day lock periods</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-terracotta/10 to-sage/10 rounded-xl p-4">
                  <h4 className="font-semibold text-stone-800 mb-2">💡 Pro Tip</h4>
                  <p className="text-stone-600 text-sm">
                    Longer lock periods offer higher APY rates. Consider your liquidity needs before choosing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'active' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-6">Your Active Savings</h3>
            
            {currentSavings.length === 0 ? (
              <div className="text-center py-12">
                <PiggyBank className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-stone-800 mb-2">No Active Savings</h4>
                <p className="text-stone-600 mb-4">Start your first savings deposit to begin earning interest</p>
                <button
                  onClick={() => setActiveTab('deposit')}
                  className="bg-terracotta text-white px-6 py-2 rounded-lg hover:bg-terracotta/90 transition-colors"
                >
                  Create Deposit
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {currentSavings.map((saving) => (
                  <div key={saving.id} className="bg-stone-50 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <p className="text-stone-600 text-sm">Amount</p>
                        <p className="font-semibold text-stone-800">{saving.amount} AFRC</p>
                      </div>
                      
                      <div>
                        <p className="text-stone-600 text-sm">APY</p>
                        <p className="font-semibold text-emerald-600">{saving.apy}%</p>
                      </div>
                      
                      <div>
                        <p className="text-stone-600 text-sm">Earned</p>
                        <p className="font-semibold text-emerald-600">+{saving.earned} AFRC</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-stone-600 text-sm">Days Remaining</p>
                          <p className="font-semibold text-stone-800">{saving.daysRemaining}</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewDetails(saving.id)}
                            className="px-4 py-2 bg-white border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors text-sm"
                          >
                            View Details
                          </button>
                          {saving.daysRemaining > 0 && (
                            <button 
                              onClick={() => handleWithdrawEarly(saving.id)}
                              className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 hover:bg-red-100 transition-colors text-sm"
                            >
                              Early Withdrawal
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="w-full bg-stone-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-terracotta to-sage h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${((saving.lockPeriod - saving.daysRemaining) / saving.lockPeriod) * 100}%`
                          }}
                        ></div>
                      </div>
                      <p className="text-stone-500 text-sm mt-1">
                        {Math.round(((saving.lockPeriod - saving.daysRemaining) / saving.lockPeriod) * 100)}% complete
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsInterface;
