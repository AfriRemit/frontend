# AfriRemit Frontend 🌍

> **The First Global DEX for African Stablecoins** - Built on Lisk Blockchain

AfriRemit Frontend is a comprehensive DeFi application interface that connects African and international financial markets through innovative blockchain solutions. Our platform enables seamless cross-border transactions, traditional savings groups, and real-world utility payments using African and international stablecoins.

## 🎯 Platform Overview

AfriRemit Frontend provides an intuitive interface for the **first decentralized exchange (DEX) built on the Lisk blockchain** that enables **global access** to African and international stablecoins. The application features:

- 🏠 **Dashboard** - Comprehensive wallet balance view and exchange rates
- 🔄 **Token Swapping** - Cross-border stablecoin swaps with liquidity provision
- 💰 **Digital Savings Groups** - Traditional Ajo/Esusu with smart contract automation
- 💸 **Send Money** - Seamless native and ERC20 token transfers
- 🚰 **Faucet** - Testnet token minting for seamless testing
- 🏦 **Buy/Sell** - On-ramp/off-ramp for fiat-crypto conversions
- ⚡ **Utility Payments** - Bill payments, airtime, and service transactions
- 👨‍💼 **Admin Panel** - Pool management and price setting

---

## 🖥️ Application Interface Structure

### 📊 Dashboard
The main interface displaying:
- **Local Stablecoin Balances**: cNGN, cKES, cZAR, cGHS, AFX
- **Live Exchange Rates**: Real-time USD conversion rates
- **Portfolio Overview**: Total balance across all supported tokens
- **Activity Summary**: Recent transactions and interactions

### 🔄 Swap Interface
Complete DEX functionality with two main tabs:

#### **Swap Tab**
- **Token Selection**: Choose from all supported African and international stablecoins
- **Amount Input**: Specify swap amounts with slippage protection
- **Exchange Rate Display**: Real-time conversion rates
- **Transaction Preview**: Fee breakdown and expected output

#### **Liquidity Tab**
- **Add Liquidity**: Contribute to existing pools (e.g., cNGN/cZAR)
- **Remove Liquidity**: Withdraw LP tokens and reclaim assets
- **Pool Overview**: View all available liquidity pools with balances
- **LP Token Rewards**: Earn AFR tokens from swap fees
- **Pool Creation**: Create new trading pairs when needed

**Example Pool Display:**
```
cNGN/cZAR Pool
Balance: 150,000 cNGN / 15,000 cZAR
Your Share: 5.2%
Earned Fees: 45.2 AFR
```

### 💰 Save (Ajo/Esusu)
Traditional rotating savings with modern security features:

#### **For Agents**
- **Create Group**: Set up new savings groups with custom parameters
- **Group Management**: Monitor active groups and member contributions
- **Invite Code Generation**: Share secure codes with trusted members
- **Reputation Dashboard**: Track success rate and earnings

#### **For Users**
- **Join Group**: Enter invite codes to join trusted savings circles
- **Contribution Tracking**: Monitor payment schedules and amounts
- **Payout Calendar**: View when you'll receive group payouts
- **History**: Track completed and active groups

**User Dashboard Example:**
```
Welcome back, Nasir!

Total Contributions: 8.00 AFX
Across 3 active groups

Active Groups: 3
Completed: 1

Reputation Score: 85/100
Status: Good standing
```

**Available Actions:**
- **Create Group** (Agents only)
- **My Groups** - View all participated groups
- **Join Group** - Enter invite code to join available groups

### 💸 Send Money
Simple and secure token transfer interface:
- **Recipient Address**: Input destination wallet address
- **Token Selection**: Choose from native currency or any ERC20 token
- **Amount Input**: Specify transfer amount with balance verification
- **Transaction Preview**: Gas fees and confirmation details
- **Address Book**: Save frequently used addresses

### 🚰 Faucet
Testnet token distribution for seamless testing:
- **Token Selection**: Mint test versions of supported stablecoins
- **Amount Limits**: Controlled distribution to prevent abuse
- **Balance Check**: Verify current testnet token balances

**Available Testnet Tokens:**
- USDT, WETH, AFR, AFX, cNGN, cZAR, cGHS, cKES

### 🏦 Buy/Sell (On-Ramp/Off-Ramp)
Fiat-crypto conversion interface:

#### **Currently Supported:**
- **NGN ↔ AFX**: Nigerian Naira to AfriRemit stablecoin
- **NGN ↔ cNGN**: Nigerian Naira to cNGN stablecoin


