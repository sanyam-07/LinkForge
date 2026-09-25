import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { EXPIRATION_OPTIONS } from '../utils/constants';

export const EditUrlModal = ({ isOpen, url, onClose, onSave }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [expirationOption, setExpirationOption] = useState('never');
  const [customDate, setCustomDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (url) {
      setOriginalUrl(url.originalUrl || '');
      setIsActive(url.isActive ?? true);
      if (url.expiresAt) {
        setExpirationOption('custom');
        setCustomDate(new Date(url.expiresAt).toISOString().split('T')[0]);
      } else {
        setExpirationOption('never');
        setCustomDate('');
      }
    }
  }, [url]);

  if (!isOpen || !url) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!originalUrl.trim()) {
      setError('Destination URL cannot be empty');
      return;
    }

    setLoading(true);

    try {
      let finalExpiration = expirationOption;
      if (expirationOption === 'custom') {
        if (!customDate) {
          setError('Please specify a valid expiration date');
          setLoading(false);
          return;
        }
        finalExpiration = customDate;
      }

      await onSave(url._id, {
        originalUrl: originalUrl.trim(),
        expiration: finalExpiration,
        isActive,
      });

      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl transition-colors">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Modify Link Parameters
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-[10px] uppercase text-slate-500 dark:text-zinc-500 mb-1 font-semibold">
              Short Code
            </label>
            <input
              type="text"
              disabled
              value={url.shortCode}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase text-slate-600 dark:text-zinc-400 mb-1 font-semibold">
              Destination URL
            </label>
            <input
              type="text"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase text-slate-600 dark:text-zinc-400 mb-1 font-semibold">
              Expiration Date
            </label>
            <div className="flex gap-2">
              <select
                value={expirationOption}
                onChange={(e) => setExpirationOption(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-violet-500"
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
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] uppercase text-slate-600 dark:text-zinc-400 font-semibold">
              Link Status
            </span>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`px-4 py-1 rounded-full text-[10px] font-bold transition-colors ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-500'
              }`}
            >
              {isActive ? 'ACTIVE' : 'INACTIVE'}
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-md"
            >
              {loading ? 'Saving...' : 'Save Parameters'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUrlModal;
