import React, { useEffect, useState } from 'react';
import { ArrowRight, Globe, TrendingUp, Shield, Users, Bitcoin, Coins, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  onPageChange?: (page: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onPageChange }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleStartTrading = () => {
    if (onPageChange) {
      onPageChange('dashboard');
    }
    setIsMenuOpen(false);
  };
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        {/* Mesh Gradient Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-200/20 via-red-200/20 to-amber-200/20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-orange-100/30 to-transparent transform -skew-y-12"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-l from-transparent via-red-100/30 to-transparent transform skew-y-12"></div>
        </div>

        {/* Dynamic Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(251, 146, 60, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 146, 60, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
        }}></div>

        {/* Floating Orbs with 3D Effect */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full animate-float-${i % 4}`}
              style={{
                background: `linear-gradient(135deg, ${['#f97316', '#ef4444', '#f59e0b', '#fb923c'][i % 4]
                  }, ${['#fb923c', '#dc2626', '#d97706', '#ea580c'][i % 4]})`,
                left: `${10 + (i * 8)}%`,
                top: `${15 + (i * 6)}%`,
                boxShadow: `0 0 20px ${['#f97316', '#ef4444', '#f59e0b', '#fb923c'][i % 4]}40`,
                transform: `translateZ(${i * 10}px) scale(${1 + i * 0.1})`
              }}
            />
          ))}
        </div>

        {/* Animated Network Lines */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="networkGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#ef4444" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {[...Array(6)].map((_, i) => (
            <path
              key={i}
              d={`M${50 + i * 150} ${100 + i * 80} Q${200 + i * 100} ${350 + i * 120} ${120 + i * 90}`}
              stroke="url(#networkGrad1)"
              strokeWidth="1"
              fill="none"
              filter="url(#glow)"
              className={`animate-pulse`}
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          ))}
        </svg>

        {/* Floating 3D Icons */}
        <div className="absolute top-20 right-20 opacity-20 animate-float-3d">
          <div className="relative">
            <Bitcoin className="w-12 h-12 text-orange-500 drop-shadow-2xl" />
            <div className="absolute inset-0 bg-orange-400 blur-xl opacity-30 animate-pulse"></div>
          </div>
        </div>
        <div className="absolute bottom-32 left-16 opacity-20 animate-float-3d-delayed">
          <div className="relative">
            <Coins className="w-10 h-10 text-amber-500 drop-shadow-2xl" />
            <div className="absolute inset-0 bg-amber-400 blur-xl opacity-30 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="text-center">
          {/* Premium Badge */}
          <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-amber-500/10 backdrop-blur-xl border border-orange-200/30 text-orange-700 rounded-full text-sm font-semibold mb-12 hover:scale-105 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 transform -translate-x-full transition-transform duration-500"></div>
            <Star className="w-4 h-4 text-orange-500 mr-3 animate-spin-slow relative z-10" />
            <span className="relative z-10">🌍 First Global DEX for African Stablecoins</span>
            <Zap className="w-4 h-4 text-red-500 ml-3 animate-pulse relative z-10" />
          </div>

          {/* Hero Title with 3D Effect */}
          <div className="relative mb-12">
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-8 leading-none tracking-tight">
              <span className="block transform hover:scale-105 transition-transform duration-300">
                Bridge African
              </span>
              <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 bg-clip-text text-transparent">
                <span>Finance Globally</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-amber-500/20 blur-3xl animate-pulse"></div>
              </span>
            </h1>
          </div>

          {/* Enhanced Subheading */}
          <p className="text-2xl md:text-3xl text-gray-600 mb-16 max-w-5xl mx-auto leading-relaxed font-light">
            Trade African stablecoins, join traditional savings groups, and access
            <span className="text-orange-600 font-semibold"> global DeFi markets </span>
            on the revolutionary Lisk blockchain platform.
          </p>

          {/* CTA Buttons - Fixed Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <button 
              onClick={handleStartTrading}  
              className="bg-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-600 transition-colors duration-200 flex items-center space-x-2"
            >
              <span>Start Trading Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-orange-400 hover:text-orange-600 transition-colors duration-200">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="group text-center">
              <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-3xl p-8 hover:bg-white hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 border border-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">8+</div>
                <div className="text-gray-600 text-base">Supported Tokens</div>
              </div>
            </div>
            <div className="group text-center">
              <div className="bg-white/80 backdrop-blur-sm border border-red-100 rounded-3xl p-8 hover:bg-white hover:border-red-200 hover:shadow-xl hover:shadow-red-100/50 transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 border border-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">$2M+</div>
                <div className="text-gray-600 text-base">Total Volume</div>
              </div>
            </div>
            <div className="group text-center">
              <div className="bg-white/80 backdrop-blur-sm border border-amber-100 rounded-3xl p-8 hover:bg-white hover:border-amber-200 hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Users className="w-8 h-8 text-amber-600" />
                </div>
                <div className="text-3xl font-bold text gray-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">0+</div>
                <div className="text-gray-600 text-base">Active Users</div>
              </div>
            </div>
            <div className="group text-center">
              <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-3xl p-8 hover:bg-white hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 border border-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">100%</div>
                <div className="text-gray-600 text-base">Secure</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-30px) translateX(10px) rotate(120deg); }
          66% { transform: translateY(-10px) translateX(-15px) rotate(240deg); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-25px) translateX(-12px) rotate(-120deg); }
          66% { transform: translateY(-15px) translateX(18px) rotate(-240deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-35px) translateX(8px) rotate(90deg); }
          66% { transform: translateY(-5px) translateX(-20px) rotate(180deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-20px) translateX(15px) rotate(-90deg); }
          66% { transform: translateY(-25px) translateX(-10px) rotate(-180deg); }
        }
        @keyframes float-3d {
          0%, 100% { transform: translateY(0px) rotateY(0deg) rotateX(0deg); }
          50% { transform: translateY(-30px) rotateY(180deg) rotateX(15deg); }
        }
        @keyframes float-3d-delayed {
          0%, 100% { transform: translateY(0px) rotateY(0deg) rotateX(0deg); }
          50% { transform: translateY(-25px) rotateY(-180deg) rotateX(-15deg); }
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float-0 { animation: float-0 8s ease-in-out infinite; }
        .animate-float-1 { animation: float-1 7s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 9s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 6s ease-in-out infinite; }
        .animate-float-3d { animation: float-3d 12s ease-in-out infinite; }
        .animate-float-3d-delayed { animation: float-3d-delayed 10s ease-in-out infinite; }
        .animate-gradient-x {
          background-size: 400% 400%;
          animation: gradient-x 4s ease infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .transform-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;