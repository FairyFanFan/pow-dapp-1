import { forwardRef } from 'react';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'email' | 'password';
  disabled?: boolean;
  error?: string;
  className?: string;
  rightElement?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  disabled = false,
  error,
  className = '',
  rightElement
}, ref) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-slate-300 text-sm font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none transition-colors ${
            error ? 'border-red-500' : 'border-slate-600'
          } ${rightElement ? 'pr-12' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
