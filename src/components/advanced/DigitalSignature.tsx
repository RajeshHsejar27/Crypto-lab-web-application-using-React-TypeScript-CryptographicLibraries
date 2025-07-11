import React, { useState } from 'react';
import { PenTool, CheckCircle, XCircle, Key } from 'lucide-react';
import { 
  generateRSASigningKeyPair, 
  signMessage, 
  verifySignature, 
  exportPublicKey, 
  exportPrivateKey 
} from '../../utils/cryptography/rsa';
import { DigitalSignatureResult } from '../../types/crypto';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const DigitalSignature: React.FC = () => {
  const [message, setMessage] = useState('');
  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);
  const [exportedKeys, setExportedKeys] = useState<{public: string; private: string} | null>(null);
  const [signatureResult, setSignatureResult] = useState<DigitalSignatureResult | null>(null);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [verificationSignature, setVerificationSignature] = useState('');
  const [verificationKey, setVerificationKey] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateKeyPair = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      const newKeyPair = await generateRSASigningKeyPair(2048);
      setKeyPair(newKeyPair);
      
      const publicKey = await exportPublicKey(newKeyPair.publicKey);
      const privateKey = await exportPrivateKey(newKeyPair.privateKey);
      
      setExportedKeys({ public: publicKey, private: privateKey });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Key generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignMessage = async () => {
    if (!keyPair || !message.trim()) {
      setError('Please generate a key pair and enter a message');
      return;
    }

    setError(null);
    setIsLoading(true);
    
    try {
      const signature = await signMessage(message, keyPair.privateKey);
      
      setSignatureResult({
        signature,
        publicKey: exportedKeys?.public || '',
        privateKey: exportedKeys?.private || '',
        message
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signing failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySignature = async () => {
    if (!verificationMessage.trim() || !verificationSignature.trim() || !verificationKey.trim()) {
      setError('Please provide message, signature, and public key for verification');
      return;
    }

    setError(null);
    setIsLoading(true);
    
    try {
      // Import the public key
      const pemHeader = '-----BEGIN PUBLIC KEY-----';
      const pemFooter = '-----END PUBLIC KEY-----';
      const pemContents = verificationKey.replace(pemHeader, '').replace(pemFooter, '').replace(/\s/g, '');
      const binaryString = atob(pemContents);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const publicKey = await crypto.subtle.importKey(
        'spki',
        bytes,
        {
          name: 'RSA-PSS',
          hash: 'SHA-256'
        },
        false,
        ['verify']
      );

      const result = await verifySignature(verificationMessage, verificationSignature, publicKey);
      setVerificationResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      setVerificationResult(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadExampleData = () => {
    setMessage('This is an important document that needs to be signed.');
    if (signatureResult) {
      setVerificationMessage(signatureResult.message);
      setVerificationSignature(signatureResult.signature);
      setVerificationKey(signatureResult.publicKey);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-indigo-600 p-3 rounded-lg">
            <PenTool className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Digital Signatures</h2>
            <p className="text-gray-600">Sign messages and verify authenticity using RSA</p>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleGenerateKeyPair}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {isLoading ? <LoadingSpinner message="Generating..." size="sm" /> : 'Generate Key Pair'}
          </button>
          
          <button
            onClick={loadExampleData}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Load Example
          </button>
        </div>
      </div>

      {/* Key Pair Display */}
      {exportedKeys && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Key className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Generated Key Pair</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public Key (Share this for verification)
              </label>
              <textarea
                value={exportedKeys.public}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-xs"
                rows={6}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Private Key (Keep this secret!)
              </label>
              <textarea
                value={exportedKeys.private}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-red-50 font-mono text-xs"
                rows={6}
              />
            </div>
          </div>
        </div>
      )}

      {/* Message Signing */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sign Message</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message to Sign
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={4}
              placeholder="Enter your message..."
            />
          </div>

          <button
            onClick={handleSignMessage}
            disabled={isLoading || !keyPair || !message.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isLoading ? <LoadingSpinner message="Signing..." /> : 'Sign Message'}
          </button>
        </div>
      </div>

      {/* Signature Result */}
      {signatureResult && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Digital Signature</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Generated Signature
              </label>
              <textarea
                value={signatureResult.signature}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                rows={4}
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-800 mb-2">✓ Message Signed Successfully</h4>
              <p className="text-sm text-green-700">
                The digital signature has been created. You can now share the message, 
                signature, and public key for verification.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Signature Verification */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Verify Signature</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Message
            </label>
            <textarea
              value={verificationMessage}
              onChange={(e) => setVerificationMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
              placeholder="Enter the original message..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signature
            </label>
            <textarea
              value={verificationSignature}
              onChange={(e) => setVerificationSignature(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
              rows={3}
              placeholder="Enter the signature..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Public Key
            </label>
            <textarea
              value={verificationKey}
              onChange={(e) => setVerificationKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
              rows={6}
              placeholder="Enter the public key..."
            />
          </div>

          <button
            onClick={handleVerifySignature}
            disabled={isLoading || !verificationMessage.trim() || !verificationSignature.trim() || !verificationKey.trim()}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isLoading ? <LoadingSpinner message="Verifying..." /> : 'Verify Signature'}
          </button>
        </div>
      </div>

      {/* Verification Result */}
      {verificationResult !== null && (
        <div className={`bg-white rounded-lg shadow-lg p-6 ${
          verificationResult ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            {verificationResult ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">
              Verification {verificationResult ? 'Successful' : 'Failed'}
            </h3>
          </div>
          
          <div className={`rounded-lg p-4 ${
            verificationResult ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm font-medium ${
              verificationResult ? 'text-green-800' : 'text-red-800'
            }`}>
              {verificationResult 
                ? '✓ Signature is valid! The message has not been tampered with and was signed by the holder of the private key.'
                : '✗ Signature is invalid! The message may have been tampered with or the signature is incorrect.'
              }
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <ErrorMessage message={error} onDismiss={() => setError(null)} />
      )}
    </div>
  );
};

export default DigitalSignature;