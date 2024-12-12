import { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { Web3Context } from '../context/Web3Context';
import { CARD_CONTRACT_ADDRESS, CARD_CONTRACT_ABI } from '../contracts/config';

const MintedCards = () => {
  const { provider, account } = useContext(Web3Context);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMintedCards = async () => {
    try {
      if (!provider || !account) {
        console.log('Provider or account not available');
        return;
      }

      const contract = new ethers.Contract(
        CARD_CONTRACT_ADDRESS,
        CARD_CONTRACT_ABI,
        provider
      );

      console.log('Fetching cards for account:', account);

      // Get tokens owned by the account
      const tokenIds = await contract.getTokensByOwner(account);
      console.log('Token IDs:', tokenIds);

      // Fetch attributes for each token
      const cardPromises = tokenIds.map(async (tokenId) => {
        const attributes = await contract.getCardAttributes(tokenId);
        return {
          id: tokenId.toString(),
          element: attributes.element,
          power: attributes.power,
          defense: attributes.defense,
          special: attributes.special,
          rarity: attributes.rarity
        };
      });

      const fetchedCards = await Promise.all(cardPromises);
      console.log('Fetched cards:', fetchedCards);
      setCards(fetchedCards);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setLoading(false);
    }
  };

  // Fetch cards when component mounts or when account/provider changes
  useEffect(() => {
    fetchMintedCards();
  }, [provider, account]);

  // Also fetch cards after successful minting
  useEffect(() => {
    const contract = new ethers.Contract(
      CARD_CONTRACT_ADDRESS,
      CARD_CONTRACT_ABI,
      provider
    );

    if (contract && provider) {
      // Listen for CardMinted events
      contract.on('CardMinted', (tokenId, owner) => {
        if (owner.toLowerCase() === account?.toLowerCase()) {
          console.log('New card minted, refreshing...');
          fetchMintedCards();
        }
      });

      return () => {
        contract.removeAllListeners('CardMinted');
      };
    }
  }, [provider, account]);

  if (loading) {
    return <div className="text-center py-4">Loading your cards...</div>;
  }

  if (!cards.length) {
    return <div className="text-center py-4">No cards found. Mint some cards to see them here!</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {cards.map((card) => (
        <div key={card.id} className="bg-gray-800 rounded-lg p-4 shadow-lg">
          <h3 className="text-xl font-bold mb-2">{card.element} Card</h3>
          <div className="space-y-2">
            <p>Power: {card.power}</p>
            <p>Defense: {card.defense}</p>
            <p>Special: {card.special}</p>
            <p>Rarity: {card.rarity}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MintedCards; 