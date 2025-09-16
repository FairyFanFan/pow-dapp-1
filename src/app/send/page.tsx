'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Send, QrCode, Copy, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { sendETHTransaction, getGasEstimate, isValidAddress, formatTransactionValue, getCurrentGasPrice, calculateTransactionFee, formatGasPrice, formatTransactionFee } from '@/lib/transactions';
import { trackTransaction, trackError, trackPageView } from '@/lib/analytics';

export default function SendPage() {
  const { walletAddress, balance, error: walletError } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState<string | null>(null);
  const [gasEstimate, setGasEstimate] = useState<{
    gasPrice: string;
    gasLimit: string;
    estimatedFee: string;
  } | null>(null);

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', balance: balance, icon: '🔷' },
    { symbol: 'BTC', name: 'Bitcoin', balance: '0.15', icon: '🟠', disabled: true },
    { symbol: 'USDC', name: 'USD Coin', balance: '1,250.00', icon: '💵', disabled: true }
  ];

  // Track page view
  useEffect(() => {
    trackPageView('send_page');
  }, []);

  const estimateGas = useCallback(async () => {
    if (!recipient || !amount || !walletAddress || selectedToken !== 'ETH') return;

    if (!isValidAddress(recipient)) {
      setTransactionError('请输入有效的以太坊地址');
      return;
    }

    try {
      const gasLimit = await getGasEstimate(recipient, amount, walletAddress);
      const gasPrice = await getCurrentGasPrice();
      const estimatedFee = calculateTransactionFee(gasLimit, gasPrice);
      
      setGasEstimate({
        gasPrice: formatGasPrice(gasPrice),
        gasLimit: gasLimit.toString(),
        estimatedFee: formatTransactionFee(estimatedFee)
      });
      setTransactionError(null);
    } catch (error) {
      console.error('Gas 估算失败:', error);
      trackError('gas_estimation_failed', error instanceof Error ? error.message : 'Unknown error');
      setTransactionError('Gas 估算失败，请检查地址和金额');
    }
  }, [recipient, amount, walletAddress, selectedToken]);

  useEffect(() => {
    const timeoutId = setTimeout(estimateGas, 500);
    return () => clearTimeout(timeoutId);
  }, [estimateGas]);

  const handleSend = async () => {
    if (!recipient || !amount || !walletAddress) {
      setTransactionError('请填写所有必填字段');
      return;
    }

    if (!isValidAddress(recipient)) {
      setTransactionError('请输入有效的以太坊地址');
      return;
    }

    if (selectedToken !== 'ETH') {
      setTransactionError('目前只支持 ETH 转账');
      return;
    }

    setIsSending(true);
    setTransactionError(null);
    setTransactionSuccess(null);

    try {
      // Track transaction initiation
      trackTransaction('eth_send', amount, 'ETH');
      
      const txHash = await sendETHTransaction(recipient, amount, walletAddress);
      setTransactionSuccess(txHash);
      
      // Clear form
      setRecipient('');
      setAmount('');
      setGasEstimate(null);
    } catch (error: unknown) {
      console.error('发送交易失败:', error);
      trackError('transaction_failed', error instanceof Error ? error.message : 'Unknown error');
      setTransactionError(error instanceof Error ? error.message : '发送失败');
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
      console.error('复制失败:', error);
      trackError('copy_failed', 'Failed to copy to clipboard');
    }
  };

  const handleAmountChange = (value: string) => {
    // 只允许数字和小数点
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value)) {
      setAmount(value);
    }
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
            返回首页
          </Link>
          <h1 className="text-2xl font-bold text-white">发送代币</h1>
          <div className="w-20"></div>
        </div>

        <div className="max-w-md mx-auto">
          {/* Wallet Info */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/70">我的钱包</span>
              <span className="text-white font-mono text-sm">
                {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '未连接'}
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
            <h2 className="text-xl font-semibold text-white mb-6">发送交易</h2>
            
            {/* Token Selection */}
            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-2">选择代币</label>
              <div className="grid grid-cols-3 gap-2">
                {tokens.map((token) => (
                  <button
                    key={token.symbol}
                    onClick={() => setSelectedToken(token.symbol)}
                    disabled={token.disabled}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedToken === token.symbol
                        ? 'border-purple-400 bg-purple-400/20'
                        : 'border-white/20 hover:border-white/40'
                    } ${token.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="text-2xl mb-1">{token.icon}</div>
                    <div className="text-white text-sm font-medium">{token.symbol}</div>
                    <div className="text-white/60 text-xs">{token.balance}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Address */}
            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-2">接收地址</label>
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
              <label className="block text-white/70 text-sm mb-2">金额</label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 text-sm">
                  {selectedToken}
                </div>
              </div>
              {amount && (
                <div className="mt-2 text-white/60 text-sm">
                  约 {formatTransactionValue(amount, selectedToken)}
                </div>
              )}
            </div>

            {/* Gas Estimate */}
            {gasEstimate && (
              <div className="mb-6 p-4 bg-white/5 rounded-xl">
                <h3 className="text-white/70 text-sm mb-2">Gas 费用估算</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-white/60">
                    <span>Gas 价格:</span>
                    <span>{gasEstimate.gasPrice} Gwei</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Gas 限制:</span>
                    <span>{gasEstimate.gasLimit}</span>
                  </div>
                  <div className="flex justify-between text-white font-medium">
                    <span>预估费用:</span>
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
                  <span className="text-green-300 text-sm font-medium">交易成功！</span>
                </div>
                <div className="text-green-300/80 text-sm font-mono break-all">
                  {transactionSuccess}
                </div>
                <a
                  href={`https://etherscan.io/tx/${transactionSuccess}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-400 hover:text-green-300 text-sm mt-2"
                >
                  在 Etherscan 查看 <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            )}

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={isSending || !recipient || !amount || !walletAddress}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center"
            >
              {isSending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  发送中...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  发送 {amount} {selectedToken}
                </>
              )}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">快速操作</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors">
                <QrCode className="w-5 h-5 mr-2" />
                扫描二维码
              </button>
              <button className="w-full flex items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors">
                <Copy className="w-5 h-5 mr-2" />
                从剪贴板粘贴
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
