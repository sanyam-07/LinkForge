import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Login = ({ showToast }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide email and password');
      return;
    }

    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res.success) {
        if (showToast) showToast('Welcome back to your workspace!', 'success');
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Subtle Typography Watermark */}
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.04] dark:opacity-[0.03] font-display font-extrabold text-9xl tracking-tighter text-slate-900 dark:text-white">
        SHORT • SHARE • TRACK
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl dark:shadow-2xl backdrop-blur-xl relative z-10 transition-colors"
      >
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              ⚡
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              LINK<span className="text-violet-600 dark:text-violet-400">FORGE</span>
            </span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Welcome back.
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Continue to your link workspace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-600 dark:text-zinc-400 mb-1 font-semibold">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 dark:text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 outline-none focus:border-violet-500 font-mono transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-600 dark:text-zinc-400 mb-1 font-semibold">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 dark:text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 outline-none focus:border-violet-500 font-mono transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400 hover:opacity-95 text-zinc-950 font-bold text-sm shadow-lg shadow-lime-400/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>SIGN IN</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs font-mono text-slate-500 dark:text-zinc-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-violet-600 dark:text-violet-400 font-bold hover:underline">
            Register here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
