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
    if (error && typeof error === 'object' && 'code' in error && error.code === 4001) {
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
    if (error && typeof error === 'object' && 'code' in error && error.code === 4001) {
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
