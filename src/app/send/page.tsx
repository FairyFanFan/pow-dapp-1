'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Send, QrCode, Copy, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { sendETHTransaction, getGasEstimate, isValidAddress, formatTransactionValue, getCurrentGasPrice, calculateTransactionFee, formatGasPrice, formatTransactionFee } from '@/lib/transactions';
import { transferToken, estimateTokenTransferGas, formatTokenAmount } from '@/lib/erc20';
import { TokenInfo, POPULAR_TOKENS } from '@/types/tokens';
import { trackTransaction, trackError, trackPageView } from '@/lib/analytics';
import TokenSelector from '@/components/TokenSelector';

export default function SendPage() {
  const { walletAddress, balance, error: walletError } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState<string | null>(null);
  const [gasEstimate, setGasEstimate] = useState<{
    gasPrice: string;
    gasLimit: string;
    estimatedFee: string;
  } | null>(null);

  // Initialize with ETH as default
  useEffect(() => {
    if (!selectedToken) {
      setSelectedToken({
        address: '0x0000000000000000000000000000000000000000', // ETH placeholder
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        balance: balance
      });
    }
  }, [selectedToken, balance]);

  // Track page view
  useEffect(() => {
    trackPageView('send_page');
  }, []);

  const estimateGas = useCallback(async () => {
    if (!recipient || !amount || !walletAddress || !selectedToken) return;

    if (!isValidAddress(recipient)) {
      setTransactionError('Please enter a valid Ethereum address');
      return;
    }

    try {
      let gasLimit: bigint;
      
      if (selectedToken.symbol === 'ETH') {
        // ETH transfer
        gasLimit = await getGasEstimate(recipient, amount, walletAddress);
      } else {
        // ERC-20 token transfer
        gasLimit = await estimateTokenTransferGas(selectedToken.address, recipient, amount, walletAddress);
      }

      const gasPrice = await getCurrentGasPrice();
      const estimatedFee = calculateTransactionFee(gasLimit, gasPrice);
      
      setGasEstimate({
        gasPrice: formatGasPrice(gasPrice),
        gasLimit: gasLimit.toString(),
        estimatedFee: formatTransactionFee(estimatedFee)
      });
      setTransactionError(null);
    } catch (error) {
      console.error('Gas estimation failed:', error);
      trackError('gas_estimation_failed', error instanceof Error ? error.message : 'Unknown error');
      setTransactionError('Gas estimation failed, please check address and amount');
    }
  }, [recipient, amount, walletAddress, selectedToken]);

  useEffect(() => {
    const timeoutId = setTimeout(estimateGas, 500);
    return () => clearTimeout(timeoutId);
  }, [estimateGas]);

  const handleSend = async () => {
    if (!recipient || !amount || !walletAddress || !selectedToken) {
      setTransactionError('Please fill in all required fields');
      return;
    }

    if (!isValidAddress(recipient)) {
      setTransactionError('Please enter a valid Ethereum address');
      return;
    }

    setIsSending(true);
    setTransactionError(null);
    setTransactionSuccess(null);

    try {
      let txHash: string;

      if (selectedToken.symbol === 'ETH') {
        // Track ETH transaction initiation
        trackTransaction('eth_send', amount, 'ETH');
        txHash = await sendETHTransaction(recipient, amount, walletAddress);
      } else {
        // Track ERC-20 transaction initiation
        trackTransaction('erc20_send', amount, selectedToken.symbol);
        txHash = await transferToken({
          tokenAddress: selectedToken.address,
          to: recipient,
          amount: amount,
          from: walletAddress
        });
      }

      setTransactionSuccess(txHash);
      
      // Clear form
      setRecipient('');
      setAmount('');
      setGasEstimate(null);
    } catch (error: unknown) {
      console.error('Transaction failed:', error);
      trackError('transaction_failed', error instanceof Error ? error.message : 'Unknown error');
      setTransactionError(error instanceof Error ? error.message : 'Transaction failed');
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      trackError('copy_failed', 'Failed to copy to clipboard');
    }
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value)) {
      setAmount(value);
    }
  };

  const getExplorerUrl = (txHash: string) => {
    return `https://etherscan.io/tx/${txHash}`;
  };

  const getTokenBalance = () => {
    if (!selectedToken) return '0.0000';
    return selectedToken.balance || '0.0000';
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
          <h1 className="text-2xl font-bold text-white">Send Tokens</h1>
          <div className="w-20"></div>
        </div>

        <div className="max-w-md mx-auto">
          {/* Wallet Info */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/70">My Wallet</span>
              <span className="text-white font-mono text-sm">
                {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not Connected'}
              </span>
            </div>
            <div className="text-2xl font-bold text-white">
              {balance} ETH
            </div>
            {walletError && (
              <div className="mt-2 text-red-400 text-sm">{walletError}</div>
            )}
          </div>

          {/* Transaction Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-6">Send Transaction</h2>
            
            {/* Token Selection */}
            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-2">Select Token</label>
              <TokenSelector
                selectedToken={selectedToken}
                onTokenSelect={setSelectedToken}
                walletAddress={walletAddress}
              />
              {selectedToken && (
                <div className="mt-2 text-white/60 text-sm">
                  Balance: {getTokenBalance()} {selectedToken.symbol}
                </div>
              )}
            </div>

            {/* Recipient Address */}
            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-2">Recipient Address</label>
              <div className="relative">
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />
                <button
                  onClick={() => copyToClipboard(recipient)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Amount */}
            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-2">Amount</label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 text-sm">
                  {selectedToken?.symbol || 'TOKEN'}
                </div>
              </div>
              {amount && selectedToken && (
                <div className="mt-2 text-white/60 text-sm">
                  ≈ {formatTransactionValue(amount, selectedToken.symbol)}
                </div>
              )}
            </div>

            {/* Gas Estimate */}
            {gasEstimate && (
              <div className="mb-6 p-4 bg-white/5 rounded-xl">
                <h3 className="text-white/70 text-sm mb-2">Gas Fee Estimate</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-white/60">
                    <span>Gas Price:</span>
                    <span>{gasEstimate.gasPrice} Gwei</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Gas Limit:</span>
                    <span>{gasEstimate.gasLimit}</span>
                  </div>
                  <div className="flex justify-between text-white font-medium">
                    <span>Estimated Fee:</span>
                    <span>{parseFloat(gasEstimate.estimatedFee).toFixed(6)} ETH</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {transactionError && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-red-300 text-sm">{transactionError}</span>
              </div>
            )}

            {/* Success Message */}
            {transactionSuccess && (
              <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-green-300 text-sm font-medium">Transaction Successful!</span>
                </div>
                <div className="text-green-300/80 text-sm font-mono break-all">
                  {transactionSuccess}
                </div>
                <a
                  href={getExplorerUrl(transactionSuccess)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-400 hover:text-green-300 text-sm mt-2"
                >
                  View on Etherscan <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            )}

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={isSending || !recipient || !amount || !walletAddress || !selectedToken}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center"
            >
              {isSending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send {amount} {selectedToken?.symbol || 'TOKEN'}
                </>
              )}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors">
                <QrCode className="w-5 h-5 mr-2" />
                Scan QR Code
              </button>
              <button className="w-full flex items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors">
                <Copy className="w-5 h-5 mr-2" />
                Paste from Clipboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
