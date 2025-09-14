# PowDApp - Crypto Portfolio Manager

A modern decentralized application built with Next.js 15, TypeScript, and Tailwind CSS for managing your crypto portfolio with staking, trading, and security features.

## Features

### 🏠 Dashboard
- **Portfolio Overview**: View your crypto holdings with real-time balance tracking
- **Multi-token Support**: Manage ETH, BTC, and other cryptocurrencies
- **Price Tracking**: Monitor 24h price changes and portfolio performance
- **Recent Transactions**: Track your transaction history

### 💸 Send Tokens
- **Multi-token Transfers**: Send ETH, BTC, USDC and other supported tokens
- **QR Code Support**: Easy recipient address scanning
- **Transaction Summary**: Clear breakdown of fees and total amounts
- **Address Management**: Copy your address or use saved contacts

### 📈 Staking
- **Multiple Pools**: Choose from various staking pools with different APY rates
- **Flexible Terms**: Different lock periods and minimum stake requirements
- **Real-time Rewards**: Track your staking rewards and performance
- **Security First**: Audited smart contracts with insurance coverage

### 🔒 Security Center
- **Private Key Management**: Secure local storage with encryption
- **Two-Factor Authentication**: Add extra security layers
- **Biometric Authentication**: Use fingerprint or face recognition
- **Activity Monitoring**: Track all account activities and login attempts
- **Security Tips**: Best practices for crypto security

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pow-dapp-1
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home dashboard
│   ├── staking/           # Staking page
│   ├── send/              # Send tokens page
│   ├── security/          # Security center page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
└── lib/                   # Utility functions
```

## Features in Detail

### Wallet Integration
- Simulated wallet connection for demo purposes
- Support for multiple wallet types
- Address formatting and validation
- Balance tracking and updates

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface
- Dark theme optimized

### Security Features
- Client-side private key management
- Transaction signing simulation
- Activity logging and monitoring
- Security best practices implementation

## Future Enhancements

- [ ] Real wallet integration (MetaMask, WalletConnect)
- [ ] Live blockchain data integration
- [ ] Advanced trading features
- [ ] DeFi protocol integrations
- [ ] Mobile app development
- [ ] Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This is a demo application for educational purposes. Do not use with real funds or in production without proper security audits and testing.


# PowDApp - 加密货币投资组合管理应用

一个现代化的去中心化应用，用于管理您的加密货币投资组合，包含质押挖矿、转账交易和安全中心等功能。

## 项目概述

**PowDApp** 是一个功能完整的加密货币资产管理平台，类似于数字钱包，但功能更丰富。它为用户提供一站式的数字资产管理解决方案。

## 核心业务功能

### 1. 钱包连接 💼
- 用户可以连接数字钱包（目前是模拟连接）
- 显示钱包地址和余额
- 支持连接/断开操作
- 地址格式化显示

### 2. 投资组合展示 📊
- 显示多种加密货币资产（ETH、BTC等）
- 实时价格变化（24小时涨跌幅）
- 总资产价值统计
- 美观的卡片式布局

### 3. 转账功能 💸
- 发送代币到其他钱包地址
- 支持多种代币类型（ETH、BTC、USDC等）
- 显示交易费用和总金额
- 交易历史记录查看
- QR码扫描功能

### 4. 质押挖矿 ⛏️
- 将代币存入不同的质押池
- 获得年化收益（APY）
- 不同池子有不同的锁定期和最低质押量
- 实时显示预期收益
- 安全审计信息展示

### 5. 安全中心 🔒
- 私钥管理（加密存储）
- 双因素认证设置
- 生物识别登录
- 账户活动监控
- 安全建议和最佳实践
- 私钥导出/生成功能

## 技术特点

- **现代化UI**：深色主题，渐变背景，玻璃质感
- **响应式设计**：支持手机和桌面端
- **模拟数据**：目前使用假数据演示功能
- **模块化架构**：不同功能独立页面
- **TypeScript**：类型安全的开发体验
- **Tailwind CSS**：现代化的样式框架

## 目标用户

- 加密货币投资者
- DeFi用户
- 需要管理数字资产的人群
- 进行质押挖矿的用户
- 监控投资组合的投资者

## 技术栈

- **框架**: Next.js 15 with App Router
- **语言**: TypeScript
- **样式**: Tailwind CSS v3
- **图标**: Lucide React
- **字体**: 系统默认字体

## 📚 详细文档

- [Web3 业务逻辑详解](docs/WEB3_BUSINESS_LOGIC.md) - 深入了解 Web3 概念和业务逻辑
- [用户使用指南](docs/USER_GUIDE.md) - 快速上手指南和常见问题
- [技术架构文档](docs/TECHNICAL_ARCHITECTURE.md) - 技术实现和系统架构

## 🎯 快速理解

**PowDApp 是什么？**
一个功能完整的加密货币资产管理平台，让用户能够安全、便捷地管理数字资产。

**核心功能：**
- 💼 钱包连接和资产管理
- 💸 安全的代币转账
- ⛏️ 质押挖矿获得收益
- 🔒 全面的安全保护

**适合谁？**
- 加密货币投资者
- DeFi 用户
- 区块链新手
- 需要管理多币种的用户

