import { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { Web3Context } from '../context/Web3Context';
import { CARD_CONTRACT_ADDRESS, CARD_CONTRACT_ABI } from '../contracts/config';
import { motion } from 'framer-motion';

const MintedCards = () => {
  const { provider, account } = useContext(Web3Context);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMintedCards = async () => {
      try {
        if (!provider || !account) return;

        const contract = new ethers.Contract(
          CARD_CONTRACT_ADDRESS,
          CARD_CONTRACT_ABI,
          provider
        );

        // Get all tokens owned by the account
        const tokenIds = await contract.getTokensByOwner(account);
        
        const fetchedCards = await Promise.all(
          tokenIds.map(async (tokenId) => {
            const attributes = await contract.getCardAttributes(tokenId);
            return {
              tokenId: tokenId.toString(),
              element: attributes.element,
              power: attributes.power,
              defense: attributes.defense,
              special: attributes.special,
              rarity: attributes.rarity
            };
          })
        );

        setCards(fetchedCards);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching minted cards:', error);
        setLoading(false);
      }
    };

    fetchMintedCards();
  }, [provider, account]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-white">Loading your cards...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Your Minted Cards</h2>
      
      {cards.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          You haven't minted any cards yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <motion.div
              key={card.tokenId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white text-lg">Card #{card.tokenId}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    card.rarity >= 4 ? 'bg-yellow-400/90 text-black' : 
                    card.rarity >= 3 ? 'bg-purple-400/90 text-white' :
                    'bg-blue-400/90 text-white'
                  }`}>
                    Rarity: {card.rarity}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Element:</span>
                    <span className="text-white">{card.element}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Power:</span>
                    <span className="text-white">{card.power}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Defense:</span>
                    <span className="text-white">{card.defense}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Special:</span>
                    <span className="text-white">{card.special}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MintedCards; 