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

  // Add ethereum initialization
  useEffect(() => {
    const initializeEthereum = async () => {
        try {
            if (window.ethereum) {
                await window.ethereum.enable();
                console.log("Ethereum enabled successfully");
            }
        } catch (error) {
            console.error("Error enabling ethereum:", error);
        }
    };

    initializeEthereum();
  }, []);

  const LINEA_CHAIN_ID = '0xE705';

  const connectWallet = async () => {
    if (isConnecting) return;
    
    try {
      setIsConnecting(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error("Please install MetaMask");
      }

      // First, ensure we're on the correct network
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (currentChainId !== LINEA_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: LINEA_CHAIN_ID }],
          });
        } catch (switchError) {
          // Network doesn't exist, add it
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

      // Now connect to the network
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        // Verify we can get the balance
        const balance = await ethersProvider.getBalance(accounts[0]);
        console.log('Account balance:', ethers.formatEther(balance));
        
        setAccount(accounts[0]);
        setProvider(ethersProvider);
        setIsConnected(true);
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

  const mintCard = async (element, power, defense, special, rarity, imageUrl) => {
    try {
        if (!provider || !account) {
            throw new Error("Wallet not connected");
        }

        const signer = await provider.getSigner();
        console.log('Minting with account:', await signer.getAddress());

        const contract = new ethers.Contract(
            CARD_CONTRACT_ADDRESS,
            CARD_CONTRACT_ABI,
            signer
        );

        // Add delay before transaction
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Log contract state
        console.log('Contract address:', contract.address);
        console.log('Signer address:', await signer.getAddress());

        const tx = await contract.mintCard(
            element,
            Number(power),
            Number(defense),
            special,
            Number(rarity),
            {
                gasLimit: 1000000,
                gasPrice: ethers.parseUnits('50', 'gwei')  // Explicit gas price
            }
        );

        console.log('Transaction hash:', tx.hash);
        
        // Wait for confirmation with more blocks
        const receipt = await tx.wait(2);  // Wait for 2 confirmations
        console.log('Transaction confirmed:', receipt);

        return receipt;
    } catch (error) {
        console.error("Detailed error:", {
            error,
            message: error.message,
            code: error.code,
            data: error.data
        });
        throw error;
    }
};

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
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
  }, []);

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
      mintCard
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;