import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onDismiss, 
  type = 'error' 
}) => {
  const baseClasses = "rounded-lg p-4 flex items-start space-x-3";
  const typeClasses = {
    error: "bg-red-50 border border-red-200 text-red-800",
    warning: "bg-yellow-50 border border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border border-blue-200 text-blue-800"
  };

  const iconClasses = {
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500"
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <AlertCircle className={`h-5 w-5 mt-0.5 ${iconClasses[type]}`} />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`${iconClasses[type]} hover:opacity-70 transition-opacity`}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;