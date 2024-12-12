import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Web3Context } from '../context/Web3Context';

const Navbar = () => {
  const { account, isConnected, connectWallet, disconnectWallet, error } = useContext(Web3Context);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const navItems = [
    { name: 'Explore', href: '/', badge: 'New' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Collection', href: '/collection' },
    { name: 'Rankings', href: '/rankings' },
  ];

  console.log("Web3Context values:", { account, isConnected, error }); // Debug log

  const handleWalletClick = () => {
    console.log("Wallet button clicked"); // Debug log
    if (isConnected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  // Function to truncate ethereum address
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300`}
    >
      <div className={`mx-auto transition-all duration-300 ${
        scrolled ? 'bg-black/30 backdrop-blur-xl ' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="text-white text-2xl cursor-pointer flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-all duration-500">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold text-xl">UF</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-light text-xl">Stars</span>
                <span className="text-xs text-blue-400">Digital Collectibles</span>
              </div>
            </motion.div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-12">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.href}
                    className="text-gray-300 hover:text-white transition-colors relative group flex items-center space-x-2"
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30">
                        {item.badge}
                      </span>
                    )}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right Section */}
            <div className="hidden md:flex items-center space-x-4">
              {error && (
                <div className="text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Notification Bell */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 transition-all duration-300 relative"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full"></span>
              </motion.button>

              {/* Connect/Disconnect Wallet Button */}
              <motion.button
                onClick={handleWalletClick}
                className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm text-white px-6 py-2.5 rounded-xl
                          border border-white/10 hover:border-blue-400/30 transition-all duration-300
                          flex items-center space-x-2 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"></span>
                <span>
                  {isConnected ? truncateAddress(account) : 'Connect Wallet'}
                </span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 bg-black/30 backdrop-blur-xl"
            >
              <div className="px-6 py-4 space-y-4">
                {navItems.map((item) => (
                  <motion.div
                    key={item.name}
                    whileHover={{ x: 10 }}
                  >
                    <Link
                      to={item.href}
                      className="block text-gray-300 hover:text-white transition-colors py-2 flex items-center justify-between"
                    >
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
                <motion.button
                  className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm text-white px-6 py-2.5 rounded-xl
                            border border-white/10 hover:border-blue-400/30 transition-all duration-300
                            flex items-center justify-center space-x-2 mt-4"
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"></span>
                  <span>Connect Wallet</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar; 