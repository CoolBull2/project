import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';

interface NetworkStatusProps {
  status: string | null;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({ status }) => {
  const getStatusDisplay = () => {
    switch (status) {
      case 'checking':
        return {
          icon: <Loader2 className="h-12 w-12 animate-spin text-blue-500" />,
          text: 'Checking Network Status...',
          className: 'text-blue-500'
        };
      case 'healthy':
        return {
          icon: <CheckCircle className="h-12 w-12 text-green-500" />,
          text: 'Network is Healthy',
          className: 'text-green-500'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-12 w-12 text-yellow-500" />,
          text: 'Network Issues Detected',
          className: 'text-yellow-500'
        };
      case 'critical':
        return {
          icon: <XCircle className="h-12 w-12 text-red-500" />,
          text: 'Critical Network Problems',
          className: 'text-red-500'
        };
      default:
        return {
          icon: null,
          text: 'Run diagnostics to check network status',
          className: 'text-gray-500'
        };
    }
  };

  const { icon, text, className } = getStatusDisplay();

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg">
      {icon}
      <h2 className={`text-xl font-semibold ${className}`}>{text}</h2>
    </div>
  );
};