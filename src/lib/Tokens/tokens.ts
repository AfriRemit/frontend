// Token interface
export interface Token {
  symbol: string;
  name: string;
  balance: number;
  address?: string;
}


// Token array
const tokens: Token[] = [
  { 
    symbol: 'ETH', 
    name: 'Ethereum', 
    balance: 0.5,
    address: '0x...' // Replace with your native token address
  },
  { 
    symbol: 'USDC', 
    name: 'USD Coin', 
    balance: 1000,
    address: '0x...' // Replace with actual USDC contract address
  },
  { 
    symbol: 'AFRC', 
    name: 'AfriCoin', 
    balance: 1250,
    address: '0x...' // Replace with actual AfriCoin contract address
  },
];

export default tokens;