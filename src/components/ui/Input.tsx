import React from 'react';
import { cn } from '../../utils/helpers';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  iconRight,
  hint,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500',
            'focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
            'transition-all duration-200 py-2.5',
            icon ? 'pl-10' : 'pl-4',
            iconRight ? 'pr-10' : 'pr-4',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {iconRight}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      {hint && !error && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, hint, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        className={cn(
          'w-full bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 px-4 py-2.5',
          'focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
          'transition-all duration-200 resize-none',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      {hint && !error && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <select
        className={cn(
          'w-full bg-slate-800/50 border border-slate-700 rounded-xl text-white px-4 py-2.5',
          'focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
          'transition-all duration-200',
          error && 'border-red-500',
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-slate-800">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};
