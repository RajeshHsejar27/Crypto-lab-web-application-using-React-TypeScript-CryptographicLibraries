import React from 'react';
import { Shield, Key, Lock, Hash, ArrowRight, CheckCircle } from 'lucide-react';

const CryptoExplanation: React.FC = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Understanding Cryptography
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn the fundamental concepts behind modern cryptographic systems
          </p>
        </div>

        {/* Symmetric vs Asymmetric */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Symmetric Encryption */}
          <div className="bg-blue-50 rounded-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Symmetric Encryption</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                Uses the same key for both encryption and decryption. Fast and efficient 
                for large amounts of data.
              </p>
              
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">How it works:</h4>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="bg-blue-100 px-2 py-1 rounded">Plaintext</span>
                  <ArrowRight className="h-4 w-4" />
                  <span className="bg-blue-200 px-2 py-1 rounded">Same Key</span>
                  <ArrowRight className="h-4 w-4" />
                  <span className="bg-blue-300 px-2 py-1 rounded">Ciphertext</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Advantages:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Fast encryption/decryption</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Efficient for large files</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Lower computational overhead</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-yellow-100 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Challenge:</strong> Both parties must securely share the same key
                </p>
              </div>
            </div>
          </div>

          {/* Asymmetric Encryption */}
          <div className="bg-purple-50 rounded-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-purple-500 p-3 rounded-lg">
                <Key className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Asymmetric Encryption</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                Uses a pair of keys: public key for encryption, private key for decryption. 
                Solves the key distribution problem.
              </p>
              
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">How it works:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="bg-purple-100 px-2 py-1 rounded">Plaintext</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="bg-purple-200 px-2 py-1 rounded">Public Key</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="bg-purple-300 px-2 py-1 rounded">Ciphertext</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-purple-300 px-2 py-1 rounded">Ciphertext</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="bg-purple-400 px-2 py-1 rounded">Private Key</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="bg-purple-100 px-2 py-1 rounded">Plaintext</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Advantages:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>No key sharing required</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Enables digital signatures</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Secure key exchange</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-yellow-100 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Trade-off:</strong> Slower than symmetric encryption
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hash Functions */}
        <div className="bg-green-50 rounded-xl p-8 mb-16">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-green-500 p-3 rounded-lg">
              <Hash className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Hash Functions</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-gray-700">
                One-way functions that convert input data into a fixed-size string. 
                Essential for data integrity and password security.
              </p>
              
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Properties:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Deterministic (same input = same output)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Fixed output size</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Avalanche effect (small change = big difference)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Irreversible (one-way)</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Common Use Cases:</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-white rounded-lg p-3">
                  <h5 className="font-medium text-gray-900">Password Storage</h5>
                  <p className="text-sm text-gray-600">Store hashed passwords instead of plaintext</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <h5 className="font-medium text-gray-900">Data Integrity</h5>
                  <p className="text-sm text-gray-600">Verify files haven't been tampered with</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <h5 className="font-medium text-gray-900">Digital Signatures</h5>
                  <p className="text-sm text-gray-600">Create unique fingerprints for documents</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <h5 className="font-medium text-gray-900">Blockchain</h5>
                  <p className="text-sm text-gray-600">Link blocks and prove work in cryptocurrencies</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Best Practices */}
        <div className="bg-gray-50 rounded-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gray-600 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Security Best Practices</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Key Management</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Use strong, random keys</li>
                <li>• Rotate keys regularly</li>
                <li>• Secure key storage</li>
                <li>• Never hardcode keys</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Algorithm Selection</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Use industry standards (AES, RSA)</li>
                <li>• Avoid deprecated algorithms</li>
                <li>• Choose appropriate key sizes</li>
                <li>• Regular security audits</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Implementation</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Use proven libraries</li>
                <li>• Handle errors securely</li>
                <li>• Protect against side-channel attacks</li>
                <li>• Regular updates and patches</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoExplanation;