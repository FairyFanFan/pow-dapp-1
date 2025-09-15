# PowDApp 技术架构文档

## 🏗️ 系统架构

### 整体架构图
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端 (React)   │    │   区块链集成    │    │   区块链网络    │
│                 │    │                 │    │                 │
│  - Next.js 15   │◄──►│  - Ethers.js    │◄──►│  - Ethereum     │
│  - TypeScript   │    │  - MetaMask     │    │  - Polygon      │
│  - Tailwind CSS │    │  - Web3 API     │    │  - BSC          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ 技术栈

### 前端技术
- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS v3
- **图标**: Lucide React
- **状态管理**: React Hooks + Context

### 区块链集成
- **钱包连接**: MetaMask (真实集成)
- **区块链库**: Ethers.js v6
- **网络支持**: Ethereum Mainnet, Polygon, BSC
- **交易处理**: 真实 ETH 转账
- **Gas 估算**: 动态 Gas 费用计算

### 核心功能模块
- **钱包管理**: 连接、断开、余额查询
- **交易处理**: 发送、接收、状态跟踪
- **网络管理**: 切换、检测、验证
- **错误处理**: 用户友好的错误提示

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页 (真实钱包集成)
│   ├── staking/           # 质押页面
│   ├── send/              # 转账页面 (真实交易)
│   ├── security/          # 安全中心
│   ├── layout.tsx         # 根布局 (WalletProvider)
│   └── globals.css        # 全局样式
├── components/            # 可复用组件
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
├── hooks/                 # 自定义 Hooks
│   └── useWallet.tsx      # 真实钱包连接逻辑
├── lib/                   # 工具函数
│   └── transactions.ts    # 真实交易处理
├── types/                 # TypeScript 类型定义
│   └── ethereum.d.ts      # 以太坊类型定义
└── docs/                  # 文档
    ├── TECHNICAL_ARCHITECTURE.md
    ├── USER_GUIDE.md
    └── WEB3_BUSINESS_LOGIC.md
```

## 🔧 核心功能实现

### 1. 真实钱包连接
```typescript
// hooks/useWallet.tsx
export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('0.00');

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('请安装 MetaMask 钱包');
      return;
    }

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    
    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
      setIsConnected(true);
      await getBalance();
    }
  };
}
```

### 2. 真实交易处理
```typescript
// lib/transactions.ts
export const sendETHTransaction = async (
  to: string,
  value: string,
  from: string
): Promise<TransactionResult> => {
  // 验证地址
  if (!isValidAddress(to)) {
    return { success: false, error: '无效的接收地址' };
  }

  // 获取 Gas 估算
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
  });

  return { success: true, txHash };
};
```

### 3. Gas 费用估算
```typescript
export const getGasEstimate = async (
  from: string,
  to: string,
  value: string
): Promise<GasEstimate> => {
  const gasPrice = await window.ethereum.request({
    method: 'eth_gasPrice'
  });

  const gasLimit = await window.ethereum.request({
    method: 'eth_estimateGas',
    params: [{ from, to, value: ethers.parseEther(value).toString() }]
  });

  return { gasPrice, gasLimit };
};
```

## 🔐 安全机制

### 1. 地址验证
- 使用 Ethers.js 的 `isAddress()` 函数验证
- 实时验证用户输入的接收地址
- 防止无效地址导致的交易失败

### 2. 金额验证
- 检查发送金额是否为正数
- 验证余额是否足够支付交易和 Gas 费
- 防止超额发送

### 3. 错误处理
- 捕获所有可能的错误情况
- 提供用户友好的错误提示
- 区分不同类型的错误（网络、用户取消、余额不足等）

### 4. 交易安全
- 交易前显示完整的交易摘要
- Gas 费用透明化
- 支持交易取消

## 📊 数据流

### 1. 钱包连接流程
```
用户点击连接 → 检查MetaMask → 请求授权 → 获取账户 → 查询余额 → 更新UI
```

### 2. 交易流程
```
输入地址和金额 → 验证输入 → 估算Gas → 显示摘要 → 用户确认 → 发送交易 → 跟踪状态
```

### 3. 状态管理
```typescript
interface WalletState {
  isConnected: boolean;
  walletAddress: string;
  balance: string;
  isLoading: boolean;
  error: string | null;
}
```

## 🚀 部署架构

### 开发环境
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
```

### 生产环境
- **前端**: Vercel / Netlify
- **CDN**: Cloudflare
- **监控**: Sentry
- **分析**: Google Analytics

## 🔄 真实区块链集成特性

### 1. MetaMask 集成
- ✅ 自动检测钱包安装状态
- ✅ 支持账户切换监听
- ✅ 网络切换功能
- ✅ 交易确认处理

### 2. 交易功能
- ✅ 真实 ETH 转账
- ✅ 动态 Gas 费用估算
- ✅ 交易状态跟踪
- ✅ Etherscan 链接

### 3. 用户体验
- ✅ 实时余额更新
- ✅ 加载状态显示
- ✅ 错误提示和恢复
- ✅ 交易历史记录

### 4. 安全特性
- ✅ 地址格式验证
- ✅ 金额范围检查
- ✅ 余额充足性验证
- ✅ 交易摘要确认

## 🧪 测试策略

### 单元测试
```typescript
// __tests__/useWallet.test.ts
import { renderHook } from '@testing-library/react';
import { useWallet } from '../hooks/useWallet';

test('should connect wallet', async () => {
  const { result } = renderHook(() => useWallet());
  await result.current.connectWallet();
  expect(result.current.isConnected).toBe(true);
});
```

### 集成测试
- 钱包连接测试
- 交易流程测试
- 错误处理测试
- 网络切换测试

## 📚 开发指南

### 代码规范
- ESLint + Prettier
- TypeScript 严格模式
- 组件命名规范
- 注释文档

### Git 工作流
```bash
# 创建功能分支
git checkout -b feature/real-blockchain-integration

# 提交代码
git add .
git commit -m "feat: add real blockchain integration"

# 推送分支
git push origin feature/real-blockchain-integration
```

## 🎯 真实区块链集成完成状态

### ✅ 已完成功能
- [x] MetaMask 钱包连接
- [x] 真实余额查询
- [x] ETH 转账功能
- [x] Gas 费用估算
- [x] 地址验证
- [x] 错误处理
- [x] 网络检测
- [x] 交易状态跟踪

### 🔄 进行中功能
- [ ] 价格 API 集成
- [ ] 交易历史记录
- [ ] 多代币支持

### 📋 计划功能
- [ ] 质押功能实现
- [ ] 移动端优化
- [ ] 更多钱包支持
- [ ] 批量交易

---

**技术架构持续演进中...** 🔧

**真实区块链集成已完成！** 🎉
