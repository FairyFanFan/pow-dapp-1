import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/hooks/useWallet";
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  metadataBase: new URL('https://pow-dapp-1.vercel.app'),
  title: "PowDApp - 最易用的加密货币钱包",
  description: "简单、安全、功能完整的 Web3 钱包，支持 ETH 转账、质押挖矿和投资组合管理。专为新手设计的区块链应用。",
  keywords: ["Web3钱包", "加密货币", "ETH转账", "DeFi", "区块链", "MetaMask", "质押挖矿", "投资组合"],
  authors: [{ name: "PowDApp Team" }],
  openGraph: {
    title: "PowDApp - 让区块链变得简单",
    description: "专为新手设计的 Web3 钱包应用，支持真实区块链交互",
    url: "https://pow-dapp-1.vercel.app",
    siteName: "PowDApp",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "PowDApp - Web3 钱包应用",
      },
    ],
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PowDApp - 最易用的加密货币钱包",
    description: "简单、安全、功能完整的 Web3 钱包，支持真实区块链交互",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <WalletProvider>
          {children}
        </WalletProvider>
        <Analytics />
      </body>
    </html>
  );
}
