import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
} from 'lucide-react';
import UrlForm from '../components/UrlForm';
import { useAuth } from '../hooks/useAuth';

export const Home = ({ showToast }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-28 py-8 sm:py-16 overflow-hidden">
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 text-center space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono font-semibold text-slate-800 dark:text-lime-400 tracking-wider shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-500 dark:bg-lime-400 animate-pulse"></span>
            <span>THE MODERN URL SHORTENER</span>
          </div>

          {/* Editorial Headline */}
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
            Long links.{' '}
            <span className="bg-gradient-to-r from-lime-500 via-emerald-500 to-cyan-500 dark:from-lime-400 dark:via-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Made short.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Create clean, memorable links and understand every click with real-time analytics.
          </p>
        </motion.div>

        {/* HERO VISUAL CENTERPIECE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <UrlForm showToast={showToast} />
        </motion.div>
      </section>

      {/* SECTION 1 — HOW IT WORKS (Horizontal Timeline) */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-violet-600 dark:text-violet-400 font-bold">
            SIMPLE WORKFLOW
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            How LinkForge Works
          </h2>
        </div>

        {/* Horizontal Timeline */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="hidden md:block absolute top-1/2 left-12 right-12 h-[1px] bg-gradient-to-r from-violet-400/40 via-cyan-400/40 to-lime-400/40 -translate-y-6 z-0"></div>

          {/* Step 01 */}
          <div className="relative z-10 p-6 rounded-3xl bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-md shadow-slate-200/50 dark:shadow-none">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800/60 flex items-center justify-center font-mono font-bold text-violet-600 dark:text-violet-400 text-lg shadow-sm">
              01
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">PASTE</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              Paste your destination URL into the forge input field. Add custom slugs or expiration dates.
            </p>
          </div>

          {/* Step 02 */}
          <div className="relative z-10 p-6 rounded-3xl bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-md shadow-slate-200/50 dark:shadow-none">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800/60 flex items-center justify-center font-mono font-bold text-cyan-600 dark:text-cyan-400 text-lg shadow-sm">
              02
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">FORGE</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              LinkForge compresses the URL into a 6-character short code or custom alias instantly.
            </p>
          </div>

          {/* Step 03 */}
          <div className="relative z-10 p-6 rounded-3xl bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-md shadow-slate-200/50 dark:shadow-none">
            <div className="w-12 h-12 rounded-2xl bg-lime-50 dark:bg-lime-950 border border-lime-200 dark:border-lime-800/60 flex items-center justify-center font-mono font-bold text-lime-700 dark:text-lime-400 text-lg shadow-sm">
              03
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">TRACK</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              Understand every click with real-time devices, browser types, referrer logs, and location metrics.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — FEATURE SHOWCASE */}
      <section id="features" className="max-w-6xl mx-auto px-4 space-y-20">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-lime-600 dark:text-lime-400 font-bold">
            ENGINEERED FOR ENGAGEMENT
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            Designed to elevate your link sharing
          </h2>
        </div>

        {/* Showcase Item 1: SHORT LINKS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-violet-600 dark:text-violet-400 font-bold">01 / LINK MANAGEMENT</span>
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Short links.{' '}
              <span className="text-slate-400 dark:text-zinc-500 font-normal">Make every link easier to share.</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              Ditch messy 200-character parameter strings. LinkForge builds pristine, trustworthy links ready for Twitter, LinkedIn, email campaigns, or printed materials.
            </p>
          </div>

          {/* Mockup Preview 1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-500 font-mono">
              <span>BEFORE</span>
              <span className="text-rose-500 dark:text-rose-400 font-bold">214 CHARACTERS</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 font-mono text-xs text-slate-500 dark:text-zinc-500 truncate">
              https://example.com/store/products/category/v2/items/1294819?utm_source=twitter&utm_medium=social&utm_campaign=summer_sale_2026
            </div>

            <div className="flex items-center justify-center text-lime-600 dark:text-lime-400 font-mono text-xs font-bold py-1">
              ↓ FORGED WITH LINKFORGE ↓
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-500 font-mono">
              <span>AFTER</span>
              <span className="text-lime-600 dark:text-lime-400 font-bold">18 CHARACTERS</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-violet-500/40 flex items-center justify-between font-mono text-sm text-slate-900 dark:text-white font-bold">
              <span className="text-violet-600 dark:text-violet-400">linkforge/summersale</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-lime-400 text-zinc-950 font-bold">ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Showcase Item 2: DEEP ANALYTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-zinc-500 uppercase">REALTIME ENGAGEMENT</div>
                <div className="font-display text-2xl font-bold text-slate-900 dark:text-white">14,290 Clicks</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
                +24.8% THIS WEEK
              </span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 dark:text-zinc-400 font-mono">
                  <span>Desktop Devices</span>
                  <span>68%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-zinc-950 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full w-[68%]"></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 dark:text-zinc-400 font-mono">
                  <span>Mobile Browsers</span>
                  <span>27%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-zinc-950 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full w-[27%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">02 / DEEP ANALYTICS</span>
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Deep analytics.{' '}
              <span className="text-slate-400 dark:text-zinc-500 font-normal">Know what happens after the click.</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              Every redirection yields data. Measure total impressions, device models, browsers, operating systems, and referrers to tune your digital growth strategy.
            </p>
          </div>
        </div>

        {/* Showcase Item 3: CUSTOM ALIASES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-lime-600 dark:text-lime-400 font-bold">03 / BRANDING</span>
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Custom aliases.{' '}
              <span className="text-slate-400 dark:text-zinc-500 font-normal">Make your links memorable.</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              Boost user confidence and click-through rates by customizing short URLs with readable brand names instead of random hash codes.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl space-y-4 font-mono">
            <div className="text-xs text-slate-500 dark:text-zinc-500">RANDOM CODE VS BRANDED ALIAS</div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 text-xs text-slate-500 dark:text-zinc-500 flex justify-between">
              <span>linkforge/x9aK2b</span>
              <span className="text-slate-400 dark:text-zinc-600">Standard</span>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-violet-50 via-slate-50 to-white dark:from-violet-950 dark:to-zinc-950 border border-lime-500/50 text-sm text-slate-900 dark:text-white font-bold flex justify-between items-center shadow-lg">
              <span className="text-violet-600 dark:text-lime-400">linkforge.com/product</span>
              <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">Recommended</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — ANALYTICS PREVIEW */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 border border-slate-200 dark:border-zinc-800 p-8 sm:p-12 space-y-8 shadow-xl dark:shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-lime-600 dark:text-lime-400 font-bold">
                LIVE METRICS ENGINE
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
                Understand every click
              </h2>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono text-slate-500 dark:text-zinc-500">TOTAL RECORDED CLICKS</div>
              <div className="font-display text-4xl sm:text-6xl font-extrabold text-lime-600 dark:text-lime-400">
                24,892
              </div>
            </div>
          </div>

          {/* Interactive Growth Visual SVG */}
          <div className="h-48 sm:h-64 w-full bg-slate-100 dark:bg-zinc-950/80 rounded-2xl border border-slate-200 dark:border-zinc-800/80 p-4 relative flex items-end overflow-hidden">
            <svg className="w-full h-full text-violet-500 opacity-80 overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,130 Q75,100 150,110 T300,50 T450,20 L500,10 L500,150 L0,150 Z"
                fill="url(#grad)"
              />
              <path
                d="M0,130 Q75,100 150,110 T300,50 T450,20 L500,10"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* SECTION 4 — FINAL CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-violet-100 via-white to-cyan-100 dark:from-violet-950 dark:via-zinc-900 dark:to-cyan-950 border border-violet-200 dark:border-violet-800/40 space-y-6 shadow-xl relative overflow-hidden">
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Your links deserve better.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-md mx-auto">
            Start forging clean URLs and unlocking deep engagement analytics today.
          </p>
          <div className="pt-2">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400 hover:opacity-95 text-zinc-950 font-extrabold text-sm shadow-xl shadow-lime-400/20 transition-all hover:scale-105"
            >
              <span>START SHORTENING</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
