import React, { useState, useEffect } from 'react';
import { Crown, UserPlus,Users, TrendingUp, Calendar, DollarSign, Clock, CheckCircle, Star, Shield, AlertCircle, Loader } from 'lucide-react';
import { CONTRACT_ADDRESSES, useContractInstances } from '@/provider/ContractInstanceProvider';
import tokens from '@/lib/Tokens/tokens';


const AjoEsusuInterface = () => {
  const [contributionAmount, setContributionAmount] = useState('');
  const [groupSize, setGroupSize] = useState(5);
  const [frequency, setFrequency] = useState('weekly');
  const [activeTab, setActiveTab] = useState('create');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAgent, setIsAgent] = useState(false);
const [agentContactInfo, setAgentContactInfo] = useState('');
const [showAgentRegistration, setShowAgentRegistration] = useState(false);

  
  // Contract state
  const [userInfo, setUserInfo] = useState(null);
  const [myGroups, setMyGroups] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [supportedTokens, setSupportedTokens] = useState([]);
  const [totalStats, setTotalStats] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userName, setUserName] = useState('');

  const [showInviteModal, setShowInviteModal] = useState(false);
const [selectedGroupId, setSelectedGroupId] = useState(null);
const [maxUses, setMaxUses] = useState(10);
const [validityDays, setValidityDays] = useState(30);

  
  const { isConnected, SAVING_CONTRACT_INSTANCE, TEST_TOKEN_CONTRACT_INSTANCE,AFRISTABLE_CONTRACT_INSTANCE, address } = useContractInstances();

  const frequencyOptions = [
    {value: 'five minute', label: 'Five-minute', seconds: 300 },
    { value: 'daily', label: 'Daily', seconds: 86400 },
    { value: 'weekly', label: 'Weekly', seconds: 604800 },
    { value: 'biweekly', label: 'Bi-weekly', seconds: 1209600 },
    { value: 'monthly', label: 'Monthly', seconds: 2592000 },
  ];

  // Get supported tokens (excluding ETH which is id: 1)
  const getSupportedTokens = () => {
    return tokens.filter(token => token.id > 1);
  };

  // Format token amounts
  const formatTokenAmount = (amountInWei, decimals = 18) => {
    if (!amountInWei) return '0';
    const divisor = Math.pow(10, decimals);
    return (parseFloat(amountInWei) / divisor).toFixed(2);
  };

  // Convert token amount to wei
  const toWei = (amount, decimals = 18) => {
    const multiplier = Math.pow(10, decimals);
    return (parseFloat(amount) * multiplier).toString();
  };

  // Get time remaining
  const getTimeRemaining = (timestamp) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = Number(timestamp) - now;
    
    if (remaining <= 0) return "Expired";
    
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  // Initialize contract data
  useEffect(() => {
    if (isConnected && address) {
      initializeData();
    }
  }, [isConnected, address]);

