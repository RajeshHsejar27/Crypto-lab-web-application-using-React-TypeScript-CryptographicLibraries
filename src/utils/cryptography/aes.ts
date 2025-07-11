/**
 * AES encryption and decryption utilities using WebCrypto API
 */

import { EncryptionResult, DecryptionResult } from '../../types/crypto';

/**
 * Generates a cryptographically secure random key
 */
export const generateAESKey = async (keyLength: number = 256): Promise<CryptoKey> => {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: keyLength
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
};

/**
 * Derives a key from a password using PBKDF2
 */
export const deriveKeyFromPassword = async (
  password: string,
  salt: Uint8Array,
  keyLength: number = 256
): Promise<CryptoKey> => {
  // First, import the password as a key
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  // Derive the AES key from the password
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000, // Higher iterations for better security
      hash: 'SHA-256'
    },
    passwordKey,
    {
      name: 'AES-GCM',
      length: keyLength
    },
    false, // not extractable
    ['encrypt', 'decrypt']
  );
};

/**
 * Encrypts plain text using AES-GCM
 */
export const encryptAES = async (
  plaintext: string,
  password: string,
  keyLength: number = 256
): Promise<EncryptionResult> => {
  try {
    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Derive key from password
    const key = await deriveKeyFromPassword(password, salt, keyLength);

    // Encrypt the plaintext
    const encodedPlaintext = new TextEncoder().encode(plaintext);
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encodedPlaintext
    );

    // Combine salt, IV, and ciphertext
    const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(ciphertext), salt.length + iv.length);

    // Convert to base64 for storage/transmission
    const encrypted = btoa(String.fromCharCode(...combined));

    return {
      encrypted,
      algorithm: `AES-${keyLength}-GCM`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`AES encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Decrypts AES-GCM encrypted text
 */
export const decryptAES = async (
  encryptedData: string,
  password: string,
  keyLength: number = 256
): Promise<DecryptionResult> => {
  try {
    // Decode from base64
    const combined = new Uint8Array(
      atob(encryptedData).split('').map(char => char.charCodeAt(0))
    );

    // Extract salt, IV, and ciphertext
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const ciphertext = combined.slice(28);

    // Derive key from password
    const key = await deriveKeyFromPassword(password, salt, keyLength);

    // Decrypt the ciphertext
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      ciphertext
    );

    // Convert back to string
    const decrypted = new TextDecoder().decode(decryptedBuffer);

    return {
      decrypted,
      success: true
    };
  } catch (error) {
    return {
      decrypted: '',
      success: false,
      error: 'Decryption failed. Please check your password and encrypted data.'
    };
  }
};

/**
 * Generates a random AES key for demonstration purposes
 */
export const generateRandomAESKey = (keyLength: number = 256): string => {
  const array = new Uint8Array(keyLength / 8);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};