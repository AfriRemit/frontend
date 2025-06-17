import OpenAI from 'openai';

// Configure OpenRouter client
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '<OPENROUTER_API_KEY>',
  defaultHeaders: {
    'HTTP-Referer': import.meta.env.VITE_SITE_URL || 'https://afriremit.com',
    'X-Title': 'AfriRemit - AI Assistant',
  },
  dangerouslyAllowBrowser: true,
});

// System prompt for AfriRemit-specific context
const AFRIREMIT_SYSTEM_PROMPT = `You are the AfriRemit AI Assistant, an expert in blockchain technology, cryptocurrency, DeFi, and the AfriRemit platform specifically. You have deep knowledge about:

**AfriRemit Platform:**
- First Global DEX for African Stablecoins built on Lisk Blockchain
- Supported tokens: AFX, cNGN (Nigerian Naira), cZAR (South African Rand), cGHS (Ghanaian Cedi), cKES (Kenyan Shilling), USDT, WETH, AFR
- Core features: Token swapping, Digital savings groups (Ajo/Esusu), Send money, Faucet, Buy/Sell, Utility payments
- Smart contract addresses on Lisk Sepolia testnet
- Agent system for managing savings groups with invite codes
- Liquidity provision and LP token rewards

**Blockchain & DeFi Expertise:**
- Lisk blockchain technology and ecosystem
- Cross-border stablecoin transactions
- Liquidity pools and automated market makers (AMM)
- Yield farming and staking mechanisms
- Smart contract security and best practices
- Web3 wallet integration (MetaMask, WalletConnect)

**African Financial Context:**
- Traditional savings systems (Ajo, Esusu, Tontine)
- Cross-border remittances in Africa
- Mobile money integration
- Financial inclusion challenges and solutions
- Regulatory considerations across African markets

**Communication Style:**
- Be helpful, professional, and knowledgeable
- Use clear explanations for complex blockchain concepts
- Provide step-by-step guidance when needed
- Reference specific AfriRemit features when relevant
- Be encouraging about financial inclusion and DeFi adoption
- Always prioritize user security and best practices

**Key Guidelines:**
- Always verify smart contract addresses before transactions
- Remind users about testnet vs mainnet differences
- Emphasize the importance of seed phrase security
- Explain gas fees and transaction costs clearly
- Highlight the benefits of decentralized finance for Africa

Respond as a knowledgeable, helpful assistant focused on empowering users with blockchain and AfriRemit platform knowledge.`;

/**
 * Send a message to OpenRouter API and get AI response
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} model - Model to use (default: openai/gpt-4o)
 * @returns {Promise<string>} - AI response text
 */
export const getAIResponse = async (messages, model = 'openai/gpt-4o') => {
  try {
    // Prepare messages with system prompt
    const messagesWithSystem = [
      {
        role: 'system',
        content: AFRIREMIT_SYSTEM_PROMPT
      },
      ...messages
    ];

    const completion = await openai.chat.completions.create({
      model: model,
      messages: messagesWithSystem,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    
    // Handle different error types
    if (error.status === 401) {
      throw new Error('Invalid API key. Please check your OpenRouter configuration.');
    } else if (error.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    } else if (error.status >= 500) {
      throw new Error('OpenRouter service temporarily unavailable. Please try again.');
    } else {
      throw new Error('Failed to get AI response. Please try again.');
    }
  }
};

/**
 * Get a quick response for common AfriRemit queries
 * @param {string} query - User query
 * @returns {Promise<string>} - AI response
 */
export const getQuickAfriRemitResponse = async (query) => {
  const messages = [
    {
      role: 'user',
      content: query
    }
  ];
  
  return await getAIResponse(messages);
};

/**
 * Get contextual help based on current page/feature
 * @param {string} context - Current page context (e.g., 'swap', 'savings', 'dashboard')
 * @param {string} userQuestion - User's specific question
 * @returns {Promise<string>} - Contextual AI response
 */
export const getContextualHelp = async (context, userQuestion) => {
  const contextPrompts = {
    swap: "The user is currently on the AfriRemit swap page where they can exchange African stablecoins and other tokens. They can add liquidity to pools and earn rewards.",
    savings: "The user is on the AfriRemit savings (Ajo/Esusu) page where they can join or create traditional rotating savings groups with smart contract automation.",
    dashboard: "The user is viewing their AfriRemit dashboard with wallet balances, exchange rates, and portfolio overview.",
    send: "The user is on the send money page for transferring tokens to other addresses.",
    faucet: "The user is using the testnet faucet to get test tokens for trying out AfriRemit features.",
    buysell: "The user is on the buy/sell page for converting between fiat and cryptocurrencies."
  };

  const messages = [
    {
      role: 'user',
      content: `Context: ${contextPrompts[context] || 'General AfriRemit platform usage'}\n\nUser Question: ${userQuestion}`
    }
  ];
  
  return await getAIResponse(messages);
};

/**
 * Check if OpenRouter API is properly configured
 * @returns {boolean} - Configuration status
 */
export const isConfigured = () => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  return apiKey && apiKey !== '<OPENROUTER_API_KEY>' && apiKey.length > 10;
};

/**
 * Get available models from OpenRouter
 * @returns {Promise<Array>} - Array of available models
 */
export const getAvailableModels = async () => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      },
    });
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch models:', error);
    return [];
  }
};

export default {
  getAIResponse,
  getQuickAfriRemitResponse,
  getContextualHelp,
  isConfigured,
  getAvailableModels
};