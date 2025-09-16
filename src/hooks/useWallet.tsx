'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ethers } from 'ethers';
import { trackWalletConnection, trackError } from '@/lib/analytics';

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string;
  balance: string;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  formatAddress: (address: string) => string;
  switchNetwork: (chainId: string) => Promise<void>;
  getBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// 支持的网络配置
const SUPPORTED_NETWORKS = {
  '0x1': { name: 'Ethereum Mainnet', rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY' },
  '0x89': { name: 'Polygon Mainnet', rpcUrl: 'https://polygon-rpc.com' },
  '0x38': { name: 'BSC Mainnet', rpcUrl: 'https://bsc-dataseed.binance.org' },
  '0x5': { name: 'Goerli Testnet', rpcUrl: 'https://goerli.infura.io/v3/YOUR_INFURA_KEY' },
  '0x13881': { name: 'Polygon Mumbai', rpcUrl: 'https://rpc-mumbai.maticvigil.com' }
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('0.00');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBalance = useCallback(async () => {
    if (!walletAddress || !window.ethereum) return;

    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [walletAddress, 'latest']
      }) as string;

      // 将 Wei 转换为 ETH
      const balanceInEth = ethers.formatEther(balance);
      setBalance(parseFloat(balanceInEth).toFixed(4));
    } catch (error) {
      console.error('获取余额失败:', error);
      trackError('balance_fetch_failed', error instanceof Error ? error.message : 'Unknown error');
    }
  }, [walletAddress]);

  const checkConnection = useCallback(async () => {
    if (!window.ethereum) {
      setError('请安装 MetaMask 钱包');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
      if (accounts.length > 0) {
        setIsConnected(true);
        setWalletAddress(accounts[0]);
        await getBalance();
      } else {
        setIsConnected(false);
        setWalletAddress('');
        setBalance('0.00');
      }
      setError(null);
    } catch (error) {
      console.error('检查连接失败:', error);
      trackError('connection_check_failed', error instanceof Error ? error.message : 'Unknown error');
      setError('检查连接失败');
    }
  }, [getBalance]);

  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWalletAddress(accounts[0]);
          getBalance();
        }
      };

      const handleChainChanged = () => {
        getBalance();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [checkConnection, getBalance]);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);

    if (typeof window.ethereum === 'undefined') {
      setError('请安装 MetaMask 钱包');
      setIsLoading(false);
      trackError('metamask_not_installed', 'MetaMask wallet not found');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      if (accounts.length > 0) {
        setIsConnected(true);
        setWalletAddress(accounts[0]);
        await getBalance();
        trackWalletConnection('MetaMask');
      }
    } catch (error: unknown) {
      console.error('连接钱包失败:', error);
      if (error && typeof error === 'object' && 'code' in error && error.code === 4001) {
        setError('用户拒绝连接');
        trackError('wallet_connection_rejected', 'User rejected connection');
      } else {
        setError('连接钱包失败');
        trackError('wallet_connection_failed', error instanceof Error ? error.message : 'Unknown error');
      }
      setIsConnected(false);
      setWalletAddress('');
      setBalance('0.00');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setBalance('0.00');
    setError(null);
  };

  const switchNetwork = async (chainId: string) => {
    if (!window.ethereum) {
      setError('请安装 MetaMask 钱包');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (error: unknown) {
      console.error('切换网络失败:', error);
      if (error && typeof error === 'object' && 'code' in error && error.code === 4902) {
        // 网络未添加，尝试添加
        const network = SUPPORTED_NETWORKS[chainId as keyof typeof SUPPORTED_NETWORKS];
        if (network) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId,
                chainName: network.name,
                rpcUrls: [network.rpcUrl],
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
              }],
            });
          } catch (addError) {
            console.error('添加网络失败:', addError);
            setError('添加网络失败');
            trackError('network_add_failed', addError instanceof Error ? addError.message : 'Unknown error');
          }
        }
      } else {
        setError('切换网络失败');
        trackError('network_switch_failed', error instanceof Error ? error.message : 'Unknown error');
      }
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        balance,
        isLoading,
        error,
        connectWallet,
        disconnectWallet,
        formatAddress,
        switchNetwork,
        getBalance,
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
