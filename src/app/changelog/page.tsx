'use client';

import { useState } from 'react';
import { Calendar, Code, Zap, Shield, Globe, Star, ArrowRight, CheckCircle, Plus, Bug } from 'lucide-react';
import { trackPageView } from '@/lib/analytics';

interface ChangelogEntry {
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch' | 'feature';
  title: string;
  description: string;
  features: string[];
  improvements: string[];
  fixes: string[];
  icon: React.ReactNode;
  color: string;
}

const changelogData: ChangelogEntry[] = [
  {
    version: '1.2.0',
    date: '2024-12-17',
    type: 'major',
    title: 'Multi-Token Support (ERC-20)',
    description: 'Complete implementation of ERC-20 token support with portfolio management, transfers, and multi-token dashboard.',
    features: [
      'Support for 8 popular ERC-20 tokens (USDC, USDT, DAI, LINK, UNI, MATIC, WBTC, SHIB)',
      'TokenSelector component with search functionality',
      'Multi-token portfolio dashboard with real-time balances',
      'ERC-20 token transfer functionality',
      'Token balance fetching and price integration',
      'Gas estimation for token transfers',
      'Comprehensive error handling and validation'
    ],
    improvements: [
      'Enhanced portfolio visualization with token diversity metrics',
      'Improved user experience with intuitive token selection',
      'Optimized performance with batch operations',
      'Better error messages and user feedback',
      'Enhanced type safety with comprehensive TypeScript definitions'
    ],
    fixes: [
      'Fixed token balance display issues',
      'Resolved gas estimation accuracy problems',
      'Fixed type compatibility issues in token interfaces',
      'Resolved build compilation errors'
    ],
    icon: <Star className="w-6 h-6" />,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500'
  },
  {
    version: '1.1.0',
    date: '2024-12-16',
    type: 'major',
    title: 'Internationalization & SEO Optimization',
    description: 'Complete internationalization to English and comprehensive SEO optimization for global accessibility.',
    features: [
      'Full English translation of all UI components',
      'SEO metadata optimization with Open Graph tags',
      'Sitemap.xml and robots.txt implementation',
      'Vercel Analytics integration',
      'Social media sharing optimization',
      'Search engine optimization'
    ],
    improvements: [
      'Improved global accessibility and user experience',
      'Enhanced search engine visibility',
      'Better social media sharing experience',
      'Optimized page loading and performance',
      'Enhanced analytics tracking'
    ],
    fixes: [
      'Fixed metadata viewport warnings',
      'Resolved SEO configuration issues',
      'Fixed analytics tracking implementation'
    ],
    icon: <Globe className="w-6 h-6" />,
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500'
  },
  {
    version: '1.0.0',
    date: '2024-12-15',
    type: 'major',
    title: 'Real Blockchain Integration',
    description: 'Transformation from simulated wallet to real blockchain integration with MetaMask support.',
    features: [
      'Real MetaMask wallet integration',
      'Ethereum mainnet and testnet support',
      'Actual ETH balance fetching and display',
      'Real transaction sending functionality',
      'Network switching capabilities',
      'Gas estimation and fee calculation',
      'Transaction history tracking',
      'Error handling for blockchain interactions'
    ],
    improvements: [
      'Replaced simulated data with real blockchain data',
      'Enhanced user experience with actual crypto functionality',
      'Improved security with real wallet integration',
      'Better error handling and user feedback',
      'Optimized transaction flow and confirmation'
    ],
    fixes: [
      'Fixed wallet connection issues',
      'Resolved transaction confirmation problems',
      'Fixed balance display accuracy',
      'Resolved network switching issues'
    ],
    icon: <Shield className="w-6 h-6" />,
    color: 'bg-gradient-to-r from-green-500 to-emerald-500'
  },
  {
    version: '0.9.0',
    date: '2024-12-14',
    type: 'minor',
    title: 'Enhanced Security & Staking Features',
    description: 'Implementation of advanced security features and staking functionality for crypto portfolio management.',
    features: [
      'Advanced security settings page',
      'Two-factor authentication preparation',
      'Private key management interface',
      'Staking rewards calculation',
      'Security audit recommendations',
      'Wallet backup and recovery options'
    ],
    improvements: [
      'Enhanced security awareness and education',
      'Improved user confidence in platform security',
      'Better security best practices guidance',
      'Enhanced staking user experience'
    ],
    fixes: [
      'Fixed security page navigation issues',
      'Resolved staking calculation accuracy',
      'Fixed security recommendations display'
    ],
    icon: <Shield className="w-6 h-6" />,
    color: 'bg-gradient-to-r from-red-500 to-orange-500'
  },
  {
    version: '0.8.0',
    date: '2024-12-13',
    type: 'minor',
    title: 'Transaction Management & History',
    description: 'Comprehensive transaction management system with history tracking and detailed transaction information.',
    features: [
      'Transaction history page with detailed records',
      'Transaction status tracking and updates',
      'Gas fee optimization suggestions',
      'Transaction filtering and search',
      'Export transaction history functionality',
      'Real-time transaction notifications'
    ],
    improvements: [
      'Enhanced transaction visibility and tracking',
      'Improved user experience with transaction management',
      'Better transaction performance monitoring',
      'Enhanced transaction security features'
    ],
    fixes: [
      'Fixed transaction history loading issues',
      'Resolved transaction status update problems',
      'Fixed gas fee calculation accuracy'
    ],
    icon: <Code className="w-6 h-6" />,
    color: 'bg-gradient-to-r from-indigo-500 to-purple-500'
  },
  {
    version: '0.7.0',
    date: '2024-12-12',
    type: 'patch',
    title: 'UI/UX Improvements & Performance',
    description: 'Significant UI/UX improvements and performance optimizations for better user experience.',
    features: [
      'Modern gradient backgrounds and animations',
      'Responsive design improvements',
      'Loading states and skeleton screens',
      'Enhanced button interactions and hover effects',
      'Improved mobile responsiveness',
      'Performance optimizations'
    ],
    improvements: [
      'Enhanced visual appeal and modern design',
      'Improved loading performance',
      'Better mobile user experience',
      'Enhanced accessibility features',
      'Optimized bundle size and loading times'
    ],
    fixes: [
      'Fixed mobile layout issues',
      'Resolved loading state problems',
      'Fixed animation performance issues',
      'Resolved responsive design bugs'
    ],
    icon: <Zap className="w-6 h-6" />,
    color: 'bg-gradient-to-r from-yellow-500 to-orange-500'
  }
];

