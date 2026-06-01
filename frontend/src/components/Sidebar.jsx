import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiXMark
} from 'react-icons/hi2';
import { RiFireLine } from 'react-icons/ri';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { path: '/candidates', label: 'Candidates', icon: HiOutlineUserGroup },
  { path: '/templates', label: 'Templates', icon: HiOutlineDocumentText },
  { path: '/generate', label: 'Generate Offer', icon: HiOutlineSparkles },
  { path: '/history', label: 'Offer History', icon: HiOutlineClock },
  { path: '/verify', label: 'Verify Offer', icon: HiOutlineShieldCheck },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Sidebar panel */}
      <motion.aside
        initial={false}
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 
          bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800
          flex flex-col transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-surface-200 dark:border-surface-800">
          <NavLink to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-brand">
              <RiFireLine className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-surface-900 dark:text-white leading-none">
                OfferForge
              </h1>
              <span className="text-[10px] font-medium text-brand-500 uppercase tracking-widest">
                AI Platform
              </span>
            </div>
          </NavLink>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <HiXMark className="w-5 h-5 text-surface-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-4 mb-3 text-[10px] font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-widest">
            Main Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                isActive ? 'sidebar-link-active' : 'sidebar-link'
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
              {item.path === '/generate' && (
                <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-brand-500 to-violet-500 text-white">
                  AI
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-surface-200 dark:border-surface-800">
          <div className="glass-card p-4 bg-gradient-to-br from-brand-50 to-violet-50 dark:from-brand-950/50 dark:to-violet-950/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center">
                <HiOutlineSparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-surface-800 dark:text-surface-200">AI Powered</p>
                <p className="text-[10px] text-surface-500 dark:text-surface-400">Groq LLaMA 3.3</p>
              </div>
            </div>
            <p className="text-[11px] text-surface-500 dark:text-surface-400 leading-relaxed">
              Generate professional offer letters with AI-powered content.
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
