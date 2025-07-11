/**
 * Constants for cryptographic operations
 */

import { CryptoAlgorithm } from '../types/crypto';

export const CRYPTO_ALGORITHMS: CryptoAlgorithm[] = [
  {
    id: 'aes-256-gcm',
    name: 'AES-256-GCM',
    type: 'symmetric',
    description: 'Advanced Encryption Standard with 256-bit key and Galois Counter Mode',
    keyLength: [256],
    useCases: ['File encryption', 'Database encryption', 'Secure communications']
  },
  {
    id: 'aes-192-gcm',
    name: 'AES-192-GCM',
    type: 'symmetric',
    description: 'Advanced Encryption Standard with 192-bit key and Galois Counter Mode',
    keyLength: [192],
    useCases: ['Secure messaging', 'Data protection', 'Cloud storage']
  },
  {
    id: 'aes-128-gcm',
    name: 'AES-128-GCM',
    type: 'symmetric',
    description: 'Advanced Encryption Standard with 128-bit key and Galois Counter Mode',
    keyLength: [128],
    useCases: ['Web applications', 'Mobile apps', 'IoT devices']
  },
  {
    id: 'rsa-2048',
    name: 'RSA-2048',
    type: 'asymmetric',
    description: 'RSA encryption with 2048-bit key length',
    keyLength: [2048],
    useCases: ['Digital signatures', 'Key exchange', 'Certificate authorities']
  },
  {
    id: 'rsa-4096',
    name: 'RSA-4096',
    type: 'asymmetric',
    description: 'RSA encryption with 4096-bit key length for maximum security',
    keyLength: [4096],
    useCases: ['High-security applications', 'Government communications', 'Financial systems']
  }
];

export const HASH_ALGORITHMS = [
  { id: 'SHA-256', name: 'SHA-256', description: 'Secure Hash Algorithm 256-bit' },
  { id: 'SHA-512', name: 'SHA-512', description: 'Secure Hash Algorithm 512-bit' },
  { id: 'SHA-1', name: 'SHA-1', description: 'Secure Hash Algorithm 160-bit (deprecated)' },
  { id: 'MD5', name: 'MD5', description: 'Message Digest 5 (deprecated, for comparison only)' }
];

export const KEY_STRENGTH_RULES = {
  minLength: 8,
  strongLength: 12,
  veryStrongLength: 16,
  patterns: {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    numbers: /[0-9]/,
    symbols: /[^a-zA-Z0-9]/
  }
};

export const ENCRYPTION_EXAMPLES = {
  plaintext: 'Hello, World! This is a secret message.',
  weakPassword: 'password123',
  strongPassword: 'MyStr0ng&SecureP@ssw0rd2024!'
};