export default function ChangelogPage() {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  // Track page view
  useState(() => {
    trackPageView('changelog_page');
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'major': return 'bg-red-500';
      case 'minor': return 'bg-blue-500';
      case 'patch': return 'bg-green-500';
      case 'feature': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'major': return 'Major Release';
      case 'minor': return 'Minor Release';
      case 'patch': return 'Patch Update';
      case 'feature': return 'New Feature';
      default: return 'Update';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Calendar className="h-12 w-12 text-purple-400 mr-4" />
              <h1 className="text-4xl font-bold text-white">Changelog</h1>
            </div>
            <p className="text-xl text-slate-300 mb-4">
              Track the evolution of PowDApp with detailed release notes and feature updates
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-400">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                Major Release
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                Minor Release
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Patch Update
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                New Feature
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-slate-600"></div>

            {/* Changelog entries */}
            <div className="space-y-8">
              {changelogData.map((entry) => (
                <div key={entry.version} className="relative">
                  {/* Timeline dot */}
                  <div className={`absolute left-6 w-4 h-4 rounded-full ${getTypeColor(entry.type)} border-4 border-slate-900 z-10`}></div>
                  
                  {/* Content card */}
                  <div className="ml-16">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all">
                      {/* Version header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl ${entry.color} text-white`}>
                            {entry.icon}
                          </div>
                          <div>
                            <div className="flex items-center space-x-3">
                              <h2 className="text-2xl font-bold text-white">v{entry.version}</h2>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getTypeColor(entry.type)}`}>
                                {getTypeLabel(entry.type)}
                              </span>
                            </div>
                            <p className="text-slate-400 text-sm">{entry.date}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedVersion(selectedVersion === entry.version ? null : entry.version)}
                          className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                        >
                          <span>{selectedVersion === entry.version ? 'Hide Details' : 'Show Details'}</span>
                          <ArrowRight className={`w-4 h-4 transition-transform ${selectedVersion === entry.version ? 'rotate-90' : ''}`} />
                        </button>
                      </div>

                      {/* Title and description */}
                      <h3 className="text-xl font-semibold text-white mb-3">{entry.title}</h3>
                      <p className="text-slate-300 mb-6">{entry.description}</p>

                      {/* Detailed content */}
                      {selectedVersion === entry.version && (
                        <div className="space-y-6 pt-6 border-t border-white/20">
                          {/* New Features */}
                          {entry.features.length > 0 && (
                            <div>
                              <h4 className="flex items-center text-lg font-semibold text-white mb-3">
                                <Plus className="w-5 h-5 text-green-400 mr-2" />
                                New Features
                              </h4>
                              <ul className="space-y-2">
                                {entry.features.map((feature, idx) => (
                                  <li key={idx} className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-slate-300">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Improvements */}
                          {entry.improvements.length > 0 && (
                            <div>
                              <h4 className="flex items-center text-lg font-semibold text-white mb-3">
                                <Zap className="w-5 h-5 text-blue-400 mr-2" />
                                Improvements
                              </h4>
                              <ul className="space-y-2">
                                {entry.improvements.map((improvement, idx) => (
                                  <li key={idx} className="flex items-start space-x-3">
                                    <ArrowRight className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-slate-300">{improvement}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Bug Fixes */}
                          {entry.fixes.length > 0 && (
                            <div>
                              <h4 className="flex items-center text-lg font-semibold text-white mb-3">
                                <Bug className="w-5 h-5 text-red-400 mr-2" />
                                Bug Fixes
                              </h4>
                              <ul className="space-y-2">
                                {entry.fixes.map((fix, idx) => (
                                  <li key={idx} className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-slate-300">{fix}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 p-6 bg-white/5 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Stay Updated</h3>
            <p className="text-slate-300 mb-4">
              Follow our development progress and get notified about new features and updates.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <a
                href="https://github.com/FairyFanFan/pow-dapp-1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                <Code className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://pow-dapp-1.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-300 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
