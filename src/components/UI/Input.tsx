import React, { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
        </label>
      )}
      <input
        className={`input ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-danger flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-danger animate-pulse-soft"></span>
          {error}
        </p>
      )}
    </div>
  )
}

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className = '', ...props }) => {
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
        </label>
      )}
      <select
        className={`input ${error ? 'input-error' : ''} ${className} cursor-pointer`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && (
        <p className="mt-2 text-sm text-danger flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-danger animate-pulse-soft"></span>
          {error}
        </p>
      )}
    </div>
  )
}
