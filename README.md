# CryptoLab - Interactive Cryptographic Learning Platform

A comprehensive, secure, and interactive web application for learning and experimenting with cryptographic concepts. Built with React, TypeScript, and modern cryptographic libraries.

## 🔒 Features

### Core Cryptographic Operations
- **Symmetric Encryption**: AES-128, AES-192, AES-256 with GCM mode
- **Asymmetric Encryption**: RSA-2048, RSA-4096 with OAEP padding
- **Hash Functions**: SHA-256, SHA-512, SHA-1, MD5, PBKDF2
- **Digital Signatures**: RSA-PSS signatures with verification

### Interactive Learning Tools
- **Real-time Encryption/Decryption**: Instant feedback and results
- **Algorithm Comparison**: Side-by-side comparisons of different methods
- **Key Strength Validation**: Password strength meter with security tips
- **Import/Export Functionality**: Save and load encrypted data
- **Educational Content**: Comprehensive explanations of cryptographic concepts

### Security Features
- **Client-side Processing**: All operations performed in browser
- **Secure Key Generation**: Cryptographically secure random number generation
- **Timing Attack Protection**: Constant-time comparisons
- **Input Validation**: Comprehensive sanitization and validation
- **No Key Storage**: Keys never logged or stored

## 🛠 Technology Stack

### Frontend
- **React 18** with **TypeScript** for type safety
- **Tailwind CSS** for responsive, modern styling
- **Lucide React** for consistent iconography
- **Vite** for fast development and building

### Cryptographic Libraries
- **WebCrypto API** for browser-native cryptography
- **crypto-js** for additional algorithms and utilities
- **Modern Standards**: AES-GCM, RSA-OAEP, RSA-PSS, PBKDF2

### Security Standards
- **OWASP Compliance**: Following security best practices
- **CSP Ready**: Content Security Policy compatible
- **No External Dependencies**: Self-contained cryptographic operations

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with WebCrypto API support

### Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/cryptolab.git
cd cryptolab

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📚 Cryptographic Concepts

### Symmetric Encryption
Uses the same key for encryption and decryption. Fast and efficient for large data.

**Algorithms Supported:**
- AES-128-GCM: 128-bit key, suitable for most applications
- AES-192-GCM: 192-bit key, enhanced security
- AES-256-GCM: 256-bit key, maximum security

**Use Cases:**
- File encryption
- Database protection
- Secure messaging
- Bulk data encryption

### Asymmetric Encryption
Uses public-private key pairs. Solves key distribution problem.

**Algorithms Supported:**
- RSA-2048: Standard security for most applications
- RSA-4096: High security for sensitive data

**Use Cases:**
- Digital certificates
- Secure key exchange
- Email encryption
- Document signing

### Hash Functions
One-way functions for data integrity and authentication.

**Algorithms Supported:**
- SHA-256: Recommended for most applications
- SHA-512: Enhanced security for critical applications
- SHA-1: Legacy support (deprecated)
- MD5: Educational purposes only (deprecated)
- PBKDF2: Password-based key derivation

**Use Cases:**
- Password storage
- Data integrity verification
- Digital signatures
- Blockchain applications

## 🏗 Architecture

