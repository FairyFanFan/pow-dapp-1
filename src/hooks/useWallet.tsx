'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string;
  balance: string;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  formatAddress: (address: string) => string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('0.00');
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    setIsLoading(true);
    // Simulate wallet connection with different delays
    const delay = Math.random() * 1000 + 1000; // 1-2 seconds
    setTimeout(() => {
      setIsConnected(true);
      setWalletAddress('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
      setBalance('2.45');
      setIsLoading(false);
    }, delay);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setBalance('0.00');
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Simulate balance updates
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setBalance(prev => {
          const current = parseFloat(prev);
          const change = (Math.random() - 0.5) * 0.01; // ±0.5% change
          return (current + change).toFixed(2);
        });
      }, 10000); // Update every 10 seconds

      return () => clearInterval(interval);
    }
  }, [isConnected]);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        balance,
        isLoading,
        connectWallet,
        disconnectWallet,
        formatAddress
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
