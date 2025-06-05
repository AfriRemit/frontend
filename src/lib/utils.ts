import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function addTokenToMetamask(tokenAddress:any, tokenSymbol:any, tokenDecimals:any) {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      console.error("Metamask is not detected or not installed.");
      return;
    }
  
    const params = {
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          
        },
      },
    };
  
    try {
      await window.ethereum.request(params);
      console.log(`Token ${tokenSymbol} added to Metamask successfully.`);
    } catch (error) {
      console.error(`Failed to add token to Metamask: ${error}`);
    }
  }