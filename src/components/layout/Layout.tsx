import React, { useState, useEffect } from 'react';
import { formatEther, JsonRpcProvider } from 'ethers';
import { useContractInstances } from '@/provider/ContractInstanceProvider';
import AIChatModal from '../AI/Chat';
import tokens from '@/lib/Tokens/tokens';
import TopNavbar from './Navbar';
import MobileSidebar from './Mobile';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout = ({ children, currentPage, onPageChange }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  
  const { 
    isConnected, 
    address, 
    isCorrectNetwork,
    networkError,
    connectionError,
    signer,
    TEST_TOKEN_CONTRACT_INSTANCE,
    AFRISTABLE_CONTRACT_INSTANCE
  } = useContractInstances();

  const [txNotifications, setTxNotifications] = useState<any[]>([]);
  const [txNotifBadge, setTxNotifBadge] = useState(false);

  // Fetch recent transactions for notifications
  useEffect(() => {
    const fetchTxNotifs = async () => {
      if (!isConnected || !address || !signer) {
        setTxNotifications([]);
        setTxNotifBadge(false);
        return;
      }
      const provider = signer.provider as JsonRpcProvider | undefined;
      if (!provider) return;
      try {
        const fetchTokenTxs = async (token: any) => {
          if (!token.address) return [];
          let contract;
          if (token.symbol === 'AFX') {
            contract = await AFRISTABLE_CONTRACT_INSTANCE();
          } else {
            contract = await TEST_TOKEN_CONTRACT_INSTANCE(token.address);
          }
          if (!contract) return [];
          const currentBlock = await provider.getBlockNumber();
          const fromBlock = Math.max(currentBlock - 10000, 0);
          const sentEvents = await contract.queryFilter(
            contract.filters.Transfer(address, null),
            fromBlock,
            currentBlock
          );
          const receivedEvents = await contract.queryFilter(
            contract.filters.Transfer(null, address),
            fromBlock,
            currentBlock
          );
          const sent = sentEvents.map(e => ({
            hash: e.transactionHash,
            blockNumber: e.blockNumber,
            direction: 'sent',
            counterparty: e.args?.to,
            amount: parseFloat(formatEther(e.args?.value)),
            token: token.symbol,
            timestamp: null
          }));
          const received = receivedEvents.map(e => ({
            hash: e.transactionHash,
            blockNumber: e.blockNumber,
            direction: 'received',
            counterparty: e.args?.from,
            amount: parseFloat(formatEther(e.args?.value)),
            token: token.symbol,
            timestamp: null
          }));
          return [...sent, ...received];
        };
        const txArrays = await Promise.all(tokens.filter(t => t.address).map(fetchTokenTxs));
        let txs = txArrays.flat();
        // Fetch timestamps for each unique block
        const blockNumbers = Array.from(new Set(txs.map(tx => tx.blockNumber)));
        const blockTimestamps: Record<number, number> = {};
        if (provider && typeof provider.getBlock === 'function') {
          await Promise.all(blockNumbers.map(async (bn) => {
            const block = await provider.getBlock(bn);
            blockTimestamps[bn] = block?.timestamp;
          }));
        }
        txs = txs.map(tx => ({ ...tx, timestamp: blockTimestamps[tx.blockNumber] }));
        txs.sort((a, b) => b.blockNumber - a.blockNumber);
        setTxNotifications(txs.slice(0, 3));
        setTxNotifBadge(txs.length > 0);
      } catch (err) {
        setTxNotifications([]);
        setTxNotifBadge(false);
      }
    };
    fetchTxNotifs();
    // Poll every 15s
    const interval = setInterval(fetchTxNotifs, 15000);
    return () => clearInterval(interval);
  }, [isConnected, address, signer, TEST_TOKEN_CONTRACT_INSTANCE, AFRISTABLE_CONTRACT_INSTANCE]);

  // Hide badge when dropdown is opened
  useEffect(() => {
    if (showNotifications) setTxNotifBadge(false);
  }, [showNotifications]);

  return (
    <div className="min-h-screen bg-stone-50 max-w-7xl mx-auto">
      <TopNavbar 
        currentPage={currentPage}
        onPageChange={onPageChange}
        setSidebarOpen={setSidebarOpen}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        showMoreMenu={showMoreMenu}
        setShowMoreMenu={setShowMoreMenu}
        setShowAIChat={setShowAIChat}
        txNotifications={txNotifications}
        txNotifBadge={txNotifBadge}
        networkError={networkError}
        connectionError={connectionError}
      />

      <MobileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage={currentPage}
        onPageChange={onPageChange}
        setShowAIChat={setShowAIChat}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        isConnected={isConnected}
        address={address}
        isCorrectNetwork={isCorrectNetwork}
      />

      {/* Overlay to close dropdowns */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowNotifications(false)}
        />
      )}

      {/* AI Chat Modal */}
      {showAIChat && (
        <AIChatModal 
          isOpen={showAIChat} 
          onClose={() => setShowAIChat(false)} 
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