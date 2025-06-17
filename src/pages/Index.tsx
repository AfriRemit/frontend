import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import GaslessHome from '../components/Test';
import LandingPage from '../components/home/index';

// Route configuration
const routes = {
  landing: {
    component: LandingPage,
    requiresLayout: false,
  },
  dashboard: {
    component: Dashboard,
    requiresLayout: true,
  },
  send: {
    component: SendMoney,
    requiresLayout: true,
  },
  swap: {
    component: SwapInterface,
    requiresLayout: true,
  },
  savings: {
    component: SavingsInterface,
    requiresLayout: true,
  },
  family: {
    component: FamilyTransfers,
    requiresLayout: true,
  },
  referral: {
    component: ReferralSystem,
    requiresLayout: true,
  },
  withdraw: {
    component: WithdrawalInterface,
    requiresLayout: true,
  },
  deposit: {
    component: DepositInterface,
    requiresLayout: true,
  },
  profile: {
    component: Profile,
    requiresLayout: true,
  },
  faucet: {
    component: Faucet,
    requiresLayout: true,
  },
  'Buy/Sell': {
    component: OnrampOfframpInterface,
    requiresLayout: true,
  },
  utility: {
    component: UtilityPaymentInterface,
    requiresLayout: true,
  },
  admin: {
    component: AdminInterface,
    requiresLayout: true,
  },
} as const;

type RouteKey = keyof typeof routes;

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<RouteKey>('landing');

  // Handle initial route and URL changes
  useEffect(() => {
    const path = location.pathname;
    
    // Always default to landing page on initial load
    if (path === '/' || path === '/landing' || !path) {
      setCurrentPage('landing');
      localStorage.setItem('currentPage', 'landing');
      return;
    }

    // Handle app routes
    if (path.startsWith('/app/')) {
      const page = path.split('/app/')[1] as RouteKey;
      if (page && routes[page]) {
        setCurrentPage(page);
        localStorage.setItem('currentPage', page);
      } else {
        // If invalid route, redirect to landing
        navigate('/', { replace: true });
      }
    } else {
      // If any other route, redirect to landing
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Update URL when page changes
  useEffect(() => {
    if (currentPage === 'landing') {
      navigate('/', { replace: true });
    } else {
      navigate(`/app/${currentPage}`, { replace: true });
    }
  }, [currentPage, navigate]);

  const handlePageChange = (page: string) => {
    if (routes[page as RouteKey]) {
      setCurrentPage(page as RouteKey);
      localStorage.setItem('currentPage', page);
    }
  };

  const renderCurrentPage = () => {
    const route = routes[currentPage];
    if (!route) {
      return <LandingPage onPageChange={handlePageChange} />;
    }

    const Component = route.component;
    return <Component onPageChange={handlePageChange} />;
  };

  const route = routes[currentPage];
  const shouldUseLayout = route?.requiresLayout ?? false;

  return (
    <div className="min-h-screen bg-gray-50">
      {shouldUseLayout ? (
        <Layout currentPage={currentPage} onPageChange={handlePageChange}>
          {renderCurrentPage()}
        </Layout>
      ) : (
        renderCurrentPage()
      )}
    </div>
  );
};

export default Index;