import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PowDApp - Crypto Portfolio Manager",
  description: "A modern decentralized application for managing your crypto portfolio with staking, trading, and security features.",
  keywords: ["crypto", "portfolio", "staking", "defi", "blockchain", "ethereum"],
  authors: [{ name: "PowDApp Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
