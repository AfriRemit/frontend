import React from 'react';
import { Shield, Award, Globe, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TrustedPartners: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const partners = [
    {
      name: "Lisk",
      description: "Blockchain Infrastructure",
      logo: "https://cryptologos.cc/logos/lisk-lsk-logo.png",
      website: "https://lisk.com",
      gradient: "from-blue-500 to-purple-600",
      bgColor: "bg-blue-50"
    },
    {
      name: "Paystack",
      description: "Payment Gateway",
      logo: "https://paystack.com/assets/img/logos/paystack-icon-colored.svg",
      website: "https://paystack.com",
      gradient: "from-green-500 to-teal-600",
      bgColor: "bg-green-50"
    },
    {
      name: "Flutterwave",
      description: "Fintech Solutions",
      logo: "https://flutterwave.com/images/logo/logo-mark/full.svg",
      website: "https://flutterwave.com",
      gradient: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50"
    },
    {
      name: "Chainlink",
      description: "Price Oracles",
      logo: "https://cryptologos.cc/logos/chainlink-link-logo.png",
      website: "https://chain.link",
      gradient: "from-blue-600 to-indigo-600",
      bgColor: "bg-blue-50"
    },
    {
      name: "MetaMask",
      description: "Wallet Integration",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
      website: "https://metamask.io",
      gradient: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-50"
    },
    {
      name: "WalletConnect",
      description: "Multi-Wallet Support",
      logo: "https://walletconnect.com/static/logos/walletconnect-logo.svg",
      website: "https://walletconnect.com",
      gradient: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50"
    },
    {
      name: "Polygon",
      description: "Scaling Solution",
      logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
      website: "https://polygon.technology",
      gradient: "from-purple-600 to-indigo-600",
      bgColor: "bg-purple-50"
    },
    {
      name: "Binance",
      description: "Crypto Exchange",
      logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
      website: "https://binance.com",
      gradient: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50"
    }
  ];

  const achievements = [
    {
      icon: Shield,
      title: "Security Audited",
      description: "Smart contracts audited by leading blockchain security firms",
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      gradient: "from-emerald-400 to-teal-500"
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized for innovation in African fintech solutions",
      color: "text-blue-600",
      bg: "bg-blue-100",
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Serving users across multiple African countries",
      color: "text-purple-600",
      bg: "bg-purple-100",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Growing Fast",
      description: "Rapid adoption and expanding user base",
      color: "text-orange-600",
      bg: "bg-orange-100",
      gradient: "from-orange-400 to-red-500"
    }
  ];

  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(partners.length / itemsPerSlide);

  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlay, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentPartners = () => {
    const start = currentSlide * itemsPerSlide;
    return partners.slice(start, start + itemsPerSlide);
  };

  return (
    <section id="partners" className="py-24 bg-white relative overflow-hidden">
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 via-pink-50 to-blue-100 text-purple-800 rounded-full text-sm font-semibold mb-6 border border-purple-200/50 backdrop-blur-sm">
            <span className="mr-2">🤝</span>
            Trusted Ecosystem
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Powered by
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We partner with the best in blockchain, fintech, and security to deliver a world-class experience
          </p>
        </div>

        {/* Continuous Scrolling Partners */}
        <div className="relative mb-20 overflow-hidden">
          <div className="flex animate-scroll">
            {/* First set of logos */}
            {partners.concat(partners).map((partner, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-8 group"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-12 h-12 bg-gradient-to-r ${partner.gradient} rounded-xl flex items-center justify-center"><span class="text-white font-bold text-lg">${partner.name[0]}</span></div>`;
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 shadow-purple-500/10 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose AfriRemit?
            </h3>
            <p className="text-xl text-gray-600 leading-relaxed">
              Built with trust, security, and innovation at the core
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${achievement.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300  hover:shadow-xl`}>
                  <achievement.icon className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{achievement.title}</h4>
                <p className="text-gray-600 leading-relaxed">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-3xl border border-emerald-200/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
            <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">99.9%</div>
            <div className="text-gray-800 font-bold text-lg mb-1">Uptime</div>
            <div className="text-gray-600">Industry-leading reliability</div>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 rounded-3xl border border-blue-200/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">&lt;2s</div>
            <div className="text-gray-800 font-bold text-lg mb-1">Transaction Speed</div>
            <div className="text-gray-600">Lightning-fast execution</div>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-3xl border border-purple-200/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">0.1%</div>
            <div className="text-gray-800 font-bold text-lg mb-1">Trading Fees</div>
            <div className="text-gray-600">Competitive rates</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedPartners;