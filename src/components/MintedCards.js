import { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { Web3Context } from '../context/Web3Context';
import { CARD_CONTRACT_ADDRESS, CARD_CONTRACT_ABI } from '../contracts/config';

const MintedCards = () => {
  const [cards, setCards] = useState([]);
  const { provider, account } = useContext(Web3Context);

  useEffect(() => {
    const fetchCards = async () => {
      if (!provider || !account) return;

      try {
        const contract = new ethers.Contract(
          CARD_CONTRACT_ADDRESS,
          CARD_CONTRACT_ABI,
          provider
        );

        // Get all token IDs (you'll need to implement this)
        const tokenIds = await contract.getOwnedTokens(account);
        
        const cardPromises = tokenIds.map(async (tokenId) => {
          const balance = await contract.balanceOf(account, tokenId);
          if (balance.gt(0)) {
            const attributes = await contract.getCardAttributes(tokenId);
            return {
              tokenId,
              balance: balance.toString(),
              ...attributes
            };
          }
          return null;
        });

        const cards = (await Promise.all(cardPromises)).filter(card => card !== null);
        setCards(cards);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    fetchCards();
  }, [provider, account]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.tokenId} className="card">
          <img src={card.imageUrl} alt={card.element} />
          <div className="card-info">
            <p>Element: {card.element}</p>
            <p>Power: {card.power}</p>
            <p>Defense: {card.defense}</p>
            <p>Special: {card.special}</p>
            <p>Rarity: {card.rarity}</p>
            <p>Quantity: {card.balance}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MintedCards; 