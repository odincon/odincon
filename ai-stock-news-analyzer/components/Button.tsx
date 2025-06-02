
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
  const baseStyle = "font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-all duration-150 ease-in-out";
  
  const primaryStyle = "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 disabled:bg-primary-400 disabled:cursor-not-allowed";
  const secondaryStyle = "bg-gray-600 hover:bg-gray-700 text-gray-100 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed";

  const styles = variant === 'primary' ? primaryStyle : secondaryStyle;

  return (
    <button
      className={`${baseStyle} ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
