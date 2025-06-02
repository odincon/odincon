
import React from 'react';
import { AlertTriangleIcon } from './icons';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-800 border border-red-700 text-red-100 px-4 py-3 rounded-lg shadow-lg relative" role="alert">
      <div className="flex items-center">
        <AlertTriangleIcon className="w-6 h-6 text-red-300 mr-3"/>
        <div>
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{message}</span>
        </div>
      </div>
    </div>
  );
};
