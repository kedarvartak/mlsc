import { motion } from "framer-motion";
import { useContext, useState } from 'react';
import { Web3Context } from '../context/Web3Context';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { account, isConnected, connectWallet, disconnectWallet } = useContext(Web3Context);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const MenuButton = () => (
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="lg:hidden p-2 rounded-lg border-2 border-black hover:bg-[#FFE8E8] transition-colors"
    >
      <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        {isMobileMenuOpen ? (
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6h16M4 12h16M4 18h16"
          />
        )}
      </svg>
    </button>
  );

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white border-b-2 border-black sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="font-black text-2xl text-[#FF4141] whitespace-nowrap"
            >
              PokéChain
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/marketplace">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 font-bold text-black
                           bg-[#FFE8E8] rounded-lg border-2 border-black
                           shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                           transition-all hover:translate-x-[1px] hover:translate-y-[1px]
                           hover:shadow-none"
              >
                Marketplace
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isConnected ? disconnectWallet : connectWallet}
              className={`
                px-4 py-2 font-bold text-white whitespace-nowrap
                ${isConnected ? 'bg-green-500' : 'bg-[#FF4141]'}
                rounded-lg border-2 border-black
                shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                transition-all hover:translate-x-[1px] hover:translate-y-[1px]
                hover:shadow-none
              `}
            >
              {isConnected 
                ? `${account.slice(0, 6)}...${account.slice(-4)}`
                : 'Connect Wallet'
              }
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <MenuButton />
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: isMobileMenuOpen ? 'auto' : 0 }}
          className="lg:hidden overflow-hidden"
        >
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-4 space-y-4"
            >
              <Link to="/marketplace">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-4 py-2 font-bold text-black
                           bg-[#FFE8E8] rounded-lg border-2 border-black
                           shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                           transition-all active:translate-x-[1px] active:translate-y-[1px]
                           active:shadow-none"
                >
                  Marketplace
                </motion.button>
              </Link>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={isConnected ? disconnectWallet : connectWallet}
                className={`
                  w-full px-4 py-2 font-bold text-white
                  ${isConnected ? 'bg-green-500' : 'bg-[#FF4141]'}
                  rounded-lg border-2 border-black
                  shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                  transition-all active:translate-x-[1px] active:translate-y-[1px]
                  active:shadow-none
                `}
              >
                {isConnected 
                  ? `${account.slice(0, 6)}...${account.slice(-4)}`
                  : 'Connect Wallet'
                }
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 