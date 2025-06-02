
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  currencies: Currency[];
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencyChange,
  currencies
}) => {
  const selected = currencies.find(c => c.code === selectedCurrency);

  return (
    <div className="relative">
      <select
        value={selectedCurrency}
        onChange={(e) => onCurrencyChange(e.target.value)}
        className="appearance-none bg-white border border-stone-300 rounded-lg px-4 py-2 pr-8 font-medium focus:ring-2 focus:ring-terracotta focus:border-transparent"
      >
        {currencies.map(currency => (
          <option key={currency.code} value={currency.code}>
            {currency.flag} {currency.code} - {currency.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
    </div>
  );
};

export default CurrencySelector;
