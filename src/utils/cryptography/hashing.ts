/**
 * Cryptographic hashing utilities
 */

import CryptoJS from 'crypto-js';
import { HashResult } from '../../types/crypto';

/**
 * Computes SHA-256 hash using WebCrypto API
 */
export const computeSHA256 = async (input: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Computes SHA-512 hash using WebCrypto API
 */
export const computeSHA512 = async (input: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hash = await crypto.subtle.digest('SHA-512', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Computes SHA-1 hash using WebCrypto API (for demonstration - not secure)
 */
export const computeSHA1 = async (input: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hash = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Computes MD5 hash using crypto-js (for demonstration - not secure)
 */
export const computeMD5 = (input: string): string => {
  return CryptoJS.MD5(input).toString();
};

/**
 * Computes hash based on algorithm selection
 */
export const computeHash = async (input: string, algorithm: string): Promise<HashResult> => {
  let hash: string;
  
  switch (algorithm) {
    case 'SHA-256':
      hash = await computeSHA256(input);
      break;
    case 'SHA-512':
      hash = await computeSHA512(input);
      break;
    case 'SHA-1':
      hash = await computeSHA1(input);
      break;
    case 'MD5':
      hash = computeMD5(input);
      break;
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  return {
    hash,
    algorithm,
    input,
    timestamp: new Date().toISOString()
  };
};

/**
 * Compares two hash values (constant-time comparison to prevent timing attacks)
 */
export const compareHashes = (hash1: string, hash2: string): boolean => {
  if (hash1.length !== hash2.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < hash1.length; i++) {
    result |= hash1.charCodeAt(i) ^ hash2.charCodeAt(i);
  }

  return result === 0;
};

/**
 * Generates a cryptographically secure random salt
 */
export const generateSalt = (length: number = 16): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Computes PBKDF2 hash for password storage
 */
export const computePBKDF2 = (password: string, salt: string, iterations: number = 100000): string => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256/32,
    iterations: iterations
  }).toString();
};