import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 24, className }) => {
  return <Loader2 className={`animate-spin text-primary-600 ${className}`} size={size} />;
};

export const FullScreenLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Spinner size={48} />
  </div>
);
