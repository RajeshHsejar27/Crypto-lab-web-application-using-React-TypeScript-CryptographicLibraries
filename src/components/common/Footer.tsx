import React from 'react';
import { Github, BookOpen, AlertTriangle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">About CryptoLab</h3>
            <p className="text-sm text-gray-400 mb-4">
              An educational platform for learning cryptographic concepts through interactive demonstrations.
              Built with modern web tech stack and industry-standard encryption libraries.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Documentation"
              >
                <BookOpen className="h-5 w-5" />
              </a>
            </div>
          </div>



          {/* Security Notice */}
            <div className="md:col-start-3 md:col-end-4 md:text-right">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center md:justify-end">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
              Security Notice
            </h3>
            <p className="text-sm text-gray-400 mb-4 md:ml-auto md:inline-block md:text-right">
              This application is for educational purposes only. All cryptographic operations are performed 
              client-side in your browser. Do not use this for encrypting sensitive real-world data.
            </p>
            <p className="text-xs text-gray-500 md:ml-auto md:inline-block md:text-right">
              Always use production-grade cryptographic libraries and follow security best practices 
              in real applications.
            </p>
            </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} CryptoLab. Built with React, TypeScript, and WebCrypto API.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;