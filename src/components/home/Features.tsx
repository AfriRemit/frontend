import React from 'react';
import { 
  RefreshCw, 
  PiggyBank, 
  Send, 
  CreditCard, 
  Zap, 
  Shield, 
  Globe, 
  TrendingUp,
  Users,
  Banknote
} from 'lucide-react';

const Features: React.FC = () => {
  const mainFeatures = [
    {
      icon: RefreshCw,
      title: "Token Swapping",
      description: "Seamless cross-border stablecoin swaps with deep liquidity and competitive rates across African and international markets.",
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-blue-500/5"
    },
    {
      icon: PiggyBank,
      title: "Digital Savings Groups",
      description: "Traditional Ajo/Esusu savings reimagined with smart contract automation, transparency, and guaranteed payouts.",
      gradient: "from-green-500 to-emerald-500",
      bg: "bg-green-500/5"
    },
    {
      icon: Send,
      title: "Send Money",
      description: "Lightning-fast native and ERC20 token transfers with minimal fees across borders and within local markets.",
      gradient: "from-purple-500 to-pink-500",
      bg: "bg-purple-500/5"
    },
    {
      icon: CreditCard,
      title: "Buy/Sell Crypto",
      description: "Easy on-ramp and off-ramp services for seamless fiat-to-crypto conversions with multiple payment methods.",
      gradient: "from-orange-500 to-red-500",
      bg: "bg-orange-500/5"
    }
  ];

  const additionalFeatures = [
    {
      icon: Zap,
      title: "Utility Payments",
      description: "Pay bills, buy airtime, and handle daily transactions directly from your crypto wallet.",
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-500/10"
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Advanced security protocols and smart contract audits ensure your funds are always protected.",
      iconColor: "text-green-500",
      iconBg: "bg-green-500/10"
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Access African stablecoins from anywhere in the world with 24/7 availability.",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10"
    },
    {
      icon: TrendingUp,
      title: "Liquidity Rewards",
      description: "Earn AFR tokens by providing liquidity to trading pairs and contributing to ecosystem growth.",
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10"
    },
    {
      icon: Users,
      title: "Agent Network",
      description: "Join our trusted agent network to create and manage savings groups while earning rewards.",
      iconColor: "text-indigo-500",
      iconBg: "bg-indigo-500/10"
    },
    {
      icon: Banknote,
      title: "Multi-Currency Support",
      description: "Trade with cNGN, cKES, cZAR, cGHS, AFX, USDT, and more African and international stablecoins.",
      iconColor: "text-pink-500",
      iconBg: "bg-pink-500/10"
    }
  ];

  return (
    <section id="features" className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full text-sm font-medium text-gray-700 mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
            Powerful Features
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Everything You Need for
            <br />
            <span className="text-black  text-4xl bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              Modern African Finance
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Experience the future of African finance with our comprehensive DeFi platform built on Lisk blockchain
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-24">
          {mainFeatures.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-6 md:p-8 rounded-2xl ${feature.bg} border border-white/50 backdrop-blur-sm hover:border-gray-200/50 transition-all duration-500 hover:-translate-y-1`}
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
                <div className={`flex-shrink-0 w-16 h-16 md:w-14 md:h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 md:w-7 md:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-20">
          {additionalFeatures.map((feature, index) => (
            <div
              key={index}
              className="group p-5 md:p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:border-gray-300/50 hover:bg-white/80 transition-all duration-300 hover:-translate-y-0.5 text-center"
            >
              <div className={`w-14 h-14 md:w-12 md:h-12 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-105 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 md:w-6 md:h-6 ${feature.iconColor}`} />
              </div>
              <h4 className="text-lg md:text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Modern CTA Section */}
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
              <button className="group bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 hover:-translate-y-0.5">
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