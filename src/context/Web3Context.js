import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CARD_CONTRACT_ADDRESS, CARD_CONTRACT_ABI } from '../contracts/config';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [contract, setContract] = useState(null);
    const [mintedCards, setMintedCards] = useState([]);

    const LINEA_CHAIN_ID = '0xE705';

    const initializeContract = async (signer) => {
        try {
            const contractInstance = new ethers.Contract(
                CARD_CONTRACT_ADDRESS,
                CARD_CONTRACT_ABI,
                signer
            );
            setContract(contractInstance);
            return contractInstance;
        } catch (error) {
            console.error("Contract initialization error:", error);
            return null;
        }
    };

    const fetchMintedCards = async (contractInstance, userAccount) => {
        try {
            const cards = [];
            const filter = contractInstance.filters.CardMinted(null, userAccount);
            const events = await contractInstance.queryFilter(filter);
            
            for (const event of events) {
                try {
                    const tokenId = event.args.tokenId;
                    const balance = await contractInstance.balanceOf(userAccount, tokenId);
                    
                    if (balance > 0) {
                        const cardAttributes = await contractInstance.getCardAttributes(tokenId);
                        cards.push({
                            tokenId: tokenId.toString(),
                            balance: balance.toString(),
                            name: cardAttributes.name,
                            element: cardAttributes.element,
                            power: cardAttributes.power,
                            defense: cardAttributes.defense,
                            special: cardAttributes.special,
                            rarity: cardAttributes.rarity,
                            imageUrl: cardAttributes.imageUrl
                        });
                    }
                } catch (error) {
                    console.log(`Error fetching card details:`, error);
                }
            }
            
            setMintedCards(cards);
        } catch (error) {
            console.error("Error fetching cards:", error);
        }
    };

    const connectWallet = async () => {
        if (isConnecting) return;
        
        try {
            setIsConnecting(true);
            setError(null);

            if (!window.ethereum) {
                throw new Error("Please install MetaMask");
            }

            const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
            
            if (currentChainId !== LINEA_CHAIN_ID) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: LINEA_CHAIN_ID }],
                    });
                } catch (switchError) {
                    if (switchError.code === 4902) {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: LINEA_CHAIN_ID,
                                chainName: 'Linea Sepolia',
                                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                                rpcUrls: ['https://rpc.sepolia.linea.build'],
                                blockExplorerUrls: ['https://sepolia.lineascan.build']
                            }],
                        });
                    } else {
                        throw switchError;
                    }
                }
            }

            const ethersProvider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            
            if (accounts.length > 0) {
                const signer = await ethersProvider.getSigner();
                setAccount(accounts[0]);
                setProvider(ethersProvider);
                setIsConnected(true);

                // Initialize contract and fetch cards immediately
                const contractInstance = await initializeContract(signer);
                if (contractInstance) {
                    await fetchMintedCards(contractInstance, accounts[0]);
                }
            }
        } catch (err) {
            console.error("Connection error:", err);
            setError(err.message);
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setProvider(null);
        setIsConnected(false);
        setError(null);
        setMintedCards([]);
        setContract(null);
    };

    const claimStarterPack = async () => {
        try {
            if (!provider || !account) {
                throw new Error("Wallet not connected");
            }

            console.log('Contract Address:', CARD_CONTRACT_ADDRESS);
            console.log('Account:', account);

            const signer = await provider.getSigner();
            console.log('Signer:', signer.address);

            if (!CARD_CONTRACT_ADDRESS || CARD_CONTRACT_ADDRESS.length !== 42) {
                throw new Error("Invalid contract address");
            }

            const contract = new ethers.Contract(
                CARD_CONTRACT_ADDRESS,
                CARD_CONTRACT_ABI,
                signer
            );

            // Use fixed gas limit instead of estimation
            const gasLimit = 1000000;

            console.log('Attempting to claim starter pack...');
            const tx = await contract.claimStarterPack({
                gasLimit: gasLimit
            });
            console.log('Transaction sent:', tx);
            
            console.log('Waiting for transaction confirmation...');
            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt);

            return true;
        } catch (error) {
            console.error("Error claiming starter pack:", error);
            throw error;
        }
    };

    const mintCard = async (element, power, defense, special, rarity) => {
        try {
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
                CARD_CONTRACT_ADDRESS,
                CARD_CONTRACT_ABI,
                signer
            );

            const tx = await contract.mintCard(
                element,
                power,
                defense,
                special,
                rarity
            );

            await tx.wait();
            return tx;
        } catch (error) {
            console.error("Minting error:", error);
            throw error;
        }
    };

    // Add new function for checking balances
    const getTokenBalance = async (address, tokenId) => {
        try {
            const contract = new ethers.Contract(
                CARD_CONTRACT_ADDRESS,
                CARD_CONTRACT_ABI,
                provider
            );
            return await contract.balanceOf(address, tokenId);
        } catch (error) {
            console.error("Balance check error:", error);
            throw error;
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', async (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    setIsConnected(true);
                    if (contract) {
                        await fetchMintedCards(contract, accounts[0]);
                    }
                } else {
                    disconnectWallet();
                }
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });

            window.ethereum.on('disconnect', () => {
                disconnectWallet();
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners();
            }
        };
    }, [contract]);

    return (
        <Web3Context.Provider value={{
            account,
            provider,
            isConnected,
            error,
            isConnecting,
            connectWallet,
            disconnectWallet,
            claimStarterPack,
            mintCard,
            getTokenBalance,
            contract,
            mintedCards,
            fetchMintedCards
        }}>
            {children}
        </Web3Context.Provider>
    );
};

export default Web3Provider;