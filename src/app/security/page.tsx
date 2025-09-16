'use client';

import { useState } from 'react';
import { ArrowLeft, Shield, Key, Eye, EyeOff, CheckCircle, AlertTriangle, Lock } from 'lucide-react';
import Link from 'next/link';

export default function SecurityPage() {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  const securityFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Wallet Security',
      description: 'Your private keys are encrypted and stored securely in MetaMask.',
      status: 'active',
      color: 'green'
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Transaction Signing',
      description: 'All transactions require your explicit approval in MetaMask.',
      status: 'active',
      color: 'green'
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: 'Private Key Management',
      description: 'Private keys never leave your device and are managed by MetaMask.',
      status: 'active',
      color: 'green'
    }
  ];

  const recentActivity = [
    {
      action: 'Wallet Connected',
      timestamp: '2 hours ago',
      ip: '192.168.1.100',
      location: 'New York, US',
      status: 'success'
    },
    {
      action: 'Transaction Sent',
      timestamp: '3 hours ago',
      ip: '192.168.1.100',
      location: 'New York, US',
      status: 'success'
    },
    {
      action: 'Failed Login Attempt',
      timestamp: '1 day ago',
      ip: '203.0.113.1',
      location: 'Unknown',
      status: 'warning'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/" 
            className="flex items-center text-white hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-white">Security Center</h1>
          <div className="w-20"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Security Overview */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-green-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">Security Overview</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-purple-400 mr-3">
                      {feature.icon}
                    </div>
                    <h3 className="text-white font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-white/70 text-sm mb-3">{feature.description}</p>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      feature.color === 'green' ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <span className="text-white/60 text-sm capitalize">{feature.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Two-Factor Authentication */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Two-Factor Authentication</h3>
              <p className="text-white/70 text-sm mb-4">
                Add an extra layer of security to your account.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    twoFactorEnabled
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-500 hover:bg-gray-600 text-white'
                  }`}
                >
                  {twoFactorEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>

            {/* Session Timeout */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Session Timeout</h3>
              <p className="text-white/70 text-sm mb-4">
                Automatically disconnect after inactivity.
              </p>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(activity.status)}
                    <div>
                      <div className="text-white font-medium">{activity.action}</div>
                      <div className="text-white/60 text-sm">
                        {activity.timestamp} • {activity.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-white/50 text-sm">{activity.ip}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-white mb-6">Security Tips</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Keep Your Private Keys Safe</h4>
                    <p className="text-white/70 text-sm">
                      Never share your private keys or seed phrases with anyone.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Verify Transaction Details</h4>
                    <p className="text-white/70 text-sm">
                      Always double-check recipient addresses and amounts before confirming.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Use Hardware Wallets</h4>
                    <p className="text-white/70 text-sm">
                      Consider using hardware wallets for large amounts of cryptocurrency.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Beware of Phishing</h4>
                    <p className="text-white/70 text-sm">
                      Never enter your private keys on suspicious websites.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Update Regularly</h4>
                    <p className="text-white/70 text-sm">
                      Keep your MetaMask extension updated to the latest version.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Monitor Activity</h4>
                    <p className="text-white/70 text-sm">
                      Regularly check your transaction history for any unauthorized activity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
