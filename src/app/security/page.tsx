'use client';

import { useState } from 'react';
import { ArrowLeft, Shield, Key, Eye, EyeOff, CheckCircle, AlertTriangle, Lock, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function SecurityPage() {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const securityFeatures = [
    {
      title: 'Private Key Management',
      description: 'Your private key is encrypted and stored locally',
      status: 'secure',
      icon: Key
    },
    {
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      status: twoFactorEnabled ? 'enabled' : 'disabled',
      icon: Smartphone
    },
    {
      title: 'Biometric Authentication',
      description: 'Use fingerprint or face recognition for quick access',
      status: biometricEnabled ? 'enabled' : 'disabled',
      icon: Lock
    },
    {
      title: 'Transaction Signing',
      description: 'All transactions require your explicit approval',
      status: 'secure',
      icon: Shield
    }
  ];

  const recentActivity = [
    {
      action: 'Wallet Connected',
      time: '2 hours ago',
      status: 'success',
      location: 'Chrome Browser'
    },
    {
      action: 'Transaction Sent',
      time: '4 hours ago',
      status: 'success',
      location: 'Mobile App'
    },
    {
      action: 'Failed Login Attempt',
      time: '1 day ago',
      status: 'warning',
      location: 'Unknown IP'
    },
    {
      action: 'Security Settings Updated',
      time: '3 days ago',
      status: 'success',
      location: 'Chrome Browser'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure':
      case 'enabled':
      case 'success':
        return 'text-green-400';
      case 'disabled':
        return 'text-slate-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'secure':
      case 'enabled':
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-purple-400" />
                <h1 className="text-2xl font-bold text-white">Security Center</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Security Overview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">Security Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="bg-slate-700/50 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <feature.icon className="h-8 w-8 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                          {getStatusIcon(feature.status)}
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{feature.description}</p>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${getStatusColor(feature.status)}`}>
                            {feature.status === 'secure' ? 'Secured' : 
                             feature.status === 'enabled' ? 'Enabled' : 
                             feature.status === 'disabled' ? 'Disabled' : 'Warning'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Private Key Section */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Private Key</h3>
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 text-sm">Your Private Key</span>
                    <button
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="text-purple-400 hover:text-purple-300 flex items-center space-x-1"
                    >
                      {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="text-sm">{showPrivateKey ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <div className="bg-slate-800 rounded p-3 font-mono text-sm">
                    {showPrivateKey ? (
                      <span className="text-slate-300">
                        0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6...
                      </span>
                    ) : (
                      <span className="text-slate-500">••••••••••••••••••••••••••••••••</span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm">
                    Export Key
                  </button>
                  <button className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm">
                    Generate New Key
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings & Activity */}
          <div className="space-y-6">
            {/* Quick Settings */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Two-Factor Authentication</p>
                    <p className="text-slate-400 text-sm">Add extra security</p>
                  </div>
                  <button
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      twoFactorEnabled ? 'bg-purple-600' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Biometric Authentication</p>
                    <p className="text-slate-400 text-sm">Use fingerprint/face ID</p>
                  </div>
                  <button
                    onClick={() => setBiometricEnabled(!biometricEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      biometricEnabled ? 'bg-purple-600' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        biometricEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
              
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 py-2">
                    {getStatusIcon(activity.status)}
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{activity.action}</p>
                      <p className="text-slate-400 text-xs">{activity.location} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Tips */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Security Tips</h3>
              
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Never share your private key with anyone</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Always verify transaction details before signing</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Use hardware wallets for large amounts</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Keep your software updated</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
