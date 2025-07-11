/**
 * Validation utilities for cryptographic operations
 */

import { KeyStrength } from '../types/crypto';
import { KEY_STRENGTH_RULES } from './constants';

/**
 * Validates and scores password strength
 */
export const validateKeyStrength = (password: string): KeyStrength => {
  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length < KEY_STRENGTH_RULES.minLength) {
    feedback.push(`Minimum ${KEY_STRENGTH_RULES.minLength} characters required`);
  } else if (password.length >= KEY_STRENGTH_RULES.veryStrongLength) {
    score += 2;
  } else if (password.length >= KEY_STRENGTH_RULES.strongLength) {
    score += 1;
  }

  // Character variety checks
  const patterns = KEY_STRENGTH_RULES.patterns;
  
  if (patterns.lowercase.test(password)) {
    score += 1;
  } else {
    feedback.push('Add lowercase letters');
  }

  if (patterns.uppercase.test(password)) {
    score += 1;
  } else {
    feedback.push('Add uppercase letters');
  }

  if (patterns.numbers.test(password)) {
    score += 1;
  } else {
    feedback.push('Add numbers');
  }

  if (patterns.symbols.test(password)) {
    score += 1;
  } else {
    feedback.push('Add special characters');
  }

  // Determine strength level
  let strengthText = '';
  let color = '';

  if (score <= 2) {
    strengthText = 'Weak';
    color = 'text-red-500';
  } else if (score <= 4) {
    strengthText = 'Medium';
    color = 'text-yellow-500';
  } else if (score <= 6) {
    strengthText = 'Strong';
    color = 'text-green-500';
  } else {
    strengthText = 'Very Strong';
    color = 'text-green-600';
  }

  return {
    score,
    feedback: feedback.length > 0 ? feedback.join(', ') : 'Good password strength',
    color: `${color} font-semibold`
  };
};

/**
 * Validates input for encryption/decryption
 */
export const validateInput = (input: string, type: 'plaintext' | 'encrypted'): string | null => {
  if (!input.trim()) {
    return `${type === 'plaintext' ? 'Plain text' : 'Encrypted text'} is required`;
  }

  if (type === 'plaintext' && input.length > 10000) {
    return 'Plain text is too long (max 10,000 characters)';
  }

  if (type === 'encrypted' && input.length > 50000) {
    return 'Encrypted text is too long (max 50,000 characters)';
  }

  return null;
};

/**
 * Sanitizes input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '').trim();
};