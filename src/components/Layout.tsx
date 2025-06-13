import React, { useState } from 'react';
import { createThirdwebClient } from 'thirdweb';
import { ConnectButton } from 'thirdweb/react';
// Update the import to match the correct export name from thirdweb/chains

import {
  Shield,
  LayoutDashboard,
  Send,
  ArrowLeftRight,
  PiggyBank,
  Users,
  Menu,
  X,
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
  AlertTriangle
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useContractInstances } from '@/provider/ContractInstanceProvider';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout = ({ children, currentPage, onPageChange }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { 
    isConnected, 
    address, 
    isCorrectNetwork,
    networkError,
    connectionError,
  } = useContractInstances();

  // Create Thirdweb client
  const client = createThirdwebClient({ 
    clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID
  });

  // Complete navigation list with all pages
  const navigation = [
    { name: 'Dashboard', key: 'dashboard', icon: Home },
    { name: 'Send', key: 'send', icon: Send },
    { name: 'Swap', key: 'swap', icon: ArrowLeftRight },
    { name: 'Save', key: 'savings', icon: PiggyBank },
    //{ name: 'Family Pay', key: 'family', icon: Users },
   // { name: 'Cash Out', key: 'withdraw', icon: ArrowDownLeft },
    { name: 'Faucet', key: 'faucet', icon: Droplets },
     { name: 'Buy/Sell', key: 'Buy/Sell', icon: DollarSignIcon  },
      { name: 'Admin', key: 'admin', icon: Shield },
      { name: 'UtilityPay', key: 'utility', icon: Zap },


  ];

  const notifications = [
    { id: 1, title: 'Transfer Completed', message: 'Your transfer to John Doe has been completed successfully.', time: '2 hours ago', unread: true },
    { id: 2, title: 'Savings Milestone', message: 'Congratulations! You\'ve reached your savings goal.', time: '1 day ago', unread: true },
    { id: 3, title: 'Family Transfer', message: 'Scheduled transfer to Mama Adunni processed.', time: '2 days ago', unread: false }
  ];

  // Format address for display
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    if (addr.length < 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="min-h-screen bg-stone-50 max-w-7xl mx-auto">
      {/* Top Navbar */}
      <div className="bg-white border-b border-stone-200 h-16 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between h-full px-4 lg:px-8 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-terracotta to-sage rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <Link to="/" onClick={() => onPageChange('dashboard')}>
              <span className="font-bold text-2xl bg-gradient-to-r from-terracotta to-sage bg-clip-text text-transparent">
                AfriRemit
              </span>
              </Link>
              
            </div>
            
            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center justify-center flex-1 max-w-4xl mx-auto">
              <div className="flex items-center space-x-1">
                {navigation.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => onPageChange(item.key)}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium',
                      currentPage === item.key
                        ? 'bg-terracotta text-white shadow-sm'
                        : 'text-stone-700 hover:bg-stone-100 hover:text-terracotta'
                    )}
                  >
                   <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-stone-100 transition-colors"
            >
              <Menu className="w-6 h-6 text-stone-700" />
            </button>
          </div>

          {/* Right side icons */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={handleNotificationClick}
                className="p-2 rounded-lg hover:bg-stone-100 transition-colors relative"
              >
                <Bell className="w-5 h-5 text-stone-700" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-stone-200 z-50">
                  <div className="p-4 border-b border-stone-200">
                    <h3 className="font-semibold text-stone-800">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`p-4 border-b border-stone-100 hover:bg-stone-50 ${notification.unread ? 'bg-blue-50' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-stone-800 text-sm">{notification.title}</h4>
                            <p className="text-stone-600 text-sm mt-1">{notification.message}</p>
                            <p className="text-stone-500 text-xs mt-2">{notification.time}</p>
                          </div>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-stone-200">
                    <button className="text-terracotta text-sm font-medium hover:text-terracotta/80">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <button
              onClick={() => onPageChange('profile')}
              className="p-2 rounded-lg mr-4 hover:bg-stone-100 transition-colors"
            >
              <Settings className="w-5 h-5 text-stone-700" />
            </button>

            {/* Thirdweb Connect Button */}
            <ConnectButton 
            client={client}
            
              connectButton={{
                label: "Connect Wallet",
                className: "!bg-gradient-to-r !from-terracotta !to-sage !text-white !font-medium !px-4 !py-2 !rounded-lg !transition-all !duration-200 hover:!shadow-lg"
              }}
              detailsButton={{
                className: "!bg-green-600 !text-white !font-medium !px-4 !py-2 !rounded-lg !transition-all !duration-200",
                displayBalanceToken: {
                  4202: "0x0000000000000000000000000000000000000000" // ETH on Lisk Sepolia
                }
              }}
              connectModal={{
                title: "Connect to AfriRemit",
                titleIcon: "https://your-logo-url.com/logo.png", // Optional: Add your logo
                showThirdwebBranding: false,
              }}
              switchButton={{
                label: "Switch to Lisk Sepolia"
              }}
            />
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

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)}>
            <div className="fixed inset-y-0 left-0 w-3/4 bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 bg-gradient-to-br from-terracotta to-sage rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-xs">A</span>
                  </div>
                  <span className="font-bold text-xl bg-gradient-to-r from-terracotta to-sage bg-clip-text text-transparent">
                    AfriRemit
                  </span>
                </div>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6 text-stone-700" />
                </button>
              </div>
              
              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-3">
                {navigation.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      onPageChange(item.key);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                      currentPage === item.key
                        ? 'bg-terracotta text-white'
                        : 'text-stone-700 hover:bg-stone-100'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </nav>
              
              {/* Mobile additional options */}
              <div className="mt-8 space-y-3">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-stone-700 hover:bg-stone-100 rounded-lg"
                >
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </button>
                <button
                  onClick={() => {
                    onPageChange('profile');
                    setSidebarOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-stone-700 hover:bg-stone-100 rounded-lg"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                
                {/* Mobile Thirdweb Connect Button */}
                <div className="pt-4  border-t border-stone-200">
                  <ConnectButton 
                    client={client}
                  
                    connectButton={{
                      label: "Connect Wallet",
                      className: "!w-full !bg-gradient-to-r !from-terracotta !to-sage !text-white !font-medium !px-4 !py-3 !rounded-lg"
                    }}
                    detailsButton={{
                      className: "!w-full !bg-green-600 !text-white !font-medium !px-4 !py-3 !rounded-lg",
                      displayBalanceToken: {
                        4202: "0x0000000000000000000000000000000000000000"
                      }
                    }}
                    connectModal={{
                      title: "Connect to AfriRemit",
                      showThirdwebBranding: false,
                    }}
                    switchButton={{
                      label: "Switch to Lisk Sepolia"
                    }}
                  />
                </div>
                
                {/* Connection Status Indicator */}
                {isConnected && (
                  <div className="px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800">Wallet Connected</span>
                    </div>
                    {address && (
                      <p className="text-xs text-green-600 mt-1 font-mono">
                        {formatAddress(address)}
                      </p>
                    )}
                    {!isCorrectNetwork && (
                      <div className="flex items-center space-x-2 mt-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <span className="text-xs text-orange-600">Wrong Network</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay to close dropdowns */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowNotifications(false)}
        />
      )}

      {/* Main Content */}
      <div className={`pt-16 ${(networkError || connectionError) ? 'pt-28' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;