// ERC-20 Token interface and types

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
  priceUSD?: number;
  valueUSD?: number;
}

export interface Token extends TokenInfo {
  balance: string;
  priceUSD: number;
  valueUSD: number;
}

export interface TokenContract {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

export interface TokenBalance {
  tokenAddress: string;
  balance: string;
  formattedBalance: string;
  symbol: string;
  decimals: number;
}

export interface TokenTransferParams {
  tokenAddress: string;
  to: string;
  amount: string;
  from: string;
}

export interface TokenApprovalParams {
  tokenAddress: string;
  spender: string;
  amount: string;
  from: string;
}

// ERC-20 ABI (simplified)
export const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
] as const;

// Popular ERC-20 tokens on Ethereum mainnet
export const POPULAR_TOKENS: Omit<TokenInfo, 'balance' | 'priceUSD' | 'valueUSD'>[] = [
  {
    address: '0xA0b86a33E6441b8c4C8C0E4A8e4A8e4A8e4A8e4A8', // USDC
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86a33E6441b8c4C8C0E4A8e4A8e4A8e4A8e4A8/logo.png'
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png'
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
  },
  {
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', // LINK
    symbol: 'LINK',
    name: 'Chainlink Token',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png'
  },
  {
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI
    symbol: 'UNI',
    name: 'Uniswap',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png'
  },
  {
    address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', // MATIC
    symbol: 'MATIC',
    name: 'Polygon',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png'
  },
  {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png'
  },
  {
    address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', // SHIB
    symbol: 'SHIB',
    name: 'Shiba Inu',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE/logo.png'
  }
];

// Token price response from CoinGecko API
export interface CoinGeckoPriceResponse {
  [key: string]: {
    usd: number;
    usd_24h_change?: number;
    usd_24h_vol?: number;
  };
}

// Token search result
export interface TokenSearchResult {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  verified?: boolean;
}

// Token transaction history
export interface TokenTransaction {
  hash: string;
  from: string;
  to: string;
  tokenAddress: string;
  amount: string;
  timestamp: number;
  blockNumber: number;
  gasUsed: string;
  gasPrice: string;
}

// Token approval event
export interface TokenApprovalEvent {
  owner: string;
  spender: string;
  tokenAddress: string;
  amount: string;
  timestamp: number;
  transactionHash: string;
}
