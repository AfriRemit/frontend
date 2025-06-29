import React, { useRef, useEffect, useState } from 'react';
import { createThirdwebClient } from 'thirdweb';
import { ConnectButton } from 'thirdweb/react';
import {
  Shield,
  Send,
  ArrowLeftRight,
  PiggyBank,
  Users,
  Menu,
  Droplets,
  Settings,
  Wallet,
  Bell,
  Gift,
  ArrowDownLeft,
  DollarSignIcon,
  Home,
  LogOut,
  Zap,
  AlertTriangle,
  MoreHorizontal,
  ChevronDown,
  MessageCircle,
  ArrowUpRight,
  Search
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface TopNavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  setSidebarOpen: (open: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  showMoreMenu: boolean;
  setShowMoreMenu: (show: boolean) => void;
  setShowAIChat: (show: boolean) => void;
  txNotifications: any[];
  txNotifBadge: boolean;
  networkError?: string;
  connectionError?: string;
}

const TopNavbar = ({
  currentPage,
  onPageChange,
  setSidebarOpen,
  showNotifications,
  setShowNotifications,
  showMoreMenu,
  setShowMoreMenu,
  setShowAIChat,
  txNotifications,
  txNotifBadge,
  networkError,
  connectionError
}: TopNavbarProps) => {
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Create Thirdweb client
  const client = createThirdwebClient({ 
    clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || '9d358fb1c51d6d6g1d6d6g1d6d6g1d6d6g'
  });

  // Check if client ID is properly configured
  const isClientConfigured = import.meta.env.VITE_THIRDWEB_CLIENT_ID && 
    import.meta.env.VITE_THIRDWEB_CLIENT_ID !== '9d358fb1c51d6d6g1d6d6g1d6d6g1d6d6g';

  // Primary navigation items (always visible on desktop)
  const primaryNavigation = [
    { name: 'Dashboard', key: 'dashboard', icon: Home },
    { name: 'Send', key: 'send', icon: Send },
    { name: 'Swap', key: 'swap', icon: ArrowLeftRight },
    { name: 'Save', key: 'savings', icon: PiggyBank },
    { name: 'Buy/Sell', key: 'Buy/Sell', icon: DollarSignIcon },
  ];

  // Secondary navigation items (in "More" dropdown on desktop, full list on mobile)
  const secondaryNavigation = [
    { name: 'Faucet', key: 'faucet', icon: Droplets },
    { name: 'Utility Pay', key: 'utility', icon: Zap },
    { name: 'Admin', key: 'admin', icon: Shield },
  ];

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const isCurrentPageInSecondary = secondaryNavigation.some(item => item.key === currentPage);

  // Add click outside handler for More menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowMoreMenu]);

  return (
    <>
      {/* Top Navbar */}
      <div className="bg-white border-b border-stone-200 h-16 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center h-full px-4 lg:px-8 max-w-7xl mx-auto">
          {/* Logo and Name */}
          <button 
            onClick={() => onPageChange('dashboard')} 
            className="flex items-center space-x-3 group curser-pointer"
          >  
            <div className="relative">
              <img 
                src="https://res.cloudinary.com/ecosheane/image/upload/v1749952368/logo_virjcs.jpg"
                alt="Remifi Logo"
                className="w-12 h-12 rounded-xl object-cover group-hover:shadow-orange-200 transition-all duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Remifi
              </span>
            </div>
          </button>
          {/* Navlinks immediately after logo - hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-1 ml-2">
            {primaryNavigation.map((item) => (
              <button
                key={item.key}
                onClick={() => onPageChange(item.key)}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium whitespace-nowrap',
                  currentPage === item.key
                    ? 'font-bold'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-terracotta'
                )}
              >
                <span>{item.name}</span>
              </button>
            ))}
            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium',
                  isCurrentPageInSecondary
                    ? 'text-terracotta font-bold'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-terracotta'
                )}
              >
                <span>More</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {/* More Dropdown Menu */}
              {showMoreMenu && (
                <div 
                  ref={moreMenuRef}
                  className="absolute z-50 top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 py-1"
                >
                  {secondaryNavigation.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        onPageChange(item.key);
                        setShowMoreMenu(false);
                      }}
                      className={cn(
                        'flex items-center space-x-3 w-full px-4 py-2 text-left text-sm transition-colors',
                        currentPage === item.key
                          ? 'text-terracotta font-bold'
                          : 'text-stone-700 hover:bg-stone-50'
                      )}
                    >
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
          {/* Right side icons - Desktop only */}
          <div className="hidden lg:flex items-center space-x-2 ml-auto">
            {/* Search Icon / Input */}
            {showSearch ? (
              <input
                type="text"
                autoFocus
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onBlur={() => setShowSearch(false)}
                placeholder="Search..."
                className="px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta transition-all w-48"
                style={{ minWidth: 120 }}
              />
            ) : (
              <button
                className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
                title="Search"
                onClick={() => setShowSearch(true)}
              >
                <Search className="w-5 h-5 text-stone-700" />
              </button>
            )}
            {/* AI Chat Button */}
            <button 
              onClick={() => setShowAIChat(true)}
              className="p-2 rounded-lg hover:bg-stone-100 transition-colors relative group"
              title="AI Assistant"
            >
              <MessageCircle className="w-5 h-5 text-stone-700 group-hover:text-terracotta transition-colors" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-terracotta to-sage rounded-full animate-pulse"></div>
            </button>
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={handleNotificationClick}
                className="p-2 rounded-lg hover:bg-stone-100 transition-colors relative"
              >
                <Bell className="w-5 h-5 text-stone-700" />
                {txNotifBadge && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>}
              </button>
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-stone-200 z-50">
                  <div className="p-4 border-b border-stone-200">
                    <h3 className="font-semibold text-stone-800">Recent Transactions</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {txNotifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-sm">No recent transactions</div>
                    ) : (
                      txNotifications.map((tx, idx) => (
                        <div key={tx.hash + idx} className="flex items-center gap-3 bg-slate-50 rounded-xl p-4 m-2 shadow-sm">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${tx.direction === 'sent' ? 'bg-orange-100' : 'bg-emerald-100'}`}> 
                            {tx.direction === 'sent' ? <ArrowUpRight className="w-5 h-5 text-orange-500" /> : <ArrowDownLeft className="w-5 h-5 text-emerald-500" />}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-800 text-sm">{tx.direction === 'sent' ? 'Sent' : 'Received'} {tx.amount} {tx.token}</div>
                            <div className="text-xs text-slate-500">{tx.direction === 'sent' ? 'To' : 'From'} {tx.counterparty?.slice ? tx.counterparty.slice(0, 6) + '...' + tx.counterparty.slice(-4) : ''}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{tx.hash.slice(0, 8)}...{tx.hash.slice(-4)}</div>
                            <div className="text-[11px] text-slate-400">{tx.timestamp ? new Date(tx.timestamp * 1000).toLocaleString() : ''}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 text-center border-t border-stone-200">
                    <button className="text-terracotta text-sm font-medium hover:text-terracotta/80">
                      View All Transactions
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Thirdweb Connect Button */}
            {isClientConfigured ? (
              <ConnectButton 
                client={client}
                connectButton={{
                  label: "Connect",
                  className: "!bg-gradient-to-r !from-terracotta !to-sage !text-white !font-medium !px-4 !py-2 !rounded-lg !transition-all !duration-200 hover:!shadow-lg !text-sm"
                }}
                detailsButton={{
                  className: "!bg-green-600 !text-white !font-medium !px-4 !py-2 !rounded-lg !transition-all !duration-200 !text-sm",
                  displayBalanceToken: {
                    4202: "0x0000000000000000000000000000000000000000"
                  }
                }}
                connectModal={{
                  title: "Connect to Remifi",
                  titleIcon: "https://your-logo-url.com/logo.png",
                  showThirdwebBranding: false,
                }}
                switchButton={{
                  label: "Switch Network"
                }}
              />
            ) : (
              <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
                <div className="font-medium">Using fallback Thirdweb client</div>
                <div className="text-xs">For production, add VITE_THIRDWEB_CLIENT_ID to .env</div>
              </div>
            )}
          </div>
          {/* Hamburger menu for mobile */}
          <div className="lg:hidden ml-auto">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-stone-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-stone-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Network Error Banner */}
      {(networkError || connectionError) && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3 fixed top-16 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-800">
                {networkError || connectionError}
              </span>
            </div>
            {networkError && (
              <span className="text-sm text-red-600 font-medium">
                Use the wallet button to switch networks
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TopNavbar;