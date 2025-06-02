
import React from 'react';
import { Wallet, Send, ArrowLeftRight, PiggyBank, Home, Menu, X, Users, Gift, ArrowDownLeft } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout = ({ children, currentPage, onPageChange }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', icon: Home, id: 'dashboard' },
    { name: 'Send', icon: Send, id: 'send' },
    { name: 'Swap', icon: ArrowLeftRight, id: 'swap' },
    { name: 'Savings', icon: PiggyBank, id: 'savings' },
    { name: 'Family', icon: Users, id: 'family' },
    { name: 'Referral', icon: Gift, id: 'referral' },
    { name: 'Cash Out', icon: ArrowDownLeft, id: 'withdraw' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-stone-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-stone-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-terracotta to-sage rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xs sm:text-sm">A</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-terracotta to-sage bg-clip-text text-transparent">
                AfriRemit
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                    currentPage === item.id
                      ? 'bg-terracotta text-white shadow-sm'
                      : 'text-stone-600 hover:text-terracotta hover:bg-stone-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden xl:inline">{item.name}</span>
                </button>
              ))}
            </nav>

            {/* Desktop Wallet Button */}
            <button className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-terracotta to-sage text-white px-3 sm:px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium">
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Connect</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:text-terracotta hover:bg-stone-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-stone-200 shadow-lg">
            <div className="px-4 py-4 space-y-2 max-h-96 overflow-y-auto">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                    currentPage === item.id
                      ? 'bg-terracotta text-white shadow-sm'
                      : 'text-stone-700 hover:text-terracotta hover:bg-stone-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
              <button className="w-full flex items-center space-x-3 bg-gradient-to-r from-terracotta to-sage text-white px-4 py-3 rounded-lg mt-4 font-medium">
                <Wallet className="w-5 h-5" />
                <span>Connect Wallet</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
