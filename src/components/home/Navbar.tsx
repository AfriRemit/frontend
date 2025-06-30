import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom'

interface NavbarProps {
  onPageChange?: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Academy', href: '#courses' },
    // { name: 'Contact', href: '#contact' },
  ];

  const handleStartTrading = () => {
    if (onPageChange) {
      onPageChange('dashboard');
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isScrolled
        ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-orange-100'
        : 'bg-white/80 backdrop-blur-sm'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 mb-2 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo and Desktop Navigation (inline) */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative">
                <img
                  src="https://res.cloudinary.com/ecosheane/image/upload/v1749952368/logo_virjcs.jpg"
                  alt="AfriRemit Logo"
                  className="w-12 h-12 rounded-xl object-cover transition-all duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-2xl font-bold text-gray-900">RemiFi</span>
            </Link>
            {/* Desktop Navigation - now inline with logo */}
            <div className="hidden md:flex items-center space-x-1 ml-4">
              {navItems.map((item, index) => (
                item.name === 'Academy' ? (
                  <button
                    key={item.name}
                    onClick={() => onPageChange ? onPageChange('academy') : window.location.assign('/app/academy')}
                    className="relative px-4 py-2 text-gray-700 hover:text-orange-600 transition-all duration-300 font-medium rounded-lg group bg-transparent border-none outline-none"
                    style={{ background: 'none' }}
                  >
                    <span className="relative z-10">{item.name}</span>
                  </button>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className="relative px-4 py-2 text-gray-700 hover:text-orange-600 transition-all duration-300 font-medium rounded-lg group"
                  >
                    <span className="relative z-10">{item.name}</span>
                  </a>
                )
              ))}
            </div>
          </div>

          {/* Launch DApp Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleStartTrading}
              className="border-2 border-emerald-500 text-gray-700 px-6 py-3 rounded-full font-semibold text-lg hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Start trading</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-18 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-orange-100 shadow-xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300 font-medium rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4">
              <button
                onClick={handleStartTrading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-200 group flex items-center justify-center space-x-2"
              >
                <span className="relative z-10">Launch DApp</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;