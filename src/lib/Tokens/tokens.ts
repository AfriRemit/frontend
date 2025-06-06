// Token interface
export interface Token {
  id: number
  symbol: string;
  name: string;
  balance: number;
  address?: string;
  pool:string[];
  poolId?: number[];
  img?: string; // Optional image URL for the token
}


// Token array
const tokens: Token[] = [
  { 
    id:1,
    symbol: 'ETH', 
    name: 'Ethereum', 
    balance: 0.5,
    address: '0x010Ca9Ed0D1e8ff914c268186Af412aBE4ceA7f6', // Replace with your native token address
    pool: ["AFR","AAVE"],
    poolId: [1,3],
    img: "https://assets.pancakeswap.finance/web/native/1.png"
  },
  { 
    id:2,
    symbol: 'AAVE', 
    name: 'AAVE', 
    balance: 2,
    
     address: '0xFc053C42C3dd72EDcB5d107e0dF29c2Cfe946EEf', // Replace with actual USDC contract address
    pool: [],
    poolId: [],
    img:'https://cdn.moralis.io/eth/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png'
  },
  { 
    id:3,
    symbol: 'AFR', 
    name: 'AfriRemit', 
    balance: 1250,
    address: '0x4a820640d6463aB9A4aB5A420E9559AE8E648784', // Replace with actual AfriCoin contract address
    pool: ["AAVE"],
    poolId: [2],
    img: 'https://cdn.moralis.io/eth/0x6b3595068778dd592e39a122f4f5a5cf09c90fe2.png',
        
  },
];

export default tokens;