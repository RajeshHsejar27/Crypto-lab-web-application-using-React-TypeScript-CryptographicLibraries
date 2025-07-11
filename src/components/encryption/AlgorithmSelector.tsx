import React from 'react';
import { Lock, Key, Shield, Info } from 'lucide-react';
import { CryptoAlgorithm } from '../../types/crypto';
import { CRYPTO_ALGORITHMS } from '../../utils/constants';

interface AlgorithmSelectorProps {
  selectedAlgorithm: string;
  onAlgorithmChange: (algorithm: string) => void;
}

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedAlgorithm,
  onAlgorithmChange
}) => {
  const selectedAlgo = CRYPTO_ALGORITHMS.find(algo => algo.id === selectedAlgorithm);

  const getIcon = (type: string) => {
    return type === 'symmetric' ? Lock : Key;
  };

  const getTypeColor = (type: string) => {
    return type === 'symmetric' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CRYPTO_ALGORITHMS.map((algorithm) => {
          const Icon = getIcon(algorithm.type);
          const isSelected = selectedAlgorithm === algorithm.id;
          
          return (
            <button
              key={algorithm.id}
              onClick={() => onAlgorithmChange(algorithm.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{algorithm.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      getTypeColor(algorithm.type)
                    }`}>
                      {algorithm.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{algorithm.description}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {algorithm.keyLength.join('/')} bits
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Algorithm Information */}
      {selectedAlgo && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Info className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">About {selectedAlgo.name}</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Description</h4>
              <p className="text-sm text-gray-600">{selectedAlgo.description}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Common Use Cases</h4>
              <ul className="text-sm text-gray-600 mt-1">
                {selectedAlgo.useCases.map((useCase, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700">Security Level</h4>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Shield
                      key={i}
                      className={`h-4 w-4 ${
                        i < (selectedAlgo.keyLength[0] >= 256 ? 5 : 
                             selectedAlgo.keyLength[0] >= 192 ? 4 : 
                             selectedAlgo.keyLength[0] >= 128 ? 3 : 2)
                          ? 'text-green-500' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {selectedAlgo.keyLength[0] >= 256 ? 'Military Grade' :
                   selectedAlgo.keyLength[0] >= 192 ? 'High Security' :
                   selectedAlgo.keyLength[0] >= 128 ? 'Good Security' : 'Basic Security'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmSelector;