
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
