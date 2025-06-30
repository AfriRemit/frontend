import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
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
import AcademyIndex from '../components/academy/Index';
import CourseDetailPage from '../components/academy/DetialCourse';

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
  academy: {
    component: AcademyIndex,
    requiresLayout: false,
  },
  courseDetail: {
    component: CourseDetailPage,
    requiresLayout: false,
  },
} as const;

type RouteKey = keyof typeof routes;

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get initial page from URL or localStorage
  const getInitialPage = (): RouteKey => {
    const path = location.pathname;
    if (path.startsWith('/app/')) {
      const page = path.split('/app/')[1] as RouteKey;
      return routes[page] ? page : 'landing';
    }
    const savedPage = localStorage.getItem('currentPage') as RouteKey;
    return savedPage && routes[savedPage] ? savedPage : 'landing';
  };

  const [currentPage, setCurrentPage] = useState<RouteKey>(getInitialPage);

  // Single effect to handle all routing
  useEffect(() => {
    const path = location.pathname;
    
    // Handle app routes
    if (path.startsWith('/app/')) {
      const page = path.split('/app/')[1] as RouteKey;
      if (routes[page]) {
        setCurrentPage(page);
        localStorage.setItem('currentPage', page);
      } else {
        setCurrentPage('landing');
        localStorage.setItem('currentPage', 'landing');
        navigate('/', { replace: true });
      }
    } else if (path === '/' || path === '/landing' || !path) {
      setCurrentPage('landing');
      localStorage.setItem('currentPage', 'landing');
    } else {
      setCurrentPage('landing');
      localStorage.setItem('currentPage', 'landing');
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handlePageChange = (page: string) => {
    if (routes[page as RouteKey]) {
      setCurrentPage(page as RouteKey);
      localStorage.setItem('currentPage', page);
      if (page === 'landing') {
        navigate('/', { replace: true });
      } else {
        navigate(`/app/${page}`, { replace: true });
      }
    }
  };

  const renderCurrentPage = () => {
    const route = routes[currentPage];
    if (!route) {
      return <LandingPage onPageChange={handlePageChange} />;
    }

    const Component = route.component;
    if (currentPage === 'courseDetail') {
      return <Component />;
    }
    if (Component === LandingPage || Component === AcademyIndex) {
      return <Component onPageChange={handlePageChange} />;
    }
    return <Component />;
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