import React, { useState } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './components/home/HomePage';
import EncryptionModule from './components/encryption/EncryptionModule';
import DecryptionModule from './components/encryption/DecryptionModule';
import HashingModule from './components/advanced/HashingModule';
import DigitalSignature from './components/advanced/DigitalSignature';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeEncryptionTab, setActiveEncryptionTab] = useState('encrypt');
  const [activeAdvancedTab, setActiveAdvancedTab] = useState('hashing');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={setActiveTab} />;
      
      case 'encryption':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Encryption Tab Navigation */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <nav className="flex space-x-1">
                  <button
                    onClick={() => setActiveEncryptionTab('encrypt')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeEncryptionTab === 'encrypt'
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>Encryption</span>
                  </button>
                  <button
                    onClick={() => setActiveEncryptionTab('decrypt')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeEncryptionTab === 'decrypt'
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>Decryption</span>
                  </button>
                </nav>
              </div>
              
              {/* Encryption Content */}
              {activeEncryptionTab === 'encrypt' && <EncryptionModule />}
              {activeEncryptionTab === 'decrypt' && <DecryptionModule />}
            </div>
          </div>
        );
      
      case 'advanced':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Advanced Tab Navigation */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <nav className="flex space-x-1">
                  <button
                    onClick={() => setActiveAdvancedTab('hashing')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeAdvancedTab === 'hashing'
                        ? 'bg-purple-100 text-purple-700 font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>Hash Functions</span>
                  </button>
                  <button
                    onClick={() => setActiveAdvancedTab('signatures')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeAdvancedTab === 'signatures'
                        ? 'bg-indigo-100 text-indigo-700 font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>Digital Signatures</span>
                  </button>
                </nav>
              </div>
              
              {/* Advanced Content */}
              {activeAdvancedTab === 'hashing' && <HashingModule />}
              {activeAdvancedTab === 'signatures' && <DigitalSignature />}
            </div>
          </div>
        );
      
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;