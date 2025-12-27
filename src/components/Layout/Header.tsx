import React, { useState } from 'react'
import { Search, Bell, Sun, Moon, Palette } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { format } from 'date-fns'

const Header: React.FC = () => {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [showThemeMenu, setShowThemeMenu] = useState(false)

  const themeIcon = theme === 'dark' ? <Moon size={20} /> : theme === 'fresh' ? <Palette size={20} /> : <Sun size={20} />

  return (
    <header className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-soft border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Search with Modern Styling */}
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search orders, clients, products..."
              className="w-full pl-12 pr-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-900 
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-neutral-800
                transition-all duration-300 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          {/* Date & Time with Icon */}
          <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 animate-pulse-soft"></div>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {format(new Date(), 'PPP')}
            </span>
          </div>

          {/* Theme Switcher with Modern Design */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-3 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Toggle theme"
            >
              {themeIcon}
            </button>
            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 py-2 z-50 animate-scale-in">
                <button
                  onClick={() => { setTheme('light'); setShowThemeMenu(false); }}
                  className="w-full px-4 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center space-x-3 transition-colors group"
                >
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Sun size={16} className="text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span className="text-sm font-medium">Light Mode</span>
                </button>
                <button
                  onClick={() => { setTheme('dark'); setShowThemeMenu(false); }}
                  className="w-full px-4 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center space-x-3 transition-colors group"
                >
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Moon size={16} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-sm font-medium">Dark Mode</span>
                </button>
                <button
                  onClick={() => { setTheme('fresh'); setShowThemeMenu(false); }}
                  className="w-full px-4 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center space-x-3 transition-colors group"
                >
                  <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Palette size={16} className="text-teal-600 dark:text-teal-400" />
                  </div>
                  <span className="text-sm font-medium">Fresh Mode</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications with Badge */}
          <button className="relative p-3 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 group">
            <Bell size={20} className="group-hover:text-primary-500 transition-colors" />
            <span className="absolute top-2 right-2 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-accent-500 to-accent-600"></span>
            </span>
          </button>

          {/* User Profile with Gradient Border */}
          <div className="flex items-center space-x-3 pl-4 ml-2 border-l border-neutral-200 dark:border-neutral-700">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full opacity-75 group-hover:opacity-100 transition-opacity blur"></div>
              <img
                src={user?.avatar}
                alt={user?.name}
                className="relative w-11 h-11 rounded-full border-2 border-white dark:border-neutral-900 shadow-lg"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">{user?.name}</p>
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
