import { ethers } from 'ethers';
import { TokenInfo, TokenBalance, TokenTransferParams, TokenApprovalParams, ERC20_ABI } from '@/types/tokens';

// Helper to check if window.ethereum is available
const getEthereum = (): unknown => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return window.ethereum;
  }
  return undefined;
};

// Get ERC-20 token balance
export const getTokenBalance = async (
  tokenAddress: string,
  walletAddress: string
): Promise<TokenBalance> => {
  const ethereum = getEthereum();
  if (!ethereum) {
    throw new Error('MetaMask is not installed or not detected.');
  }

  try {
    const provider = new ethers.BrowserProvider(ethereum as ethers.Eip1193Provider);
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    
    // Get token info
    const [symbol, decimals, balance] = await Promise.all([
      contract.symbol(),
      contract.decimals(),
      contract.balanceOf(walletAddress)
    ]);

    const formattedBalance = ethers.formatUnits(balance, decimals);

    return {
      tokenAddress,
      balance: balance.toString(),
      formattedBalance,
      symbol,
      decimals
    };
  } catch (error: unknown) {
    console.error('Failed to fetch token balance:', error);
    throw new Error(`Failed to fetch token balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get multiple token balances
export const getMultipleTokenBalances = async (
  tokenAddresses: string[],
  walletAddress: string
): Promise<TokenBalance[]> => {
  const promises = tokenAddresses.map(address => 
    getTokenBalance(address, walletAddress).catch(error => {
      console.error(`Failed to fetch balance for token ${address}:`, error);
      return null;
    })
  );

  const results = await Promise.all(promises);
  return results.filter((result): result is TokenBalance => result !== null);
};

// Transfer ERC-20 tokens
export const transferToken = async (
  params: TokenTransferParams
): Promise<string> => {
  const ethereum = getEthereum();
  if (!ethereum) {
    throw new Error('MetaMask is not installed or not detected.');
  }

  try {
    const provider = new ethers.BrowserProvider(ethereum as ethers.Eip1193Provider);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(params.tokenAddress, ERC20_ABI, signer);

    // Get token decimals for proper amount formatting
    const decimals = await contract.decimals();
    const amount = ethers.parseUnits(params.amount, decimals);

    const tx = await contract.transfer(params.to, amount);
    await tx.wait();
    
    return tx.hash;
  } catch (error: unknown) {
    console.error('Token transfer failed:', error);
    if (error && typeof error === 'object' && 'code' in error && (error as any).code === 4001) {
      throw new Error('User rejected transaction');
    } else {
      throw new Error(`Token transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

// Approve ERC-20 tokens for spending
export const approveToken = async (
  params: TokenApprovalParams
): Promise<string> => {
  const ethereum = getEthereum();
  if (!ethereum) {
    throw new Error('MetaMask is not installed or not detected.');
  }

  try {
    const provider = new ethers.BrowserProvider(ethereum as ethers.Eip1193Provider);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(params.tokenAddress, ERC20_ABI, signer);

    // Get token decimals for proper amount formatting
    const decimals = await contract.decimals();
    const amount = ethers.parseUnits(params.amount, decimals);

    const tx = await contract.approve(params.spender, amount);
    await tx.wait();
    
    return tx.hash;
  } catch (error: unknown) {
    console.error('Token approval failed:', error);
    if (error && typeof error === 'object' && 'code' in error && (error as any).code === 4001) {
      throw new Error('User rejected transaction');
    } else {
      throw new Error(`Token approval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

// Check token allowance
export const getTokenAllowance = async (
  tokenAddress: string,
  owner: string,
  spender: string
): Promise<string> => {
  const ethereum = getEthereum();
  if (!ethereum) {
    throw new Error('MetaMask is not installed or not detected.');
  }

  try {
    const provider = new ethers.BrowserProvider(ethereum as ethers.Eip1193Provider);
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    
    const allowance = await contract.allowance(owner, spender);
    return allowance.toString();
  } catch (error: unknown) {
    console.error('Failed to fetch token allowance:', error);
    throw new Error(`Failed to fetch token allowance: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get token information
export const getTokenInfo = async (tokenAddress: string): Promise<TokenInfo> => {
  const ethereum = getEthereum();
  if (!ethereum) {
    throw new Error('MetaMask is not installed or not detected.');
  }

  try {
    const provider = new ethers.BrowserProvider(ethereum as ethers.Eip1193Provider);
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    
    const [name, symbol, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals()
    ]);

    return {
      address: tokenAddress,
      name,
      symbol,
      decimals,
      balance: '0'
    };
  } catch (error: unknown) {
    console.error('Failed to fetch token info:', error);
    throw new Error(`Failed to fetch token info: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Estimate gas for token transfer
export const estimateTokenTransferGas = async (
  tokenAddress: string,
  to: string,
  amount: string,
  from: string
): Promise<bigint> => {
  const ethereum = getEthereum();
  if (!ethereum) {
    throw new Error('MetaMask is not installed or not detected.');
  }

  try {
    const provider = new ethers.BrowserProvider(ethereum as ethers.Eip1193Provider);
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    
    const decimals = await contract.decimals();
    const amountWei = ethers.parseUnits(amount, decimals);
    
    const gasEstimate = await contract.transfer.estimateGas(to, amountWei, { from });
    return gasEstimate;
  } catch (error: unknown) {
    console.error('Failed to estimate token transfer gas:', error);
    throw new Error(`Failed to estimate gas: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Format token amount for display
export const formatTokenAmount = (
  amount: string,
  decimals: number,
  displayDecimals: number = 4
): string => {
  try {
    const formatted = ethers.formatUnits(amount, decimals);
    const num = parseFloat(formatted);
    return num.toFixed(displayDecimals);
  } catch {
    return '0.0000';
  }
};

// Validate token address
export const isValidTokenAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
};

// --- CoinGecko-backed price fetching with simple cache ---
const priceCache: Map<string, { price: number; ts: number }> = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60s cache

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { 'accept': 'application/json' } });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const getTokenPrice = async (tokenAddress: string): Promise<number> => {
  try {
    const now = Date.now();
    const cached = priceCache.get(tokenAddress);
    if (cached && now - cached.ts < CACHE_TTL_MS) {
      return cached.price;
    }

    let price = 0;

    if (tokenAddress === 'ETH') {
      // ETH by id
      const data = await fetchJson<{ ethereum?: { usd: number } }>(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      );
      price = data.ethereum?.usd ?? 0;
    } else {
      // ERC20 by contract address on Ethereum mainnet
      const api = 'https://api.coingecko.com/api/v3/simple/token_price/ethereum';
      const url = `${api}?contract_addresses=${encodeURIComponent(tokenAddress)}&vs_currencies=usd`;
      const data = await fetchJson<Record<string, { usd?: number }>>(url);
      const key = Object.keys(data)[0];
      price = key ? (data[key].usd ?? 0) : 0;
    }

    priceCache.set(tokenAddress, { price, ts: now });
    return price;
  } catch (error) {
    console.error('Failed to fetch token price:', error);
    return 0;
  }
};
