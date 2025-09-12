'use client';

import { useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'stake' | 'unstake' | 'reward';
  amount: string;
  token: string;
  to?: string;
  from?: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  hash?: string;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Mock initial transactions
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'send',
        amount: '0.5',
        token: 'ETH',
        to: '0x742...5a3b',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: 'completed',
        hash: '0x1234...5678'
      },
      {
        id: '2',
        type: 'reward',
        amount: '0.02',
        token: 'ETH',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        status: 'completed'
      },
      {
        id: '3',
        type: 'receive',
        amount: '1.2',
        token: 'ETH',
        from: '0x8a2...9c1d',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        status: 'completed',
        hash: '0xabcd...efgh'
      },
      {
        id: '4',
        type: 'stake',
        amount: '1.0',
        token: 'ETH',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        status: 'completed'
      }
    ];
    setTransactions(mockTransactions);
  }, []);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransactionStatus = (id: string, status: Transaction['status']) => {
    setTransactions(prev =>
      prev.map(tx => (tx.id === id ? { ...tx, status } : tx))
    );
  };

  return {
    transactions,
    addTransaction,
    updateTransactionStatus
  };
}
