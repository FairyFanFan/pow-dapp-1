'use client';

import { useState } from 'react';
import { ArrowLeft, Filter, Search, Download, Activity, Send, TrendingUp, Shield } from 'lucide-react';
import Link from 'next/link';
import { useTransactions, Transaction } from '@/hooks/useTransactions';
import { formatTimeAgo, formatAddress } from '@/lib/utils';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function TransactionsPage() {
  const { transactions } = useTransactions();
  const [filter, setFilter] = useState<'all' | 'send' | 'receive' | 'stake' | 'reward'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === 'all' || tx.type === filter;
    const matchesSearch = searchTerm === '' || 
      tx.amount.includes(searchTerm) || 
      tx.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.to && tx.to.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.from && tx.from.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'send':
        return <Send className="h-5 w-5 text-red-400" />;
      case 'receive':
        return <Send className="h-5 w-5 text-green-400" />;
      case 'stake':
        return <TrendingUp className="h-5 w-5 text-blue-400" />;
      case 'unstake':
        return <TrendingUp className="h-5 w-5 text-yellow-400" />;
      case 'reward':
        return <Shield className="h-5 w-5 text-purple-400" />;
      default:
        return <Activity className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
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
                <Activity className="h-8 w-8 text-purple-400" />
                <h1 className="text-2xl font-bold text-white">Transaction History</h1>
              </div>
            </div>
            <Button variant="secondary" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {/* Filters and Search */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                {(['all', 'send', 'receive', 'stake', 'reward'] as const).map((filterType) => (
                  <Button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    variant={filter === filterType ? 'primary' : 'secondary'}
                    size="sm"
                    className="capitalize"
                  >
                    {filterType}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Transaction List */}
          <Card className="p-6">
            <div className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">No transactions found</p>
                </div>
              ) : (
                filteredTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-4 border-b border-slate-700 last:border-b-0 hover:bg-slate-700/30 rounded-lg px-4 -mx-4 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        tx.type === 'send' ? 'bg-red-500/20' :
                        tx.type === 'receive' ? 'bg-green-500/20' :
                        tx.type === 'stake' ? 'bg-blue-500/20' :
                        tx.type === 'unstake' ? 'bg-yellow-500/20' :
                        'bg-purple-500/20'
                      }`}>
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <p className="text-white font-medium capitalize">
                          {tx.type} {tx.to ? `to ${formatAddress(tx.to)}` : ''}
                          {tx.from ? ` from ${formatAddress(tx.from)}` : ''}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                          <span>{formatTimeAgo(tx.timestamp)}</span>
                          {tx.hash && (
                            <>
                              <span>•</span>
                              <span className="font-mono">{formatAddress(tx.hash)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        tx.type === 'send' ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.token}
                      </p>
                      <p className={`text-sm ${getStatusColor(tx.status)}`}>
                        {tx.status === 'completed' ? 'Completed' : 
                         tx.status === 'pending' ? 'Pending' : 'Failed'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Send className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Sent</p>
                  <p className="text-white text-xl font-semibold">
                    {transactions
                      .filter(tx => tx.type === 'send')
                      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
                      .toFixed(2)} ETH
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Send className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Received</p>
                  <p className="text-white text-xl font-semibold">
                    {transactions
                      .filter(tx => tx.type === 'receive')
                      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
                      .toFixed(2)} ETH
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Rewards</p>
                  <p className="text-white text-xl font-semibold">
                    {transactions
                      .filter(tx => tx.type === 'reward')
                      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
                      .toFixed(4)} ETH
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
