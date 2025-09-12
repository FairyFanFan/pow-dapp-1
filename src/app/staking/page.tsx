'use client';

import { useState } from 'react';
import { ArrowLeft, TrendingUp, Clock, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function StakingPage() {
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedPool, setSelectedPool] = useState('eth-pool');
  const [isStaking, setIsStaking] = useState(false);

  const stakingPools = [
    {
      id: 'eth-pool',
      name: 'Ethereum Staking Pool',
      apy: '5.2%',
      tvl: '$2.4M',
      minStake: '0.1 ETH',
      lockPeriod: '30 days',
      color: 'purple'
    },
    {
      id: 'btc-pool',
      name: 'Bitcoin Staking Pool',
      apy: '4.8%',
      tvl: '$1.8M',
      minStake: '0.05 BTC',
      lockPeriod: '60 days',
      color: 'orange'
    },
    {
      id: 'defi-pool',
      name: 'DeFi Yield Pool',
      apy: '8.5%',
      tvl: '$3.2M',
      minStake: '100 USDC',
      lockPeriod: '14 days',
      color: 'green'
    }
  ];

  const handleStake = async () => {
    setIsStaking(true);
    // Simulate staking process
    setTimeout(() => {
      setIsStaking(false);
      alert('Successfully staked!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-purple-400" />
                <h1 className="text-2xl font-bold text-white">Staking</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Staking Pools */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">Available Staking Pools</h2>
            
            {stakingPools.map((pool) => (
              <div
                key={pool.id}
                className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border transition-all cursor-pointer ${
                  selectedPool === pool.id 
                    ? 'border-purple-500 bg-purple-900/20' 
                    : 'border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => setSelectedPool(pool.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-${pool.color}-500 rounded-full flex items-center justify-center`}>
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{pool.name}</h3>
                      <p className="text-slate-400">APY: {pool.apy}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">{pool.apy}</p>
                    <p className="text-slate-400 text-sm">APY</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-slate-400 text-sm">TVL</p>
                    <p className="text-white font-semibold">{pool.tvl}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Min Stake</p>
                    <p className="text-white font-semibold">{pool.minStake}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Lock Period</p>
                    <p className="text-white font-semibold">{pool.lockPeriod}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Staking Form */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Stake Tokens</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Amount to Stake
                  </label>
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Available: 2.45 ETH</span>
                  <button className="text-purple-400 hover:text-purple-300">
                    Max
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Estimated APY</span>
                    <span className="text-green-400 font-semibold">5.2%</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Lock Period</span>
                    <span className="text-white">30 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Expected Rewards</span>
                    <span className="text-white font-semibold">
                      {stakeAmount ? (parseFloat(stakeAmount) * 0.052 / 12).toFixed(4) : '0.0000'} ETH
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleStake}
                  disabled={!stakeAmount || isStaking}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Zap className="h-4 w-4" />
                  <span>{isStaking ? 'Staking...' : 'Stake Now'}</span>
                </button>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="h-5 w-5 text-blue-400" />
                <h4 className="text-lg font-semibold text-white">Security</h4>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Audited smart contracts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Non-custodial staking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Insurance coverage</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
