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

      console.log('Contract instance created');
      console.log('Fetching cards for account:', account);

      try {
        // Check balance first
        const balance = await contract.balanceOf(account);
        console.log('Account balance:', balance.toString());

        if (balance.toString() === '0') {
          console.log('No tokens found for account');
          setCards([]);
          setLoading(false);
          return;
        }

        // Get tokens owned by the account
        const tokenIds = await contract.getTokensByOwner(account);
        console.log('Raw token IDs response:', tokenIds);

        if (!tokenIds) {
          console.log('No tokens found for account');
          setCards([]);
          setLoading(false);
          return;
        }

        // Ensure tokenIds is an array
        const tokenIdsArray = Array.isArray(tokenIds) ? tokenIds : [tokenIds];
        console.log('Token IDs array:', tokenIdsArray);

        // Fetch attributes for each token
        const cardPromises = tokenIdsArray.map(async (tokenId) => {
          try {
            console.log('Fetching attributes for token:', tokenId.toString());
            const attributes = await contract.getCardAttributes(tokenId);
            console.log('Attributes for token', tokenId.toString(), ':', attributes);
            
            return {
              id: tokenId.toString(),
              element: attributes.element,
              power: attributes.power,
              defense: attributes.defense,
              special: attributes.special,
              rarity: attributes.rarity,
              imageUrl: attributes.imageUrl
            };
          } catch (error) {
            console.error(`Error fetching attributes for token ${tokenId}:`, error);
            return null;
          }
        });

        const fetchedCards = (await Promise.all(cardPromises)).filter(card => card !== null);
        console.log('Final fetched cards:', fetchedCards);
        setCards(fetchedCards);
      } catch (error) {
        console.error('Error in data fetching:', error);
        throw error;
      } finally {
        setLoading(false);
      }
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div key={card.id} className="bg-white rounded-xl p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="relative aspect-square mb-4 bg-[#FFE8E8] rounded-lg overflow-hidden">
            <img 
              src={card.imageUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${(parseInt(card.id) % 151) + 1}.png`}
              alt={`${card.element} Pokemon`}
              className="w-full h-full object-contain p-4"
            />
            <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full border-2 border-black font-bold text-sm">
              #{card.id}
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-4 text-center">
            {card.element} Pokemon
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b-2 border-black/10 pb-2">
              <span className="font-bold">Power</span>
              <span className="text-red-500 font-bold">{card.power}</span>
            </div>
            <div className="flex justify-between items-center border-b-2 border-black/10 pb-2">
              <span className="font-bold">Defense</span>
              <span className="text-blue-500 font-bold">{card.defense}</span>
            </div>
            <div className="flex justify-between items-center border-b-2 border-black/10 pb-2">
              <span className="font-bold">Special</span>
              <span className="text-purple-500 font-bold">{card.special}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold">Rarity</span>
              <span className="text-yellow-500 font-bold">{'⭐'.repeat(parseInt(card.rarity))}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MintedCards; 