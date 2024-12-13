// components/Landing.js
import { motion } from "framer-motion";
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import { useSpring, animated } from '@react-spring/web';
import Spline from '@splinetool/react-spline';
import { useContext, useState } from 'react';
import { Web3Context } from '../context/Web3Context';
import { useNavigate } from 'react-router-dom';

// A more colorful placeholder with Pokemon-like colors
const pokemonCard = "https://placehold.co/600x800/FF0000/FFFFFF.png?text=Pokemon+NFT+Card";

const Landing = () => {
  const { connectWallet, isConnected, claimStarterPack } = useContext(Web3Context);
  const [claiming, setClaiming] = useState(false);
  const [claimStatus, setClaimStatus] = useState('');
  const navigate = useNavigate();

  const handleStartJourney = async () => {
    try {
      if (!isConnected) {
        await connectWallet();
      }
      
      setClaiming(true);
      setClaimStatus('Claiming your starter Pokemon...');
      await claimStarterPack();
      setClaimStatus('Starter Pokemon claimed successfully!');
      
      setTimeout(() => {
        navigate('/marketplace');
      }, 2000);
      
    } catch (error) {
      console.error("Error starting journey:", error);
      setClaimStatus(`Error: ${error.message}`);
    } finally {
      setClaiming(false);
    }
  };

  const HeroCard = () => {
    const float = useSpring({
      from: { transform: 'translate3d(0px, 0px, 0px) rotate(0deg)' },
      to: async (next) => {
        while (true) {
          await next({ transform: 'translate3d(0px, 15px, 0px) rotate(3deg)' });
          await next({ transform: 'translate3d(0px, -5px, 0px) rotate(-2deg)' });
        }
      },
      config: { duration: 2500 },
    });

    return (
      <animated.div style={float} className="relative w-[320px] h-[460px]">
      {/* Background decorative elements */}
      <div className="absolute -top-6 -right-6 w-full h-full bg-yellow-400 rounded-2xl border-4 border-black rotate-3" />
      <div className="absolute -bottom-6 -left-6 w-full h-full bg-red-400 rounded-2xl border-4 border-black -rotate-3" />
      
      {/* Main card */}
      <div className="relative w-full h-full bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
        {/* Card image section */}
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center"
               style={{ backgroundImage: `url(${pokemonCard})` }}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90" />
          </div>
        </div>

        {/* Card content */}
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <div className="bg-white rounded-xl p-5 border-4 border-black transform transition-all duration-300 group-hover:scale-[1.02]">
            {/* Rare badge */}
            <div className="absolute -top-5 right-4 bg-yellow-400 text-black font-black px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-3">
              RARE
            </div>
            
            {/* Pokemon info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl font-black text-black">Charizard</h3>
                <span className="font-mono font-bold text-red-500">#006</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full border-2 border-black">
                  Fire Type
                </span>
                <span className="bg-yellow-400 text-black text-sm font-bold px-3 py-1 rounded-full border-2 border-black">
                  ★★★★★
                </span>
              </div>
              
              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'ATK', value: '95', color: 'bg-red-100' },
                  { label: 'DEF', value: '85', color: 'bg-blue-100' },
                  { label: 'SP', value: '🔥', color: 'bg-yellow-100' },
                ].map((stat, index) => (
                  <div 
                    key={index} 
                    className={`${stat.color} rounded-lg border-2 border-black p-2 text-center group-hover:translate-y-[-2px] transition-transform`}
                  >
                    <div className="text-black font-bold text-xs">{stat.label}</div>
                    <div className="text-black font-black text-sm">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Power bar */}
              <div className="relative h-3 bg-gray-200 rounded-full border-2 border-black overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-red-500 w-[85%] animate-pulse" />
              </div>

              {/* Card footer */}
              <div className="flex justify-between items-center pt-2 border-t-2 border-black">
                <div className="text-xs font-bold text-gray-600">Limited Edition</div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold">Power Level</span>
                  <span className="font-mono font-black text-red-500">85</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-4 left-4 w-4 h-4 bg-yellow-400 border-2 border-black rounded-full" />
        <div className="absolute top-4 right-4 w-4 h-4 bg-red-400 border-2 border-black rounded-full" />
        <div className="absolute bottom-4 left-4 w-4 h-4 bg-red-400 border-2 border-black rounded-full" />
        <div className="absolute bottom-4 right-4 w-4 h-4 bg-yellow-400 border-2 border-black rounded-full" />
      </div>
    </animated.div>
    );
  };

  return (
    <ParallaxProvider>
      <div className="min-h-screen bg-[#FFE8E8] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-500/20 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-yellow-500/20 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse-slow" />
        </div>

        <section className="pt-24 pb-20 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <motion.div 
                className="flex-1 text-center md:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="font-display text-5xl md:text-7xl font-black  mb-6 leading-tight tracking-tight">
                  Collect <span className="text-red-500 relative inline-block
                    ">Pokemon</span> Cards on Web3
                </h1>
                <p className="text-gray-700 text-lg mb-8 max-w-xl">
                  Mint, battle, and trade unique Pokemon cards on the blockchain. 
                  Become the ultimate Pokemon master in the digital realm.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <motion.button
                    onClick={handleStartJourney}
                    className="neubrutalism-button bg-red-500 text-white px-8 py-4 rounded-xl font-bold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {claiming ? 'Claiming...' : isConnected ? 'Connected!' : 'Start Your Journey'}
                  </motion.button>
                  {claimStatus && (
                    <div className={`text-sm ${claimStatus.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                      {claimStatus}
                    </div>
                  )}
                  <motion.button
                    className="neubrutalism-button bg-white text-black px-8 py-4 rounded-xl font-bold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Collection
                  </motion.button>
                </div>
                
                <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto md:mx-0">
                  {[
                    { value: '150+', label: 'Pokemon' },
                    { value: '1.2K', label: 'Trainers' },
                    { value: '5.5K', label: 'Battles' },
                  ].map((stat, index) => (
                    <div 
                      key={index} 
                      className="bg-white p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      <div className="text-2xl font-black text-red-500 mb-1">{stat.value}</div>
                      <div className="text-black font-bold text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                className="flex-1 flex justify-center items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <HeroCard />
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </ParallaxProvider>
  );
};

export default Landing;