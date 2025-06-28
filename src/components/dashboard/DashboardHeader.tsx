import React from 'react';
import { Eye, EyeOff, Copy } from 'lucide-react';
import Currencies from '@/lib/Tokens/currencies';
import { shortenAddress } from '@/lib/utils';

interface DashboardHeaderProps {
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  balanceVisible: boolean;
  setBalanceVisible: (visible: boolean) => void;
  walletAddress: string;
  copied: boolean;
  onCopyAddress: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedCurrency,
  setSelectedCurrency,
  balanceVisible,
  setBalanceVisible,
  walletAddress,
  copied,
  onCopyAddress
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Manage your digital assets with confidence</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="w-full sm:w-auto bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {Currencies.map(currency => (
              <option key={currency.code} value={currency.code}>
                {currency.flag} {currency.code}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="p-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {balanceVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>

            <button
              onClick={onCopyAddress}
              className="flex-1 sm:flex-none flex items-center justify-between sm:justify-start space-x-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3 text-slate-600 hover:text-slate-900 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span className="text-sm font-mono font-medium truncate">{shortenAddress(walletAddress)}</span>
              <Copy className="w-4 h-4 flex-shrink-0" />
            </button>

            {copied && (
              <div className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg animate-pulse">
                Copied!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;