**Interface Features:**
- **Buy Tab**: Convert fiat to stablecoins
- **Sell Tab**: Convert stablecoins to fiat
- **Rate Display**: Real-time conversion rates
- **Payment Methods**: Bank transfer and mobile money integration
- **Transaction Limits**: KYC-based limits and verification

### ⚡ Utility Payment (Upcoming Feature)
Bill payment and service transactions:

#### **Available Services:**
```
Airtime Recharge
• Buy airtime for mobile phones
• Fee: 1%

Electricity Bills  
• Pay electricity bills instantly
• Fee: 0.5%

Internet Data
• Buy internet data bundles  
• Fee: 1%

Cable TV
• Pay for cable TV subscriptions
• Fee: 0.5%

Exam PINs
• Buy exam result checker PINs
• Fee: 0.2%
```

**Interface Features:**
- **Service Selection**: Choose from available utility services
- **Provider Selection**: Select specific service providers
- **Payment Token**: Choose payment method (AFX, cNGN, etc.)


### 👨‍💼 Admin Panel
Administrative interface for platform management:

#### **Pool Management:**
- **Create Pools**: Add new trading pairs


#### **Price Management:**
- **Oracle Settings**: Configure price feed sources
- **Manual Price Updates**: Set mock token prices for testing

---

## 🎨 User Experience Features

### Navigation Structure
```
Primary Navigation:
Dashboard → Send Money → Swap → Save → Faucet → Buy/Sell → Admin → UtilityPay
```



### User Authentication
- **Wallet Connection**: MetaMask, WalletConnect integration
- **User Profiles**: Save preferences and transaction history

### Real-Time Updates
- **Live Prices**: Real-time token price updates
- **Balance Sync**: Automatic wallet balance updates

---

## 🛠️ Technical Implementation

### Frontend Stack
```javascript
// Core Technologies
React.js          // Primary framework
TypeScript        // Type safety
TailwindCSS       // Styling and design system
Web3.js / Ethers  // Blockchain interaction

```

### Smart Contract Integration
```javascript
// Contract Addresses (Lisk Sepolia)
const CONTRACTS = {
  Savings: "0x...",      // AjoEsusu contract
  Swap: "0x...",         // AfriSwap DEX
  AfriStable: "0x...",   // AFX stablecoin
  PriceFeed: "0x..."     // Price oracle
};

// Supported Tokens
const TOKENS = {
  "0x88a4e1125FF42e0010192544EAABd78Db393406e": "USDT",
  "0xa01ada077F5C2DB68ec56f1a28694f4d495201c9": "WETH", 
  "0x207d9E20755fEe1924c79971A3e2d550CE6Ff2CB": "AFR",
  "0xc5737615ed39b6B089BEDdE11679e5e1f6B9E768": "AFX",
  "0x278ccC9E116Ac4dE6c1B2Ba6bfcC81F25ee48429": "cNGN",
  "0x1255C3745a045f653E5363dB6037A2f854f58FBf": "cZAR",
  "0x19a8a27E066DD329Ed78F500ca7B249D40241dC4": "cGHS",
  "0x291ca1891b41a25c161fDCAE06350E6a524068d5": "cKES"
};
```

---

## 🎯 User Workflows

### New User Onboarding
1. **Connect Wallet** → Connect MetaMask or compatible wallet
2. **Get Test Tokens** → Use faucet to mint testnet tokens
3. **Explore Dashboard** → View balances and exchange rates
4. **Try Swapping** → Make first token swap
5. **Join Savings Group** → Find agent and join with invite code

### Agent Workflow
1. **Register as Agent** → Complete agent registration
2. **Create Savings Group** → Set up group parameters
3. **Generate Invite Codes** → Share with trusted members
4. **Manage Groups** → Monitor contributions and payouts
5. **Build Reputation** → Successfully complete groups

### Trader Workflow
1. **Check Liquidity** → View available trading pairs
2. **Add Liquidity** → Contribute to pools for rewards
3. **Execute Swaps** → Trade between stablecoins

---

## 🔧 Development Setup

### Prerequisites
```bash
Node.js >= 16.0.0
npm or yarn
MetaMask browser extension
Git
```

### Installation
```bash
# Clone the repository
git clone https://github.com/AfriRemit/frontend.git
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env

# Start development server
npm run dev
```

