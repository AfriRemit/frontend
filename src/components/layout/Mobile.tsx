import React from 'react';
import { createThirdwebClient } from 'thirdweb';
import { ConnectButton } from 'thirdweb/react';
import {
  Shield,
  Send,
  ArrowLeftRight,
  PiggyBank,
  X,
  Droplets,
  Bell,
  DollarSignIcon,
  Home,
  Zap,
  AlertTriangle,
  MessageCircle,
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPage: string;
  onPageChange: (page: string) => void;
  setShowAIChat: (show: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  isConnected: boolean;
  address?: string;
  isCorrectNetwork: boolean;
}

const MobileSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  currentPage,
  onPageChange,
  setShowAIChat,
  showNotifications,
  setShowNotifications,
  isConnected,
  address,
  isCorrectNetwork
}: MobileSidebarProps) => {
  // Create Thirdweb client
  const client = createThirdwebClient({ 
    clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || '9d358fb1c51d6d6g1d6d6g1d6d6g1d6d6g'
  });

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

  // All navigation items for mobile
  const allNavigation = [...primaryNavigation, ...secondaryNavigation];

  // Format address for display
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    if (addr.length < 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="lg:hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-stone-200">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 bg-gradient-to-br from-terracotta to-sage rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-xs">A</span>
                  </div>
                  <span className="font-bold text-xl bg-gradient-to-r from-terracotta to-sage bg-clip-text text-transparent">
                    Remifi
                  </span>
                </div>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6 text-stone-700" />
                </button>
              </div>
              
              {/* Mobile Navigation */}
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="px-4 space-y-2">
                  {allNavigation.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        onPageChange(item.key);
                        setSidebarOpen(false);
                      }}
                      className={cn(
                        'flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors text-left',
                        currentPage === item.key
                          ? 'bg-terracotta text-white'
                          : 'text-stone-700 hover:bg-stone-100'
                      )}
                    >
                      <span>{item.name}</span>
                    </button>
                  ))}
                </nav>
                
                {/* Mobile additional options */}
                <div className="mt-6 px-4 space-y-2 border-t border-stone-200 pt-4">
                  <button 
                    onClick={() => {
                      setShowAIChat(true);
                      setSidebarOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-stone-700 hover:bg-stone-100 rounded-lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Remifi AI</span>
                    <span className="ml-auto w-2 h-2 bg-gradient-to-r from-terracotta to-sage rounded-full animate-pulse"></span>
                  </button>
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-stone-700 hover:bg-stone-100 rounded-lg"
                  >
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                    <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                </div>
              </div>
              
              {/* Mobile Footer */}
              <div className="p-4 border-t border-stone-200">
                {/* Mobile Thirdweb Connect Button */}
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
                    title: "Connect to Remifi",
                    showThirdwebBranding: false,
                  }}
                  switchButton={{
                    label: "Switch to Lisk Sepolia"
                  }}
                />
                
                {/* Connection Status Indicator */}
                {isConnected && (
                  <div className="mt-3 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800">Connected</span>
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
        </div>
      )}
    </div>
  );
};

export default MobileSidebar;