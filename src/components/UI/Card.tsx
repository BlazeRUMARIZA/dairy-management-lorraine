import React, { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
  gradient?: boolean
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false, 
  glass = false,
  gradient = false,
  onClick 
}) => {
  const baseClass = glass ? 'card-glass' : gradient ? 'card-gradient' : 'card'
  const hoverClass = hover ? 'card-hover cursor-pointer' : ''
  
  return (
    <div 
      className={`${baseClass} ${hoverClass} ${className} p-6`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  trend?: number
  icon?: ReactNode
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-glow',
    secondary: 'bg-gradient-to-br from-secondary-500 to-secondary-600 text-white shadow-glow-secondary',
    success: 'bg-gradient-to-br from-success to-success-dark text-white',
    danger: 'bg-gradient-to-br from-danger to-danger-dark text-white',
    warning: 'bg-gradient-to-br from-warning to-warning-dark text-white',
  }

  return (
    <Card hover className="group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">{title}</p>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {value}
          </p>
          {trend !== undefined && (
            <div className="mt-3 flex items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                trend >= 0 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                <span className="text-sm mr-1">{trend >= 0 ? '↑' : '↓'}</span>
                {Math.abs(trend)}%
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">vs yesterday</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-4 rounded-2xl ${colorClasses[color]} transform group-hover:scale-110 transition-all duration-300 shadow-lg`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