### Environment Variables
```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_66..
VITE_THIRDWEB_CLIENT_ID=..
```

### Build and Deploy
```bash
# Build for production
npm run build

# Start production server
npm start


```


---

## 🤝 Contributing

### Pull Request Process
1. **Fork Repository** → Create personal fork
2. **Create Branch** → Feature/bugfix branch
3. **Write Tests** → Add comprehensive tests
4. **Update Documentation** → Keep docs current
5. **Submit PR** → Detailed pull request description

---


### Developer Resources
- **Lisk Documentation**: https://lisk.com/documentation
- **Web3.js Guide**: https://web3js.readthedocs.io
- **React Documentation**: https://reactjs.org/docs
- **TailwindCSS**: https://tailwindcss.com/docs

---

## 🛣️ Roadmap & Future Development



## Phase 1: Core Platform Stabilization (Q2-Q3 2025)

### Q2 2025 (Current - Foundation Completion)
**Priority: Complete Core MVP**
- [x] AfriSwap DEX deployment on Lisk Sepolia
- [x] AFX stablecoin launch  
- [x] AjoEsusu savings groups with agent system
- [x] Dashboard with wallet integration
- [x] Basic swap interface
- [ ] **Critical Gap**: Comprehensive reputation system (essential for trust)
- [ ] **Critical Gap**: Live price feed integration (essential for accurate swaps)
- [ ] Enhanced security audits and bug fixes

### Q3 2025 (Mainnet Launch & Core Features)
**Priority: Production Readiness**
- [ ] AfriSwap DEX deployment on Lisk Mainnet
- [ ] Mainnet security audit completion
- [ ] Advanced AjoEsusu features (group insurance, flexible scheduling)
- [ ] Agent dashboard and management tools
- [ ] Multi-language support (English, Hausa, Yoruba, Igbo - Nigeria focus)
- [ ] Mobile money integration (start with major Nigerian providers)
- [ ] Basic analytics dashboard

## Phase 2: Feature Enhancement & Growth (Q4 2025)

### Q4 2025 (Market Expansion)
**Priority: User Growth & Retention**
- [ ] Advanced trading features (limit orders, stop-loss)
- [ ] Utility payment integration (electricity, mobile airtime)
- [ ] Enhanced mobile app development
- [ ] Agent network expansion program
- [ ] Basic DeFi lending integrated with savings groups
- [ ] Cross-group lending pilot program
- [ ] User education and onboarding improvements

## Phase 3: Ecosystem Development (Q1-Q2 2026)

### Q1 2026 (Platform Maturity)
**Priority: Ecosystem Building**
- [ ] Additional African stablecoins (cUGX, cTZS) - start with 1-2 markets
- [ ] NFT marketplace integration (focus on utility NFTs)
- [ ] Insurance products for savings groups
- [ ] Enterprise API suite (basic version)
- [ ] Advanced analytics and reporting
- [ ] Partnership integrations with local banks

### Q2 2026 (Advanced Features)
**Priority: Innovation & Differentiation**
- [ ] AI-powered savings recommendations
- [ ] Cross-chain bridge development (focus on major chains)
- [ ] Advanced DeFi yield farming features
- [ ] Institutional AjoEsusu products (pilot)
- [ ] API marketplace launch

## Phase 4: Scale & Global Expansion (Q3-Q4 2026)

### Q3-Q4 2026 (Global Ready)
**Priority: Scale & Expansion**
- [ ] Multi-chain deployment for savings groups
- [ ] Additional African market expansion (Ghana, Kenya)
- [ ] Advanced derivatives trading
- [ ] Global agent network establishment
- [ ] Enterprise-grade features and SLAs
- [ ] Regulatory compliance for multiple jurisdictions

---

## ⚠️ Important Notes


### Testnet Limitations
- **Test Tokens Only**: All tokens are testnet versions
- **Demo Timeframes**: Shortened time periods for demonstration
- **Limited Features**: Some features in development
- **Mock Data**: Some data sources use mock implementations

---

**AfriRemit Frontend** - *Bridging African Finance with Global DeFi* 🌍

> Built with ❤️ for financial inclusion and powered by modern web technologies on Lisk blockchain. 
> Providing the most intuitive interface for African stablecoin trading and traditional savings systems.

---

*This documentation is maintained by the AfriRemit frontend team. For technical support, please visit our [GitHub repository](https://github.com/AfriRemit/frontend)*