const initializeData = async () => {
  setIsLoading(true);
  try {
    const Saving_Contract = await SAVING_CONTRACT_INSTANCE();
    
    // Check if user is registered
    const registered = await Saving_Contract.isUserRegistered(address);
    setIsRegistered(registered);
    
    if (registered) {
      // Check if user is an agent
      const agentStatus = await Saving_Contract.isAjoAgent(address);
      setIsAgent(agentStatus);
      
      // Get user info
      const userMemberInfo = await Saving_Contract.getMemberInfo(address);
      console.log('userMemberInfo', userMemberInfo);
      setUserInfo(userMemberInfo);
      
      const name = await Saving_Contract.getUserName(address);
      setUserName(name);
      
      // Get user's groups
      const userGroupIds = await Saving_Contract.getUserGroups(address);
      const userGroupsData = await Promise.all(
        userGroupIds.map(async (groupId) => {
          const summary = await Saving_Contract.getGroupSummary(groupId);
          console.log('summarry',summary)

          const savingInfo= await Saving_Contract.savingsGroups(groupId);
          console.log('savingInfo',savingInfo)
          const contributionStatus = await Saving_Contract.getUserContributionStatus(groupId, address);
          
          // Get invite code for groups created by the user
          let inviteCode = "";
          if (summary[2] === address) {
            try {
              inviteCode = await Saving_Contract.groupInviteCode(groupId);
            } catch (error) {
              console.log(`No invite code for group ${groupId}`);
            }
          }
          
          return { 
            ...summary, 
            contributionStatus,
            inviteCode 
          };
        })
      );
      setMyGroups(userGroupsData);
    }
    
    // Get available groups
    const joinableGroups = await Saving_Contract.getJoinableGroups();
    setAvailableGroups(joinableGroups);
    
    // Get supported tokens
    const tokenData = await Saving_Contract.getSupportedTokens();
    setSupportedTokens(tokenData);
    
    // Get total stats
    const stats = await Saving_Contract.getTotalStats();
    console.log('total stats', stats)
    setTotalStats(stats);
    
    // Set supported tokens for UI
    setSelectedToken(getSupportedTokens()[0]?.address || '');
    
  } catch (error) {
    console.error('Error initializing data:', error);
    setErrorMessage('Failed to load contract data');
  }
  setIsLoading(false);
};

  const handleRegisterUser = async () => {
    if (!userName.trim()) return;
    
    setIsProcessing(true);
    try {
      const Saving_Contract = await SAVING_CONTRACT_INSTANCE();
      const tx = await Saving_Contract.registerUser(userName);
      await tx.wait();
      
      setIsRegistered(true);
      setSuccessMessage('Successfully registered! Welcome to AfriRemit Ajo/Esusu.');
      initializeData(); // Refresh data
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('Failed to register user');
    }
    setIsProcessing(false);
  };


   const handleRegisterUserAsAgent = async () => {
  if (!agentContactInfo.trim()) return;

  setIsProcessing(true);
  try {
    const Saving_Contract = await SAVING_CONTRACT_INSTANCE();
;

    // Then, register the user as an Ajo Agent
    const agentTx = await Saving_Contract.registerAsAjoAgent(userName, agentContactInfo);
    await agentTx.wait();

    setIsAgent(true);
    setShowAgentRegistration(false);
    setSuccessMessage('Successfully registered as an agent!');
    initializeData(); // Refresh data
  } catch (error) {
    console.error('Agent registration error:', error);
    setErrorMessage('Failed to register as agent');
  }
  setIsProcessing(false);
};
 

 

  const handleCreateGroup = async () => {
    if (!groupName || !contributionAmount || !selectedToken || parseFloat(contributionAmount) <= 0) return;
    
    setIsProcessing(true);
    try {
      const Saving_Contract = await SAVING_CONTRACT_INSTANCE();
      const freqData = frequencyOptions.find(f => f.value === frequency);
      const contributionInWei = toWei(contributionAmount);
      
      const tx = await Saving_Contract.createGroup(
        groupName,
        groupDescription || `${groupName} - A savings group`,
        selectedToken,
        contributionInWei,
        freqData.seconds,
        groupSize
      );
      
      const receipt = await tx.wait();
      
      // Extract group ID from events
      const groupCreatedEvent = receipt.events?.find(e => e.event === 'GroupCreated');
      const groupId = groupCreatedEvent?.args?.groupId;
      
      if (groupId) {
        // Generate invite code
        const inviteCodeTx = await Saving_Contract.generateInviteCode(groupId, 10, 7);
        await inviteCodeTx.wait();
        
        setSuccessMessage(`Successfully created "${groupName}" group! Share the invite code with members.`);
        setGroupName('');
        setGroupDescription('');
        setContributionAmount('');
        initializeData(); // Refresh data
      }
    } catch (error) {
      console.error('Group creation error:', error);
      setErrorMessage('Failed to create group');
    }
    setIsProcessing(false);
  };

  const handleJoinGroup = async (groupId) => {
    setIsProcessing(true);
    try {
      const Saving_Contract = await SAVING_CONTRACT_INSTANCE();
      let tx;
      
      if (inviteCode.trim()) {
        tx = await Saving_Contract.joinGroupWithCode(groupId, inviteCode);
      } else {
        // If no invite code, try direct join (if allowed)
        setErrorMessage('Invite code required to join group');
        setIsProcessing(false);
        return;
      }
      
      await tx.wait();
      setSuccessMessage('Successfully joined the group!');
      setInviteCode('');
      initializeData(); // Refresh data
    } catch (error) {
      console.error('Join group error:', error);
      setErrorMessage('Failed to join group');
    }
    setIsProcessing(false);
  };

  const handleContribute = async (groupId, tokenAddress,amount) => {
    setIsProcessing(true);
    console.log(groupId,tokenAddress,amount)
    try {

      const AFRI_Contract = await AFRISTABLE_CONTRACT_INSTANCE();
      const TOKEN_Contract= await TEST_TOKEN_CONTRACT_INSTANCE(tokenAddress);
      if(tokenAddress == '0xc5737615ed39b6B089BEDdE11679e5e1f6B9E768'){
       
        const tx = await AFRI_Contract.approve(CONTRACT_ADDRESSES.savingAddress,amount);
          await tx.wait();      
      }else{
    
        const tx = await TOKEN_Contract.approve(CONTRACT_ADDRESSES.savingAddress, amount);
        await tx.wait();   
      }

      const Saving_Contract = await SAVING_CONTRACT_INSTANCE();
      const tx = await Saving_Contract.contribute(groupId);
      await tx.wait();
      
      setSuccessMessage('Contribution made successfully!');
      initializeData(); // Refresh data
    } catch (error) {
      console.error('Contribution error:', error);
      setErrorMessage('Failed to make contribution');
    }
    setIsProcessing(false);
  };

  const handleClaimPayout = async (groupId) => {
    setIsProcessing(true);
    try {
      const Saving_Contract = await SAVING_CONTRACT_INSTANCE();
      const tx = await Saving_Contract.claimPayout(groupId);
      await tx.wait();
      
      setSuccessMessage('Payout claimed successfully!');
      initializeData(); // Refresh data
    } catch (error) {
      console.error('Claim payout error:', error);
      setErrorMessage('Failed to claim payout');
    }
    setIsProcessing(false);
  };

  const handleVerifyInviteCode = async () => {
  if (!inviteCode.trim()) return;
  
  setIsProcessing(true);
  setErrorMessage('');
  
  try {
    const Saving_Contract = await SAVING_CONTRACT_INSTANCE();
    const codeInfo = await Saving_Contract.getInviteCodeInfo(inviteCode.trim());
    
    // codeInfo returns: [agent, agentName, groupId, groupName, isActive, maxUses, currentUses, expiryTime]
    const [agent, agentName, groupId, groupName, isActive, maxUses, currentUses, expiryTime] = codeInfo;
    
    if (!isActive) {
      setErrorMessage('This invite code is no longer active');
       setIsProcessing(false);
      return;
    }
    
    // Check if code has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (expiryTime > 0 && currentTime > expiryTime) {
      setErrorMessage('This invite code has expired');
      return;
    }
    
    // Check if max uses reached
    if (maxUses > 0 && currentUses >= maxUses) {
      setErrorMessage('This invite code has reached its maximum usage limit');
      return;
    }
    
    // Show success message with group info
    setSuccessMessage(`Valid invite code! Group: ${groupName} (ID: ${groupId.toString()}) by ${agentName}`);
    
    // Optionally auto-fill the group selection or redirect to join the group
    // You might want to store the verified group info in state to use for joining
      setIsProcessing(false);
  } catch (error) {
    console.error('Verify invite code error:', error);
    setErrorMessage('Invalid invite code or verification failed');
      setIsProcessing(false);
  }
  
  setIsProcessing(false);
};
  const agentRegistrationSection = !isAgent && (
  <div className="bg-gradient-to-br from-sage/10 to-gold/10 rounded-xl p-6 mb-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-stone-800 mb-2">Become an Agent</h3>
        <p className="text-stone-600 text-sm">
          Create and manage groups as a trusted agent in the community.
        </p>
      </div>
      <button
        onClick={() => setShowAgentRegistration(true)}
        className="bg-gradient-to-r from-sage to-gold text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
      >
        Register as Agent
      </button>
    </div>
    
  
  </div>
);
  const getStatusColor = (isActive, isCompleted, canJoin) => {
    if (isCompleted) return 'text-stone-500 bg-stone-100';
    if (isActive) return 'text-emerald-600 bg-emerald-50';
    if (canJoin) return 'text-blue-600 bg-blue-50';
    return 'text-stone-600 bg-stone-100';
  };

  const getGroupStatus = (group) => {
    if (group.isCompleted) return 'Completed';
    if (group.isActive) return 'Active';
    if (group.canJoin) return 'Recruiting';
    return 'Full';
  };

  // Handler for generating invite code
