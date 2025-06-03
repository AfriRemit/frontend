import React, { useState } from 'react';
import { User, Plus, Edit, Trash2, CreditCard, Smartphone, Wallet } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('payment');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formType, setFormType] = useState('');
  const [editingMethod, setEditingMethod] = useState<number | null>(null);

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'bank',
      name: 'First Bank Nigeria',
      details: '****1234',
      isDefault: true
    },
    {
      id: 2,
      type: 'mobile',
      name: 'MTN Mobile Money',
      details: '+234 *** *** **90',
      isDefault: false
    }
  ]);

  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'bank',
    bankName: '',
    accountNumber: '',
    accountName: '',
    mobileNumber: '',
    walletAddress: '',
    walletType: ''
  });

  const [editPaymentMethod, setEditPaymentMethod] = useState({
    type: 'bank',
    bankName: '',
    accountNumber: '',
    accountName: '',
    mobileNumber: '',
    walletAddress: '',
    walletType: ''
  });

  const handleAddPaymentMethod = () => {
    console.log('Adding new payment method:', newPaymentMethod);
    setShowAddForm(false);
    setNewPaymentMethod({
      type: 'bank',
      bankName: '',
      accountNumber: '',
      accountName: '',
      mobileNumber: '',
      walletAddress: '',
      walletType: ''
    });
  };

  const handleEditClick = (method: any) => {
    setEditingMethod(method.id);
    setEditPaymentMethod({
      type: method.type,
      bankName: method.name,
      accountNumber: '',
      accountName: '',
      mobileNumber: method.type === 'mobile' ? method.details : '',
      walletAddress: method.type === 'wallet' ? method.details : '',
      walletType: ''
    });
  };

  const handleSaveEdit = () => {
    console.log('Saving edited payment method:', editPaymentMethod);
    setEditingMethod(null);
    setEditPaymentMethod({
      type: 'bank',
      bankName: '',
      accountNumber: '',
      accountName: '',
      mobileNumber: '',
      walletAddress: '',
      walletType: ''
    });
  };

  const handleDeleteMethod = (id: number) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'bank': return <CreditCard className="w-5 h-5" />;
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      case 'wallet': return <Wallet className="w-5 h-5" />;
      default: return <CreditCard className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-terracotta" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-stone-800">Profile Settings</h2>
            <p className="text-stone-600">Manage your payment methods and preferences</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-stone-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('payment')}
            className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'payment'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Payment Methods
          </button>
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'personal'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Personal Info
          </button>
        </div>

        {activeTab === 'payment' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-stone-800">Payment Methods</h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => { setFormType('bank'); setShowAddForm(true); }}
                  className="bg-terracotta text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-terracotta/90 transition-colors"
                >
                  Add Bank
                </button>
                <button
                  onClick={() => { setFormType('mobile'); setShowAddForm(true); }}
                  className="bg-sage text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sage/90 transition-colors"
                >
                  Add Mobile
                </button>
                <button
                  onClick={() => { setFormType('wallet'); setShowAddForm(true); }}
                  className="bg-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold/90 transition-colors"
                >
                  Add Wallet
                </button>
              </div>
            </div>

            {showAddForm && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
                <h4 className="text-lg font-semibold text-stone-800 mb-6">
                  Add {formType === 'bank' ? 'Bank Account' : formType === 'mobile' ? 'Mobile Money' : 'Crypto Wallet'}
                </h4>
                
                {formType === 'bank' && (
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      placeholder="Bank Name"
                      value={newPaymentMethod.bankName}
                      onChange={(e) => setNewPaymentMethod({...newPaymentMethod, bankName: e.target.value})}
                      className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={newPaymentMethod.accountNumber}
                      onChange={(e) => setNewPaymentMethod({...newPaymentMethod, accountNumber: e.target.value})}
                      className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Account Name"
                      value={newPaymentMethod.accountName}
                      onChange={(e) => setNewPaymentMethod({...newPaymentMethod, accountName: e.target.value})}
                      className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                    />
                  </div>
                )}

                {formType === 'mobile' && (
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      placeholder="Mobile Number"
                      value={newPaymentMethod.mobileNumber}
                      onChange={(e) => setNewPaymentMethod({...newPaymentMethod, mobileNumber: e.target.value})}
                      className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                    />
                  </div>
                )}

                {formType === 'wallet' && (
                  <div className="grid grid-cols-1 gap-4">
                    <select
                      value={newPaymentMethod.walletType}
                      onChange={(e) => setNewPaymentMethod({...newPaymentMethod, walletType: e.target.value})}
                      className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                    >
                      <option value="">Select Wallet Type</option>
                      <option value="ethereum">Ethereum</option>
                      <option value="bitcoin">Bitcoin</option>
                      <option value="usdc">USDC</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Wallet Address"
                      value={newPaymentMethod.walletAddress}
                      onChange={(e) => setNewPaymentMethod({...newPaymentMethod, walletAddress: e.target.value})}
                      className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                    />
                  </div>
                )}

                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={handleAddPaymentMethod}
                    className="flex-1 bg-terracotta text-white py-3 rounded-lg hover:bg-terracotta/90 transition-colors font-medium"
                  >
                    Add Payment Method
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

            <div className="space-y-4">
              {paymentMethods.map(method => (
                <div key={method.id} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
                  {editingMethod === method.id ? (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-stone-800">Edit Payment Method</h4>
                      {method.type === 'bank' && (
                        <div className="grid grid-cols-1 gap-4">
                          <input
                            type="text"
                            placeholder="Bank Name"
                            value={editPaymentMethod.bankName}
                            onChange={(e) => setEditPaymentMethod({...editPaymentMethod, bankName: e.target.value})}
                            className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                          />
                          <input
                            type="text"
                            placeholder="Account Number"
                            value={editPaymentMethod.accountNumber}
                            onChange={(e) => setEditPaymentMethod({...editPaymentMethod, accountNumber: e.target.value})}
                            className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                          />
                        </div>
                      )}
                      {method.type === 'mobile' && (
                        <input
                          type="text"
                          placeholder="Mobile Number"
                          value={editPaymentMethod.mobileNumber}
                          onChange={(e) => setEditPaymentMethod({...editPaymentMethod, mobileNumber: e.target.value})}
                          className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                        />
                      )}
                      <div className="flex space-x-3">
                        <button 
                          onClick={handleSaveEdit}
                          className="bg-terracotta text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-terracotta/90 transition-colors"
                        >
                          Save Changes
                        </button>
                        <button 
                          onClick={() => setEditingMethod(null)}
                          className="bg-stone-100 text-stone-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center">
                          {getPaymentIcon(method.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-stone-800">{method.name}</h4>
                          <p className="text-stone-600 text-sm">{method.details}</p>
                        </div>
                        {method.isDefault && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditClick(method)}
                          className="p-2 text-stone-500 hover:text-terracotta transition-colors rounded-lg hover:bg-stone-50"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteMethod(method.id)}
                          className="p-2 text-stone-500 hover:text-red-600 transition-colors rounded-lg hover:bg-stone-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'personal' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <h3 className="text-lg font-semibold text-stone-800 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="First Name"
                className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
              />
            </div>
            <button className="mt-6 bg-terracotta text-white px-8 py-3 rounded-lg hover:bg-terracotta/90 transition-colors font-medium">
              Update Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
