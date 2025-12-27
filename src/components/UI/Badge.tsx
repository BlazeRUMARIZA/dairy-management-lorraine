import React, { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
  size?: 'sm' | 'md' | 'lg'
  pulse?: boolean
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'md', pulse = false }) => {
  const variantClasses = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'bg-info-light/10 text-info dark:bg-info-dark/30 dark:text-info-light',
    default: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200',
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  return (
    <span className={`badge ${variantClasses[variant]} ${sizeClasses[size]} ${pulse ? 'animate-pulse-soft' : ''}`}>
      {children}
    </span>
  )
}
