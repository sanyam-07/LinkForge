import React from 'react';

export const CardSkeleton = () => (
  <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 animate-pulse space-y-3">
    <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/3"></div>
    <div className="h-8 bg-slate-200 dark:bg-zinc-800 rounded w-1/2"></div>
    <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-2/3"></div>
  </div>
);

export const TableSkeleton = ({ rows = 4 }) => (
  <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-pulse">
    <div className="p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-100/80 dark:bg-zinc-950 flex gap-4">
      <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/4"></div>
      <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/4"></div>
      <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/6"></div>
      <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/6"></div>
    </div>
    <div className="divide-y divide-slate-200 dark:divide-zinc-800">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex gap-4 items-center">
          <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/4"></div>
          <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/6"></div>
          <div className="h-6 bg-slate-200 dark:bg-zinc-800 rounded-full w-16"></div>
        </div>
      ))}
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 animate-pulse space-y-4">
    <div className="h-6 bg-slate-200 dark:bg-zinc-800 rounded w-1/4"></div>
    <div className="h-64 bg-slate-100 dark:bg-zinc-950 rounded-2xl flex items-end p-4 gap-3">
      <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-t h-1/3"></div>
      <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-t h-2/3"></div>
      <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-t h-1/2"></div>
      <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-t h-3/4"></div>
      <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-t h-2/5"></div>
    </div>
  </div>
);

export default { CardSkeleton, TableSkeleton, ChartSkeleton };
