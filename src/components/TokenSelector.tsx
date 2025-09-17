'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { TokenInfo, POPULAR_TOKENS } from '@/types/tokens';
import { getTokenBalance } from '@/lib/erc20';

interface TokenSelectorProps {
  selectedToken: TokenInfo | null;
  onTokenSelect: (token: TokenInfo) => void;
  walletAddress: string;
  className?: string;
}

export default function TokenSelector({
  selectedToken,
  onTokenSelect,
  walletAddress,
  className = ''
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize tokens with default balances
  useEffect(() => {
    const initialTokens: TokenInfo[] = POPULAR_TOKENS.map(token => ({
      ...token,
      balance: '0',
      priceUSD: 0,
      valueUSD: 0
    }));
    setTokens(initialTokens);
  }, []);

  // Filter tokens based on search term
  const filteredTokens = tokens.filter(token =>
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load token balances when wallet is connected
  useEffect(() => {
    if (walletAddress && tokens.length > 0) {
      loadTokenBalances();
    }
  }, [walletAddress, tokens]);

  const loadTokenBalances = async () => {
    setLoading(true);
    try {
      const updatedTokens = await Promise.all(
        tokens.map(async (token) => {
          try {
            const balance = await getTokenBalance(token.address, walletAddress);
            return {
              ...token,
              balance: balance.formattedBalance
            };
          } catch (error) {
            console.error(`Failed to load balance for ${token.symbol}:`, error);
            return {
              ...token,
              balance: '0'
            };
          }
        })
      );
      setTokens(updatedTokens);
    } catch (error) {
      console.error('Failed to load token balances:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSelect = (token: TokenInfo) => {
    onTokenSelect(token);
    setIsOpen(false);
    setSearchTerm('');
  };

  const formatBalance = (balance: string | undefined, decimals: number) => {
    if (!balance) return '0.0000';
    const num = parseFloat(balance);
    return num.toFixed(4);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selected Token Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all"
      >
        <div className="flex items-center space-x-3">
          {selectedToken ? (
            <>
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {selectedToken.symbol.charAt(0)}
                </span>
              </div>
              <div className="text-left">
                <div className="font-semibold">{selectedToken.symbol}</div>
                <div className="text-sm text-white/60">{selectedToken.name}</div>
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">?</span>
              </div>
              <div className="text-left">
                <div className="font-semibold">Select Token</div>
                <div className="text-sm text-white/60">Choose a token to send</div>
              </div>
            </>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl z-50 max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-4 border-b border-white/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          {/* Token List */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-white/60">
                Loading token balances...
              </div>
            ) : filteredTokens.length === 0 ? (
              <div className="p-4 text-center text-white/60">
                No tokens found
              </div>
            ) : (
              filteredTokens.map((token) => (
                <button
                  key={token.address}
                  onClick={() => handleTokenSelect(token)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {token.symbol.charAt(0)}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white">{token.symbol}</div>
                      <div className="text-sm text-white/60">{token.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">
                      {formatBalance(token.balance, token.decimals)}
                    </div>
                    <div className="text-sm text-white/60">{token.symbol}</div>
                  </div>
                  {selectedToken?.address === token.address && (
                    <Check className="w-5 h-5 text-purple-400 ml-2" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Add Custom Token */}
          <div className="p-4 border-t border-white/20">
            <button
              onClick={() => {
                // TODO: Implement custom token addition
                console.log('Add custom token');
              }}
              className="w-full text-center text-purple-400 hover:text-purple-300 text-sm py-2"
            >
              + Add Custom Token
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
