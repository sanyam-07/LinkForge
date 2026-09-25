import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Zap } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isCopy = toast.type === 'copy';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-xl bg-white/95 dark:bg-zinc-900/95 border border-slate-200 dark:border-zinc-800 text-xs font-mono font-medium text-slate-900 dark:text-white transition-colors"
      >
        {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-lime-400 shrink-0" />}
        {isCopy && <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />}
        {!isSuccess && !isCopy && <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}

        <span className="text-slate-800 dark:text-zinc-200">{toast.message}</span>

        <button
          onClick={onClose}
          className="p-1 text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white rounded-lg ml-2"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
