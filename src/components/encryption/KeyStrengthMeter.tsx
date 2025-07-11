import React from 'react';
import { Shield, ShieldCheck, ShieldX } from 'lucide-react';
import { validateKeyStrength } from '../../utils/validation';

interface KeyStrengthMeterProps {
  password: string;
  showMeter?: boolean;
}

const KeyStrengthMeter: React.FC<KeyStrengthMeterProps> = ({ 
  password, 
  showMeter = true 
}) => {
  const strength = validateKeyStrength(password);
  
  // Calculate strength percentage
  const strengthPercentage = Math.min((strength.score / 6) * 100, 100);
  
  // Get appropriate icon
  const getIcon = () => {
    if (strength.score <= 2) return ShieldX;
    if (strength.score <= 4) return Shield;
    return ShieldCheck;
  };

  const Icon = getIcon();

  if (!showMeter && !password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      {showMeter && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              strength.score <= 2 ? 'bg-red-500' :
              strength.score <= 4 ? 'bg-yellow-500' :
              strength.score <= 6 ? 'bg-green-500' : 'bg-green-600'
            }`}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
      )}

      {/* Strength Indicator */}
      <div className="flex items-center space-x-2">
        <Icon className={`h-4 w-4 ${
          strength.score <= 2 ? 'text-red-500' :
          strength.score <= 4 ? 'text-yellow-500' :
          'text-green-500'
        }`} />
        <div className="flex-1">
          <span className={`text-sm font-medium ${strength.color}`}>
            {strength.score <= 2 ? 'Weak' :
             strength.score <= 4 ? 'Medium' :
             strength.score <= 6 ? 'Strong' : 'Very Strong'}
          </span>
          <p className="text-xs text-gray-600 mt-1">{strength.feedback}</p>
        </div>
      </div>

      {/* Security Tips */}
      {password && strength.score <= 4 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
          <h4 className="text-sm font-medium text-yellow-800 mb-1">
            Password Security Tips:
          </h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Use at least 12 characters</li>
            <li>• Include uppercase and lowercase letters</li>
            <li>• Add numbers and special characters</li>
            <li>• Avoid common words or patterns</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default KeyStrengthMeter;