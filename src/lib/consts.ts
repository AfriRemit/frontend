import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { SmartWalletOptions } from "thirdweb/wallets";

// Replace this with your client ID string
const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
if (!clientId) throw new Error("No client ID provided");

// ————————————————————————————————————————————————
// 1️⃣ Define Lisk Sepolia Chain
export const chain = defineChain({
  id: 4202, // Chain ID for Lisk Sepolia
  name: "Lisk Sepolia",
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpc: "https://4202.rpc.thirdweb.com", // or your own RPC URL like: "https://rpc.sepolia-api.lisk.com"
  blockExplorers: [
    {
      name: "Lisk Scout",
      url: "https://sepolia-blockscout.lisk.com", // Replace with actual Lisk explorer if available
    },
  ],
  testnet: true,
});
// Chain ID 4202, RPC URL and explorer from the official Lisk Sepolia page :contentReference[oaicite:2]{index=2}
// ————————————————————————————————————————————————

export const client = createThirdwebClient({ clientId });



export const accountAbstraction: SmartWalletOptions = {
  chain,
  sponsorGas: true,
};