const handleGenerateInviteCode = async (groupId) => {
  setIsProcessing(true);
  try {
    const Saving_Contract = await SAVING_CONTRACT_INSTANCE();
    
    const tx = await Saving_Contract.generateInviteCode(
      groupId,
      maxUses,
      validityDays
    );
    
    await tx.wait();
    
    // Close modal and reset values
    setShowInviteModal(false);
    setSelectedGroupId(null);
    setMaxUses(10);
    setValidityDays(30);
    
    // Refresh the groups data to show the new invite code
    await initializeData();
    
    setSuccessMessage('Invite code generated successfully!');
    
  } catch (error) {
    console.error('Error generating invite code:', error);
    setErrorMessage('Failed to generate invite code. Please try again.');
  }
  setIsProcessing(false);
};

// Handler for deactivating invite code
const handleDeactivateInviteCode = async (inviteCode) => {
  setIsProcessing(true);
  try {
    const Saving_Contract = await SAVING_CONTRACT_INSTANCE();
    
    const tx = await Saving_Contract.deactivateInviteCode(inviteCode);
    await tx.wait();
    
    // Refresh the groups data to reflect the deactivated code
    await initializeData();
    
    setSuccessMessage('Invite code deactivated successfully!');
    
  } catch (error) {
    console.error('Error deactivating invite code:', error);
    setErrorMessage('Failed to deactivate invite code. Please try again.');
  }
  setIsProcessing(false);
};

