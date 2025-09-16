'use client';

import { useState } from 'react';
import { ArrowLeft, ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function TransactionsPage() {
  const [filter, setFilter] = useState('all');

  const transactions = [
    {
      id: '0x1234...5678',
      type: 'send',
      amount: '0.5 ETH',
      to: '0xabcd...efgh',
      status: 'confirmed',
      timestamp: '2 hours ago',
      gasFee: '0.002 ETH',
      hash: '0x1234567890abcdef1234567890abcdef12345678'
    },
    {
      id: '0x2345...6789',
      type: 'receive',
      amount: '1.2 ETH',
      from: '0xbcde...fghi',
      status: 'confirmed',
      timestamp: '1 day ago',
      gasFee: '0.001 ETH',
      hash: '0x2345678901bcdef2345678901bcdef234567890'
    },
    {
      id: '0x3456...789a',
      type: 'send',
      amount: '0.1 ETH',
      to: '0xcdef...ghij',
      status: 'pending',
      timestamp: '5 minutes ago',
      gasFee: '0.003 ETH',
      hash: '0x3456789012cdef3456789012cdef3456789012'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

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
          <h1 className="text-2xl font-bold text-white">Transaction History</h1>
          <div className="w-20"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-8">
            {[
              { id: 'all', label: 'All' },
              { id: 'send', label: 'Sent' },
              { id: 'receive', label: 'Received' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === tab.id
                    ? 'bg-purple-500 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Transaction List */}
          <div className="space-y-4">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      tx.type === 'send' ? 'bg-red-500/20' : 'bg-green-500/20'
                    }`}>
                      {tx.type === 'send' ? (
                        <span className="text-red-400 text-xl">↗</span>
                      ) : (
                        <span className="text-green-400 text-xl">↙</span>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white font-semibold">
                          {tx.type === 'send' ? 'Sent' : 'Received'} {tx.amount}
                        </span>
                        {getStatusIcon(tx.status)}
                      </div>
                      <div className="text-white/60 text-sm">
                        {tx.type === 'send' ? `To: ${tx.to}` : `From: ${tx.from}`}
                      </div>
                      <div className="text-white/50 text-xs">
                        {tx.timestamp} • Gas: {tx.gasFee}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${getStatusColor(tx.status)}`}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                    <a
                      href={`https://etherscan.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white/50 text-2xl">📄</span>
              </div>
              <h3 className="text-white font-semibold mb-2">No Transactions Found</h3>
              <p className="text-white/60">
                {filter === 'all' 
                  ? "You haven't made any transactions yet."
                  : `No ${filter} transactions found.`
                }
              </p>
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-white/70 text-sm mb-2">Total Sent</h3>
              <div className="text-2xl font-bold text-red-400">0.6 ETH</div>
              <div className="text-white/60 text-sm">Last 30 days</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-white/70 text-sm mb-2">Total Received</h3>
              <div className="text-2xl font-bold text-green-400">1.2 ETH</div>
              <div className="text-white/60 text-sm">Last 30 days</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-white/70 text-sm mb-2">Total Gas Fees</h3>
              <div className="text-2xl font-bold text-yellow-400">0.006 ETH</div>
              <div className="text-white/60 text-sm">Last 30 days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
