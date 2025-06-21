import React from 'react';
import { 
  Globe, 
  Twitter, 
  Github, 
  MessageCircle, 
  Mail, 
  ArrowUp,
  ExternalLink
} from 'lucide-react';

interface FooterProps {
  onPageChange: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onPageChange }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    platform: [
      { name: 'Dashboard', page: 'dashboard' },
      { name: 'Swap Tokens', page: 'swap' },
      { name: 'Savings Groups', page: 'savings' },
      { name: 'Send Money', page: 'send' },
      { name: 'Buy/Sell', page: 'Buy/Sell' }
    ],
    resources: [
      { name: 'Documentation', href: 'https://docs.afriremit.com', external: true },
      { name: 'API Reference', href: 'https://api.afriremit.com', external: true },
      { name: 'Help Center', href: 'https://help.afriremit.com', external: true },
      { name: 'Blog', href: 'https://blog.afriremit.com', external: true },
      { name: 'Tutorials', href: 'https://tutorials.afriremit.com', external: true }
    ],
    company: [
      { name: 'About Us', href: 'https://afriremit.com/about', external: true },
      { name: 'Careers', href: 'https://afriremit.com/careers', external: true },
      { name: 'Press Kit', href: 'https://afriremit.com/press', external: true },
      { name: 'Partners', href: 'https://afriremit.com/partners', external: true },
      { name: 'Contact', href: 'mailto:contact@afriremit.com', external: true }
    ],
    legal: [
      { name: 'Terms of Service', href: 'https://afriremit.com/terms', external: true },
      { name: 'Privacy Policy', href: 'https://afriremit.com/privacy', external: true },
      { name: 'Cookie Policy', href: 'https://afriremit.com/cookies', external: true },
      { name: 'Security', href: 'https://afriremit.com/security', external: true },
      { name: 'Compliance', href: 'https://afriremit.com/compliance', external: true }
    ]
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/afriremit', label: 'Twitter', external: true },
    { icon: Github, href: 'https://github.com/afriremit', label: 'GitHub', external: true },
    { icon: MessageCircle, href: 'https://discord.gg/afriremit', label: 'Discord', external: true },
    { icon: Mail, href: 'mailto:hello@afriremit.com', label: 'Email', external: true }
  ];

  const supportedTokens = [
    'cNGN', 'cKES', 'cZAR', 'cGHS', 'AFX', 'USDT', 'WETH', 'AFR'
  ];

  const handleLinkClick = (link: { page?: string; href?: string; external?: boolean }) => {
    if (link.page) {
      onPageChange(link.page);
    } else if (link.href && link.external) {
      window.open(link.href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold">AfriRemit</span>
                  <span className="text-xs text-gray-400 -mt-1">Africa’s DeFi Hub</span>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
               Africa’s Stablecoin Gateway to the World, built on Lisk blockchain. 
               Powering African Finance through De-Fi.
              </p>
              
              {/* Supported Tokens */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Supported Tokens</h4>
                <div className="flex flex-wrap gap-2">
                  {supportedTokens.map((token, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-medium border border-gray-700"
                    >
                      {token}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target={social.external ? "_blank" : undefined}
                    rel={social.external ? "noopener noreferrer" : undefined}
                    className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Platform</h3>
              <ul className="space-y-3">
                {footerLinks.platform.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleLinkClick(link)}
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group w-full text-left"
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Resources</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-6 mb-4 md:mb-0">
                <p className="text-gray-400 text-sm">
                  © 2025 AfriRemit. All rights reserved.
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>Built on</span>
                  <span className="text-blue-400 font-medium">Lisk</span>
                  <span>•</span>
                  <span>Secured by</span>
                  <span className="text-green-400 font-medium">Smart Contracts</span>
                </div>
              </div>
              
              <button
                onClick={scrollToTop}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 group"
              >
                <span className="text-sm">Back to top</span>
                <div className="w-8 h-8 bg-gray-800 hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-600 rounded-lg flex items-center justify-center transition-all duration-300">
                  <ArrowUp className="w-4 h-4 group-hover:text-white" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;