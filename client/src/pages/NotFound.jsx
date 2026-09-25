import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-400 shadow-2xl">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-extrabold text-white">404 Link Not Found</h1>
          <p className="text-xs font-mono text-zinc-400 leading-relaxed">
            The link you are trying to access does not exist, has been deleted, or was mistyped.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400 text-zinc-950 font-bold text-xs shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO LINKFORGE</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
