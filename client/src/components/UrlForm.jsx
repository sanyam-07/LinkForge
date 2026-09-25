import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Copy,
  Check,
  Calendar,
  SlidersHorizontal,
  ExternalLink,
  Sparkles,
  Zap,
  QrCode,
  Share2,
  Tag,
} from 'lucide-react';
import urlService from '../services/urlService';
import aiService from '../services/aiService';
import { useAuth } from '../hooks/useAuth';
import { EXPIRATION_OPTIONS } from '../utils/constants';
import QrCodeModal from './QrCodeModal';

export const UrlForm = ({ onUrlCreated, showToast }) => {
  const { isAuthenticated } = useAuth();
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expirationOption, setExpirationOption] = useState('never');
  const [customDate, setCustomDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // AI Assistant States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const [loading, setLoading] = useState(false);
  const [isForging, setIsForging] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [qrModalUrl, setQrModalUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!originalUrl.trim()) {
      setError('Please enter a destination URL to forge');
      return;
    }

    setLoading(true);
    setIsForging(true);

    try {
      let finalExpiration = expirationOption;
      if (expirationOption === 'custom') {
        if (!customDate) {
          setError('Please select a custom expiration date');
          setLoading(false);
          setIsForging(false);
          return;
        }
        finalExpiration = customDate;
      }

      await new Promise((r) => setTimeout(r, 600));

      const res = await urlService.createUrl({
        originalUrl: originalUrl.trim(),
        customAlias: customAlias.trim() || undefined,
        expiration: finalExpiration,
      });

      if (res.success && res.data) {
        setResult(res.data);
        if (showToast) {
          showToast('Link forged successfully!', 'success');
        }
        if (onUrlCreated) {
          onUrlCreated(res.data);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to shorten URL. Please check your URL input.';
      setError(msg);
      if (showToast) {
        showToast(msg, 'error');
      }
    } finally {
      setLoading(false);
      setIsForging(false);
    }
  };

  const handleAiAnalyze = async () => {
    if (!originalUrl.trim()) {
      setError('Please enter a destination URL first before requesting AI analysis');
      return;
    }
    setError('');
    setAiLoading(true);
    try {
      const res = await aiService.analyzeUrl(originalUrl.trim());
      if (res.success && res.data) {
        setAiSuggestions(res.data);
        setShowAdvanced(true);
        if (showToast) showToast('AI suggestions generated!', 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'AI Assistant features are currently unavailable';
      setError(msg);
      if (showToast) showToast(msg, 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const applyAiSuggestions = () => {
    if (aiSuggestions) {
      if (aiSuggestions.suggestedAlias) {
        setCustomAlias(aiSuggestions.suggestedAlias);
      }
      if (showToast) showToast('AI parameters applied to form!', 'success');
    }
  };

  const handleCopy = () => {
    if (result?.shortUrl) {
      navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      if (showToast) {
        showToast('Short link copied to clipboard!', 'copy');
      }
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (!result?.shortUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LinkForge Short Link',
          url: result.shortUrl,
        });
      } catch (err) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative rounded-3xl bg-white dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800 p-6 sm:p-8 shadow-xl shadow-slate-200/60 dark:shadow-violet-950/20 backdrop-blur-xl overflow-hidden transition-colors">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-violet-500/10 dark:bg-violet-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/your-very-long-url-path"
                disabled={loading}
                className="w-full pl-5 pr-36 py-4.5 rounded-2xl bg-slate-100/80 dark:bg-zinc-950/90 border border-slate-300 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono text-xs sm:text-sm transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400 hover:opacity-95 text-zinc-950 font-bold text-xs sm:text-sm shadow-md shadow-lime-400/20 disabled:opacity-50 flex items-center gap-2 transition-all group"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>FORGE</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Advanced Options Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-slate-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 font-medium flex items-center gap-1.5 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showAdvanced ? 'Hide options' : 'Custom alias & Expiration'}</span>
              </button>

              {/* AI Assistant Trigger Button */}
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={handleAiAnalyze}
                  disabled={aiLoading}
                  className="px-2.5 py-1 rounded-lg bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 font-mono font-bold text-[11px] hover:bg-violet-100 dark:hover:bg-violet-900/60 flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  <Sparkles className={`w-3 h-3 ${aiLoading ? 'animate-spin' : ''}`} />
                  <span>{aiLoading ? 'Analyzing...' : 'AI Assistant'}</span>
                </button>
              )}
            </div>

            <span className="text-slate-400 dark:text-zinc-500 font-mono text-[11px]">
              {isAuthenticated ? 'Workspace Active' : 'Instant Guest Forge'}
            </span>
          </div>

          {/* AI Suggestions Box */}
          <AnimatePresence>
            {aiSuggestions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-cyan-50 dark:from-violet-950/60 dark:to-zinc-950 border border-violet-200 dark:border-violet-800/80 space-y-3 font-mono text-xs"
              >
                <div className="flex items-center justify-between text-violet-600 dark:text-violet-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-lime-500 dark:text-lime-400" />
                    AI LINK ASSISTANT SUGGESTIONS
                  </span>
                  {aiSuggestions.category && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300">
                      {aiSuggestions.category}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 dark:text-zinc-400">
                  {aiSuggestions.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500">Suggested Alias:</span>
                    <span className="font-bold text-violet-600 dark:text-lime-400">{aiSuggestions.suggestedAlias}</span>
                  </div>

                  <button
                    type="button"
                    onClick={applyAiSuggestions}
                    className="px-3 py-1 rounded-lg bg-violet-600 text-white font-bold text-[11px] hover:bg-violet-500 transition-colors shadow-sm"
                  >
                    USE SUGGESTIONS
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Advanced Options Drawer */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4 border-t border-slate-200 dark:border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {/* Custom Alias */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 mb-1.5">
                    Custom Alias
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs text-slate-400 dark:text-zinc-500 font-mono pointer-events-none select-none z-10">
                      linkforge/
                    </span>
                    <input
                      type="text"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                      placeholder="myproduct"
                      disabled={loading}
                      className="w-full pl-[92px] pr-3 py-2 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 text-xs text-slate-900 dark:text-zinc-200 font-mono outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Expiration Select */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 mb-1.5">
                    Link Expiration
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={expirationOption}
                      onChange={(e) => setExpirationOption(e.target.value)}
                      disabled={loading}
                      className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 text-xs text-slate-900 dark:text-zinc-200 outline-none focus:border-violet-500"
                    >
                      {EXPIRATION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    {expirationOption === 'custom' && (
                      <input
                        type="date"
                        value={customDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setCustomDate(e.target.value)}
                        className="px-2 py-2 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 text-xs text-slate-900 dark:text-zinc-200 outline-none"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Notice */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {error}
            </div>
          )}
        </form>

        {/* Live Transformation Animation State */}
        <AnimatePresence>
          {isForging && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-6 p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-violet-500/40 text-center space-y-3"
            >
              <div className="text-xs font-mono uppercase tracking-widest text-violet-600 dark:text-violet-400 animate-pulse flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-lime-500 dark:text-lime-400 animate-bounce" />
                FORGING LINK...
              </div>

              <div className="flex items-center justify-center gap-4 text-xs font-mono">
                <span className="text-slate-500 dark:text-zinc-500 truncate max-w-[150px] sm:max-w-[220px]">
                  {originalUrl}
                </span>
                <span className="text-lime-600 dark:text-lime-400 font-bold">──────→</span>
                <span className="text-slate-900 dark:text-white font-bold animate-pulse">linkforge/...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Showcase Card */}
        <AnimatePresence>
          {result && !isForging && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-zinc-950 dark:to-zinc-900 border border-violet-500/40 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-lime-600 dark:text-lime-400 flex items-center gap-1 font-bold">
                  <Sparkles className="w-3 h-3" />
                  Your link is ready
                </span>
                {result.expiresAt && (
                  <span className="text-[11px] text-slate-500 dark:text-zinc-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Expires {new Date(result.expiresAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Transformation Visual Representation */}
              <div className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono text-slate-600 dark:text-zinc-400 flex items-center justify-between gap-2">
                <span className="truncate max-w-[200px] text-slate-500 dark:text-zinc-500">{result.originalUrl}</span>
                <span className="text-violet-600 dark:text-violet-400 font-bold shrink-0">─── FORGED ───→</span>
                <span className="text-slate-900 dark:text-white font-bold shrink-0">{result.shortCode}</span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-950 p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800">
                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-sm sm:text-base font-bold text-violet-600 dark:text-violet-400 hover:underline truncate flex items-center gap-1.5"
                >
                  <span>{result.shortUrl}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" />
                </a>

                <div className="flex items-center gap-1.5 shrink-0 font-mono">
                  <button
                    onClick={() => setQrModalUrl(result)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    title="View QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleNativeShare}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                    title="Share Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      copied
                        ? 'bg-emerald-500 text-zinc-950'
                        : 'bg-gradient-to-r from-lime-400 to-emerald-400 hover:opacity-90 text-zinc-950 shadow-md shadow-lime-400/20'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>COPY LINK</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* QR Code Modal */}
      <QrCodeModal
        isOpen={!!qrModalUrl}
        url={qrModalUrl}
        onClose={() => setQrModalUrl(null)}
        showToast={showToast}
      />
    </div>
  );
};

export default UrlForm;
