import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Milk, Package, Truck, Users, DollarSign, BarChart3, Settings, HelpCircle, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Sidebar: React.FC = () => {
  const { logout } = useAuth()

  const mainMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Milk, label: 'Production', path: '/production' },
    { icon: Package, label: 'Stock & Inventory', path: '/inventory' },
    { icon: Truck, label: 'Orders & Deliveries', path: '/orders' },
    { icon: Users, label: 'Clients & Relations', path: '/clients' },
    { icon: DollarSign, label: 'Invoicing & Finance', path: '/invoicing' },
    { icon: BarChart3, label: 'Reports & Analytics', path: '/reports' },
  ]

  const secondaryMenuItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Support', path: '#' },
  ]

  return (
    <div className="w-64 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 shadow-xl border-r border-neutral-200 dark:border-neutral-800 flex flex-col">
      {/* Logo with Gradient */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-glow transition-transform duration-300 group-hover:scale-110">
            <Milk className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">DairyPro</h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Management System</p>
          </div>
        </div>
      </div>

      {/* Main Navigation with Modern Styling */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {mainMenuItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 scale-105'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:scale-102'
              }`
            }
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {({ isActive }) => (
              <>
                <div className={`transition-all duration-300 ${isActive ? 'text-white' : 'text-neutral-500 dark:text-neutral-400 group-hover:text-primary-500'}`}>
                  <item.icon size={20} />
                </div>
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-soft"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Secondary Navigation with Enhanced Design */}
      <div className="px-3 py-4 border-t border-neutral-200 dark:border-neutral-800 space-y-1 bg-neutral-50/50 dark:bg-neutral-900/50">
        {secondaryMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 group"
          >
            <div className="text-neutral-500 dark:text-neutral-400 group-hover:text-secondary-500 transition-colors">
              <item.icon size={20} />
            </div>
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 group"
        >
          <div className="text-neutral-500 dark:text-neutral-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            <LogOut size={20} />
          </div>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
