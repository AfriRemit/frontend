import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Settings, Info, X, Droplets, Plus, DollarSign } from 'lucide-react';
 import tokens from '@/lib/Tokens/tokens';
import { addTokenToMetamask } from '@/lib/utils.ts';
import { useContractInstances } from '@/provider/ContractInstanceProvider';
import { roundToTwoDecimalPlaces, roundToFiveDecimalPlaces } from '../lib/utils';




// Faucet Component - Your exact original logic
const FaucetComponent = () => {
  const { isConnected, TEST_TOKEN_CONTRACT_INSTANCE, fetchBalance, address } = useContractInstances();
 
  const [fromToken, setFromToken] = useState('AFR');
  const [isFaucet, setFaucet] = useState(false);
  const [toToken, setToToken] = useState('AFR');
  const token1Address = tokens.find(t => t.symbol === fromToken)?.address;
  const token2Address = tokens.find(t => t.symbol === toToken)?.address;

  const [token1Amount, setToken1Amount] = useState(null);
  const [Bal1, setBal1] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching balances and rates...', token1Address, token2Address);
        const bal1 = await fetchBalance(token1Address);
      
     
       const roundedBal1 = bal1 ? roundToTwoDecimalPlaces(bal1) : 0;
       
            
        setBal1(roundedBal1);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [isConnected, fromToken, Bal1, token1Address, token2Address, fetchBalance]);

  const getFaucet = async () => {
    try {
      const TOKEN_CONTRACT = await TEST_TOKEN_CONTRACT_INSTANCE(token1Address);
      const GET_FAUCET = await TOKEN_CONTRACT.faucet(token1Amount);
      setFaucet(true);
      console.log(`Loading - ${GET_FAUCET.hash}`);
      await GET_FAUCET.wait();
      console.log(`Success - ${GET_FAUCET.hash}`);
      setFaucet(false);
    } catch (error) {
      setFaucet(false);
      console.log(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Faucet</h1>
        <p className="text-stone-600">Get AfriRemit Testnet Tokens</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <div className="space-y-4">
          <div className="bg-stone-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              {address && !isNaN(Bal1) && (
                <span className="text-stone-500 text-sm">
                  Balance: {Bal1} {fromToken}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="number"
                disabled={!isConnected}
                value={token1Amount}
                onChange={(e) => setToken1Amount(e.target.value)}
                className="flex-1 text-2xl font-semibold bg-transparent border-none outline-none"
                placeholder="0.0"
              />
              
              <select
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
                className="bg-white border border-stone-300 rounded-lg px-3 py-2 font-medium"
              >
                {tokens
  .filter(token => token.symbol !== 'ETH' && token.symbol !== 'AFX')
  .map(token => (
    <option key={token.symbol} value={token.symbol}>
      {token.symbol}
    </option>
  ))}

              </select>
            </div>
            
            <button 
              disabled={true}
              className="text-terracotta text-sm mt-2 hover:underline"
            >
              Max Faucet: 100 {fromToken}
            </button>
          </div>
        </div>

        <button
          disabled={!isConnected || !token1Amount || isFaucet}
          onClick={getFaucet}
          className="w-full mt-6 bg-gradient-to-r from-terracotta to-sage text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFaucet ? 'Getting Faucet' : 'Get Faucet'}
        </button>

        <button
          onClick={() => addTokenToMetamask(token1Address, fromToken, 18)}
          className="w-full mt-6 bg-gradient-to-r from-terracotta to-sage text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Metamask
        </button>
      </div>
    </div>
  );
};



export default FaucetComponent;
