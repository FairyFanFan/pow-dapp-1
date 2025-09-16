import { ethers } from 'ethers';

export interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

// 验证以太坊地址
export const isValidAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
};

// 获取Gas费用估算
export const getGasEstimate = async (
  from: string,
  to: string,
  value: string
): Promise<bigint> => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed or not detected.');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const tx = {
      from: from,
      to: to,
      value: ethers.parseEther(value),
    };
    const gasLimit = await provider.estimateGas(tx);
    return gasLimit;
  } catch (error: unknown) {
    console.error('获取 Gas 估算失败:', error);
    throw new Error('获取 Gas 估算失败，请检查地址和金额');
  }
};

// 发送ETH交易
export const sendETHTransaction = async (
  to: string,
  value: string,
  from: string,
  gasPrice?: bigint,
  gasLimit?: bigint
): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed or not detected.');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const tx = {
      from: from,
      to: to,
      value: ethers.parseEther(value),
      ...(gasPrice && { gasPrice }),
      ...(gasLimit && { gasLimit }),
    };

    const transactionResponse = await signer.sendTransaction(tx);
    await transactionResponse.wait();
    return transactionResponse.hash;
  } catch (error: unknown) {
    console.error('发送交易失败:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 4001) {
      throw new Error('用户拒绝交易');
    } else if (error && typeof error === 'object' && 'code' in error && error.code === 'UNPREDICTABLE_GAS_LIMIT') {
      throw new Error('Gas 估算失败，请检查地址和金额');
    } else {
      throw new Error(`交易失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

// 格式化交易金额显示
export const formatTransactionValue = (value: string, _tokenSymbol: string): string => {
  try {
    const ethValue = parseFloat(value);
    // 简单的汇率转换，实际应用中应该从API获取实时汇率
    const usdValue = ethValue * 2500; // 假设 1 ETH = $2500
    return `$${usdValue.toFixed(2)}`;
  } catch {
    return '';
  }
};

// 获取当前Gas价格
export const getCurrentGasPrice = async (): Promise<bigint> => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed or not detected.');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const feeData = await provider.getFeeData();
    return feeData.gasPrice || BigInt(20000000000); // 默认 20 Gwei
  } catch (error: unknown) {
    console.error('获取 Gas 价格失败:', error);
    return BigInt(20000000000); // 默认 20 Gwei
  }
};

// 计算交易费用
export const calculateTransactionFee = (gasLimit: bigint, gasPrice: bigint): bigint => {
  return gasLimit * gasPrice;
};

// 格式化Gas价格显示
export const formatGasPrice = (gasPrice: bigint): string => {
  return (Number(gasPrice) / 1e9).toFixed(2); // 转换为 Gwei
};

// 格式化交易费用显示
export const formatTransactionFee = (fee: bigint): string => {
  return ethers.formatEther(fee);
};
