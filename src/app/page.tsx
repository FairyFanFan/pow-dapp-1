'use client';

import { useState, useEffect, useCallback } from 'react';
import { Wallet, Send, TrendingUp, Shield, ArrowUpRight, RefreshCw, Calendar, Code } from 'lucide-react';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { TokenInfo, POPULAR_TOKENS } from '@/types/tokens';
import { getMultipleTokenBalances, getTokenPrice } from '@/lib/erc20';
import { trackPageView } from '@/lib/analytics';

export default function Home() {
  const { 
    isConnected, 
    walletAddress, 
    balance, 
    isLoading, 
    connectWallet, 
    disconnectWallet, 
    formatAddress,
    getBalance
  } = useWallet();

  const [tokenBalances, setTokenBalances] = useState<TokenInfo[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [totalValueUSD, setTotalValueUSD] = useState(0);

  // Track page view
  useEffect(() => {
    trackPageView('home_page');
  }, []);

  const loadTokenBalances = useCallback(async () => {
    if (!walletAddress) return;
    
    setLoadingTokens(true);
    try {
      // Get balances for popular tokens
      const tokenAddresses = POPULAR_TOKENS.map(token => token.address);
      const balances = await getMultipleTokenBalances(tokenAddresses, walletAddress);
      
      // Combine with token info and prices
      const tokensWithBalances = await Promise.all(
        balances.map(async (balance) => {
          const tokenInfo = POPULAR_TOKENS.find(t => t.address === balance.tokenAddress);
          if (!tokenInfo) return null;

          const price = await getTokenPrice(balance.tokenAddress);
          const valueUSD = parseFloat(balance.formattedBalance) * price;

          return {
            ...tokenInfo,
            balance: balance.formattedBalance,
            priceUSD: price,
            valueUSD: valueUSD
          } as TokenInfo;
        })
      );

      const validTokens = tokensWithBalances.filter((token): token is TokenInfo => token !== null);
      
      // Add ETH to the list
      const ethPrice = await getTokenPrice('ETH');
      const ethValue = parseFloat(balance) * ethPrice;
      
      const ethToken: TokenInfo = {
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        balance: balance,
        priceUSD: ethPrice,
        valueUSD: ethValue
      };

      const allTokens = [ethToken, ...validTokens].filter(token => 
        parseFloat(token.balance || '0') > 0
      );

      setTokenBalances(allTokens);
      
      // Calculate total portfolio value
      const total = allTokens.reduce((sum, token) => sum + (token.valueUSD || 0), 0);
      setTotalValueUSD(total);
    } catch (error) {
      console.error('Failed to load token balances:', error);
    } finally {
      setLoadingTokens(false);
    }
  }, [walletAddress, balance]);

  // Load token balances when wallet is connected
  useEffect(() => {
    if (isConnected && walletAddress) {
      loadTokenBalances();
    }
  }, [isConnected, walletAddress, loadTokenBalances]);

  const refreshBalances = async () => {
    await getBalance();
    await loadTokenBalances();
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatBalance = (balance: string | undefined, decimals: number = 4) => {
    if (!balance) return '0.0000';
    const num = parseFloat(balance);
    return num.toFixed(decimals);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <main className="container mx-auto px-4 py-8">
        {isConnected ? (
          /* Portfolio Dashboard */
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Portfolio</h1>
                <p className="text-slate-300">
                  {formatAddress(walletAddress)} • Ethereum Mainnet
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={refreshBalances}
                  disabled={loadingTokens}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingTokens ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-300 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>

            {/* Portfolio Summary */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-white/70 text-sm mb-2">Total Portfolio Value</h3>
                <div className="text-3xl font-bold text-white mb-1">
                  {formatValue(totalValueUSD)}
                </div>
                <div className="text-green-400 text-sm">+2.5% (24h)</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-white/70 text-sm mb-2">Assets</h3>
                <div className="text-3xl font-bold text-white mb-1">
                  {tokenBalances.length}
                </div>
                <div className="text-white/60 text-sm">Different tokens</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-white/70 text-sm mb-2">Network</h3>
                <div className="text-3xl font-bold text-white mb-1">ETH</div>
                <div className="text-white/60 text-sm">Ethereum Mainnet</div>
              </div>
            </div>

            {/* Token Holdings */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Your Holdings</h2>
                {loadingTokens && (
                  <div className="flex items-center space-x-2 text-white/60">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Loading...</span>
                  </div>
                )}
              </div>

              {tokenBalances.length === 0 && !loadingTokens ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white/50 text-2xl">💰</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">No Tokens Found</h3>
                  <p className="text-white/60">
                    You don&apos;t have any tokens in your wallet yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tokenBalances.map((token) => (
                    <div
                      key={token.address}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg font-bold">
                            {token.symbol.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-white">{token.symbol}</div>
                          <div className="text-white/60 text-sm">{token.name}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-white font-semibold">
                          {formatBalance(token.balance)}
                        </div>
                        <div className="text-white/60 text-sm">
                          {formatValue(token.valueUSD || 0)}
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-white/60 text-sm">
                          ${token.priceUSD?.toFixed(2) || '0.00'}
                        </div>
                        <div className="flex items-center text-green-400 text-sm">
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                          +2.5%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Link 
                href="/send"
                className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <Send className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  <ArrowUpRight className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" />
                </div>
                <h3 className="text-white font-semibold mb-2">Send Tokens</h3>
                <p className="text-white/60 text-sm">
                  Transfer ETH and ERC-20 tokens to any address
                </p>
              </Link>

              <Link 
                href="/staking"
                className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-green-400 group-hover:text-green-300 transition-colors" />
                  <ArrowUpRight className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" />
                </div>
                <h3 className="text-white font-semibold mb-2">Staking</h3>
                <p className="text-white/60 text-sm">
                  Earn rewards by staking your tokens
                </p>
              </Link>

              <Link 
                href="/security"
                className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <Shield className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <ArrowUpRight className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" />
                </div>
                <h3 className="text-white font-semibold mb-2">Security</h3>
                <p className="text-white/60 text-sm">
                  Manage your wallet security settings
                </p>
              </Link>

              <Link 
                href="/changelog"
                className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="w-8 h-8 text-orange-400 group-hover:text-orange-300 transition-colors" />
                  <ArrowUpRight className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" />
                </div>
                <h3 className="text-white font-semibold mb-2">Changelog</h3>
                <p className="text-white/60 text-sm">
                  View feature updates and release notes
                </p>
              </Link>
            </div>
          </div>
        ) : (
          /* Welcome Screen */
          <div className="text-center py-20">
            <div className="max-w-2xl mx-auto">
              <Shield className="h-24 w-24 text-purple-400 mx-auto mb-8" />
              <h1 className="text-5xl font-bold text-white mb-6">
                Welcome to PowDApp
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                A modern decentralized application for managing your crypto portfolio with multi-token support
              </p>
              <div className="space-y-4">
                <button
                  onClick={connectWallet}
                  disabled={isLoading}
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-lg font-semibold rounded-xl transition-colors flex items-center space-x-3 mx-auto"
                >
                  <Wallet className="h-6 w-6" />
                  <span>{isLoading ? 'Connecting...' : 'Connect Your Wallet'}</span>
                </button>
                <p className="text-slate-400 text-sm">
                  Connect your MetaMask wallet to start managing your crypto assets
                </p>
                {typeof window !== 'undefined' && !window.ethereum && (
                  <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg">
                    <p className="text-yellow-400 text-sm">
                      Please install MetaMask browser extension to use this application
                    </p>
                  </div>
                )}
              </div>
              
              {/* Additional Info */}
              <div className="mt-12 grid md:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-xl p-6">
                  <Code className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Open Source</h3>
                  <p className="text-slate-400 text-sm">
                    Built with modern web technologies and open source principles
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-6">
                  <Shield className="h-8 w-8 text-green-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Secure</h3>
                  <p className="text-slate-400 text-sm">
                    Your private keys never leave your device. Full control over your assets.
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-6">
                  <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Always Updated</h3>
                  <p className="text-slate-400 text-sm">
                    Regular updates with new features and improvements. Check our changelog!
                  </p>
                  <Link 
                    href="/changelog"
                    className="inline-flex items-center mt-3 text-purple-400 hover:text-purple-300 text-sm"
                  >
                    View Changelog
                    <ArrowUpRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
