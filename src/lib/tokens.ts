import { ethers } from 'ethers';
import { Token, TokenContract, ERC20_ABI, POPULAR_TOKENS } from '@/types/tokens';

// Helper to check if window.ethereum is available
const getEthereum = (): unknown => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return window.ethereum;
  }
  return undefined;
};

// Get token contract instance
export const getTokenContract = async (tokenAddress: string): Promise<ethers.Contract | null> => {
  const ethereum = getEthereum();
  if (!ethereum) {
    throw new Error('MetaMask is not installed or not detected.');
  }

  try {
    const provider = new ethers.BrowserProvider(ethereum as ethers.Eip1193Provider);
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    return contract;
  } catch (error) {
    console.error('Failed to create token contract:', error);
    return null;
  }
};

// Get token information
export const getTokenInfo = async (tokenAddress: string): Promise<TokenContract | null> => {
  const contract = await getTokenContract(tokenAddress);
  if (!contract) return null;

  try {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply()
    ]);

    return {
      address: tokenAddress,
      name,
      symbol,
      decimals: Number(decimals),
      totalSupply: totalSupply.toString()
    };
  } catch (error) {
    console.error('Failed to get token info:', error);
    return null;
  }
};

// Get token balance
export const getTokenBalance = async (
  tokenAddress: string,
  walletAddress: string
): Promise<string> => {
  const contract = await getTokenContract(tokenAddress);
  if (!contract) return '0';

  try {
    const balance = await contract.balanceOf(walletAddress);
    const decimals = await contract.decimals();
    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.error('Failed to get token balance:', error);
    return '0';
  }
};

// Get multiple token balances
export const getMultipleTokenBalances = async (
  tokenAddresses: string[],
  walletAddress: string
): Promise<{ tokenAddress: string; balance: string }[]> => {
  const promises = tokenAddresses.map(async (address) => {
    try {
      const balance = await getTokenBalance(address, walletAddress);
      return { tokenAddress: address, balance };
    } catch (error) {
      console.error(`Failed to get balance for token ${address}:`, error);
      return { tokenAddress: address, balance: '0' };
    }
  });

  return Promise.all(promises);
};

