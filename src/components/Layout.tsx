import React, { useState } from 'react';
import {
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
  Home
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useContractInstances } from '@/provider/ContractInstanceProvider';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout = ({ children, currentPage, onPageChange }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { connectWallet, isConnected, address } = useContractInstances();

  // Complete navigation list with all pages
  const navigation = [
    { name: 'Dashboard', key: 'dashboard', icon: Home },
    { name: 'Send Money', key: 'send', icon: Send },
    { name: 'Swap', key: 'swap', icon: ArrowLeftRight },
    { name: 'Save & Earn', key: 'savings', icon: PiggyBank },
    { name: 'Family Pay', key: 'family', icon: Users },
    { name: 'Faucet', key: 'faucet', icon: Droplets },
  ];

  const notifications = [
    { id: 1, title: 'Transfer Completed', message: 'Your transfer to John Doe has been completed successfully.', time: '2 hours ago', unread: true },
    { id: 2, title: 'Savings Milestone', message: 'Congratulations! You\'ve reached your savings goal.', time: '1 day ago', unread: true },
    { id: 3, title: 'Family Transfer', message: 'Scheduled transfer to Mama Adunni processed.', time: '2 days ago', unread: false }
  ];

  // Handle wallet connection with proper error handling
  const handleConnectWallet = async () => {
    if (isConnected) return; // Already connected
    
    setIsConnecting(true);
    try {
      await connectWallet();
      console.log('Wallet connected successfully!');
      // Close mobile sidebar if it was open
      setSidebarOpen(false);
    } catch (error: any) {
      console.error('Connection failed:', error);
      // You can add toast notification here
      alert(`Failed to connect wallet: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  // Format address for display
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Get wallet button text
  const getWalletButtonText = () => {
    if (isConnecting) return 'Connecting...';
    if (isConnected && address) return formatAddress(address);
    return 'Connect Wallet';
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top Navbar */}
      <div className="bg-white border-b border-stone-200 h-16 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between h-full px-4 lg:px-8 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-terracotta to-sage rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-terracotta to-sage bg-clip-text text-transparent">
                AfriRemit
              </span>
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
                    <span className="hidden xl:inline">{item.name}</span>
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
          <div className="hidden lg:flex items-center space-x-2">
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
              className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <Settings className="w-5 h-5 text-stone-700" />
            </button>

            {/* Wallet Connection with full functionality */}
            <div className="relative">
              <button 
                onClick={handleConnectWallet}
                disabled={isConnecting || isConnected}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isConnected 
                    ? 'bg-green-600 text-white cursor-default'
                    : isConnecting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-terracotta to-sage text-white hover:shadow-lg cursor-pointer'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>{getWalletButtonText()}</span>
              </button>
              
              {/* Connection Status Indicator */}
              {isConnected && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
                
                {/* Mobile Wallet Connection */}
                <button 
                  onClick={handleConnectWallet}
                  disabled={isConnecting || isConnected}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isConnected 
                      ? 'bg-green-600 text-white cursor-default'
                      : isConnecting
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-terracotta to-sage text-white hover:shadow-lg cursor-pointer'
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                  <span>{getWalletButtonText()}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay to close notifications */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowNotifications(false)}
        />
      )}

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;