// Optional: Handler for copying invite code to clipboard
const handleCopyInviteCode = async (inviteCode) => {
  try {
    await navigator.clipboard.writeText(inviteCode);
    setSuccessMessage('Invite code copied to clipboard!');
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    setErrorMessage('Failed to copy invite code');
  }
};

  // Show loading screen
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-terracotta" />
          <p className="text-stone-600">Loading AfriRemit Ajo/Esusu data...</p>
        </div>
      </div>
    );
  }

  // Show connection prompt
  if (!isConnected) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-screen">
        <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
          <Shield className="w-16 h-16 text-terracotta mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Connect Your Wallet</h2>
          <p className="text-stone-600">Please connect your wallet to access AfriRemit Ajo/Esusu</p>
        </div>
      </div>
    );
  }

  // Show registration form if not registered
  if (!isRegistered) {
    return (
   <div className="max-w-md mx-auto mt-16">
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
      <div className="text-center mb-6">
        <Users className="w-16 h-16 text-terracotta mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-stone-800 mb-2">Welcome to AfriRemit Ajo/Esusu</h2>
        <p className="text-stone-600">Please register to get started</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>
        
        <div className="space-y-2">
          <button
            onClick={handleRegisterUser}
            disabled={!userName.trim() || isProcessing}
            className="w-full bg-gradient-to-r from-terracotta to-sage text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Registering...' : 'Register as User'}
          </button>
          
          <div className="text-center text-stone-500 text-sm">or</div>
          
          <button
            onClick={() => setShowAgentRegistration(true)}
            disabled={!userName.trim()}
            className="w-full bg-gradient-to-r from-sage to-gold text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Register as Agent
          </button>
        </div>
      </div>
    </div>
   
  </div>
    );
  }

  return (
    <>
      {/* Agent Registration Modal */}
    {showAgentRegistration && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <h3 className="text-xl font-bold text-stone-800 mb-4">Register as Agent</h3>
          <p className="text-stone-600 text-sm mb-6">
            As an agent, you can create groups and will be automatically added as a member.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Contact Information
              </label>
              <textarea
                value={agentContactInfo}
                onChange={(e) => setAgentContactInfo(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                placeholder="Phone, email, or other contact details"
                rows={3}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAgentRegistration(false)}
                className="flex-1 bg-stone-200 text-stone-700 py-3 rounded-xl font-semibold hover:bg-stone-300 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleRegisterUserAsAgent}
                disabled={!agentContactInfo.trim() || isProcessing}
                className="flex-1 bg-gradient-to-r from-sage to-gold text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Registering...' : 'Register'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">AfriRemit Ajo/Esusu</h1>
        <p className="text-stone-600">Traditional rotating savings with modern security</p>
        <p className="text-stone-500 text-sm">Welcome back, {userName}!</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-800">{successMessage}</p>
          <button onClick={() => setSuccessMessage('')} className="ml-auto text-green-600 hover:text-green-800">
            ×
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{errorMessage}</p>
          <button onClick={() => setErrorMessage('')} className="ml-auto text-red-600 hover:text-red-800">
            ×
          </button>
        </div>
      )}

      {/* Overview Stats */}
    {/* Overview Stats */}
{userInfo && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-sage" />
        </div>
        <h3 className="font-semibold text-stone-800">Total Contributions</h3>
      </div>
      <p className="text-2xl font-bold text-stone-800">
        {formatTokenAmount(userInfo[1])} 
      </p>
      <p className="text-stone-500 text-sm">Across {userInfo[3]?.toString()} active groups</p>
    </div>

    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
          <Users className="w-5 h-5 text-emerald-600" />
        </div>
        <h3 className="font-semibold text-stone-800">Active Groups</h3>
      </div>
      <p className="text-2xl font-bold text-emerald-600">{userInfo[3]?.toString()}</p>
      <p className="text-stone-500 text-sm">
        {userInfo[4]?.toString()} completed
      </p>
    </div>

    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
          <Star className="w-5 h-5 text-gold" />
        </div>
        <h3 className="font-semibold text-stone-800">Reputation Score</h3>
      </div>
      <p className="text-2xl font-bold text-stone-800">{userInfo[7]?.toString()}/100</p>
      <p className="text-stone-500 text-sm">
        {userInfo[6] ? 'Has defaults' : 'Good standing'}
      </p>
    </div>
  </div>
)}

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200">
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'create'
                ? 'text-terracotta border-b-2 border-terracotta'
                : 'text-stone-600 hover:text-stone-800'
            }`}
          >
            Create Group
          </button>
          <button
            onClick={() => setActiveTab('my-groups')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'my-groups'
                ? 'text-terracotta border-b-2 border-terracotta'
                : 'text-stone-600 hover:text-stone-800'
            }`}
          >
            My Groups ({myGroups.length})
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'join'
                ? 'text-terracotta border-b-2 border-terracotta'
                : 'text-stone-600 hover:text-stone-800'
            }`}
          >
            Join Group ({availableGroups.length})
          </button>
        </div>

        {activeTab === 'create' && isAgent  &&(
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-stone-800">Create New Ajo/Esusu Group</h3>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                    placeholder="e.g., Friends Savings Circle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                    placeholder="Brief description of the group purpose"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Token
                  </label>
                  <select
                    value={selectedToken}
                    onChange={(e) => setSelectedToken(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                  >
                    {getSupportedTokens().map((token) => (
                      <option key={token.id} value={token.address}>
                        {token.symbol} - {token.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Contribution Amount (per member)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type="number"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                      placeholder="100"
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Group Size
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="2"
                      max="20"
                      value={groupSize}
                      onChange={(e) => setGroupSize(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="font-semibold text-stone-800 min-w-[3rem]">{groupSize} members</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-3">
                    Contribution Frequency
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {frequencyOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFrequency(option.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          frequency === option.value
                            ? 'border-terracotta bg-terracotta/5'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="text-center">
                          <p className="font-semibold text-stone-800">{option.label}</p>
                          <p className="text-stone-500 text-sm">Every {option.seconds / 86400} day{option.seconds / 86400 > 1 ? 's' : ''}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {contributionAmount && selectedToken && (
                  <div className="bg-stone-50 rounded-xl p-4">
                    <h4 className="font-semibold text-stone-800 mb-3">Group Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-stone-600">Your Contribution</span>
                        <span className="font-medium">{contributionAmount} {getSupportedTokens().find(t => t.address === selectedToken)?.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-600">Total Members</span>
                        <span className="font-medium">{groupSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-600">Payout When Your Turn</span>
                        <span className="font-medium text-emerald-600">
                          {parseFloat(contributionAmount) * groupSize} {getSupportedTokens().find(t => t.address === selectedToken)?.symbol}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleCreateGroup}
                  disabled={!groupName || !contributionAmount || !selectedToken || parseFloat(contributionAmount) <= 0 || isProcessing}
                  className="w-full bg-gradient-to-r from-terracotta to-sage text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Creating Group...' : 'Create Group'}
                </button>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-stone-800">How AfriRemit Ajo/Esusu Works</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-terracotta/10 rounded-full flex items-center justify-center mt-1">
                      <span className="text-terracotta font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-stone-800">Form a Group</h4>
                      <p className="text-stone-600 text-sm">Create or join a trusted circle of 2-20 members</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-sage/10 rounded-full flex items-center justify-center mt-1">
                      <span className="text-sage font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-stone-800">Regular Contributions</h4>
                      <p className="text-stone-600 text-sm">Everyone contributes the same amount at set intervals</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center mt-1">
                      <span className="text-gold font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-stone-800">Rotating Payouts</h4>
                      <p className="text-stone-600 text-sm">Each round, one member receives the total contribution pool</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center mt-1">
                      <span className="text-emerald-600 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-stone-800">Build Reputation</h4>
                      <p className="text-stone-600 text-sm">Consistent participation improves your reputation score</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-terracotta/10 to-sage/10 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-terracotta" />
                    <h4 className="font-semibold text-stone-800">Smart Contract Security</h4>
                  </div>
                  <p className="text-stone-600 text-sm">
                    All contributions are secured by smart contracts. Transparent, automated, and trustworthy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      
         {activeTab === 'create' && !isAgent && (
  <div className="p-6 text-center">
    <div className="max-w-md mx-auto">
      <Shield className="w-16 h-16 text-sage mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-stone-800 mb-2">Agent Access Required</h3>
      <p className="text-stone-600 mb-6">
        Only registered agents can create new Ajo/Esusu groups. Register as an agent to unlock this feature.
      </p>
      <button
        onClick={() => setShowAgentRegistration(true)}
        className="bg-gradient-to-r from-sage to-gold text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
      >
        Register as Agent
      </button>
    </div>
  </div>
)}
        

 {activeTab === 'my-groups' && (
  <div className="p-6">
    <h3 className="text-lg font-semibold text-stone-800 mb-6">Your Groups</h3>
    
    {myGroups.length === 0 ? (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-stone-300 mx-auto mb-4" />
        <h4 className="text-lg font-semibold text-stone-800 mb-2">No Groups Yet</h4>
        <p className="text-stone-600 mb-4">Create your first Ajo/Esusu group to start saving together</p>
        <button
          onClick={() => setActiveTab('create')}
          className="bg-terracotta text-white px-6 py-2 rounded-lg hover:bg-terracotta/90 transition-colors"
        >
          Create Group
        </button>
      </div>
    ) : (
      <div className="space-y-8">
        {/* Groups I Created Section */}
   {myGroups.filter(group => group[2] === address && !group[11]).length > 0 && (
          <div>
            <h4 className="text-md font-medium text-stone-700 mb-4 flex items-center">
              <Crown className="w-5 h-5 mr-2 text-amber-600" />
              Groups I Created ({myGroups.filter(group => group[2] === address  && !group[11]).length})
            </h4>
            <div className="space-y-4">
              {myGroups
                .filter(group => group[2] === address && !group[11]) // Add !group[11] here too
                .map((group) => (
                  <div key={group[0]} className="bg-stone-50 rounded-xl p-6 border-l-4 border-amber-500">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h5 className="font-semibold text-stone-800 text-lg">{group[1]}</h5>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(group[10], group[11], group[12])}`}>
                            {getGroupStatus(group)}
                          </span>
                          <span className="text-stone-600 text-sm">
                            Round {group[8]?.toString()}/{group[9]?.toString()}
                          </span>
                          <span className="text-amber-600 text-sm font-medium">Creator</span>
                        </div>
                      </div>
                     <div className="flex space-x-2">
  {/* Invite Code Management */}
  <div className="flex flex-col space-y-2">
    {group.inviteCode && group.inviteCode !== "0" && group.inviteCode !== "" ? (
      <div className="flex items-center space-x-2">
        <span className="text-xs text-stone-600 bg-stone-200 px-2 py-1 rounded">
          Code: {group.inviteCode}
        </span>
        <button
          onClick={() => handleDeactivateInviteCode(group.inviteCode)}
          disabled={isProcessing}
          className="text-red-600 hover:text-red-700 text-xs px-2 py-1 border border-red-200 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          Deactivate
        </button>
      </div>
    ) : (
      <button
        onClick={() => {
          setSelectedGroupId(group[0]);
          setShowInviteModal(true);
        }}
        disabled={isProcessing}
        className="text-blue-600 hover:text-blue-700 text-xs px-2 py-1 border border-blue-200 rounded hover:bg-blue-50 transition-colors disabled:opacity-50"
      >
        Generate Invite
      </button>
    )}
  </div>

  {group[14] === address && group[10] && (
    <button
      onClick={() => handleClaimPayout(group[0])}
      disabled={isProcessing}
      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
    >
      Claim Payout
    </button>
  )}

  {group[10] && !group.contributionStatus?.[0] && (
    <button
      onClick={() => handleContribute(group[0],group[4], group[5])}
      disabled={isProcessing}
      className="bg-terracotta text-white px-4 py-2 rounded-lg hover:bg-terracotta/90 transition-colors disabled:opacity-50"
    >
      Contribute
    </button>
  )}
</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <DollarSign className="w-4 h-4 text-stone-500" />
                          <span className="text-stone-600 text-sm">Contribution</span>
                        </div>
                        <p className="font-semibold text-stone-800">
                          {formatTokenAmount(group[5])} {getSupportedTokens().find(t => t.address === group[4])?.symbol}
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="w-4 h-4 text-stone-500" />
                          <span className="text-stone-600 text-sm">Members</span>
                        </div>
                        <p className="font-semibold text-stone-800">
                          {group[6]?.toString()}/{group[7]?.toString()}
                        </p>
                      </div>

                    <div className="bg-white rounded-lg p-4">
  <div className="flex items-center space-x-2 mb-2">
    <Clock className="w-4 h-4 text-stone-500" />
    <span className="text-stone-600 text-sm">
      {group[10] ? 'Next Deadline' : 'Status'}
    </span>
  </div>
  <p className="font-semibold text-stone-800">
    {group[10] ? getTimeRemaining(group[13]) : 'Not Started'}
  </p>
</div>
                    </div>

                    {group[14] && group[14] !== "0x0000000000000000000000000000000000000000" && (
                      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <Star className="w-5 h-5 text-emerald-600" />
                          <span className="font-medium text-stone-800">
                            Current Recipient: {group[15] || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    )}

                    {group.contributionStatus && (
                      <div className="flex items-center space-x-2 mt-3">
                        {group.contributionStatus[0] ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                            <span className="text-emergreen-600 font-medium">Contributed for this round</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                            <span className="text-amber-600 font-medium">
                              {group.contributionStatus[2] ? 'Late - Please contribute' : 'Contribution pending'}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
        {/* Groups I Joined Section */}
       {myGroups.filter(group => group[2] !== address && !group[11]).length > 0 && (
          <div>
            <h4 className="text-md font-medium text-stone-700 mb-4 flex items-center">
              <UserPlus className="w-5 h-5 mr-2 text-blue-600" />
              Groups I Joined ({myGroups.filter(group => group[2] !== address  && !group[11]).length})
            </h4>
            <div className="space-y-4">
              {myGroups
                .filter(group => group[2] !== address)
                .map((group) => (
                  <div key={group[0]} className="bg-stone-50 rounded-xl p-6 border-l-4 border-blue-500">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h5 className="font-semibold text-stone-800 text-lg">{group[1]}</h5>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(group[10], group[11], group[12])}`}>
                            {getGroupStatus(group)}
                          </span>
                          <span className="text-stone-600 text-sm">
                            Round {group[8]?.toString()}/{group[9]?.toString()}
                          </span>
                          <span className="text-blue-600 text-sm font-medium">Member</span>
                        </div>
                        <p className="text-stone-600 text-sm mt-1">
                          Created by: {group[3] || 'Unknown'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {group[14] === address && group[10] && (
                          <button
                            onClick={() => handleClaimPayout(group[0])}
                            disabled={isProcessing}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                          >
                            Claim Payout
                          </button>
                        )}
                        
                        {group[10] && !group.contributionStatus?.[0] && (
                          <button
                            onClick={() =>  handleContribute(group[0], group[4], group[5])}
                            disabled={isProcessing}
                            className="bg-terracotta text-white px-4 py-2 rounded-lg hover:bg-terracotta/90 transition-colors disabled:opacity-50"
                          >
                            Contribute
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <DollarSign className="w-4 h-4 text-stone-500" />
                          <span className="text-stone-600 text-sm">Contribution</span>
                        </div>
                        <p className="font-semibold text-stone-800">
                          {formatTokenAmount(group[5])} {getSupportedTokens().find(t => t.address === group[4])?.symbol}
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="w-4 h-4 text-stone-500" />
                          <span className="text-stone-600 text-sm">Members</span>
                        </div>
                        <p className="font-semibold text-stone-800">
                          {group[6]?.toString()}/{group[7]?.toString()}
                        </p>
                      </div>


<div className="bg-white rounded-lg p-4">
  <div className="flex items-center space-x-2 mb-2">
    <Clock className="w-4 h-4 text-stone-500" />
    <span className="text-stone-600 text-sm">
      {group[10] ? 'Next Deadline' : 'Status'}
    </span>
  </div>
  <p className="font-semibold text-stone-800">
    {group[10] ? getTimeRemaining(group[13]) : 'Not Started'}
  </p>
</div>
                    </div>

                    {group[14] && group[14] !== "0x0000000000000000000000000000000000000000" && (
                      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <Star className="w-5 h-5 text-emerald-600" />
                          <span className="font-medium text-stone-800">
                            Current Recipient: {group[15] || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    )}

                    {group.contributionStatus && (
                      <div className="flex items-center space-x-2 mt-3">
                        {group.contributionStatus[0] ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                            <span className="text-emerald-600 font-medium">Contributed for this round</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                            <span className="text-amber-600 font-medium">
                              {group.contributionStatus[2] ? 'Late - Please contribute' : 'Contribution pending'}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Completed Groups Section */}
{myGroups.filter(group => group[11]).length > 0 && (
  <div>
    <h4 className="text-md font-medium text-stone-700 mb-4 flex items-center">
      <CheckCircle className="w-5 h-5 mr-2 text-emerald-600" />
      Completed Groups ({myGroups.filter(group => group[11]).length})
    </h4>
    <div className="space-y-4">
      {myGroups
        .filter(group => group[11])
        .map((group) => (
          <div key={group[0]} className="bg-stone-50 rounded-xl p-6 border-l-4 border-emerald-500 opacity-75">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h5 className="font-semibold text-stone-800 text-lg">{group[1]}</h5>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                    Completed
                  </span>
                  <span className="text-stone-600 text-sm">
                    Final Round: {group[8]?.toString()}/{group[9]?.toString()}
                  </span>
                  <span className={`text-sm font-medium ${group[2] === address ? 'text-amber-600' : 'text-blue-600'}`}>
                    {group[2] === address ? 'Creator' : 'Member'}
                  </span>
                </div>
                {group[2] !== address && (
                  <p className="text-stone-600 text-sm mt-1">
                    Created by: {group[3] || 'Unknown'}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-4 h-4 text-stone-500" />
                  <span className="text-stone-600 text-sm">Contribution</span>
                </div>
                <p className="font-semibold text-stone-800">
                  {formatTokenAmount(group[5])} {getSupportedTokens().find(t => t.address === group[4])?.symbol}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-4 h-4 text-stone-500" />
                  <span className="text-stone-600 text-sm">Members</span>
                </div>
                <p className="font-semibold text-stone-800">
                  {group[6]?.toString()}/{group[7]?.toString()}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-stone-600 text-sm">Status</span>
                </div>
                <p className="font-semibold text-emerald-600">
                  All rounds completed
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-stone-800">
                  This contribution circle has been successfully completed!
                </span>
              </div>
            </div>
          </div>
        ))}
    </div>
  </div>
)}
      </div>
    )}
  </div>
)}

        {activeTab === 'join' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-6">Join a Group</h3>
            
            {/* Invite Code Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-stone-800 mb-4">Have an Invite Code?</h4>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="flex-1 px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter invite code (e.g., AJO1234567890123)"
                />
                <button
  onClick={handleVerifyInviteCode}
  disabled={!inviteCode.trim() || isProcessing}
  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isProcessing ? 'Verifying...' : 'Verify Code'}
</button>
              </div>
            </div>

            {/* Available Groups */}
            {availableGroups.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-stone-800 mb-2">No Available Groups</h4>
                <p className="text-stone-600 mb-4">All groups are currently full or invite-only</p>
                <p className="text-stone-500 text-sm">Ask friends for invite codes or create your own group</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="font-semibold text-stone-800">Available Groups</h4>
                {availableGroups.map((group) => (
                  <div key={group.groupId} className="bg-stone-50 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h5 className="font-semibold text-stone-800 text-lg">{group.name}</h5>
                        <p className="text-stone-600 text-sm mb-2">Created by {group.creatorName || 'Unknown'}</p>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(group.isActive, group.isCompleted, group.canJoin)}`}>
                            {getGroupStatus(group)}
                          </span>
                          <span className="text-stone-600 text-sm">
                            {group.currentMembers}/{group.maxMembers} members
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleJoinGroup(group.groupId)}
                        disabled={!group.canJoin || isProcessing || !inviteCode.trim()}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Joining...' : 'Join Group'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <DollarSign className="w-4 h-4 text-stone-500" />
                          <span className="text-stone-600 text-sm">Contribution Required</span>
                        </div>
                        <p className="font-semibold text-stone-800">
                          {formatTokenAmount(group.contributionAmount)} {getSupportedTokens().find(t => t.address === group.token)?.symbol}
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-stone-500" />
                          <span className="text-stone-600 text-sm">Potential Payout</span>
                        </div>
                        <p className="font-semibold text-emerald-600">
                          {formatTokenAmount(group.contributionAmount * group.maxMembers)} {getSupportedTokens().find(t => t.address === group.token)?.symbol}
                        </p>
                      </div>
                    </div>

                    {group.nextContributionDeadline && (
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5 text-amber-600" />
                          <span className="font-medium text-stone-800">
                            Next contribution deadline: {getTimeRemaining(group.nextContributionDeadline)}
                          </span>
                        </div>
                      </div>
                    )}

                    {!inviteCode.trim() && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-blue-800 text-sm">
                          💡 You need an invite code to join this group. Ask the group creator for an invitation.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Platform Statistics */}
      {totalStats && (
        <div className="bg-gradient-to-br from-terracotta/10 via-sage/10 to-gold/10 rounded-2xl p-8">
  <h3 className="text-xl font-bold text-stone-800 text-center mb-8">Platform Statistics</h3>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="text-center">
      <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-3">
        <TrendingUp className="w-8 h-8 text-sage" />
      </div>
      <p className="text-2xl font-bold text-stone-800">{totalStats[0]?.toString()}</p>
      <p className="text-stone-600 text-sm">Total Groups</p>
    </div>

    <div className="text-center">
      <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
        <CheckCircle className="w-8 h-8 text-emerald-600" />
      </div>
      <p className="text-2xl font-bold text-emerald-600">{totalStats[1]?.toString()}</p>
      <p className="text-stone-600 text-sm">Active Groups</p>
    </div>

    <div className="text-center">
      <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
        <Star className="w-8 h-8 text-gold" />
      </div>
      <p className="text-2xl font-bold text-stone-800">{totalStats[2]?.toString()}</p>
      <p className="text-stone-600 text-sm">Completed Groups</p>
    </div>
  </div>
</div>
      )}
{showInviteModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-96 max-w-md">
      <h3 className="text-lg font-semibold text-stone-800 mb-4">Generate Invite Code</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-stone-700 text-sm font-medium mb-2">
            Maximum Uses
          </label>
          <input
            type="number"
            value={maxUses}
            onChange={(e) => setMaxUses(parseInt(e.target.value) || 1)}
            min="1"
            max="100"
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta"
            placeholder="10"
          />
          <p className="text-xs text-stone-500 mt-1">How many people can use this code</p>
        </div>

        <div>
          <label className="block text-stone-700 text-sm font-medium mb-2">
            Validity (Days)
          </label>
          <input
            type="number"
            value={validityDays}
            onChange={(e) => setValidityDays(parseInt(e.target.value) || 1)}
            min="1"
            max="365"
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta"
            placeholder="30"
          />
          <p className="text-xs text-stone-500 mt-1">How many days the code will be valid</p>
        </div>
      </div>

      <div className="flex space-x-3 mt-6">
        <button
          onClick={() => setShowInviteModal(false)}
          className="flex-1 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => handleGenerateInviteCode(selectedGroupId)}
          disabled={isProcessing}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isProcessing ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </div>
  </div>
)}
      {/* Footer */}
      <div className="text-center py-6 border-t border-stone-200">
        <p className="text-stone-500 text-sm">
          AfriRemit Ajo/Esusu - Building financial inclusion through traditional savings circles powered by blockchain technology
        </p>
      </div>
    </div>
    </>
  );
};

export default AjoEsusuInterface;