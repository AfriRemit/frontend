import React from 'react';
import { ArrowRight, Shield, Users, Gift, Wallet, AlertCircle } from 'lucide-react';

interface FeaturesProps {
  onPageChange?: (page: string) => void;
}

const Features: React.FC<FeaturesProps> = ({ onPageChange }) => {
  const handleGetStarted = () => {
    if (onPageChange) {
      onPageChange('dashboard');
    }
  };

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full text-sm font-medium text-orange-700 mb-6">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Everything You Need to
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 bg-clip-text text-transparent"> Trade & Save</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access a comprehensive suite of DeFi tools designed specifically for African markets
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: Shield,
              title: 'Secure Trading',
              description: 'Trade with confidence using our secure and audited smart contracts',
              gradient: 'from-orange-500 to-red-500'
            },
            {
              icon: Users,
              title: 'Community Savings',
              description: 'Join traditional savings groups with modern blockchain technology',
              gradient: 'from-yellow-500 to-orange-500'
            },
            {
              icon: Gift,
              title: 'Rewards Program',
              description: 'Earn rewards for trading and participating in the ecosystem',
              gradient: 'from-purple-500 to-pink-500'
            },
            {
              icon: Wallet,
              title: 'Multi-Currency',
              description: 'Support for multiple African stablecoins and global cryptocurrencies',
              gradient: 'from-green-500 to-emerald-500'
            },
            {
              icon: AlertCircle,
              title: 'Real-time Alerts',
              description: 'Get instant notifications for price movements and market updates',
              gradient: 'from-blue-500 to-cyan-500'
            }
          ].map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 text-center relative">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)] rounded-3xl"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-white/80 mb-6">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Ready to Start
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Experience the Future
              </h3>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Join thousands of users already trading and saving with AfriRemit
              </p>
              <button 
                onClick={handleGetStarted}
                className="group bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-2">
                  Get Started Today
                  <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;