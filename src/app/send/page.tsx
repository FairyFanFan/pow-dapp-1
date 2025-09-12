'use client';

import { useState } from 'react';
import { ArrowLeft, Send, QrCode, Copy, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SendPage() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', balance: '2.45', icon: '🔷' },
    { symbol: 'BTC', name: 'Bitcoin', balance: '0.15', icon: '🟠' },
    { symbol: 'USDC', name: 'USD Coin', balance: '1,250.00', icon: '💵' }
  ];

  const handleSend = async () => {
    setIsSending(true);
    // Simulate sending process
    setTimeout(() => {
      setIsSending(false);
      alert('Transaction sent successfully!');
    }, 2000);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                <Send className="h-8 w-8 text-purple-400" />
                <h1 className="text-2xl font-bold text-white">Send Tokens</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Send Form */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Transfer Tokens</h2>
            
            <div className="space-y-6">
              {/* Token Selection */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-3">
                  Select Token
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {tokens.map((token) => (
                    <div
                      key={token.symbol}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedToken === token.symbol
                          ? 'border-purple-500 bg-purple-900/20'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                      onClick={() => setSelectedToken(token.symbol)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{token.icon}</span>
                          <div>
                            <p className="text-white font-semibold">{token.symbol}</p>
                            <p className="text-slate-400 text-sm">{token.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">{token.balance}</p>
                          <p className="text-slate-400 text-sm">Available</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recipient Address */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Recipient Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none pr-12"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white">
                    <QrCode className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <button
                    onClick={copyAddress}
                    className="text-purple-400 hover:text-purple-300 text-sm flex items-center space-x-1"
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copied ? 'Copied!' : 'Use my address'}</span>
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none pr-16"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    {selectedToken}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-slate-400 text-sm">
                    Balance: {tokens.find(t => t.symbol === selectedToken)?.balance} {selectedToken}
                  </span>
                  <button className="text-purple-400 hover:text-purple-300 text-sm">
                    Max
                  </button>
                </div>
              </div>

              {/* Transaction Summary */}
              {amount && recipient && (
                <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
                  <h4 className="text-white font-semibold">Transaction Summary</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Amount</span>
                    <span className="text-white">{amount} {selectedToken}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Network Fee</span>
                    <span className="text-white">~0.001 ETH</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold pt-2 border-t border-slate-600">
                    <span className="text-slate-300">Total</span>
                    <span className="text-white">{amount} {selectedToken} + 0.001 ETH</span>
                  </div>
                </div>
              )}

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!amount || !recipient || isSending}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-lg font-semibold"
              >
                <Send className="h-5 w-5" />
                <span>{isSending ? 'Sending...' : 'Send Transaction'}</span>
              </button>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                    <Send className="h-4 w-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm">Sent to 0x742...5a3b</p>
                    <p className="text-slate-400 text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-red-400 text-sm font-semibold">-0.5 ETH</p>
                  <p className="text-slate-400 text-xs">$1,250.00</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Send className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm">Received from 0x8a2...9c1d</p>
                    <p className="text-slate-400 text-xs">1 day ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 text-sm font-semibold">+1.2 ETH</p>
                  <p className="text-slate-400 text-xs">$3,000.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
