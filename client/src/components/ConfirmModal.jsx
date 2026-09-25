import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onClose,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-mono">{message}</p>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800 font-mono text-xs">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-bold"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-500 font-bold shadow-md disabled:opacity-50"
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
