import React, { useState } from 'react';
import { Hash, Copy, RefreshCw } from 'lucide-react';
import { computeHash, compareHashes, generateSalt, computePBKDF2 } from '../../utils/cryptography/hashing';
import { HashResult } from '../../types/crypto';
import { HASH_ALGORITHMS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const HashingModule: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('SHA-256');
  const [inputText, setInputText] = useState('');
  const [hashResult, setHashResult] = useState<HashResult | null>(null);
  const [compareHash, setCompareHash] = useState('');
  const [comparisonResult, setComparisonResult] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // PBKDF2 specific states
  const [password, setPassword] = useState('');
  const [salt, setSalt] = useState('');
  const [iterations, setIterations] = useState(100000);
  const [pbkdf2Result, setPbkdf2Result] = useState<string>('');

  const handleHash = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      if (!inputText.trim()) {
        setError('Please enter text to hash');
        return;
      }

      const result = await computeHash(inputText, selectedAlgorithm);
      setHashResult(result);
      setComparisonResult(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hashing failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompare = () => {
    if (hashResult && compareHash) {
      const matches = compareHashes(hashResult.hash, compareHash);
      setComparisonResult(matches);
    }
  };

  const handleCopyHash = async () => {
    if (hashResult) {
      await navigator.clipboard.writeText(hashResult.hash);
    }
  };

  const generateRandomSalt = () => {
    const newSalt = generateSalt(16);
    setSalt(newSalt);
  };

  const handlePBKDF2 = () => {
    if (!password || !salt) {
      setError('Password and salt are required for PBKDF2');
      return;
    }

    try {
      const result = computePBKDF2(password, salt, iterations);
      setPbkdf2Result(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PBKDF2 computation failed');
    }
  };

  const loadExampleData = () => {
    setInputText('Hello, World! This is a test message.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-purple-600 p-3 rounded-lg">
            <Hash className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Hash Functions</h2>
            <p className="text-gray-600">Generate and compare cryptographic hashes</p>
          </div>
        </div>

        <button
          onClick={loadExampleData}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          Load Example Data
        </button>
      </div>

      {/* Algorithm Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Hash Algorithm</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HASH_ALGORITHMS.map((algorithm) => (
            <button
              key={algorithm.id}
              onClick={() => setSelectedAlgorithm(algorithm.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedAlgorithm === algorithm.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  selectedAlgorithm === algorithm.id ? 'bg-purple-500 text-white' : 'bg-gray-100'
                }`}>
                  <Hash className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{algorithm.name}</h4>
                  <p className="text-sm text-gray-600">{algorithm.description}</p>
                  {(algorithm.id === 'SHA-1' || algorithm.id === 'MD5') && (
                    <p className="text-xs text-orange-600 mt-1">⚠️ For educational purposes only</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Input Text</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text to Hash
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={4}
              placeholder="Enter text to generate hash..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {inputText.length} characters
            </p>
          </div>

          <button
            onClick={handleHash}
            disabled={isLoading || !inputText.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isLoading ? <LoadingSpinner message="Hashing..." /> : 'Generate Hash'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <ErrorMessage message={error} onDismiss={() => setError(null)} />
      )}

      {/* Hash Result */}
      {hashResult && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hash Result</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {hashResult.algorithm} Hash
              </label>
              <div className="relative">
                <textarea
                  value={hashResult.hash}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  rows={3}
                />
                <button
                  onClick={handleCopyHash}
                  className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700"
                  title="Copy hash"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hash Length
                </label>
                <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                  {hashResult.hash.length} characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Generated At
                </label>
                <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                  {new Date(hashResult.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hash Comparison */}
      {hashResult && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hash Comparison</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compare with Another Hash
              </label>
              <input
                type="text"
                value={compareHash}
                onChange={(e) => setCompareHash(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                placeholder="Paste hash to compare..."
              />
            </div>

            <button
              onClick={handleCompare}
              disabled={!compareHash.trim()}
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg transition-colors disabled:bg-gray-100 disabled:text-gray-400"
            >
              Compare Hashes
            </button>

            {comparisonResult !== null && (
              <div className={`rounded-lg p-4 ${
                comparisonResult ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm font-medium ${
                  comparisonResult ? 'text-green-800' : 'text-red-800'
                }`}>
                  {comparisonResult ? '✓ Hashes match!' : '✗ Hashes do not match'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PBKDF2 Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">PBKDF2 Key Derivation</h3>
        <p className="text-sm text-gray-600 mb-4">
          Password-Based Key Derivation Function 2 - Used for secure password hashing
        </p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter password..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salt
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={salt}
                  onChange={(e) => setSalt(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                  placeholder="Enter salt..."
                />
                <button
                  onClick={generateRandomSalt}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Generate random salt"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Iterations
            </label>
            <input
              type="number"
              value={iterations}
              onChange={(e) => setIterations(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              min="1000"
              max="1000000"
            />
            <p className="text-xs text-gray-500 mt-1">
              Higher iterations = more secure but slower (recommended: 100,000+)
            </p>
          </div>

          <button
            onClick={handlePBKDF2}
            disabled={!password || !salt}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Generate PBKDF2 Hash
          </button>

          {pbkdf2Result && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PBKDF2 Result
              </label>
              <textarea
                value={pbkdf2Result}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                rows={3}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HashingModule;