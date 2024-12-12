import { motion } from "framer-motion";
import { useState, useContext } from "react";
import { ethers } from 'ethers';
import { Web3Context } from '../context/Web3Context';
import { CARD_CONTRACT_ADDRESS, CARD_CONTRACT_ABI } from '../contracts/config';
import MintedCards from './MintedCards';

const Marketplace = () => {
  const { provider, account } = useContext(Web3Context);
  const [mintingStatus, setMintingStatus] = useState('');

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Sample card data
  const cards = [
    {
      id: 1,
      name: "Lionel Messi",
      rarity: "Legendary",
      price: 12.5,
      currency: "ETH",
      image: "/messi.jpg",
      seller: "0x1234...5678",
      attributes: {
        pace: 91,
        shooting: 94,
        passing: 96
      },
      listed: "2 hours ago"
    },
    
  ];

  // Form state
  const [formData, setFormData] = useState({
    element: '',
    power: '',
    defense: '',
    special: '',
    rarity: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const mintCard = async (e) => {
    e.preventDefault();
    try {
      setMintingStatus('Starting mint process...');
      
      // Basic validation
      if (!formData.element || !formData.power || !formData.defense || !formData.special || !formData.rarity) {
        throw new Error('All fields are required');
      }

      const signer = await provider.getSigner();
      console.log('Signer address:', await signer.getAddress());

      // Create contract instance
      const contract = new ethers.Contract(
        CARD_CONTRACT_ADDRESS,
        CARD_CONTRACT_ABI,
        signer
      );

      // Log transaction parameters
      const params = {
        element: formData.element,
        power: parseInt(formData.power),
        defense: parseInt(formData.defense),
        special: formData.special,
        rarity: parseInt(formData.rarity)
      };
      console.log('Minting with parameters:', params);

      // Get current gas price
      const feeData = await provider.getFeeData();
      console.log('Current gas price:', feeData.gasPrice.toString());

      setMintingStatus('Sending transaction...');

      // Send transaction with explicit gas settings
      const tx = await contract.mintCard(
        params.element,
        params.power,
        params.defense,
        params.special,
        params.rarity,
        {
          gasLimit: 300000,
          gasPrice: feeData.gasPrice
        }
      );

      console.log('Transaction sent:', tx.hash);
      setMintingStatus('Transaction sent, waiting for confirmation...');

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      setMintingStatus('Card minted successfully!');
      
      // Reset form
      setFormData({
        element: '',
        power: '',
        defense: '',
        special: '',
        rarity: ''
      });

    } catch (error) {
      console.error('Minting error:', {
        message: error.message,
        code: error.code,
        data: error.data
      });
      setMintingStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-light text-white">Marketplace</h1>
            <p className="text-gray-400">Discover, collect, and trade unique player cards</p>
          </div>
          
          {/* Search Bar */}
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search cards..."
                className="w-full md:w-80 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 
                         text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50"
              />
              <svg className="w-5 h-5 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filters and Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            {/* Price Range Filter */}
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <h3 className="text-white mb-4">Price Range</h3>
              <input
                type="range"
                min="0"
                max="100"
                className="w-full h-2 bg-blue-500/20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-2">
                <span className="text-gray-400">0 ETH</span>
                <span className="text-gray-400">100 ETH</span>
              </div>
            </div>

            {/* Rarity Filter */}
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <h3 className="text-white mb-4">Rarity</h3>
              {['Common', 'Rare', 'Epic', 'Legendary'].map((rarity) => (
                <label key={rarity} className="flex items-center space-x-3 mb-3">
                  <input type="checkbox" className="form-checkbox text-blue-500 rounded bg-white/5 border-white/10" />
                  <span className="text-gray-300">{rarity}</span>
                </label>
              ))}
            </div>

            {/* Sort Options */}
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <h3 className="text-white mb-4">Sort By</h3>
              <select className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 focus:outline-none">
                <option value="recent">Recently Listed</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rarity">Rarity</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden"
                >
                  {/* Card Image */}
                  <div className="relative aspect-square">
                    <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-yellow-400/90 text-black text-xs">
                      {card.rarity}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-white text-lg">{card.name}</h3>
                      <div className="text-right">
                        <div className="text-blue-400 text-lg">{card.price} {card.currency}</div>
                        <div className="text-gray-400 text-xs">${card.price * 2000}</div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(card.attributes).map(([key, value]) => (
                        <div key={key} className="text-center p-1 rounded-lg bg-white/5">
                          <div className="text-gray-400 text-xs">{key}</div>
                          <div className="text-white text-sm">{value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Buy Button */}
                    <button className="w-full py-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-400/30 
                                     hover:bg-blue-500/30 transition-all duration-300">
                      Buy Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <MintedCards />

        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Mint New Card</h2>
          
          <form onSubmit={mintCard} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Element</label>
              <input
                type="text"
                name="element"
                value={formData.element}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2"
                placeholder="Fire, Water, Earth, Air"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Power (0-100)</label>
              <input
                type="number"
                name="power"
                min="0"
                max="100"
                value={formData.power}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Defense (0-100)</label>
              <input
                type="number"
                name="defense"
                min="0"
                max="100"
                value={formData.defense}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Special Ability</label>
              <input
                type="text"
                name="special"
                value={formData.special}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2"
                placeholder="Fireball, Heal, Shield"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Rarity (1-5)</label>
              <input
                type="number"
                name="rarity"
                min="1"
                max="5"
                value={formData.rarity}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm 
                       text-white px-6 py-3 rounded-xl border border-white/10 hover:border-blue-400/30 
                       transition-all duration-300"
            >
              Mint Card
            </button>
          </form>

          {mintingStatus && (
            <div className={`mt-4 text-center ${mintingStatus.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
              {mintingStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace; 