// components/Landing.js
import { motion } from "framer-motion";
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import { useSpring, animated } from '@react-spring/web';

import messiCard from '../assets/messi.jpg';
import Spline from '@splinetool/react-spline';

const Landing = () => {
  const float = useSpring({
    from: { transform: 'translate3d(0px, 0px, 0px) rotate(0deg)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translate3d(0px, 20px, 0px) rotate(2deg)' });
        await next({ transform: 'translate3d(0px, 0px, 0px) rotate(-2deg)' });
      }
    },
    config: { duration: 3000 },
  });

  const HeroCard = () => {
    const float = useSpring({
      from: { transform: 'translate3d(0px, 0px, 0px) rotate(0deg)' },
      to: async (next) => {
        while (true) {
          await next({ transform: 'translate3d(0px, 20px, 0px) rotate(2deg)' });
          await next({ transform: 'translate3d(0px, 0px, 0px) rotate(-2deg)' });
        }
      },
      config: { duration: 3000 },
    });

    return (
      <animated.div style={float} className="relative w-80 h-[28rem] rounded-2xl perspective-1000">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl transform rotate-6 group hover:border-blue-500/50 transition-all duration-500">
          {/* Shine effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" />
          </div>
          
          {/* Card content with enhanced effects */}
          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden">
            {/* Background image with gradient overlay */}
            <div className="absolute inset-0 bg-cover bg-center"
                 style={{ backgroundImage: `url(${messiCard})` }}>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
            </div>

            {/* Card details with glass effect */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 transform transition-transform duration-300 group-hover:scale-105">
                {/* Player Rating */}
                <div className="absolute -top-4 right-4 bg-yellow-400/90 text-black font-semibold px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  93 OVR
                </div>
                
                {/* Player Info */}
                <div className="space-y-3">
                  <h3 className="text-white text-xl">Lionel Messi</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400 text-sm">Legendary Edition</span>
                    <span className="text-white/70 text-sm">#7/10</span>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {[
                      { label: 'PAC', value: 91 },
                      { label: 'SHO', value: 94 },
                      { label: 'DRI', value: 96 },
                    ].map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-white/70 text-xs">{stat.label}</div>
                        <div className="text-white text-sm">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Holographic effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
          </div>
        </div>
      </animated.div>
    );
  };

  return (
    <ParallaxProvider>
      <div className="min-h-screen bg-[#0A0A0F] relative overflow-hidden">
        
        
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse-slow" />
          <div className="absolute inset-0 bg-grid" />
        </div>

        {/* Hero Section */}
        <section className="pt-32 pb-20 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              {/* Left Content */}
              <motion.div 
                className="flex-1 text-center md:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-7xl text-white mb-6 leading-tight">
                  Collect <span className="text-blue-400">Legendary</span> Football Moments
                </h1>
                <p className="text-gray-400 text-lg mb-8 max-w-xl">
                  Own and trade exclusive digital cards featuring the greatest moments in football history. 
                  Join the future of sports collectibles.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <motion.button
                    className="bg-blue-500 text-white px-8 py-3 rounded-xl hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Collecting
                  </motion.button>
                  <motion.button
                    className="bg-transparent border border-blue-400/30 text-white px-8 py-3 rounded-xl hover:bg-blue-500/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Marketplace
                  </motion.button>
                </div>
                
                {/* Stats */}
                <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto md:mx-0">
                  {[
                    { value: '10K+', label: 'Collectibles' },
                    { value: '3.2K', label: 'Users' },
                    { value: '8.1K', label: 'Trades' },
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl text-white mb-1">{stat.value}</div>
                      <div className="text-gray-500 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right Content - Floating Card */}
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

        {/* Spline Design Card Section */}
        
        <section className="min-h-screen relative overflow-hidden py-32 bg-[#0A0A0F]">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse-slow" />
            <div className="absolute inset-0 bg-grid" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative z-10 space-y-12"
            >
                <div className="space-y-6">
                <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-sm text-blue-400 border border-white/10"
                >
                    Digital Collectibles
                </motion.span>
                <h2 className="text-4xl md:text-5xl text-white leading-tight">
                    Interactive Trading Cards
                </h2>
                <p className="text-lg text-gray-400 max-w-xl">
                    Explore our collection of digital football cards featuring dynamic 3D interactions and real-time statistics
                </p>
                </div>

                <div className="space-y-4">
                {[
                    'Authentic digital collectibles',
                    'Real-time performance updates',
                    'Exclusive player editions',
                    'Verifiable ownership'
                ].map((feature, index) => (
                    <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                    >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />
                    <span className="text-gray-300">{feature}</span>
                    </motion.div>
                ))}
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Current Release</span>
                    <span className="text-white">Series 01 / 2024</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Available Cards</span>
                    <span className="text-white">1,232 / 5,000</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Floor Price</span>
                    <span className="text-white">0.45 ETH</span>
                </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white hover:bg-white/20 transition-all duration-300"
                >
                    Browse Collection
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 hover:bg-white/10 transition-all duration-300"
                >
                    View Details
                </motion.button>
                </div>
            </motion.div>

            {/* Right Content - Spline Design */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative h-[700px] w-full flex items-center justify-center overflow-hidden"
            >
                <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[120%] h-[120%] -mt-20">
                    {/* Glow Effects */}
                    <div className="absolute inset-0 bg-blue-500/10 rounded-3xl blur-3xl animate-pulse-slow" />
                    
                    {/* Spline Container */}
                    <div className="relative w-full h-full scale-125">
                    <Spline scene="https://prod.spline.design/gXmj4i8CaELjDjr0/scene.splinecode" />
                    </div>
                </div>
                </div>
            </motion.div>
            </div>
        </div>
        </section>

        {/* Add more sections as needed */}

      </div>
    </ParallaxProvider>
  );
};

export default Landing;