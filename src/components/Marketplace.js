import { motion } from "framer-motion";
import { useState, useContext, useEffect } from "react";
import { ethers } from 'ethers';
import { Web3Context } from '../context/Web3Context';
import { CARD_CONTRACT_ADDRESS, CARD_CONTRACT_ABI } from '../contracts/config';
import MintedCards from './MintedCards';

const Marketplace = () => {
  const { provider, account, isConnected, connectWallet } = useContext(Web3Context);
  const [mintingStatus, setMintingStatus] = useState('');
  const [formData, setFormData] = useState({
    element: '',
    power: '',
    defense: '',
    special: '',
    rarity: ''
  });

  useEffect(() => {
    const checkConnection = async () => {
      if (!isConnected && window.ethereum) {
        try {
          await connectWallet();
        } catch (error) {
          console.error('Connection error:', error);
          setMintingStatus('Error: Please connect your wallet');
        }
      }
    };
    
    checkConnection();
  }, [isConnected, connectWallet]);

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
        if (!isConnected || !provider || !account) {
            setMintingStatus('Please connect your wallet first');
            await connectWallet();
            return;
        }

        setMintingStatus('Starting mint process...');
        
        const signer = await provider.getSigner();
        console.log('Using signer:', await signer.getAddress());

        const contract = new ethers.Contract(
            CARD_CONTRACT_ADDRESS,
            CARD_CONTRACT_ABI,
            signer
        );

        // Validate input values
        if (!formData.element || !formData.power || !formData.defense || !formData.special || !formData.rarity) {
            throw new Error("All fields are required");
        }

        if (Number(formData.power) < 0 || Number(formData.power) > 100) {
            throw new Error("Power must be between 0 and 100");
        }

        if (Number(formData.defense) < 0 || Number(formData.defense) > 100) {
            throw new Error("Defense must be between 0 and 100");
        }

        if (Number(formData.rarity) < 1 || Number(formData.rarity) > 5) {
            throw new Error("Rarity must be between 1 and 5");
        }

        console.log('Mint parameters:', {
            element: formData.element,
            power: Number(formData.power),
            defense: Number(formData.defense),
            special: formData.special,
            rarity: Number(formData.rarity)
        });

        // Add delay before transaction
        await new Promise(resolve => setTimeout(resolve, 1000));

        const tx = await contract.mintCard(
            formData.element,
            Number(formData.power),
            Number(formData.defense),
            formData.special,
            Number(formData.rarity),
            {
                gasLimit: 1000000
            }
        );

        console.log('Transaction sent:', tx.hash);
        setMintingStatus('Transaction sent, waiting for confirmation...');

        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);
        
        setMintingStatus('Card minted successfully!');
        
        // Reset form after successful mint
        setFormData({
            element: '',
            power: '',
            defense: '',
            special: '',
            rarity: ''
        });
        
    } catch (error) {
        console.error('Minting error:', error);
        setMintingStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFE8E8] pt-24 pb-12 relative">
      {/* Background blur effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-500/20 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-yellow-500/20 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse-slow" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-black mb-4">
            Pokemon Card <span className="text-red-500">Marketplace</span>
          </h1>
          <p className="text-gray-700 text-lg">
            Mint new cards or view your collection
          </p>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="mb-6">
            <motion.button
              onClick={connectWallet}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Connect Wallet
            </motion.button>
          </div>
        )}

        {/* Your Cards Section */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-6">Your Collection</h2>
          <MintedCards />
        </div>

        {/* Mint New Card Section */}
        <div className="bg-white p-8 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="font-display text-2xl font-bold mb-6">Mint New Card</h2>
          
          <form onSubmit={mintCard} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Element</label>
              <input
                type="text"
                name="element"
                value={formData.element}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                placeholder="Fire, Water, Grass"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Power (0-100)</label>
                <input
                  type="number"
                  name="power"
                  min="0"
                  max="100"
                  value={formData.power}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Defense (0-100)</label>
                <input
                  type="number"
                  name="defense"
                  min="0"
                  max="100"
                  value={formData.defense}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Special Move</label>
              <input
                type="text"
                name="special"
                value={formData.special}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                placeholder="Thunderbolt, Solar Beam, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Rarity (1-5)</label>
              <input
                type="number"
                name="rarity"
                min="1"
                max="5"
                value={formData.rarity}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
            </div>

            <motion.button
              type="submit"
              disabled={!isConnected}
              className={`w-full px-8 py-4 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                isConnected ? 'bg-red-500 text-white' : 'bg-gray-300 cursor-not-allowed'
              }`}
              whileHover={{ scale: isConnected ? 1.02 : 1 }}
              whileTap={{ scale: isConnected ? 0.98 : 1 }}
            >
              {isConnected ? 'Mint Pokemon Card' : 'Connect Wallet to Mint'}
            </motion.button>
          </form>

          {mintingStatus && (
            <div className={`mt-4 text-center font-bold ${mintingStatus.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
              {mintingStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;