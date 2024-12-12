import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (isConnecting) return; // Prevent multiple connection attempts
    
    try {
      setIsConnecting(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error("Please install MetaMask");
      }

      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
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
      disconnectWallet
    }}>
      {children}
    </Web3Context.Provider>
  );
}; 