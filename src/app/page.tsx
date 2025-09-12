'use client';

import { useState, useEffect } from 'react';
import { Wallet, Send, Shield, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('0.00');
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    setIsLoading(true);
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnected(true);
      setWalletAddress('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
      setBalance('2.45');
      setIsLoading(false);
    }, 1500);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setBalance('0.00');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">PowDApp</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Connected</p>
                    <p className="text-white font-mono">{formatAddress(walletAddress)}</p>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isLoading}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Wallet className="h-4 w-4" />
                  <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isConnected ? (
          <div className="space-y-8">
            {/* Balance Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Portfolio</h2>
                <Activity className="h-6 w-6 text-purple-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">ETH</span>
                    </div>
                    <span className="text-slate-300">Ethereum</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{balance} ETH</p>
                  <p className="text-green-400 text-sm">+2.4% (24h)</p>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">BTC</span>
                    </div>
                    <span className="text-slate-300">Bitcoin</span>
                  </div>
                  <p className="text-3xl font-bold text-white">0.15 BTC</p>
                  <p className="text-red-400 text-sm">-1.2% (24h)</p>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                    <span className="text-slate-300">Total Value</span>
                  </div>
                  <p className="text-3xl font-bold text-white">$4,250.00</p>
                  <p className="text-green-400 text-sm">+5.8% (24h)</p>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/send" className="group">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 group-hover:border-purple-500 transition-colors">
                  <div className="flex items-center space-x-3 mb-4">
                    <Send className="h-6 w-6 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">Send</h3>
                  </div>
                  <p className="text-slate-400 mb-4">Transfer tokens to another wallet</p>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors">
                    Send Tokens
                  </button>
                </div>
              </Link>

              <Link href="/staking" className="group">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 group-hover:border-purple-500 transition-colors">
                  <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                    <h3 className="text-xl font-semibold text-white">Stake</h3>
                  </div>
                  <p className="text-slate-400 mb-4">Earn rewards by staking your tokens</p>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors">
                    Start Staking
                  </button>
                </div>
              </Link>

              <Link href="/security" className="group">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 group-hover:border-purple-500 transition-colors">
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="h-6 w-6 text-blue-400" />
                    <h3 className="text-xl font-semibold text-white">Security</h3>
                  </div>
                  <p className="text-slate-400 mb-4">Manage your security settings</p>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors">
                    Security Center
                  </button>
                </div>
              </Link>
            </div>

            {/* Recent Transactions */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-6">Recent Transactions</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Send className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Sent to 0x742...5a3b</p>
                      <p className="text-slate-400 text-sm">2 hours ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-red-400 font-medium">-0.5 ETH</p>
                    <p className="text-slate-400 text-sm">$1,250.00</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Staking Reward</p>
                      <p className="text-slate-400 text-sm">1 day ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-medium">+0.02 ETH</p>
                    <p className="text-slate-400 text-sm">$50.00</p>
                  </div>
                </div>
              </div>
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
                A modern decentralized application for managing your crypto portfolio
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
                  Connect your wallet to start managing your crypto assets
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
