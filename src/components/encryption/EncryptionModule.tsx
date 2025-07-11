import React, { useState } from 'react';
import { Lock, Copy, Download, Upload, Eye, EyeOff } from 'lucide-react';
import { encryptAES } from '../../utils/cryptography/aes';
import { encryptRSA, generateRSAKeyPair, exportPublicKey, exportPrivateKey } from '../../utils/cryptography/rsa';
import { validateInput, sanitizeInput } from '../../utils/validation';
import { EncryptionResult } from '../../types/crypto';
import { ENCRYPTION_EXAMPLES } from '../../utils/constants';
import AlgorithmSelector from './AlgorithmSelector';
import KeyStrengthMeter from './KeyStrengthMeter';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const EncryptionModule: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('aes-256-gcm');
  const [plaintext, setPlaintext] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [encryptionResult, setEncryptionResult] = useState<EncryptionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rsaKeys, setRsaKeys] = useState<{ public: string; private: string } | null>(null);

  const handleEncrypt = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Validate inputs
      const plaintextError = validateInput(plaintext, 'plaintext');
      if (plaintextError) {
        setError(plaintextError);
        return;
      }

      const sanitizedPlaintext = sanitizeInput(plaintext);
      
      let result: EncryptionResult;

      if (selectedAlgorithm.startsWith('aes')) {
        if (!password) {
          setError('Password is required for AES encryption');
          return;
        }
        
        const keyLength = parseInt(selectedAlgorithm.split('-')[1]);
        result = await encryptAES(sanitizedPlaintext, password, keyLength);
      } else if (selectedAlgorithm.startsWith('rsa')) {
        // Generate RSA key pair if not exists
        if (!rsaKeys) {
          const keyLength = parseInt(selectedAlgorithm.split('-')[1]);
          const keyPair = await generateRSAKeyPair(keyLength);
          const publicKey = await exportPublicKey(keyPair.publicKey);
          const privateKey = await exportPrivateKey(keyPair.privateKey);
          
          const keys = { public: publicKey, private: privateKey };
          setRsaKeys(keys);
          
          result = await encryptRSA(sanitizedPlaintext, publicKey, keyLength);
        } else {
          const keyLength = parseInt(selectedAlgorithm.split('-')[1]);
          result = await encryptRSA(sanitizedPlaintext, rsaKeys.public, keyLength);
        }
      } else {
        throw new Error('Unsupported algorithm');
      }

      setEncryptionResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResult = async () => {
    if (encryptionResult) {
      await navigator.clipboard.writeText(encryptionResult.encrypted);
    }
  };

  const handleDownloadResult = () => {
    if (encryptionResult) {
      const data = {
        encrypted: encryptionResult.encrypted,
        algorithm: encryptionResult.algorithm,
        timestamp: encryptionResult.timestamp,
        ...(rsaKeys && { publicKey: rsaKeys.public, privateKey: rsaKeys.private })
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `encrypted-${encryptionResult.algorithm}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleLoadExample = () => {
    setPlaintext(ENCRYPTION_EXAMPLES.plaintext);
    setPassword(ENCRYPTION_EXAMPLES.strongPassword);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-600 p-3 rounded-lg">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Encryption Module</h2>
            <p className="text-gray-600">Encrypt your plaintext using various cryptographic algorithms</p>
          </div>
        </div>

        <button
          onClick={handleLoadExample}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          Load Example Data
        </button>
      </div>

      {/* Algorithm Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Encryption Algorithm</h3>
        <AlgorithmSelector
          selectedAlgorithm={selectedAlgorithm}
          onAlgorithmChange={setSelectedAlgorithm}
        />
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Input Data</h3>
        
        <div className="space-y-4">
          {/* Plaintext Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plaintext to Encrypt
            </label>
            <textarea
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Enter your message to encrypt..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {plaintext.length} characters
            </p>
          </div>

          {/* Password Input for AES */}
          {selectedAlgorithm.startsWith('aes') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Encryption Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a strong password..."
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <KeyStrengthMeter password={password} />
            </div>
          )}

          {/* RSA Key Information */}
          {selectedAlgorithm.startsWith('rsa') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">RSA Key Information</h4>
              <p className="text-sm text-yellow-700">
                {rsaKeys 
                  ? 'RSA key pair has been generated and will be used for encryption.'
                  : 'An RSA key pair will be automatically generated when you encrypt.'
                }
              </p>
              {rsaKeys && (
                <button
                  onClick={() => setRsaKeys(null)}
                  className="mt-2 text-sm text-yellow-600 hover:text-yellow-800 underline"
                >
                  Generate New Key Pair
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Encrypt Button */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <button
          onClick={handleEncrypt}
          disabled={isLoading || !plaintext || (selectedAlgorithm.startsWith('aes') && !password)}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {isLoading ? <LoadingSpinner message="Encrypting..." /> : 'Encrypt Data'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <ErrorMessage message={error} onDismiss={() => setError(null)} />
      )}

      {/* Results Section */}
      {encryptionResult && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Encryption Result</h3>
          
          <div className="space-y-4">
            {/* Encrypted Data */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Encrypted Data
              </label>
              <div className="relative">
                <textarea
                  value={encryptionResult.encrypted}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  rows={6}
                />
                <button
                  onClick={handleCopyResult}
                  className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700"
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Algorithm
                </label>
                <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                  {encryptionResult.algorithm}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timestamp
                </label>
                <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                  {new Date(encryptionResult.timestamp).toLocaleString()}
                </p>
              </div>
            </div>

            {/* RSA Keys Display */}
            {rsaKeys && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Public Key (for encryption)
                  </label>
                  <textarea
                    value={rsaKeys.public}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-xs"
                    rows={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Private Key (for decryption) - Keep this secure!
                  </label>
                  <textarea
                    value={rsaKeys.private}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-red-50 font-mono text-xs"
                    rows={6}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleCopyResult}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span>Copy Result</span>
              </button>
              <button
                onClick={handleDownloadResult}
                className="flex items-center space-x-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncryptionModule;