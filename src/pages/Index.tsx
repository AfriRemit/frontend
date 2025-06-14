
import React, { useState } from 'react';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import SendMoney from '../components/SendMoney';
import SwapInterface from '../components/SwapInterface';
import SavingsInterface from '../components/SavingsInterface';
import FamilyTransfers from '../components/FamilyTransfers';
import ReferralSystem from '../components/ReferralSystem';
import WithdrawalInterface from '../components/WithdrawalInterface';
import DepositInterface from '../components/DepositInterface';
import Profile from '../components/Profile';
import Faucet from '../components/Faucet';
import OnrampOfframpInterface from '@/components/BuyandSellInterface';
import AdminInterface from '@/components/Admin';
import UtilityPaymentInterface from '../components/UtilityInterface';
import GaslessHome from '../components/Test'

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={setCurrentPage} />;
      case 'send':
        return <SendMoney />;
      case 'swap':
        return <SwapInterface />;
      case 'savings':
        return <SavingsInterface />;
      case 'family':
        return <FamilyTransfers />;
      case 'referral':
        return <ReferralSystem />;
      case 'withdraw':
        return <WithdrawalInterface />;
      case 'deposit':
        return <DepositInterface />;
      case 'profile':
        return <Profile />;
      case 'faucet':
        return <Faucet />;
      case 'Buy/Sell':
        return <OnrampOfframpInterface />; 
      case 'utility':
        return <UtilityPaymentInterface />;
      case 'admin':
        return <AdminInterface />;
     

      default:
        return <Dashboard onPageChange={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
};

export default Index;