### Project Structure
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── encryption/      # Encryption/decryption modules
│   ├── advanced/        # Advanced cryptographic tools
│   └── home/           # Landing page and explanations
├── utils/
│   ├── cryptography/    # Cryptographic implementations
│   ├── validation.ts    # Input validation utilities
│   └── constants.ts     # Application constants
├── types/
│   └── crypto.ts       # TypeScript type definitions
└── App.tsx             # Main application component
```

### Key Components

#### Encryption Module (`src/components/encryption/`)
- **EncryptionModule**: Main encryption interface
- **DecryptionModule**: Decryption interface with validation
- **AlgorithmSelector**: Algorithm selection and information
- **KeyStrengthMeter**: Password strength validation

#### Advanced Tools (`src/components/advanced/`)
- **HashingModule**: Hash function demonstrations
- **DigitalSignature**: RSA signature generation and verification

#### Cryptographic Utilities (`src/utils/cryptography/`)
- **aes.ts**: AES encryption implementations
- **rsa.ts**: RSA encryption and signature utilities
- **hashing.ts**: Hash function implementations
- **utils.ts**: Common cryptographic utilities

## 🔐 Security Considerations

### Implementation Security
- **Memory Safety**: Proper cleanup of sensitive data
- **Timing Attack Protection**: Constant-time comparisons
- **Input Validation**: Comprehensive sanitization
- **Error Handling**: Secure error messages without information leakage

### Key Management
- **Secure Generation**: Cryptographically secure random keys
- **No Storage**: Keys never persisted or logged
- **Proper Disposal**: Immediate cleanup after use
- **Key Rotation**: Encourages regular key changes

### Algorithm Selection
- **Modern Standards**: Only current, secure algorithms
- **Proper Modes**: GCM for AES, OAEP for RSA
- **Appropriate Key Sizes**: Following current recommendations
- **Deprecation Warnings**: Clear warnings for weak algorithms

## 📖 Usage Examples

### Basic Encryption
```typescript
// AES-256 encryption
const result = await encryptAES(plaintext, password, 256);
console.log(result.encrypted); // Base64 encoded ciphertext

// RSA encryption (requires key pair)
const keyPair = await generateRSAKeyPair(2048);
const publicKey = await exportPublicKey(keyPair.publicKey);
const result = await encryptRSA(plaintext, publicKey, 2048);
```

### Hash Generation
```typescript
// SHA-256 hash
const hash = await computeHash(input, 'SHA-256');
console.log(hash.hash); // Hexadecimal hash

// PBKDF2 for password hashing
const salt = generateSalt(16);
const hash = computePBKDF2(password, salt, 100000);
```

### Digital Signatures
```typescript
// Generate signing key pair
const keyPair = await generateRSASigningKeyPair(2048);

// Sign message
const signature = await signMessage(message, keyPair.privateKey);

// Verify signature
const isValid = await verifySignature(message, signature, keyPair.publicKey);
```

## 🎯 Educational Goals

### Learning Objectives
1. **Understand** the difference between symmetric and asymmetric encryption
2. **Explore** the role of hash functions in cybersecurity
3. **Experiment** with different key sizes and their security implications
4. **Practice** secure key management principles
5. **Recognize** common cryptographic vulnerabilities

### Interactive Features
- **Real-time Feedback**: Immediate results and error messages
- **Visual Explanations**: Clear diagrams and step-by-step processes
- **Hands-on Practice**: Interactive encryption/decryption exercises
- **Security Warnings**: Alerts for weak keys or deprecated algorithms

## ⚠️ Important Disclaimers

### Educational Use Only
This application is designed for educational purposes. While it uses industry-standard cryptographic libraries, it should not be used for protecting real sensitive data in production environments.

### Browser Limitations
- Requires modern browser with WebCrypto API support
- Limited to JavaScript-accessible cryptographic operations
- Performance may vary based on browser and device capabilities

### Security Recommendations
- Always use established cryptographic libraries in production
- Follow current security best practices and guidelines
- Regular security audits and updates
- Proper key management and infrastructure

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript best practices
2. Maintain comprehensive documentation
3. Include security considerations in all PRs
4. Add tests for new cryptographic functions
5. Follow the existing code style and patterns

### Security Contributions
Security-related contributions are especially welcome:
- Security audits and reviews
- Additional algorithm implementations
- Performance optimizations
- Educational content improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Resources

### Cryptographic Standards
- [NIST Cryptographic Standards](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines)
- [OWASP Cryptographic Storage Cheat Sheet](https://owasp.org/www-project-cheat-sheets/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [RFC 3447 - PKCS #1: RSA Cryptography Specifications](https://tools.ietf.org/html/rfc3447)

### Learning Resources
- [Cryptography Engineering](https://www.schneier.com/books/cryptography_engineering/)
- [Applied Cryptography](https://www.schneier.com/books/applied_cryptography/)
- [Coursera Cryptography Courses](https://www.coursera.org/learn/crypto)

### Technical Documentation
- [Web Crypto API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Node.js Crypto Module](https://nodejs.org/api/crypto.html)
- [CryptoJS Documentation](https://cryptojs.gitbook.io/docs/)

---

**Built with ❤️ and 🔒 by the CryptoLab Team**