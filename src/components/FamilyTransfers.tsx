
import React, { useState } from 'react';
import { Users, Calendar, Plus, Edit, Trash2, Clock } from 'lucide-react';

const FamilyTransfers = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTransfer, setNewTransfer] = useState({
    recipient: '',
    amount: '',
    frequency: 'monthly',
    currency: 'cNGN'
  });

  const scheduledTransfers = [
    {
      id: 1,
      recipient: 'Mama Adunni',
      amount: 50000,
      currency: 'cNGN',
      frequency: 'monthly',
      nextDate: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      recipient: 'Brother Kojo',
      amount: 25000,
      currency: 'cGHS',
      frequency: 'bi-weekly',
      nextDate: '2024-01-08',
      status: 'active'
    }
  ];

  const handleAddTransfer = () => {
    console.log('Adding new scheduled transfer:', newTransfer);
    setShowAddForm(false);
    setNewTransfer({ recipient: '', amount: '', frequency: 'monthly', currency: 'cNGN' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-terracotta/10 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-terracotta" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-stone-800">Family Transfers</h2>
            <p className="text-stone-600 text-sm">Automated payments to your loved ones</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-terracotta text-white px-4 py-2 rounded-lg hover:bg-terracotta/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Schedule</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <h3 className="text-lg font-semibold text-stone-800 mb-4">Schedule New Transfer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Recipient name"
              value={newTransfer.recipient}
              onChange={(e) => setNewTransfer({...newTransfer, recipient: e.target.value})}
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
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleAddTransfer}
              className="flex-1 bg-terracotta text-white py-3 rounded-lg hover:bg-terracotta/90 transition-colors"
            >
              Schedule Transfer
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 bg-stone-100 text-stone-700 py-3 rounded-lg hover:bg-stone-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {scheduledTransfers.map(transfer => (
          <div key={transfer.id} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-sage/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-sage" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800">{transfer.recipient}</h3>
                  <p className="text-stone-600 text-sm">{transfer.amount.toLocaleString()} {transfer.currency}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-stone-600 text-sm">Next transfer</p>
                  <p className="font-medium text-stone-800 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {transfer.nextDate}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-stone-500 hover:text-terracotta transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-stone-500 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                transfer.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {transfer.status}
              </span>
              <span className="text-stone-500 text-sm flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {transfer.frequency}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyTransfers;
