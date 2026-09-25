import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Clock, ArrowLeft, PlusCircle } from 'lucide-react';

export const ExpiredLink = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason');

  const title = reason === 'disabled' ? 'Link Deactivated' : 'Oops! This link has expired.';
  const subtitle =
    reason === 'disabled'
      ? 'The owner of this link has set its status to inactive.'
      : 'This shortened URL had an expiration limit that has already passed.';

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lime-400 shadow-2xl">
          <Clock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-extrabold text-white">{title}</h1>
          <p className="text-xs font-mono text-zinc-400 leading-relaxed">{subtitle}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            to="/"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400 text-zinc-950 font-bold text-xs shadow-lg flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
          <Link
            to="/"
            className="px-6 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-bold text-xs flex items-center gap-2 hover:border-zinc-700"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Forge New Link</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExpiredLink;
