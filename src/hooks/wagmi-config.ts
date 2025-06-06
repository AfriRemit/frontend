import { createConfig, http } from 'wagmi';
import { liskSepolia } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';

// If Lisk Sepolia is not available in wagmi/chains, define it manually
const liskSepoliaCustom = {
  id: 4202,
  name: 'Lisk Sepolia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia-api.lisk.com'],
    },
    public: {
      http: ['https://rpc.sepolia-api.lisk.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Lisk Sepolia Explorer',
      url: 'https://sepolia-blockscout.lisk.com',
    },
  },
  testnet: true,
} as const;

// Create wagmi config
export const wagmiConfig = createConfig({
  chains: [liskSepoliaCustom], // Use liskSepolia if available in wagmi/chains
  connectors: [
    injected(),
    metaMask(),
    // Add WalletConnect if you have a project ID
    // walletConnect({ projectId: 'your-project-id' }),
  ],
  transports: {
    [liskSepoliaCustom.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}