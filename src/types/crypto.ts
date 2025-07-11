/**
 * Type definitions for the cryptographic application
 */

export interface EncryptionResult {
  encrypted: string;
  key?: string;
  iv?: string;
  algorithm: string;
  timestamp: string;
}

export interface DecryptionResult {
  decrypted: string;
  success: boolean;
  error?: string;
}

export interface KeyStrength {
  score: number;
  feedback: string;
  color: string;
}

export interface CryptoAlgorithm {
  id: string;
  name: string;
  type: 'symmetric' | 'asymmetric';
  description: string;
  keyLength: number[];
  useCases: string[];
}

export interface HashResult {
  hash: string;
  algorithm: string;
  input: string;
  timestamp: string;
}

export interface DigitalSignatureResult {
  signature: string;
  publicKey: string;
  privateKey: string;
  message: string;
  verified?: boolean;
}