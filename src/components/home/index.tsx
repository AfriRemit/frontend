import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import Features from './Features';
import TrustedPartners from './Partner';
// import Stats from './Stats';
// import Testimonials from './Testimonials';
// import Contact from './Contact';
import Footer from './Footer';

interface LandingPageProps {
  onPageChange?: (page: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onPageChange }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar onPageChange={onPageChange} />
      <HeroSection onPageChange={onPageChange} />
      {/* <Stats /> */}
      <Features onPageChange={onPageChange} />
      <TrustedPartners />
      {/* <Testimonials /> */}
      {/* <Contact /> */}
      <Footer />
    </div>
  );
};

export default LandingPage;