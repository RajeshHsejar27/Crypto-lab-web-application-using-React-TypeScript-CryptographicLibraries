import React, { useState } from 'react';
import { Unlock, Upload, Eye, EyeOff } from 'lucide-react';
import { decryptAES } from '../../utils/cryptography/aes';
import { decryptRSA } from '../../utils/cryptography/rsa';
import { validateInput, sanitizeInput } from '../../utils/validation';
import { DecryptionResult } from '../../types/crypto';
import AlgorithmSelector from './AlgorithmSelector';
import KeyStrengthMeter from './KeyStrengthMeter';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const DecryptionModule: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('aes-256-gcm');
  const [encryptedData, setEncryptedData] = useState('');
  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [decryptionResult, setDecryptionResult] = useState<DecryptionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDecrypt = async () => {
    setError(null);
    setIsLoading(true);
    setDecryptionResult(null);

    try {
      // Validate inputs
      const encryptedError = validateInput(encryptedData, 'encrypted');
      if (encryptedError) {
        setError(encryptedError);
        return;
      }

      const sanitizedEncryptedData = sanitizeInput(encryptedData);
      
      let result: DecryptionResult;

      if (selectedAlgorithm.startsWith('aes')) {
        if (!password) {
          setError('Password is required for AES decryption');
          return;
        }
        
        const keyLength = parseInt(selectedAlgorithm.split('-')[1]);
        result = await decryptAES(sanitizedEncryptedData, password, keyLength);
      } else if (selectedAlgorithm.startsWith('rsa')) {
        if (!privateKey) {
          setError('Private key is required for RSA decryption');
          return;
        }
        
        result = await decryptRSA(sanitizedEncryptedData, privateKey);
      } else {
        throw new Error('Unsupported algorithm');
      }

      setDecryptionResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Decryption failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          
          if (data.encrypted) {
            setEncryptedData(data.encrypted);
            
            // Auto-detect algorithm if available
            if (data.algorithm) {
              const algoId = data.algorithm.toLowerCase().replace(/[^a-z0-9-]/g, '-');
              setSelectedAlgorithm(algoId);
            }
            
            // Auto-fill private key if available
            if (data.privateKey) {
              setPrivateKey(data.privateKey);
            }
          } else {
            // Assume it's just encrypted text
            setEncryptedData(content);
          }
        } catch (error) {
          // If JSON parsing fails, treat as plain encrypted text
          setEncryptedData(e.target?.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-green-600 p-3 rounded-lg">
            <Unlock className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Decryption Module</h2>
            <p className="text-gray-600">Decrypt your encrypted data using the correct keys</p>
          </div>
        </div>

        {/* File Upload */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer transition-colors">
            <Upload className="h-4 w-4" />
            <span>Upload Encrypted File</span>
            <input
              type="file"
              accept=".json,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-500">
            Upload a JSON file or encrypted text file
          </p>
        </div>
      </div>

      {/* Algorithm Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Decryption Algorithm</h3>
        <AlgorithmSelector
          selectedAlgorithm={selectedAlgorithm}
          onAlgorithmChange={setSelectedAlgorithm}
        />
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Input Data</h3>
        
        <div className="space-y-4">
          {/* Encrypted Data Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Encrypted Data
            </label>
            <textarea
              value={encryptedData}
              onChange={(e) => setEncryptedData(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
              rows={6}
              placeholder="Paste your encrypted data here..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {encryptedData.length} characters
            </p>
          </div>

          {/* Password Input for AES */}
          {selectedAlgorithm.startsWith('aes') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Decryption Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter the password used for encryption..."
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <KeyStrengthMeter password={password} showMeter={false} />
            </div>
          )}

          {/* Private Key Input for RSA */}
          {selectedAlgorithm.startsWith('rsa') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Private Key (PEM format)
              </label>
              <textarea
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                rows={8}
                placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste your RSA private key in PEM format
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Decrypt Button */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <button
          onClick={handleDecrypt}
          disabled={
            isLoading || 
            !encryptedData || 
            (selectedAlgorithm.startsWith('aes') && !password) ||
            (selectedAlgorithm.startsWith('rsa') && !privateKey)
          }
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {isLoading ? <LoadingSpinner message="Decrypting..." /> : 'Decrypt Data'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <ErrorMessage message={error} onDismiss={() => setError(null)} />
      )}

      {/* Results Section */}
      {decryptionResult && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Decryption Result</h3>
          
          {decryptionResult.success ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800 mb-2">✓ Decryption Successful</h4>
                <p className="text-sm text-green-700">
                  Your data has been successfully decrypted.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Decrypted Text
                </label>
                <textarea
                  value={decryptionResult.decrypted}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  rows={6}
                />
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-red-800 mb-2">✗ Decryption Failed</h4>
              <p className="text-sm text-red-700">
                {decryptionResult.error || 'Unable to decrypt the data. Please check your inputs.'}
              </p>
              <div className="mt-3">
                <h5 className="text-sm font-medium text-red-800 mb-1">Common Issues:</h5>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Wrong password or key</li>
                  <li>• Corrupted or modified encrypted data</li>
                  <li>• Incorrect algorithm selection</li>
                  <li>• Invalid key format (for RSA)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DecryptionModule;