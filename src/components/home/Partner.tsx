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
      logo: "https://storage.googleapis.com/accesswire/logos/subaccounts/53774.png?v=2",
      website: "https://lisk.com",
     
    },
    {
      name: "Paystack",
      description: "Payment Gateway",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Paystack.png",
      website: "https://paystack.com",
      gradient: "from-green-500 to-teal-600",
      bgColor: "bg-green-50"
    },
   
    {
      name: "Chainlink",
      description: "Price Oracles",
      logo: "https://cdn.prod.website-files.com/5f6b7190899f41fb70882d08/665705c1f3833b5b5d8f4ffb_logo-chainlink-blue.svg",
      website: "https://chain.link",
      gradient: "from-blue-600 to-indigo-600",
      bgColor: "bg-blue-50"
    },
    {
  name: "Africa's Talking",
  description: "Telco & Airtime Integration",
  logo: "https://dka575ofm4ao0.cloudfront.net/pages-transactional_logos/retina/855412/AT_Color-71519b9f-5507-4527-a596-45a7698d82b7.png", // or use a custom icon if needed
  website: "https://africastalking.com",
  gradient: "from-red-600 to-yellow-600",
  bgColor: "bg-red-50"
}

  ];

 const achievements = [
{
  icon: () => <img src="https://cdn.prod.website-files.com/5f6b7190899f41fb70882d08/665705c1f3833b5b5d8f4ffb_logo-chainlink-blue.svg" alt="Chainlink" className="w-10 h-10 object-contain" />,
  title: "Price Feed Integrated",
  description: "Decentralized Chainlink oracle powering token exchange rates",
  color: "text-white-600",
  bg: "bg-white-100",
  gradient: "from-green-400 to-cyan-500"
}
,
  {
    icon: () => <img src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Paystack.png" alt="Paystack" className="w-10 h-10 object-contain" />,
    title: "Payment Gateway Ready",
    description: "Integrated test setup with Paystack for fiat on-ramp",
    color: "text-blue-600",
    bg: "bg-blue-100",
    gradient: "from-blue-400 to-cyan-500"
  },
  {
    icon: () => <img src="https://sepolia-blockscout.lisk.com/assets/configs/network_icon_dark.svg" alt="Lisk" className="w-10 h-10 object-contain" />,
    title: "Testnet Deployed",
    description: "MVP live on Lisk Sepolia testnet with core features",
    color: "text-purple-600",
    bg: "bg-purple-100",
    gradient: "from-purple-400 to-pink-500"
  },
  {
  icon: () => <img src="https://dka575ofm4ao0.cloudfront.net/pages-transactional_logos/retina/855412/AT_Color-71519b9f-5507-4527-a596-45a7698d82b7.png" alt="Africa's Talking" className="w-10 h-10 object-contain" />,
  title: "Utility Payment Enabled",
  description: "Bill, airtime, and service integrations via Africa's Talking API",
 color: "text-indigo-700",
  bg: "bg-indigo-100",
  gradient: "from-indigo-500 to-blue-500"
}

];


  const itemsPerSlide = 2;
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
           Collaborating with top innovators in blockchain, fintech, and security to build a seamless and reliable experience.
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
              Why Try AfriRemit?
            </h3>
            <p className="text-xl text-gray-600 leading-relaxed">
              We are building a new platform for cross-border payments and digital assets in Africa. Join us on our journey!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${achievement.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300  hover:shadow-xl`}>
                  {achievement.icon()}
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