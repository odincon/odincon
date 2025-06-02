
import React from 'react';

interface BaseFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type?: string;
  value: string; // Override value to be string for InputField
}

export const InputField: React.FC<InputFieldProps> = ({ label, name, type = "text", value, onChange, placeholder, required, helpText }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}{required && <span className="text-red-400">*</span>}</label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-colors"
    />
    {helpText && <p className="mt-1 text-xs text-gray-400">{helpText}</p>}
  </div>
);

interface TextAreaFieldProps extends BaseFieldProps {
  rows?: number;
  value: string; // Override value to be string for TextAreaField
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, name, value, onChange, placeholder, required, rows = 3, helpText }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}{required && <span className="text-red-400">*</span>}</label>
    <textarea
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-colors"
    />
    {helpText && <p className="mt-1 text-xs text-gray-400">{helpText}</p>}
  </div>
);

interface NumberFieldProps extends BaseFieldProps {
  min?: number;
  max?: number;
  step?: number;
  value: number; // Override value to be number for NumberField
}

export const NumberField: React.FC<NumberFieldProps> = ({ label, name, value, onChange, placeholder, required, min, max, step, helpText }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}{required && <span className="text-red-400">*</span>}</label>
    <input
      type="number"
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      min={min}
      max={max}
      step={step}
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-colors"
    />
    {helpText && <p className="mt-1 text-xs text-gray-400">{helpText}</p>}
  </div>
);
