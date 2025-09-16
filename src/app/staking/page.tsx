'use client';

import { useState } from 'react';
import { ArrowLeft, TrendingUp, Shield, Zap } from 'lucide-react';
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/" 
            className="flex items-center text-white hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-white">Staking</h1>
          <div className="w-20"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Staking Pools */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {stakingPools.map((pool) => (
              <div
                key={pool.id}
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all cursor-pointer ${
                  selectedPool === pool.id
                    ? 'border-purple-400 bg-purple-400/20'
                    : 'border-white/20 hover:border-white/40'
                }`}
                onClick={() => setSelectedPool(pool.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">{pool.name}</h3>
                  <div className={`w-3 h-3 rounded-full ${
                    pool.color === 'purple' ? 'bg-purple-400' :
                    pool.color === 'orange' ? 'bg-orange-400' : 'bg-green-400'
                  }`}></div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">APY</span>
                    <span className="text-green-400 font-semibold">{pool.apy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">TVL</span>
                    <span className="text-white">{pool.tvl}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Min Stake</span>
                    <span className="text-white">{pool.minStake}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Lock Period</span>
                    <span className="text-white">{pool.lockPeriod}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Staking Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Stake Your Tokens</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Stake Amount */}
              <div>
                <label className="block text-white/70 text-sm mb-2">Stake Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 text-sm">
                    ETH
                  </div>
                </div>
                <div className="mt-2 text-white/60 text-sm">
                  Available: 2.5 ETH
                </div>
              </div>

              {/* Estimated Rewards */}
              <div>
                <label className="block text-white/70 text-sm mb-2">Estimated Rewards</label>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    +0.13 ETH/year
                  </div>
                  <div className="text-white/60 text-sm">
                    Based on 5.2% APY
                  </div>
                </div>
              </div>
            </div>

            {/* Staking Button */}
            <button
              onClick={handleStake}
              disabled={isStaking || !stakeAmount}
              className="w-full mt-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center"
            >
              {isStaking ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Staking...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Stake {stakeAmount} ETH
                </>
              )}
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <Shield className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Secure Staking</h3>
              <p className="text-white/70 text-sm">
                Your tokens are secured by smart contracts and audited protocols.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <TrendingUp className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">High Yields</h3>
              <p className="text-white/70 text-sm">
                Earn competitive returns on your staked tokens with compound interest.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <Zap className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Instant Unstaking</h3>
              <p className="text-white/70 text-sm">
                Unstake your tokens anytime with our flexible staking options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
