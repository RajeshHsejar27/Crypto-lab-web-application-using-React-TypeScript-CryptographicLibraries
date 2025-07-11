import React from 'react';
import { Shield, Lock, Key, Hash, PenTool, BookOpen, ArrowRight } from 'lucide-react';
import CryptoExplanation from './CryptoExplanation';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: Lock,
      title: 'Symmetric Encryption',
      description: 'AES encryption with various key lengths (128, 192, 256 bits)',
      color: 'bg-blue-500',
      examples: ['File encryption', 'Database protection', 'Secure messaging']
    },
    {
      icon: Key,
      title: 'Asymmetric Encryption',
      description: 'RSA encryption with public-private key pairs',
      color: 'bg-purple-500',
      examples: ['Digital certificates', 'Key exchange', 'Secure communications']
    },
    {
      icon: Hash,
      title: 'Hash Functions',
      description: 'SHA-256, SHA-512, and more for data integrity',
      color: 'bg-green-500',
      examples: ['Password hashing', 'Data verification', 'Digital fingerprints']
    },
    {
      icon: PenTool,
      title: 'Digital Signatures',
      description: 'RSA signatures for authenticity and non-repudiation',
      color: 'bg-orange-500',
      examples: ['Document signing', 'Code signing', 'Email verification']
    }
  ];

  const quickStart = [
    {
      step: 1,
      title: 'Choose Algorithm',
      description: 'Select from AES, RSA, or hash functions',
      action: () => onNavigate('encryption')
    },
    {
      step: 2,
      title: 'Enter Your Data',
      description: 'Input text or upload files to encrypt',
      action: () => onNavigate('encryption')
    },
    {
      step: 3,
      title: 'Generate Results',
      description: 'Get encrypted data and security keys',
      action: () => onNavigate('encryption')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Shield className="h-16 w-16" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Learn Cryptography
              <span className="block text-blue-200">Interactively</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Explore encryption, hashing, and digital signatures with hands-on examples 
              and modern cryptographic algorithms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('encryption')}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Start Encrypting</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => onNavigate('advanced')}
                className="bg-blue-500 bg-opacity-20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-30 transition-colors border border-blue-300"
              >
                Advanced Tools
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cryptographic Tools & Algorithms
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore industry-standard encryption methods with interactive demonstrations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className={`${feature.color} p-3 rounded-lg w-fit mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Use Cases:</h4>
                    <ul className="text-sm text-gray-600">
                      {feature.examples.map((example, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quick Start Guide
            </h2>
            <p className="text-xl text-gray-600">
              Get started with cryptography in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickStart.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full font-bold text-lg mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {item.description}
                  </p>
                  <button
                    onClick={item.action}
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                  >
                    <span>Try it now</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                {index < quickStart.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Crypto Explanation Section */}
      <CryptoExplanation />

      {/* Security Notice */}
      <div className="bg-yellow-50 border-t border-yellow-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Educational Purpose Only
              </h3>
              <p className="text-yellow-700">
                This application is designed for learning cryptographic concepts. All operations 
                are performed client-side in your browser. For production applications, always 
                use established cryptographic libraries and follow security best practices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;