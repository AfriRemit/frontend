
import React, { useState,useEffect } from 'react';
import { Plus, Minus, Info, Droplets, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useContractInstances } from '@/provider/ContractInstanceProvider';
import tokens from '@/lib/Tokens/tokens';
import { ethers, formatEther, parseEther } from 'ethers';
import { CONTRACT_ADDRESSES } from '@/provider/ContractInstanceProvider';
import { toast} from 'react-toastify';
import ToastIndex from './ToastIndex';
import { roundToSevenDecimalPlaces, roundToTwoDecimalPlaces } from '../lib/utils';
export interface Token {
  id: number
  symbol: string;
  name: string;
  balance: number;
  address?: string;
  pool: string[];
}

// Rename the local tokens array to avoid conflict with imported 'tokens'


interface LiquidityPool {
  pair: string;
  userLiquidity: number;
  totalLiquidity: number;
  userShare: number;
  fees24h: number;
}




const LiquidityInterface = ({ onBackToSwap }) => {
  const [activeTab, setActiveTab] = useState('add');
  const [token1, setToken1] = useState('ETH');
  const [token2, setToken2] = useState('AFR');
  const token1Address = tokens.find(t => t.symbol === token1)?.address;
  const token2Address = tokens.find(t => t.symbol === token2)?.address;


  const [amount1, setAmount1] = useState('');
  const [amount2, setAmount2] = useState('');
  const [availablePools, setAvailablePools] = useState<string[]>([]);
  const [poolExists, setPoolExists] = useState(true);
  
  const { isConnected, SWAP_CONTRACT_INSTANCE, TEST_TOKEN_CONTRACT_INSTANCE, PRICEAPI_CONTRACT_INSTANCE,fetchBalance, address } = useContractInstances()

  // States from old frontend
  const [isApprove1, setApprove1] = useState(false);
  const [isApprove2, setApprove2] = useState(false);
  const [hasApproveOne, setHasApprovedOne] = useState(false);
  const [hasApproveTwo, setHasApprovedTwo] = useState(false);
  const [Bal1, setBal1] = useState(null);
  const [Bal2, setBal2] = useState(null);
  const [isAddLiquid, setIsAddLiquid] = useState(false);
  const [isEstimate, setEstimate] = useState(false);
  const [amount2Rate, setAmount2Rate] = useState('');
  const [amount1inWei, setToWei] = useState(null);
  const [poolBal1, setPoolBal1] = useState(null);
  const [poolBal2, setPoolBal2] = useState(null);
  const [liquidID, setLiquidID] = useState('');
  const[isRemoveLiquid,setIsRemoveLiquid]=useState(false)
  const [loading, setLoading] = useState(false);
  const [userLiquidityPools, setUserLiquidityPools] = useState([]);

  // Helper function to get USD value for a token amount
  const getTokenUSDValue = async (tokenAddress, amount, PRICE_FEED_CONTRACT) => {
    try {
      console.log(`     Getting price for token ${tokenAddress}, amount: ${amount}`);
      const priceInWei = await PRICE_FEED_CONTRACT.getLatestPrice(tokenAddress);
      const price = parseFloat(formatEther(priceInWei));
      const usdValue = amount * price;
      console.log(`     Token price: ${price}, USD value: ${usdValue.toFixed(2)}`);
      return usdValue;
    } catch (error) {
      console.error(`     ❌ Error getting price for token ${tokenAddress}:`, error.message);
      return 0;
    }
  };

  // Helper function to get total pool liquidity in USD
  const getTotalPoolLiquidity = async (tokenA, tokenB, PRICE_FEED_CONTRACT, SWAP_CONTRACT) => {
    try {
      console.log(`     Getting pool size for ${tokenA.symbol}/${tokenB.symbol}`);
      // Get total pool balances using getPoolSize
      const [poolBalance1, poolBalance2] = await SWAP_CONTRACT.getPoolSize(tokenA.address, tokenB.address);
      
      const totalAmount0Formatted = parseFloat(formatEther(poolBalance1));
      const totalAmount1Formatted = parseFloat(formatEther(poolBalance2));
      
      console.log(`     Pool Balances: ${totalAmount0Formatted} ${tokenA.symbol}, ${totalAmount1Formatted} ${tokenB.symbol}`);
      
      const [usdValue0, usdValue1] = await Promise.all([
        getTokenUSDValue(tokenA.address, totalAmount0Formatted, PRICE_FEED_CONTRACT),
        getTokenUSDValue(tokenB.address, totalAmount1Formatted, PRICE_FEED_CONTRACT)
      ]);
      
      const totalUsdValue = usdValue0 + usdValue1;
      console.log(`     Total pool USD value: ${totalUsdValue.toFixed(2)}`);
      return totalUsdValue;
    } catch (error) {
      console.error(`     ❌ Error getting total pool liquidity for tokens ${tokenA.symbol}/${tokenB.symbol}:`, error.message);
      return 0;
    }
  };

  const getAllLiquidityPoolsWithAddresses = () => {
  const pools = [];
  tokens.forEach(token => {
    if (Array.isArray(token.pool)) {
      token.pool.forEach(poolTokenSymbol => {
        // Find the token object for the pool partner
        const partnerToken = tokens.find(t => t.symbol === poolTokenSymbol);
        if (partnerToken) {
          const pair = `${token.symbol}/${poolTokenSymbol}`;
          const reversePair = `${poolTokenSymbol}/${token.symbol}`;
          
          // Check if this pair already exists (avoid duplicates)
          const existingPool = pools.find(p => p.pair === pair || p.pair === reversePair);
          if (!existingPool) {
            pools.push({
              pair: pair,
              tokenA: {
                symbol: token.symbol,
                address: token.address
              },
              tokenB: {
                symbol: poolTokenSymbol,
                address: partnerToken.address
              }
            });
          }
        }
      });
    }
  });
  return pools;
};

// Enhanced useEffect to fetch all pool data
useEffect(() => {
  let intervalId;
  


const fetchAllPoolsData = async () => {
  try {
    console.log('🔄 Starting liquidity pools fetch...');
    setLoading(true);

    if (!SWAP_CONTRACT_INSTANCE || !isConnected || !tokens?.length) {
      console.log('❌ Missing dependencies:', {
        SWAP_CONTRACT_INSTANCE: !!SWAP_CONTRACT_INSTANCE,
        isConnected,
        tokensLength: tokens?.length || 0
      });
      setLoading(false);
      return;
    }

    console.log('✅ All dependencies available, initializing contracts...');
    const SWAP_CONTRACT = await SWAP_CONTRACT_INSTANCE();
    const PRICE_FEED_CONTRACT = await PRICEAPI_CONTRACT_INSTANCE();

    // Get all available pools
    const availablePools = getAllLiquidityPoolsWithAddresses();
    console.log('📋 Available pools:', availablePools);

    const structuredPools = [];

    for (const pool of availablePools) {
      try {
        console.log(`\n🔍 Processing pool: ${pool.pair}`);
        const { tokenA, tokenB } = pool;

        // Fetch pool balances
        console.log('   🏊 Fetching pool balances...');
        const [poolBalance1, poolBalance2] = await SWAP_CONTRACT.getPoolSize(
          tokenA.address,
          tokenB.address
        );

        const poolBal1 = roundToSevenDecimalPlaces(parseFloat(formatEther(poolBalance1)));
        const poolBal2 = roundToSevenDecimalPlaces(parseFloat(formatEther(poolBalance2)));

        console.log(`   Pool Balances: ${poolBal1} ${tokenA.symbol}, ${poolBal2} ${tokenB.symbol}`);

        // Get USD values for pool balances
        console.log('   💰 Getting USD values for pool balances...');
        const [poolUsdValue1, poolUsdValue2] = await Promise.all([
          getTokenUSDValue(tokenA.address, poolBal1, PRICE_FEED_CONTRACT),
          getTokenUSDValue(tokenB.address, poolBal2, PRICE_FEED_CONTRACT)
        ]);

        const totalPoolLiquidity = poolUsdValue1 + poolUsdValue2;
        console.log(`   Total pool liquidity: $${totalPoolLiquidity.toFixed(2)}`);

        // User liquidity data
        let userLiquidity = 0;
        let userShare = '0.0000000';
        let userTokenA = { amount: 0, usdValue: 0 };
        let userTokenB = { amount: 0, usdValue: 0 };
        let fees24h = '0.00';

        if (address) {
          try {
            console.log('   👤 Fetching user liquidity...');

            // Implement based on contract logic
            const userAmountA = 0;
            const userAmountB = 0;

            if (userAmountA > 0 || userAmountB > 0) {
              const [userUsdValueA, userUsdValueB] = await Promise.all([
                getTokenUSDValue(tokenA.address, userAmountA, PRICE_FEED_CONTRACT),
                getTokenUSDValue(tokenB.address, userAmountB, PRICE_FEED_CONTRACT)
              ]);

              userLiquidity = userUsdValueA + userUsdValueB;

              userShare = totalPoolLiquidity > 0
                ? roundToSevenDecimalPlaces((userLiquidity / totalPoolLiquidity) * 100).toString()
                : '0.0000000';

              userTokenA = {
                amount: roundToSevenDecimalPlaces(userAmountA),
                usdValue: roundToSevenDecimalPlaces(userUsdValueA)
              };

              userTokenB = {
                amount: roundToSevenDecimalPlaces(userAmountB),
                usdValue: roundToSevenDecimalPlaces(userUsdValueB)
              };

              fees24h = '0.00'; // Placeholder
            }
          } catch (error) {
            console.warn(`   ⚠️ Could not fetch user liquidity:`, error.message);
          }
        }

        const poolData = {
          pair: pool.pair,
          userLiquidity: roundToSevenDecimalPlaces(userLiquidity),
          userShare,
          fees24h,
          totalLiquidity: roundToSevenDecimalPlaces(totalPoolLiquidity),
          tokenA: {
            symbol: tokenA.symbol,
            amount: userTokenA.amount,
            usdValue: userTokenA.usdValue,
            address: tokenA.address,
            poolBalance: poolBal1,
            poolUsdValue: roundToSevenDecimalPlaces(poolUsdValue1)
          },
          tokenB: {
            symbol: tokenB.symbol,
            amount: userTokenB.amount,
            usdValue: userTokenB.usdValue,
            address: tokenB.address,
            poolBalance: poolBal2,
            poolUsdValue: roundToSevenDecimalPlaces(poolUsdValue2)
          }
        };

        structuredPools.push(poolData);
        console.log(`   ✅ Pool ${pool.pair} processed successfully`);

      } catch (error) {
        console.error(`   ❌ Error processing pool ${pool.pair}:`, error);
      }
    }

    console.log(`\n🎯 Final structured pools (${structuredPools.length}):`, structuredPools);
    setUserLiquidityPools(structuredPools);
    console.log('✅ Liquidity pools fetch completed successfully');

  } catch (error) {
    console.error('❌ Error fetching liquidity pools data:', error);
    console.error('Error stack:', error.stack);
  } finally {
    setLoading(false);
  }
};
  // Initial fetch
  fetchAllPoolsData();

  // Set up interval - 15 seconds to be reasonable
  intervalId = setInterval(fetchAllPoolsData, 60000);

  // Cleanup interval on unmount or dependency change
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}, [SWAP_CONTRACT_INSTANCE, isConnected, address, tokens]);
useEffect(() => {
  let intervalId;
  
  const fetchData = async () => {
    try {
      console.log('🔄 Starting liquidity fetch...');
      setLoading(true);
      
      // Early return if dependencies are missing
      if (!SWAP_CONTRACT_INSTANCE || !isConnected || !address || !tokens?.length) {
        console.log('❌ Missing dependencies:', {
          SWAP_CONTRACT_INSTANCE: !!SWAP_CONTRACT_INSTANCE,
          isConnected,
          address,
          tokensLength: tokens?.length || 0
        });
        setLoading(false);
        return;
      }

      console.log('✅ All dependencies available, initializing contracts for...');
      const SWAP_CONTRACT = await SWAP_CONTRACT_INSTANCE();
      const PRICE_FEED_CONTRACT = await PRICEAPI_CONTRACT_INSTANCE();
      
      console.log('📋 Fetching user liquidities for address:', address);
      const [pools, amounts0, amounts1, providerLiquids] = await SWAP_CONTRACT.myLiquidities(address);

      console.log('📊 Raw liquidity data:', {
        poolsCount: pools.length,
        pools: pools.map(p => p.toString()),
        amounts0: amounts0.map(a => formatEther(a)),
        amounts1: amounts1.map(a => formatEther(a))
      });

      const structuredPools = [];

      for (let i = 0; i < pools.length; i++) {
        console.log(`\n🔍 Processing pool ${i + 1}/${pools.length}`);
        
        const poolId = pools[i].toString();
        const amount0 = parseFloat(formatEther(amounts0[i]));
        const amount1 = parseFloat(formatEther(amounts1[i]));

        console.log(`   Pool ID: ${poolId}`);
        console.log(`   User amounts: ${amount0} / ${amount1}`);

        // Find token pair by poolId reference - improved logic
        const poolTokens = tokens.filter(token => {
          // Handle both array and single value cases
          const tokenPoolIds = Array.isArray(token.poolId) ? token.poolId : [token.poolId];
          return tokenPoolIds.includes(Number(poolId));
        });
        
        console.log(`   Found ${poolTokens.length} matching tokens:`, poolTokens.map(t => t.symbol));
        
        if (poolTokens.length === 2) {
          const [tokenA, tokenB] = poolTokens;
          
          // Ensure we have different tokens
          if (tokenA.address === tokenB.address) {
            console.warn(`   ❌ Found duplicate token addresses for pool ${poolId}`);
            continue;
          }
          
          console.log(`   Token pair: ${tokenA.symbol}/${tokenB.symbol}`);
          console.log(`   Token addresses: ${tokenA.address} / ${tokenB.address}`);
          
          // Get USD values for user's liquidity
          console.log('   💰 Getting USD values for user liquidity...');
          const [userUsdValue0, userUsdValue1] = await Promise.all([
            getTokenUSDValue(tokenA.address, amount0, PRICE_FEED_CONTRACT),
            getTokenUSDValue(tokenB.address, amount1, PRICE_FEED_CONTRACT)
          ]);
          
          const userTotalUsdValue = userUsdValue0 + userUsdValue1;
          console.log(`   User USD values: ${userUsdValue0.toFixed(2)} + ${userUsdValue1.toFixed(2)} = ${userTotalUsdValue.toFixed(2)}`);
          
          // Get total pool liquidity in USD
          console.log('   🏊 Getting total pool liquidity...');
          const totalPoolLiquidity = await getTotalPoolLiquidity(tokenA, tokenB, PRICE_FEED_CONTRACT, SWAP_CONTRACT);
          console.log(`   Total pool liquidity: ${totalPoolLiquidity.toFixed(2)}`);
          
          // Calculate user's share percentage
          const userSharePercentage = totalPoolLiquidity > 0 
            ? ((userTotalUsdValue / totalPoolLiquidity) * 100).toFixed(4)
            : '0.0000';
          console.log(`   User share: ${userSharePercentage}%`);

          // Calculate 24h fees (you might need to implement this in your contract)
          let fees24h = '0.00';
          try {
            console.log('   💸 Fetching user fees...');
            const feesEarned = 24;
            const feesUsd = await getTokenUSDValue(tokenA.address, parseFloat(formatEther(feesEarned)), PRICE_FEED_CONTRACT);
            fees24h = feesUsd.toFixed(2);
            console.log(`   24h fees: ${fees24h}`);
          } catch (error) {
            console.warn(`   ⚠️ Could not fetch fees for pool ${poolId}:`, error.message);
          }

          const poolData = {
            pair: `${tokenA.symbol}/${tokenB.symbol}`,
            userLiquidity: userTotalUsdValue,
            userShare: userSharePercentage,
            fees24h: fees24h,
            totalLiquidity: totalPoolLiquidity,
            poolId,
            tokenA: {
              symbol: tokenA.symbol,
              amount: amount0,
              usdValue: userUsdValue0,
              address: tokenA.address
            },
            tokenB: {
              symbol: tokenB.symbol,
              amount: amount1,
              usdValue: userUsdValue1,
              address: tokenB.address
            }
          };

          structuredPools.push(poolData);
          console.log(`   ✅ Pool ${poolId} processed successfully`);
        } else {
          console.warn(`   ❌ Could not resolve full token pair for poolId ${poolId} - found ${poolTokens.length} tokens`);
          if (poolTokens.length > 2) {
            console.warn(`   Token details:`, poolTokens.map(t => ({ symbol: t.symbol, address: t.address, poolId: t.poolId })));
          }
        }
      }

      console.log(`\n🎯 Final structured pools (${structuredPools.length}):`, structuredPools);
      setUserLiquidityPools(structuredPools);
      console.log('✅ Liquidity fetch completed successfully');
      
    } catch (error) {
      console.error('❌ Error fetching liquidity data:', error);
      console.error('Error stack:', error.stack);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  fetchData();

  
}, [SWAP_CONTRACT_INSTANCE, isConnected, address, tokens]);
 




useEffect(() => {
  const fetchData = async () => {
    try {
      // Check if all required dependencies are available
      if (!SWAP_CONTRACT_INSTANCE || !token1 || !token2 || !isConnected) {
        console.log('Missing dependencies - wallet not connected or tokens not selected');
        return;
      }

      console.log('Fetching pool balances for:', token1, token2);
      
      // Get contract instance and check if it's valid
      const SWAP_CONTRACT = await SWAP_CONTRACT_INSTANCE();
      if (!SWAP_CONTRACT) {
        console.warn('Unable to get swap contract instance. Please connect your wallet.');
        return;
      }




      // Fetch pool balances
      const [poolBalance1, poolBalance2] = await SWAP_CONTRACT.getPoolSize(token1Address, token2Address);
      const s_poolBal1 = formatEther(poolBalance1);
      const s_poolBal2 = formatEther(poolBalance2);
      console.log('Pool Balances:', s_poolBal1, s_poolBal2);
      
      setPoolBal1(Number(roundToSevenDecimalPlaces(s_poolBal1)));
      setPoolBal2(Number(roundToSevenDecimalPlaces(s_poolBal2)));
    
      // Fetch user balances
      const bal1 = await fetchBalance(token1Address);
      const bal2 = await fetchBalance(token2Address);
      
      // Handle potential undefined balances
      const roundedBal1 = bal1 ? roundToTwoDecimalPlaces(bal1) : '0';
      const roundedBal2 = bal2 ? roundToTwoDecimalPlaces(bal2) : '0';
      
      setBal1(roundedBal1);
      setBal2(roundedBal2);
      console.log('User Balances:', roundedBal1, roundedBal2);
      
    } catch(error) {
      console.error('Error fetching data:', error);
      // Optionally set error state or show user notification
    }
  };

  fetchData();
}, [token1, token2, address, isConnected, isAddLiquid]); // Removed poolBal1, poolBal2 to prevent infinite loop




const calculateAmount2Async = async () => {
  console.log('🚀 Starting calculateAmount2Async');
  console.log('📊 Initial values:', { amount1, isConnected, token1Address, token2Address });
  console.log('📊 Amount1 type and value:', { type: typeof amount1, value: amount1, length: amount1?.length });
  
  // Check for valid amount1 (not null, not empty string, not just whitespace)
  const isValidAmount = amount1 !== null && amount1 !== "" && amount1?.toString().trim() !== "";
  
  if (isValidAmount && isConnected) {
    console.log('✅ Passed initial checks - setting estimate to true');
    setEstimate(true);
    
    try {
      // Get contract instance with null check
      console.log('🔗 Getting contract instance...');
      const SWAP_CONTRACT = await SWAP_CONTRACT_INSTANCE();
      if (!SWAP_CONTRACT) {
        console.warn('❌ Unable to get swap contract instance. Please connect your wallet.');
        setAmount2(null);
        return;
      }
      console.log('✅ Contract instance obtained');

      // Check if tokens are selected
      if (!token1Address || !token2Address) {
        console.warn('❌ Tokens not selected properly:', { token1Address, token2Address });
        setAmount2(null);
        return;
      }
      console.log('✅ Token addresses validated');

      // Check pool liquidity (warnings only - don't stop execution)
      try {
        console.log('🏊 Checking pool liquidity...');
        const [poolBalance1, poolBalance2] = await SWAP_CONTRACT.getPoolSize(token1Address, token2Address);
        
        // Convert to numbers for comparison
        const pool1 = Number(formatEther(poolBalance1));
        const pool2 = Number(formatEther(poolBalance2));
        
        console.log('🏊 Pool balances:', { pool1, pool2, poolBalance1: poolBalance1.toString(), poolBalance2: poolBalance2.toString() });
        
        // Warn about liquidity issues but continue execution
        if (pool1 <= 0 || pool2 <= 0) {
          console.warn('⚠️ Pool has no liquidity for this trading pair - estimate may fail');
        }
        
        // Warn about large input amounts but continue
        const inputAmount = Number(amount1);
        console.log('📊 Input amount vs pool:', { inputAmount, pool1, percentage: pool1 > 0 ? (inputAmount/pool1)*100 : 'N/A' });
        
        if (pool1 > 0 && inputAmount >= pool1 * 0.9) {
          console.warn('⚠️ Input amount is large compared to pool liquidity - estimate may fail');
        }
        
      } catch (poolError) {
        console.warn('⚠️ Could not check pool liquidity:', poolError);
        console.log('🔄 Continuing with estimate anyway...');
      }

      console.log('💰 Preparing to call estimate...');
      
      // Validate amount1 before parsing
      const trimmedAmount = amount1.toString().trim();
      if (!trimmedAmount || isNaN(Number(trimmedAmount))) {
        console.warn('❌ Invalid amount1 value:', { original: amount1, trimmed: trimmedAmount });
        setAmount2('0');
        return;
      }
      
      console.log('📊 Parsing amount:', trimmedAmount);
      const TokenAmountInWei = parseEther(trimmedAmount);
      console.log('📊 Amount in Wei:', TokenAmountInWei.toString());
      setToWei(TokenAmountInWei);
      
      // Call contract estimate function
      console.log('🔄 Calling SWAP_CONTRACT.estimate...');
      const rate = await SWAP_CONTRACT.estimate(
        token1Address,
        token2Address,
        TokenAmountInWei
      );
      
      console.log('🎯 Estimated rate (raw):', rate.toString());
      
      setAmount2Rate(rate);
   
      const formattedRate = formatEther(rate);
      console.log('🎯 Estimated rate (formatted):', formattedRate);
      setAmount2(formattedRate.toString());
      console.log('✅ Calculated amount2:', formattedRate.toString());
      
    } catch (error) {
      console.error('❌ Error calculating amount2:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        data: error.data
      });
      
      // Handle specific error types
      if (error.message.includes('DIVIDE_BY_ZERO') || error.message.includes('Panic due to DIVIDE_BY_ZERO')) {
        console.warn('❌ Pool has insufficient liquidity for this swap');
        setAmount2('0');
      } else if (error.message.includes('execution reverted')) {
        console.warn('❌ Transaction would fail - check pool liquidity or input amount');
        setAmount2('0');
      } else {
        setAmount2(null);
      }
    } finally {
      console.log('🏁 Setting estimate to false');
      setEstimate(false);
    }
  } else {
    // If amount1 is invalid or wallet not connected, set amount2 to null
    console.log('❌ Failed initial checks:', { 
      amount1IsNull: amount1 === null,
      amount1IsEmpty: amount1 === "",
      amount1Value: amount1,
      amount1Type: typeof amount1,
      isConnected,
      isValidAmount: amount1 !== null && amount1 !== "" && amount1?.toString().trim() !== ""
    });
    setAmount2(null);
    setEstimate(false);
    
    if (!isConnected) {
      console.warn('❌ Wallet not connected - cannot calculate estimate');
    }
  }
  console.log('🏁 Function execution completed');
};

// Modified useEffect to also depend on pool balances
useEffect(() => {
  // Add a small delay to prevent too frequent calls
  const timeoutId = setTimeout(() => {
    calculateAmount2Async();
  }, 300);
  
  return () => clearTimeout(timeoutId);
}, [amount1, token1, token2, isConnected, poolBal1, poolBal2]);



const isNativeToken = (tokenAddress) => {
  const nativeToken = tokens.find(token => token.address === tokenAddress);
  if (nativeToken && nativeToken.symbol === 'ETH') {
    return true;
  }
  return false;
};


 const token1IsNative = isNativeToken(token1Address);
  const token2IsNative = isNativeToken(token2Address);















  // Get all available liquidity pools
  const getAllLiquidityPools = () => {
    const pools: string[] = [];
    tokens.forEach(token => {
      if (Array.isArray(token.pool)) {
        token.pool.forEach(poolToken => {
          const pair = `${token.symbol}/${poolToken}`;
          const reversePair = `${poolToken}/${token.symbol}`;
          if (!pools.includes(pair) && !pools.includes(reversePair)) {
            pools.push(pair);
          }
        });
      }
    });
    return pools;
  };

  // Check if a liquidity pool exists between two tokens
  const checkPoolExists = (token1Symbol: string, token2Symbol: string): boolean => {
    const token1Data = tokens.find(t => t.symbol === token1Symbol);
    const token2Data = tokens.find(t => t.symbol === token2Symbol);

    if (!token1Data || !token2Data) return false; 

    const pool1 = Array.isArray(token1Data.pool) ? token1Data.pool : [];
    const pool2 = Array.isArray(token2Data.pool) ? token2Data.pool : [];

    return pool1.includes(token2Symbol) || pool2.includes(token1Symbol);
  };

  // Get available tokens for token1 selection
  // ALL tokens can be Token 1
  const getAvailableToken1Options = () => {
    return tokens; // Return all tokens
  };

  // Get available tokens for token2 based on token1 selection
  // Only tokens that are IN the selected token1's pool array
  const getAvailableToken2Options = (selectedToken1: string): Token[] => {
    const token1Data = tokens.find(t => t.symbol === selectedToken1);
    if (!token1Data || !Array.isArray(token1Data.pool)) return [];

    // Only get tokens that are explicitly listed in token1's pool array
    const availableTokens = token1Data.pool
      .map(poolSymbol => tokens.find(t => t.symbol === poolSymbol))
      .filter((t): t is Token => Boolean(t));

    return availableTokens;
  }
  const liquidityPools: LiquidityPool[] = getAllLiquidityPools().map(pair => ({
    pair,
    userLiquidity: Math.random() * 1000 + 100,
    totalLiquidity: Math.random() * 100000 + 10000,
    userShare: Math.random() * 2,
    fees24h: Math.random() * 50 + 5
  }));

  const getTokenBalance = (symbol: string) => {
    return tokens.find(t => t.symbol === symbol)?.balance || 0;
  };

 

  const handleAmount1Change = (value: string) => {
    setAmount1(value);
    
  };

  const handleToken1Change = (newToken1: string) => {
    setToken1(newToken1);
    const availableToken2s = getAvailableToken2Options(newToken1);
    if (availableToken2s.length > 0 && availableToken2s[0]) {
      setToken2(availableToken2s[0].symbol);
    }
    setAmount1('');
    setAmount2('');
  };

  const handleToken2Change = (newToken2: string) => {
    setToken2(newToken2);
    setAmount1('');
    setAmount2('');
  };

  useEffect(() => {
    const poolExists = checkPoolExists(token1, token2);
    setPoolExists(poolExists);
    if (!poolExists) {
      setAmount2('');
    } 
  }, [token1, token2, amount1]);

  const availableToken1Options = getAvailableToken1Options();
  const availableToken2Options = getAvailableToken2Options(token1);

 const  getLiquidID =async(poolid,token1,token2)=>{
    const SWAP_CONTRACT=await SWAP_CONTRACT_INSTANCE()
    const LIQUID_ID=await SWAP_CONTRACT.liquidIndex(poolid);
    
  
     const xLIQUID_ID=Number(LIQUID_ID)
      
       
        const id=`Your Liquid ID for ${token1}/${token2} is ${xLIQUID_ID}`;
       
          toast.success(id, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        
  
     
  }

  const ApproveToken1=async()=>{
   
    try{
      const TEST_TOKEN_CONTRACT= await TEST_TOKEN_CONTRACT_INSTANCE(token1Address);  
     const approveSpending =await TEST_TOKEN_CONTRACT.approve(CONTRACT_ADDRESSES.swapAddress,amount1inWei); 
     console.log(`Loading - ${approveSpending.hash}`);
     setApprove1(true)
      await approveSpending.wait();
    console.log(`Success - ${approveSpending.hash}`);
    setApprove1(false)
    setHasApprovedOne(true)
    }catch(error){
     setApprove1(false)
     console.log(error)
    }
   }

  const ApproveToken2=async()=>{
   
   try{
     const TEST_TOKEN_CONTRACT= await TEST_TOKEN_CONTRACT_INSTANCE(token2Address);  
    const approveSpending =await TEST_TOKEN_CONTRACT.approve(CONTRACT_ADDRESSES.swapAddress,amount2Rate); 
    console.log(`Loading - ${approveSpending.hash}`);
    setApprove2(true)
     await approveSpending.wait();
   console.log(`Success - ${approveSpending.hash}`);
   setApprove2(false)
   setHasApprovedTwo(true)
   }catch(error){
    setApprove2(false)
    console.log(error)
   }
  }

  const AddLiquidity = async () => {
   
      const SWAP_CONTRACT = await SWAP_CONTRACT_INSTANCE();
      const POOL_ID = await SWAP_CONTRACT.findPool(token1Address, token2Address);
      console.log(POOL_ID)
      
      if(Number(POOL_ID) ==  0) return;

     if(isNativeToken(token1Address)){
      try{    

const ADD_LIQUID=await SWAP_CONTRACT.provideLiquidity(POOL_ID, amount1inWei, {
          value: amount1inWei,
        });
       setIsAddLiquid(true) 

         
         console.log(`Loading - ${ADD_LIQUID.hash}`);
              await ADD_LIQUID.wait();
              console.log(`Success - ${ADD_LIQUID.hash}`);
              setIsAddLiquid(false);
               setHasApprovedOne(false);
               setHasApprovedTwo(false);
               setApprove1(false);
               setApprove2(false);
                getLiquidID(POOL_ID, token1 ,token2);
              
     }catch(error){
      setIsAddLiquid(false);
    console.log(error)
    }    
     }else{
      try{
        const ADD_LIQUID=await SWAP_CONTRACT.provideLiquidity(POOL_ID, amount1inWei);
               setIsAddLiquid(true) 
        
                 
                 console.log(`Loading - ${ADD_LIQUID.hash}`);
                      await ADD_LIQUID.wait();
                      console.log(`Success - ${ADD_LIQUID.hash}`);
                      setIsAddLiquid(false);
                      
               setHasApprovedOne(false);
               setHasApprovedTwo(false);
               setApprove1(false);
               setApprove2(false);
                     getLiquidID(POOL_ID, token1 , token2);
                      
             }catch(error){
              setIsAddLiquid(false);
            console.log(error)
            }


     }
     
  
  };

const setMaxAmount1 = () => {
  setAmount1(Bal1.toString());  
}

    const REMOVE_LIQUID=async()=>{
      try{
        const SWAP_CONTRACT= await SWAP_CONTRACT_INSTANCE();  
       const REMOVE_LIQUID =await SWAP_CONTRACT.removeLiquidity(liquidID); 
       console.log(`Loading - ${REMOVE_LIQUID.hash}`);
       setIsRemoveLiquid(true)
        await REMOVE_LIQUID.wait();
      console.log(`Success - ${REMOVE_LIQUID.hash}`);
      setIsRemoveLiquid(false)
      }catch(error){
       setIsRemoveLiquid(false)
       console.log(error)
      }

      
    }


  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8 space-y-8">

    {/* Back to Swap Button */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBackToSwap}
          className="flex items-center space-x-2 text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Swap</span>
        </button>
     
      </div>

    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Liquidity</h1>
        <p className="text-stone-600">Add liquidity to earn fees from swaps</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-stone-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('add')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'add'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Add Liquidity
        </button>
        <button
          onClick={() => setActiveTab('remove')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'remove'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Remove Liquidity
        </button>
        <button
          onClick={() => setActiveTab('pools')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'pools'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Your Pools
        </button>
      </div>

     {activeTab === 'add' && (
     <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 mx-4">
  <h3 className="text-lg font-semibold text-stone-800 mb-4">Add Liquidity</h3>
  
  <div className="space-y-4">
    {/* Token 1 */}
    <div className="bg-stone-50 rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-stone-600 text-sm">Token 1</span>
        {address && !isNaN(Bal1) && (
          <span className="text-stone-500 text-sm">
            Balance: {Bal1} {token1}
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*[.,]?[0-9]*"
          value={amount1}
          onChange={(e) => handleAmount1Change(e.target.value)}
          disabled={!isConnected}
          className="w-40 text-2xl font-semibold bg-transparent border-none outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder={isConnected ? "0.0" : "Connect wallet"}
        />
        
        <div className="flex items-center space-x-2 ml-6">
          {tokens.find(t => t.symbol === token1)?.img && (
            <img
              src={tokens.find(t => t.symbol === token1)?.img}
              alt={token1}
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <select
            value={token1}
            onChange={(e) => handleToken1Change(e.target.value)}
            disabled={!isConnected}
            className="bg-white border border-stone-300 rounded-lg px-3 py-2 font-medium min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {availableToken1Options.map(token => (
              <option key={token.symbol} value={token.symbol}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <button 
        onClick={setMaxAmount1}
        className="text-terracotta text-sm mt-2 hover:underline"
        disabled={!isConnected}
      >
        Max
      </button>
    </div>

    <div className="flex justify-center">
      <Plus className="w-5 h-5 text-stone-400" />
    </div>

    {/* Token 2 */}
    <div className="bg-stone-50 rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-stone-600 text-sm">Token 2</span>
        {address && !isNaN(Bal2) && (
          <span className="text-stone-500 text-sm">
            Balance: {Bal2} {token2}
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*[.,]?[0-9]*"
          value={amount2}
          readOnly
          className="w-40 text-2xl font-semibold bg-transparent border-none outline-none text-stone-800"
          placeholder="0.0"
        />
        
        <div className="flex items-center space-x-2 ml-6">
          {tokens.find(t => t.symbol === token2)?.img && (
            <img
              src={tokens.find(t => t.symbol === token2)?.img}
              alt={token2}
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <select
            value={token2}
            onChange={(e) => handleToken2Change(e.target.value)}
            className="bg-white border border-stone-300 rounded-lg px-3 py-2 font-medium min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={availableToken2Options.length === 0 || !isConnected}
          >
            {availableToken2Options.map(token => (
              <option key={token?.symbol} value={token?.symbol}>
                {token?.symbol}
              </option>
            ))}
            {availableToken2Options.length === 0 && (
              <option value="">No pools available</option>
            )}
          </select>
        </div>
      </div>
    </div>
  </div>

  {/* Pool Status Warning */}
  {!poolExists && (
    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-3">
      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-amber-800 font-medium text-sm">No Liquidity Pool</p>
        <p className="text-amber-700 text-sm">
          There's no existing liquidity pool for {token1}/{token2}. 
          Please select tokens with available pools.
        </p>
      </div>
    </div>
  )}

  {/* Real Pool Balances Info */}
  {isConnected && poolBal1 !== null && poolBal2 !== null && (
    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
      <div className="flex items-center space-x-2 mb-2">
        <Info className="w-4 h-4 text-green-600" />
        <span className="text-green-800 font-medium text-sm">Current Pool Liquidity</span>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-green-700">{token1} in Pool:</span>
          <span className="font-medium text-green-800">{poolBal1?.toFixed(6) || '0'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-green-700">{token2} in Pool:</span>
          <span className="font-medium text-green-800">{poolBal2?.toFixed(6) || '0'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-green-700">Total Pool Value:</span>
          <span className="font-medium text-green-800">{((poolBal1 || 0) + (poolBal2 || 0)).toFixed(6)}</span>
        </div>
      </div>
    </div>
  )}

  {/* Available Pools Info */}
  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
    <div className="flex items-center space-x-2 mb-2">
      <Info className="w-4 h-4 text-blue-600" />
      <span className="text-blue-800 font-medium text-sm">Available Pools</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {getAllLiquidityPools().map(pool => (
        <span key={pool} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
          {pool}
        </span>
      ))}
    </div>
  </div>

  {amount1 && poolExists && isConnected && (
    <div className="mt-6 p-4 bg-stone-50 rounded-xl">
      <div className="flex items-center space-x-2 mb-3">
        <Info className="w-4 h-4 text-stone-500" />
        <span className="text-stone-600 text-sm font-medium">Liquidity Details</span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-stone-600">Pool Share</span>
          <span className="font-medium">
            {poolBal1 && poolBal2 && amount1 && amount2 ? 
              `~${(((parseFloat(amount1) + parseFloat(amount2)) / ((poolBal1 + poolBal2) + (parseFloat(amount1) + parseFloat(amount2)))) * 100).toFixed(3)}%` : 
              '~0.01%'
            }
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-600">LP Tokens</span>
          <span className="font-medium">
            {amount1 && amount2 ? 
              Math.sqrt(parseFloat(amount1) * parseFloat(amount2)).toFixed(6) : 
              '0'
            }
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-600">Estimated APY</span>
          <span className="font-medium text-green-600">15.2%</span>
        </div>
      </div>
    </div>
  )}

  {/* Loading state */}
  {isEstimate && (
    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
        <span className="text-yellow-800 text-sm">Calculating optimal amount...</span>
      </div>
    </div>
  )}

  {/* Approval Section */}
  <div className="approval-section">
    {/* Token 1 Approval - only if ERC20 */}
    {!token1IsNative && (
      <button 
        className="w-full mt-6 bg-gradient-to-r from-terracotta to-sage text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={ApproveToken1}
        disabled={isApprove1 || hasApproveOne || !amount1}
      >
        {isApprove1 ? 'Approving...' : 
         hasApproveOne ? '✓ Approved' : 
         `Approve ${token1}`}
      </button>
    )}
    
    {/* Token 2 Approval - only if ERC20 */}
    {!token2IsNative && (
      <button 
        className="w-full mt-6 bg-gradient-to-r from-terracotta to-sage text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={ApproveToken2}
        disabled={isApprove1 || hasApproveTwo || !amount2Rate}
      >
        {isApprove2 ? 'Approving...' : 
         hasApproveTwo ? '✓ Approved' : 
         `Approve ${token2}`}
      </button>
    )}
  </div>
  
  {/* Main Action Button */}
  <button 
    onClick={AddLiquidity}
    className="w-full mt-6 bg-gradient-to-r from-terracotta to-sage text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    disabled={
      isAddLiquid ||
      !isConnected || 
      !poolExists || 
      !amount1 || 
      isEstimate ||
      (!token1IsNative && !hasApproveOne) ||
      (!token2IsNative && !hasApproveTwo)
    }
  >
    {isAddLiquid ? 'Adding Liquid...' :
     !isConnected ? 'Connect Wallet' :
     !poolExists ? 'Pool not available' :
     !amount1 ? 'Enter amount' :
     isEstimate ? 'Calculating...' :
     (!token1IsNative && !hasApproveOne) ? `Approve ${token1} First` :
     (!token2IsNative && !hasApproveTwo) ? `Approve ${token2} First` :
     'Add Liquidity'}
  </button>
</div>
        
      )}
    </div>

    {activeTab === 'pools' && (
       <div className="space-y-4">
  {loading ? (
    <div className="text-center py-8 text-stone-600">
      <p>Loading liquidity pools...</p>
    </div>
  ) : userLiquidityPools.length === 0 ? (
    <div className="text-center py-8 text-stone-600">
      <p>No liquidity pools available</p>
    </div>
  ) : (
    userLiquidityPools.map((pool, index) => (
      <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-terracotta to-sage rounded-full flex items-center justify-center">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-800">{pool.pair}</h3>
              <p className="text-stone-600 text-sm">
                {parseFloat(pool.userShare) > 0 
                  ? `${pool.userShare}% pool share` 
                  : 'Available for liquidity'
                }
              </p>
            </div>
          </div>
          <div className="text-right">
          
           
          </div>
        </div>
        
{/* Token breakdown */}
<div className="grid grid-cols-2 gap-4 mb-4 text-sm bg-stone-50 rounded-lg p-3">
  <div>
    <p className="text-stone-600">{pool.tokenA.symbol}</p>
    <p className="font-medium">
      {parseFloat(pool.tokenA.amount) > 0 
        ? `${pool.tokenA.amount.toFixed(6)} (Your position)`
        : `${pool.tokenA.poolBalance.toFixed(2)} (Pool balance)`
      }
    </p>
    <p className="text-xs text-stone-500">
      ${parseFloat(pool.tokenA.amount) > 0 
        ? pool.tokenA.usdValue.toFixed(2)
        : pool.tokenA.poolUsdValue.toFixed(2)
      }
    </p>
  </div>
  <div>
    <p className="text-stone-600">{pool.tokenB.symbol}</p>
    <p className="font-medium">
      {parseFloat(pool.tokenB.amount) > 0 
        ? `${pool.tokenB.amount.toFixed(6)} (Your position)`
        : `${pool.tokenB.poolBalance.toFixed(2)} (Pool balance)`
      }
    </p>
    <p className="text-xs text-stone-500">
      ${parseFloat(pool.tokenB.amount) > 0 
        ? pool.tokenB.usdValue.toFixed(2)
        : pool.tokenB.poolUsdValue.toFixed(2)
      }
    </p>
  </div>
</div>

<div className="text-sm">
  <div className="text-center py-2">
    <p className="text-stone-600 mb-1">Total Pool Liquidity</p>
    <p className="font-semibold text-stone-800 text-base">
      ${pool.totalLiquidity.toLocaleString(undefined, {
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2
      })}
    </p>
  </div>
</div> 
        
      </div>
    ))
  )}
</div>
      )}

      {activeTab === 'remove' && (
         <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 mx-4">
          <h3 className="text-lg font-semibold text-stone-800 mb-4">Add Liquidity</h3>
          
          <div className="space-y-4">
            {/* Token 1 */}
            <div className="bg-stone-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-stone-600 text-sm">Liquidity ID</span>
             
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={liquidID}
                  onChange={(e) => setLiquidID(e.target.value)}
                  disabled={!isConnected}
                  className="flex-1 text-2xl font-semibold bg-transparent border-none outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={isConnected ? "0" : "Connect wallet to enter amount"}
                />
                
               
              </div>
            </div>

        

          
          </div>

      

         

          {/* Available Pools Info */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 font-medium text-sm">Available Pools</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {getAllLiquidityPools().map(pool => (
                <span key={pool} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  {pool}
                </span>
              ))}
            </div>
          </div>

         
      
      {/* Main Action Button */}
  <button 
  disabled={isRemoveLiquid || !isConnected || !liquidID}
  onClick={REMOVE_LIQUID}
  className="w-full mt-6 bg-gradient-to-r from-terracotta to-sage text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"

>
  {isRemoveLiquid ? 'Removing Liquidity...': 'Remove Liquidity'}
</button>

    </div>
      )}


      <ToastIndex/>
    </div>
    
  );
};

export default LiquidityInterface;
