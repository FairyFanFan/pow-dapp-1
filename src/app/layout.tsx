import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/hooks/useWallet";

export const metadata: Metadata = {
  title: "PowDApp - Crypto Portfolio Manager",
  description: "A modern decentralized application for managing your crypto portfolio with staking, trading, and security features.",
  keywords: ["crypto", "portfolio", "staking", "defi", "blockchain", "ethereum"],
  authors: [{ name: "PowDApp Team" }],
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
      </body>
    </html>
  );
}
