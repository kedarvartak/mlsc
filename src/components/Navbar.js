import { motion } from "framer-motion";
import { useContext } from 'react';
import { Web3Context } from '../context/Web3Context';

const Navbar = () => {
  const { account, isConnected, connectWallet, disconnectWallet } = useContext(Web3Context);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white border-b-2 border-black"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="font-black text-2xl text-[#FF4141]"
          >
            PokéChain
          </motion.div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/marketplace'}
              className="px-4 py-2 font-bold text-black
                         bg-[#FFE8E8] rounded-lg border-2 border-black
                         shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                         transition-all hover:translate-x-[1px] hover:translate-y-[1px]
                         hover:shadow-none"
            >
              Marketplace
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isConnected ? disconnectWallet : connectWallet}
              className={`
                px-4 py-2 font-bold text-white
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
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 