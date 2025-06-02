
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} AI Stock News Analyzer. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Powered by Gemini. Information is AI-generated and for educational purposes only. Not financial advice.
        </p>
      </div>
    </footer>
  );
};