// Transfer tokens
export const transferTokens = async (
  tokenAddress: string,
  to: string,
  amount: string,
  walletAddress: string
): Promise<string> => {
  const ethereum = getEthereum();
  if (!ethereum) {
    throw new Error('MetaMask is not installed or not detected.');
  }

  try {
    const provider = new ethers.BrowserProvider(ethereum as ethers.Eip1193Provider);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

    const decimals = await contract.decimals();
    const amountWei = ethers.parseUnits(amount, decimals);

    const tx = await contract.transfer(to, amountWei);
    await tx.wait();
    return tx.hash;
  } catch (error: unknown) {
    console.error('Token transfer failed:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 4001) {
      throw new Error('User rejected transaction');
    } else {
      throw new Error(`Token transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

// Approve tokens for spending
export const approveTokens = async (
  tokenAddress: string,
  spender: string,
  amount: string,
  walletAddress: string
): Promise<string> => {
  const ethereum = getEthereum();
  if (!ethereum) {
    throw new Error('MetaMask is not installed or not detected.');
  }

  try {
    const provider = new ethers.BrowserProvider(ethereum as ethers.Eip1193Provider);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

    const decimals = await contract.decimals();
    const amountWei = ethers.parseUnits(amount, decimals);

    const tx = await contract.approve(spender, amountWei);
    await tx.wait();
    return tx.hash;
  } catch (error: unknown) {
    console.error('Token approval failed:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 4001) {
      throw new Error('User rejected transaction');
    } else {
      throw new Error(`Token approval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

// Get token allowance
export const getTokenAllowance = async (
  tokenAddress: string,
  owner: string,
  spender: string
): Promise<string> => {
  const contract = await getTokenContract(tokenAddress);
  if (!contract) return '0';

  try {
    const allowance = await contract.allowance(owner, spender);
    const decimals = await contract.decimals();
    return ethers.formatUnits(allowance, decimals);
  } catch (error) {
    console.error('Failed to get token allowance:', error);
    return '0';
  }
};

// Estimate gas for token transfer
export const estimateTokenTransferGas = async (
  tokenAddress: string,
  to: string,
  amount: string,
  walletAddress: string
): Promise<bigint> => {
  const contract = await getTokenContract(tokenAddress);
  if (!contract) throw new Error('Failed to create token contract');

  try {
    const decimals = await contract.decimals();
    const amountWei = ethers.parseUnits(amount, decimals);
    
    const gasEstimate = await contract.transfer.estimateGas(to, amountWei, { from: walletAddress });
    return gasEstimate;
  } catch (error: unknown) {
    console.error('Failed to estimate token transfer gas:', error);
    throw new Error(`Failed to estimate gas: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Estimate gas for token approval
export const estimateTokenApprovalGas = async (
  tokenAddress: string,
  spender: string,
  amount: string,
  walletAddress: string
): Promise<bigint> => {
  const contract = await getTokenContract(tokenAddress);
  if (!contract) throw new Error('Failed to create token contract');

  try {
    const decimals = await contract.decimals();
    const amountWei = ethers.parseUnits(amount, decimals);
    
    const gasEstimate = await contract.approve.estimateGas(spender, amountWei, { from: walletAddress });
    return gasEstimate;
  } catch (error: unknown) {
    console.error('Failed to estimate token approval gas:', error);
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

// Get token price from CoinGecko (free tier)
export const getTokenPrice = async (tokenAddress: string): Promise<number> => {
  try {
    // This is a simplified version - in production, you'd want to use a proper API
    // For now, we'll return a mock price
    const mockPrices: { [key: string]: number } = {
      '0xA0b86a33E6441b8c4C8C0E4A8e4A8e4A8e4A8e4A8': 1.00, // USDC
      '0xdAC17F958D2ee523a2206206994597C13D831ec7': 1.00, // USDT
      '0x6B175474E89094C44Da98b954EedeAC495271d0F': 1.00, // DAI
      '0x514910771AF9Ca656af840dff83E8264EcF986CA': 15.50, // LINK
      '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984': 6.20, // UNI
      '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0': 0.85, // MATIC
      'ETH': 2500.00, // ETH price
    };

    return mockPrices[tokenAddress] || 0;
  } catch (error) {
    console.error('Failed to fetch token price:', error);
    return 0;
  }
};

// Get popular tokens with balances
export const getPopularTokensWithBalances = async (
  walletAddress: string
): Promise<Token[]> => {
  const tokensWithBalances = await Promise.all(
    POPULAR_TOKENS.map(async (token) => {
      try {
        const balance = await getTokenBalance(token.address, walletAddress);
        const price = await getTokenPrice(token.address);
        const valueUSD = parseFloat(balance) * price;

        return {
          ...token,
          balance,
          priceUSD: price,
          valueUSD
        };
      } catch (error) {
        console.error(`Failed to get balance for ${token.symbol}:`, error);
        return {
          ...token,
          balance: '0',
          priceUSD: 0,
          valueUSD: 0
        };
      }
    })
  );

  return tokensWithBalances;
};

// Search tokens by symbol or name
export const searchTokens = async (
  query: string,
  walletAddress?: string
): Promise<Token[]> => {
  // For now, we'll search through popular tokens
  // In a real application, you might want to use a token registry API
  const popularTokens = await getPopularTokensWithBalances(walletAddress || '');
  
  return popularTokens.filter(token =>
    token.symbol.toLowerCase().includes(query.toLowerCase()) ||
    token.name.toLowerCase().includes(query.toLowerCase())
  );
};

// Add custom token
export const addCustomToken = async (
  tokenAddress: string,
  walletAddress: string
): Promise<Token | null> => {
  try {
    const tokenInfo = await getTokenInfo(tokenAddress);
    if (!tokenInfo) return null;

    const balance = await getTokenBalance(tokenAddress, walletAddress);
    const price = await getTokenPrice(tokenAddress);
    const valueUSD = parseFloat(balance) * price;

    return {
      address: tokenAddress,
      symbol: tokenInfo.symbol,
      name: tokenInfo.name,
      decimals: tokenInfo.decimals,
      balance,
      priceUSD: price,
      valueUSD
    };
  } catch (error) {
    console.error('Failed to add custom token:', error);
    return null;
  }
};
