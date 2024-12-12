import React, { createContext, useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask");
      }

      // Reset MetaMask
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });

      // Switch to Hardhat network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7A69' }], // 31337 in hex
      });

      const ethersProvider = new BrowserProvider(window.ethereum);
      const accounts = await ethersProvider.send("eth_requestAccounts", []);
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setProvider(ethersProvider);
        setIsConnected(true);
        setError(null);
      }
    } catch (err) {
      console.error("Connection error:", err);
      setError(err.message);
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
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
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
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </Web3Context.Provider>
  );
}; 