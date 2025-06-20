import React, { useState } from 'react';
import { Users, Calendar, Plus, Edit, Trash2, Clock, Wallet } from 'lucide-react';

const FamilyTransfers = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTransfer, setNewTransfer] = useState({
    recipient: '',
    recipientWallet: '',
    amount: '',
    frequency: 'monthly',
    currency: 'cNGN',
    paymentMethod: ''
  });

  const paymentMethods = [
   
  ];

  const scheduledTransfers = [
    {
      id: 1,
      recipient: 'Mama Adunni',
      recipientWallet: '+234 123 456 7890',
      amount: 50000,
      currency: 'cNGN',
      frequency: 'monthly',
      nextDate: '2024-01-15',
      status: 'active',
      paymentMethod: 'MTN Mobile Money'
    },
    {
      id: 2,
      recipient: 'Brother Kojo',
      recipientWallet: '0x742d35Cc6634C0532925a3b8D6Ac9',
      amount: 25000,
      currency: 'cGHS',
      frequency: 'bi-weekly',
      nextDate: '2024-01-08',
      status: 'active',
      paymentMethod: 'Ethereum Wallet'
    }
  ];

  const handleAddTransfer = () => {
    console.log('Adding new scheduled transfer:', newTransfer);
    setShowAddForm(false);
    setNewTransfer({ 
      recipient: '', 
      recipientWallet: '',
      amount: '', 
      frequency: 'monthly', 
      currency: 'cNGN',
      paymentMethod: ''
    });
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-terracotta" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stone-800">Family Transfers</h2>
              <p className="text-stone-600">Automated payments to your loved ones</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-terracotta text-white px-6 py-3 rounded-lg hover:bg-terracotta/90 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Add Schedule</span>
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <h3 className="text-lg font-semibold text-stone-800 mb-6">Schedule New Transfer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Recipient name"
                value={newTransfer.recipient}
                onChange={(e) => setNewTransfer({...newTransfer, recipient: e.target.value})}
                className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Recipient wallet/phone/account"
                value={newTransfer.recipientWallet}
                onChange={(e) => setNewTransfer({...newTransfer, recipientWallet: e.target.value})}
                className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newTransfer.amount}
                onChange={(e) => setNewTransfer({...newTransfer, amount: e.target.value})}
                className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
              />
              <select
                value={newTransfer.paymentMethod}
                onChange={(e) => setNewTransfer({...newTransfer, paymentMethod: e.target.value})}
                className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
              >
                <option value="">Select Payment Method</option>
                {paymentMethods.map(method => (
                  <option key={method.id} value={method.name}>
                    {method.name} ({method.details})
                  </option>
                ))}
              </select>
              <select
                value={newTransfer.frequency}
                onChange={(e) => setNewTransfer({...newTransfer, frequency: e.target.value})}
                className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
              >
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
              <select
                value={newTransfer.currency}
                onChange={(e) => setNewTransfer({...newTransfer, currency: e.target.value})}
                className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
              >
                <option value="cNGN">🇳🇬 cNGN - Nigerian Naira</option>
                <option value="cGHS">🇬🇭 cGHS - Ghanaian Cedi</option>
                <option value="cKES">🇰🇪 cKES - Kenyan Shilling</option>
                <option value="cZAR">🇿🇦 cZAR - South African Rand</option>
              </select>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleAddTransfer}
                className="flex-1 bg-terracotta text-white py-3 rounded-lg hover:bg-terracotta/90 transition-colors font-medium"
              >
                Schedule Transfer
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-stone-100 text-stone-700 py-3 rounded-lg hover:bg-stone-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {scheduledTransfers.map(transfer => (
            <div key={transfer.id} className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-14 h-14 bg-sage/10 rounded-full flex items-center justify-center">
                    <Users className="w-7 h-7 text-sage" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-800 text-lg">{transfer.recipient}</h3>
                    <p className="text-stone-600 text-lg font-medium">{transfer.amount.toLocaleString()} {transfer.currency}</p>
                    <div className="flex items-center text-stone-500 text-sm mt-2">
                      <Wallet className="w-4 h-4 mr-2" />
                      <span className="truncate max-w-[200px]">{transfer.recipientWallet}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-stone-600 text-sm mb-1">Next transfer</p>
                    <p className="font-medium text-stone-800 flex items-center text-lg">
                      <Calendar className="w-5 h-5 mr-2" />
                      {transfer.nextDate}
                    </p>
                    <p className="text-stone-500 text-sm mt-2">{transfer.paymentMethod}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-3 text-stone-500 hover:text-terracotta transition-colors rounded-lg hover:bg-stone-50">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="p-3 text-stone-500 hover:text-red-600 transition-colors rounded-lg hover:bg-stone-50">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  transfer.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {transfer.status}
                </span>
                <span className="text-stone-500 flex items-center font-medium">
                  <Clock className="w-4 h-4 mr-2" />
                  {transfer.frequency}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FamilyTransfers;
