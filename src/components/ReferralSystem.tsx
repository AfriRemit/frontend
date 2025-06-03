
import React, { useState } from 'react';
import { Share2, Gift, Users, Copy, Check } from 'lucide-react';

const ReferralSystem = () => {
  const [copied, setCopied] = useState(false);
  const referralCode = "AFRI2024JD";
  const referralLink = `https://afriRemit.app/ref/${referralCode}`;
  
  const referralStats = {
    totalReferred: 12,
    pendingRewards: 45.50,
    totalEarned: 180.00,
    thisMonth: 3
  };

  const recentReferrals = [
    { name: 'John D.', status: 'completed', reward: 15.00, date: '2 days ago' },
    { name: 'Sarah M.', status: 'pending', reward: 15.00, date: '5 days ago' },
    { name: 'Mike O.', status: 'completed', reward: 15.00, date: '1 week ago' }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    const message = `Join me on AfriRemit and earn rewards! Use my referral code: ${referralCode} or click: ${referralLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToTwitter = () => {
    const message = `Join me on AfriRemit, the best cross-border money app for Africa! 🌍💰 Use my referral code: ${referralCode}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralLink)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareGeneric = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join AfriRemit',
        text: `Join me on AfriRemit and earn rewards! Use my referral code: ${referralCode}`,
        url: referralLink,
      });
    } else {
      copyToClipboard(referralLink);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center bg-gradient-to-br from-terracotta/10 to-sage/10 rounded-2xl p-8">
        <div className="w-16 h-16 bg-gradient-to-r from-terracotta to-sage rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">Invite Friends & Earn</h2>
        <p className="text-stone-600 mb-6">
          Earn 15 AFRC for every friend who joins and makes their first transfer
        </p>
        
        <div className="bg-white rounded-xl p-4 mb-6">
          <p className="text-stone-600 text-sm mb-2">Your Referral Code</p>
          <div className="flex items-center justify-center space-x-2">
            <code className="bg-stone-100 px-4 py-2 rounded-lg font-mono text-lg font-bold text-terracotta">
              {referralCode}
            </code>
            <button
              onClick={() => copyToClipboard(referralCode)}
              className="p-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 mb-6">
          <p className="text-stone-600 text-sm mb-2">Share Your Link</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={() => copyToClipboard(referralLink)}
              className="px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors text-sm"
            >
              Copy Link
            </button>
          </div>
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={shareGeneric}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button 
            onClick={shareToWhatsApp}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            WhatsApp
          </button>
          <button 
            onClick={shareToTwitter}
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Twitter
          </button>
        </div>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-terracotta">{referralStats.totalReferred}</p>
          <p className="text-stone-600 text-sm">Total Referred</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-sage">{referralStats.pendingRewards}</p>
          <p className="text-stone-600 text-sm">Pending Rewards</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gold">{referralStats.totalEarned}</p>
          <p className="text-stone-600 text-sm">Total Earned</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-stone-800">{referralStats.thisMonth}</p>
          <p className="text-stone-600 text-sm">This Month</p>
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Recent Referrals</h3>
        <div className="space-y-3">
          {recentReferrals.map((referral, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-terracotta/10 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-terracotta" />
                </div>
                <div>
                  <p className="font-medium text-stone-800">{referral.name}</p>
                  <p className="text-stone-500 text-sm">{referral.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sage">+{referral.reward} AFRC</p>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  referral.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {referral.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReferralSystem;
