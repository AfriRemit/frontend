// Token interface
export interface Token {
  id: number
  symbol: string;
  name: string;
  balance: number;
  address?: string;
  pool:string[];
}


// Token array
const tokens: Token[] = [
  { 
    id:1,
    symbol: 'ETH', 
    name: 'Ethereum', 
    balance: 0.5,
    address: '0x010Ca9Ed0D1e8ff914c268186Af412aBE4ceA7f6', // Replace with your native token address
    pool: ["AAVE","AFR"]
  },
  { 
    id:2,
    symbol: 'AAVE', 
    name: 'AAVE', 
    balance: 2,
    address: '0xFc053C42C3dd72EDcB5d107e0dF29c2Cfe946EEf', // Replace with actual USDC contract address
    pool: []
  },
  { 
    id:3,
    symbol: 'AFR', 
    name: 'AfriRemit', 
    balance: 1250,
    address: '0x4a820640d6463aB9A4aB5A420E9559AE8E648784', // Replace with actual AfriCoin contract address
    pool: []
  },
];

export default tokens;