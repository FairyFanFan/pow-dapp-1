'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ethers } from 'ethers';

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
      setError('获取余额失败');
    }
  }, [walletAddress]);

  const checkConnection = useCallback(async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          await getBalance();
        }
      } catch (error) {
        console.error('检查连接状态失败:', error);
      }
    }
  }, [getBalance]);

  // 检查是否已连接钱包
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // 监听账户变化
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          getBalance();
        } else {
          setIsConnected(false);
          setWalletAddress('');
          setBalance('0.00');
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [getBalance]);

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('请安装 MetaMask 钱包');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 请求连接钱包
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      }) as string[];

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        await getBalance();
        await checkNetwork();
      }
    } catch (error: unknown) {
      console.error('连接钱包失败:', error);
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as { code: number }).code;
        if (errorCode === 4001) {
          setError('用户拒绝了连接请求');
        } else if (errorCode === -32002) {
          setError('连接请求已在进行中，请检查 MetaMask');
        } else {
          setError('连接钱包失败');
        }
      } else {
        setError('连接钱包失败');
      }
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

  const checkNetwork = async () => {
    if (!window.ethereum) return;

    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
      const network = SUPPORTED_NETWORKS[chainId as keyof typeof SUPPORTED_NETWORKS];
      
      if (!network) {
        setError(`不支持的网络 (Chain ID: ${chainId})，请切换到以太坊主网`);
      }
    } catch (error) {
      console.error('检查网络失败:', error);
    }
  };

  const switchNetwork = async (chainId: string) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }]
      });
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as { code: number }).code;
        if (errorCode === 4902) {
          // 网络不存在，尝试添加
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
                    decimals: 18
                  }
                }]
              });
            } catch (addError) {
              console.error('添加网络失败:', addError);
              setError('添加网络失败');
            }
          }
        } else {
          console.error('切换网络失败:', error);
          setError('切换网络失败');
        }
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
        getBalance
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
