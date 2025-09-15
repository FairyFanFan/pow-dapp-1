import { ethers } from 'ethers';

export interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export interface GasEstimate {
  gasPrice: string;
  gasLimit: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
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
): Promise<GasEstimate> => {
  if (!window.ethereum) {
    throw new Error('MetaMask not found');
  }

  try {
    // 获取当前Gas价格
    const gasPrice = await window.ethereum.request({
      method: 'eth_gasPrice'
    }) as string;

    // 估算Gas限制
    const gasLimit = await window.ethereum.request({
      method: 'eth_estimateGas',
      params: [{
        from,
        to,
        value: ethers.parseEther(value).toString()
      }]
    }) as string;

    return {
      gasPrice,
      gasLimit,
    };
  } catch (error) {
    console.error('Gas估算失败:', error);
    throw new Error('无法估算Gas费用');
  }
};

// 发送ETH交易
export const sendETHTransaction = async (
  to: string,
  value: string,
  from: string
): Promise<TransactionResult> => {
  if (!window.ethereum) {
    return {
      success: false,
      error: '请安装MetaMask钱包'
    };
  }

  try {
    // 验证地址
    if (!isValidAddress(to)) {
      return {
        success: false,
        error: '无效的接收地址'
      };
    }

    // 验证金额
    const amount = parseFloat(value);
    if (isNaN(amount) || amount <= 0) {
      return {
        success: false,
        error: '无效的发送金额'
      };
    }

    // 获取Gas估算
    const gasEstimate = await getGasEstimate(from, to, value);

    // 发送交易
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from,
        to,
        value: ethers.parseEther(value).toString(),
        gas: gasEstimate.gasLimit,
        gasPrice: gasEstimate.gasPrice,
      }]
    }) as string;

    return {
      success: true,
      txHash
    };
  } catch (error: unknown) {
    console.error('发送交易失败:', error);
    
    let errorMessage = '交易失败';
    if (error && typeof error === 'object' && 'code' in error) {
      const errorCode = (error as { code: number }).code;
      if (errorCode === 4001) {
        errorMessage = '用户取消了交易';
      } else if (errorCode === -32603) {
        errorMessage = '交易被拒绝';
      }
    }
    
    if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = (error as { message: string }).message;
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

// 获取交易状态
export const getTransactionStatus = async (txHash: string): Promise<{
  status: 'pending' | 'success' | 'failed';
  blockNumber?: number;
  gasUsed?: string;
}> => {
  if (!window.ethereum) {
    throw new Error('MetaMask not found');
  }

  try {
    const tx = await window.ethereum.request({
      method: 'eth_getTransactionByHash',
      params: [txHash]
    }) as { blockNumber?: string } | null;

    if (!tx) {
      return { status: 'pending' };
    }

    if (tx.blockNumber) {
      const receipt = await window.ethereum.request({
        method: 'eth_getTransactionReceipt',
        params: [txHash]
      }) as { status: string; blockNumber: string; gasUsed: string };

      return {
        status: receipt.status === '0x1' ? 'success' : 'failed',
        blockNumber: parseInt(receipt.blockNumber, 16),
        gasUsed: receipt.gasUsed
      };
    }

    return { status: 'pending' };
  } catch (error) {
    console.error('获取交易状态失败:', error);
    return { status: 'pending' };
  }
};

// 格式化交易金额
export const formatTransactionValue = (value: string, decimals: number = 18): string => {
  try {
    return ethers.formatUnits(value, decimals);
  } catch {
    return '0';
  }
};

// 获取ETH余额
export const getETHBalance = async (address: string): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('MetaMask not found');
  }

  try {
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest']
    }) as string;

    return ethers.formatEther(balance);
  } catch (error) {
    console.error('获取余额失败:', error);
    throw new Error('获取余额失败');
  }
};
