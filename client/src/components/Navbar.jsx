import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import {
  Sun,
  Moon,
  ArrowRight,
  LogOut,
  User,
  Menu,
  X,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sticky top-4 z-50 w-full max-w-6xl mx-auto px-4">
      <nav className="w-full bg-white/90 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl px-4 sm:px-6 py-3 shadow-lg shadow-slate-200/50 dark:shadow-black/40 transition-all">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 p-[1px] shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 dark:bg-zinc-950 rounded-[11px] flex items-center justify-center">
                <svg className="w-4 h-4 text-violet-400 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                LINK<span className="text-violet-600 dark:text-violet-400">FORGE</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold tracking-wide text-slate-600 dark:text-zinc-400">
            <Link
              to="/"
              className={`hover:text-slate-900 dark:hover:text-white transition-colors ${
                isActive('/') ? 'text-slate-900 dark:text-white font-bold' : ''
              }`}
            >
              Product
            </Link>
            <a
              href="/#how-it-works"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="/#features"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Features
            </a>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`hover:text-slate-900 dark:hover:text-white transition-colors ${
                  isActive('/dashboard') ? 'text-violet-600 dark:text-violet-400 font-bold' : ''
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 border-l border-slate-200 dark:border-zinc-800 pl-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/60 text-xs font-semibold text-slate-800 dark:text-zinc-200 hover:border-violet-500/50 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
                  <span className="max-w-[140px] truncate">{user?.name || 'Workspace'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 border-l border-slate-200 dark:border-zinc-800 pl-3">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-950 bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400 hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md shadow-lime-400/20"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-slate-200 dark:border-zinc-800/80 mt-3 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white font-medium"
            >
              Product
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-violet-600 dark:text-violet-400 font-semibold"
                >
                  Dashboard Workspace
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block text-sm text-rose-600 dark:text-rose-400 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-xs font-semibold text-slate-800 dark:text-zinc-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl bg-lime-400 text-zinc-950 text-xs font-bold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
