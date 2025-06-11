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
    pool: ["AFR","USDT"],
    poolId: [1,2],
    img: "https://assets.pancakeswap.finance/web/native/1.png"
  },
  { 
    id:2,
    symbol: 'USDT', 
    name: 'USDT', 
    balance: 2,
    
     address: '0x88a4e1125FF42e0010192544EAABd78Db393406e', // Replace with actual USDC contract address
    pool: [],
    poolId: [],
    img:'https://coin-images.coingecko.com/coins/images/39963/large/usdt.png?1724952731'
  },
   { 
    id:3,
    symbol: 'WETH', 
    name: 'Wrapped Ethereum', 
    balance: 1250,
    address: '0xa01ada077F5C2DB68ec56f1a28694f4d495201c9', // Replace with actual AfriCoin contract address
    pool: [],
    poolId: [],
    img: 'https://coin-images.coingecko.com/coins/images/39810/large/weth.png?1724139790',
        
  }, 

  { 
    id:4,
    symbol: 'AFR', 
    name: 'AfriRemit', 
    balance: 1250,
    address: '0x207d9E20755fEe1924c79971A3e2d550CE6Ff2CB', // Replace with actual AfriCoin contract address
    pool: [],
    poolId: [],
    img: 'https://cdn.moralis.io/eth/0x6b3595068778dd592e39a122f4f5a5cf09c90fe2.png',
        
  },
     { 
    id:5,
    symbol: 'AFX', 
    name: 'AfriStable', 
    balance: 1250,
    address: '0xc5737615ed39b6B089BEDdE11679e5e1f6B9E768', // Replace with actual AfriCoin contract address
    pool: [],
    poolId: [],
    img: 'https://www.xe.com/svgs/flags/ngn.static.svg',
        
  },
   { 
    id:6,
    symbol: 'cNGN', 
    name: 'Crypto Naira', 
    balance: 1250,
    address: '0x278ccC9E116Ac4dE6c1B2Ba6bfcC81F25ee48429', // Replace with actual AfriCoin contract address
  
    pool: [],
    poolId: [],
    img: 'https://www.xe.com/svgs/flags/ngn.static.svg',
        
  },
   { 
    id:7,
    symbol: 'cZAR', 
    name: 'Crypto South African Rand', 
    balance: 1250,
    address: '0x1255C3745a045f653E5363dB6037A2f854f58FBf', // Replace with actual AfriCoin contract address
    pool: [],
    poolId: [],
    img: 'https://www.xe.com/svgs/flags/zar.static.svg',
        
  },
   { 
    id:8,
    symbol: 'cGHS', 
    name: 'Crypto Ghanaian Cedi', 
    balance: 1250,
    address: '0x19a8a27E066DD329Ed78F500ca7B249D40241dC4', // Replace with actual AfriCoin contract address
    pool: [],
    poolId: [],
    
    img: 'https://www.xe.com/svgs/flags/ghs.static.svg',
        
  },
   { 
    id:9,
    symbol: 'cKES', 
    name: '	Crypto Kenyan Shilling', 
    balance: 1250,
    address: '0x291ca1891b41a25c161fDCAE06350E6a524068d5', // Replace with actual AfriCoin contract address
    pool: [],
    poolId: [],
    img: 'https://www.xe.com/svgs/flags/kes.static.svg',
        
  },
];

export default tokens;




/*
["0x88a4e1125FF42e0010192544EAABd78Db393406e","0x207d9E20755fEe1924c79971A3e2d550CE6Ff2CB","0x278ccC9E116Ac4dE6c1B2Ba6bfcC81F25ee48429","0x1255C3745a045f653E5363dB6037A2f854f58FBf","0x19a8a27E066DD329Ed78F500ca7B249D40241dC4","0x291ca1891b41a25c161fDCAE06350E6a524068d5","0xa01ada077F5C2DB68ec56f1a28694f4d495201c9"]


*/