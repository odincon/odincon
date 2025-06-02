
import React from 'react';
import { BarChart2Icon } from './icons'; // Assuming you have a relevant icon

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart2Icon className="h-8 w-8 text-primary-500 mr-3" />
            <h1 className="text-2xl font-bold text-white">
              AI Stock News <span className="text-primary-400">Analyzer</span>
            </h1>
          </div>
          {/* Future placeholder for nav items or user profile */}
        </div>
      </div>
    </header>
  );
};
