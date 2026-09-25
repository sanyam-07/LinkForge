import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Register = ({ showToast }) => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await register({ name: name.trim(), email: email.trim(), password });
      if (res.success) {
        if (showToast) showToast('Account created successfully!', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Subtle Typography Watermark */}
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.04] dark:opacity-[0.03] font-display font-extrabold text-9xl tracking-tighter text-slate-900 dark:text-white">
        LINKFORGE
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
            Build your link workspace.
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Create an account to manage links and track click analytics
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-600 dark:text-zinc-400 mb-1 font-semibold">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 outline-none focus:border-violet-500 font-mono transition-colors"
              />
            </div>
          </div>

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
                placeholder="At least 6 characters"
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

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-600 dark:text-zinc-400 mb-1 font-semibold">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 dark:text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 outline-none focus:border-violet-500 font-mono transition-colors"
              />
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
                <span>CREATE ACCOUNT</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs font-mono text-slate-500 dark:text-zinc-500">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-600 dark:text-violet-400 font-bold hover:underline">
            Login here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
