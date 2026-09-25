import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, APP_TAGLINE } from '../utils/constants';

export const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800/80 transition-colors py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                ⚡
              </div>
              <span className="font-display font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                LINK<span className="text-violet-600 dark:text-violet-400">FORGE</span>
              </span>
            </Link>
            <p className="text-xs text-slate-600 dark:text-zinc-500 max-w-sm leading-relaxed">
              {APP_TAGLINE} Next-generation URL management and click intelligence platform.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-3">
              PRODUCT
            </h4>
            <ul className="space-y-2 text-xs font-mono text-slate-600 dark:text-zinc-400">
              <li>
                <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Workspace
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-3">
              FEATURES
            </h4>
            <ul className="space-y-2 text-xs font-mono text-slate-600 dark:text-zinc-400">
              <li>Instant Shortening</li>
              <li>Custom Slugs</li>
              <li>Realtime Analytics</li>
              <li>Link Expiration</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 dark:text-zinc-600 gap-4">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Engineering Portfolio & Placement Project</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
