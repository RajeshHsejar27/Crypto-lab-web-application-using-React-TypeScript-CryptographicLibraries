/**
 * RSA encryption and decryption utilities using WebCrypto API
 */

import { EncryptionResult, DecryptionResult, DigitalSignatureResult } from '../../types/crypto';

/**
 * Generates an RSA key pair
 */
export const generateRSAKeyPair = async (keyLength: number = 2048): Promise<CryptoKeyPair> => {
  return await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: keyLength,
      publicExponent: new Uint8Array([1, 0, 1]), // 65537
      hash: 'SHA-256'
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
};

/**
 * Exports a public key to PEM format
 */
export const exportPublicKey = async (key: CryptoKey): Promise<string> => {
  const exported = await crypto.subtle.exportKey('spki', key);
  const exportedAsString = String.fromCharCode(...new Uint8Array(exported));
  const exportedAsBase64 = btoa(exportedAsString);
  return `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
};

/**
 * Exports a private key to PEM format
 */
export const exportPrivateKey = async (key: CryptoKey): Promise<string> => {
  const exported = await crypto.subtle.exportKey('pkcs8', key);
  const exportedAsString = String.fromCharCode(...new Uint8Array(exported));
  const exportedAsBase64 = btoa(exportedAsString);
  return `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
};

/**
 * Imports a public key from PEM format
 */
export const importPublicKey = async (pem: string): Promise<CryptoKey> => {
  const pemHeader = '-----BEGIN PUBLIC KEY-----';
  const pemFooter = '-----END PUBLIC KEY-----';
  const pemContents = pem.replace(pemHeader, '').replace(pemFooter, '').replace(/\s/g, '');
  const binaryString = atob(pemContents);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return await crypto.subtle.importKey(
    'spki',
    bytes,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    false,
    ['encrypt']
  );
};

/**
 * Imports a private key from PEM format
 */
export const importPrivateKey = async (pem: string): Promise<CryptoKey> => {
  const pemHeader = '-----BEGIN PRIVATE KEY-----';
  const pemFooter = '-----END PRIVATE KEY-----';
  const pemContents = pem.replace(pemHeader, '').replace(pemFooter, '').replace(/\s/g, '');
  const binaryString = atob(pemContents);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return await crypto.subtle.importKey(
    'pkcs8',
    bytes,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    false,
    ['decrypt']
  );
};

/**
 * Encrypts text using RSA public key
 */
export const encryptRSA = async (
  plaintext: string,
  publicKeyPem: string,
  keyLength: number = 2048
): Promise<EncryptionResult> => {
  try {
    // RSA can only encrypt limited data size (key size - padding)
    const maxBytes = Math.floor(keyLength / 8) - 42; // OAEP padding overhead
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    if (data.length > maxBytes) {
      throw new Error(`RSA can only encrypt up to ${maxBytes} bytes. Use hybrid encryption for larger data.`);
    }

    const publicKey = await importPublicKey(publicKeyPem);
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP'
      },
      publicKey,
      data
    );

    const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)));

    return {
      encrypted: encryptedBase64,
      algorithm: `RSA-${keyLength}`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`RSA encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Decrypts RSA encrypted text
 */
export const decryptRSA = async (
  encryptedData: string,
  privateKeyPem: string
): Promise<DecryptionResult> => {
  try {
    const privateKey = await importPrivateKey(privateKeyPem);
    const encryptedBytes = new Uint8Array(
      atob(encryptedData).split('').map(char => char.charCodeAt(0))
    );

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP'
      },
      privateKey,
      encryptedBytes
    );

    const decryptedText = new TextDecoder().decode(decrypted);

    return {
      decrypted: decryptedText,
      success: true
    };
  } catch (error) {
    return {
      decrypted: '',
      success: false,
      error: 'RSA decryption failed. Please check your private key and encrypted data.'
    };
  }
};

/**
 * Generates RSA key pair for digital signatures
 */
export const generateRSASigningKeyPair = async (keyLength: number = 2048): Promise<CryptoKeyPair> => {
  return await crypto.subtle.generateKey(
    {
      name: 'RSA-PSS',
      modulusLength: keyLength,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['sign', 'verify']
  );
};

/**
 * Signs a message using RSA private key
 */
export const signMessage = async (
  message: string,
  privateKey: CryptoKey
): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  const signature = await crypto.subtle.sign(
    {
      name: 'RSA-PSS',
      saltLength: 32
    },
    privateKey,
    data
  );

  return btoa(String.fromCharCode(...new Uint8Array(signature)));
};

/**
 * Verifies a digital signature
 */
export const verifySignature = async (
  message: string,
  signature: string,
  publicKey: CryptoKey
): Promise<boolean> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const signatureBytes = new Uint8Array(
      atob(signature).split('').map(char => char.charCodeAt(0))
    );

    return await crypto.subtle.verify(
      {
        name: 'RSA-PSS',
        saltLength: 32
      },
      publicKey,
      signatureBytes,
      data
    );
  } catch (error) {
    return false;
  }
};