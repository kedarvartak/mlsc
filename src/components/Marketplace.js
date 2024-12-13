import React, { useState, useContext } from 'react';
import { motion } from "framer-motion";
import { Web3Context } from '../context/Web3Context';

const Marketplace = () => {
    const { account, contract, mintedCards, fetchMintedCards } = useContext(Web3Context);
    const [mintingStatus, setMintingStatus] = useState('');
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
        if (!contract) {
            setMintingStatus('Please connect your wallet first');
            return;
        }

        try {
            setMintingStatus('Starting mint process...');
            
            const tx = await contract.mintCard(
                formData.element,
                Number(formData.power),
                Number(formData.defense),
                formData.special,
                Number(formData.rarity)
            );

            setMintingStatus('Minting in progress...');
            await tx.wait();
            
            setMintingStatus('Card minted successfully!');
            setFormData({
                element: '',
                power: '',
                defense: '',
                special: '',
                rarity: ''
            });

            // Fetch updated cards after successful mint
            await fetchMintedCards(contract, account);
        } catch (error) {
            console.error('Minting error:', error);
            setMintingStatus(`Error: ${error.message}`);
        }
    };

    const renderRarityStars = (rarity) => {
        const starCount = Math.min(Number(rarity.toString()), 5);
        return '★'.repeat(starCount);
    };

    return (
        <div className="min-h-screen bg-[#FFE8E8] p-8">
            {/* Mint Form Section */}
            <div className="mb-12 p-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-lg">
                <h2 className="text-4xl font-bold mb-8 text-black">Mint New Card</h2>
                
                <form onSubmit={mintCard} className="space-y-6">
                    <div className="form-group">
                        <label className="block text-xl mb-2 font-bold">Element:</label>
                        <select
                            name="element"
                            value={formData.element}
                            onChange={handleInputChange}
                            className="w-full p-3 border-4 border-black rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                            required
                        >
                            <option value="">Select Element</option>
                            <option value="Fire">Fire</option>
                            <option value="Water">Water</option>
                            <option value="Grass">Grass</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-group">
                            <label className="block text-xl mb-2 font-bold">Power (1-100):</label>
                            <input
                                type="number"
                                name="power"
                                value={formData.power}
                                onChange={handleInputChange}
                                min="1"
                                max="100"
                                className="w-full p-3 border-4 border-black rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="block text-xl mb-2 font-bold">Defense (1-100):</label>
                            <input
                                type="number"
                                name="defense"
                                value={formData.defense}
                                onChange={handleInputChange}
                                min="1"
                                max="100"
                                className="w-full p-3 border-4 border-black rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="block text-xl mb-2 font-bold">Special Move:</label>
                        <input
                            type="text"
                            name="special"
                            value={formData.special}
                            onChange={handleInputChange}
                            className="w-full p-3 border-4 border-black rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="block text-xl mb-2 font-bold">Rarity (1-5):</label>
                        <input
                            type="number"
                            name="rarity"
                            value={formData.rarity}
                            onChange={handleInputChange}
                            min="1"
                            max="5"
                            className="w-full p-3 border-4 border-black rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-500 text-white text-xl font-bold py-4 px-8 border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                        disabled={!account}
                    >
                        Mint Card
                    </button>
                </form>

                {mintingStatus && (
                    <div className="mt-6 p-4 border-4 border-black rounded-lg bg-yellow-100">
                        <p className="text-lg font-bold">{mintingStatus}</p>
                    </div>
                )}
            </div>

            {/* Minted Cards Section */}
            <div className="p-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-lg">
                <h2 className="text-4xl font-bold mb-8 text-black">Your Collection</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mintedCards.map((card) => (
                        <motion.div
                            key={card.tokenId}
                            className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all p-6"
                            whileHover={{ scale: 1.02 }}
                        >
                            <img 
                                src={card.imageUrl || 'placeholder-image-url'} 
                                alt={card.name || 'Pokemon Card'}
                                className="w-full h-48 object-contain mb-4 rounded-xl border-4 border-black"
                            />
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-display text-2xl font-black">{card.name || 'Unknown'}</h3>
                                    <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full border-2 border-black">
                                        {card.element} Type
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-red-100 rounded-lg border-2 border-black p-2 text-center">
                                        <div className="text-black font-bold text-xs">ATK</div>
                                        <div className="text-black font-black text-sm">
                                            {Number(card.power.toString())}
                                        </div>
                                    </div>
                                    <div className="bg-blue-100 rounded-lg border-2 border-black p-2 text-center">
                                        <div className="text-black font-bold text-xs">DEF</div>
                                        <div className="text-black font-black text-sm">
                                            {Number(card.defense.toString())}
                                        </div>
                                    </div>
                                    <div className="bg-yellow-100 rounded-lg border-2 border-black p-2 text-center">
                                        <div className="text-black font-bold text-xs">QTY</div>
                                        <div className="text-black font-black text-sm">
                                            {Number(card.balance.toString())}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="bg-yellow-400 text-black text-sm font-bold px-3 py-1 rounded-full border-2 border-black">
                                        {renderRarityStars(card.rarity)}
                                    </span>
                                </div>

                                <div className="text-sm font-bold text-gray-600 border-t-2 border-black pt-2">
                                    Special Move: {card.special}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {mintedCards.length === 0 && (
                    <div className="text-center p-8 border-4 border-black rounded-lg bg-gray-100">
                        <p className="text-xl font-bold">No cards in your collection yet. Start minting above!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketplace;