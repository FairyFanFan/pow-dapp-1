import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/hooks/useWallet";
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  metadataBase: new URL('https://pow-dapp-1.vercel.app'),
  title: "PowDApp - The Easiest Crypto Wallet",
  description: "Simple, secure, and feature-complete Web3 wallet supporting ETH transfers, staking, and portfolio management. Designed for beginners in blockchain.",
  keywords: ["Web3 wallet", "cryptocurrency", "ETH transfer", "DeFi", "blockchain", "MetaMask", "staking", "portfolio", "crypto wallet", "ethereum"],
  authors: [{ name: "PowDApp Team" }],
  openGraph: {
    title: "PowDApp - Making Blockchain Simple",
    description: "A beginner-friendly Web3 wallet application with real blockchain integration",
    url: "https://pow-dapp-1.vercel.app",
    siteName: "PowDApp",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "PowDApp - Web3 Wallet Application",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PowDApp - The Easiest Crypto Wallet",
    description: "Simple, secure, and feature-complete Web3 wallet with real blockchain integration",
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
    <html lang="en">
      <body className="antialiased">
        <WalletProvider>
          {children}
        </WalletProvider>
        <Analytics />
      </body>
    </html>
  );
}
