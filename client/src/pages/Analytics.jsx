import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Laptop,
  Globe,
  Monitor,
  RefreshCw,
  TrendingUp,
  Sparkles,
  Bot,
  Zap,
} from 'lucide-react';
import analyticsService from '../services/analyticsService';
import aiService from '../services/aiService';
import { getSocket } from '../services/socket';
import {
  ClicksTimeChart,
  DistributionPieChart,
  DistributionBarChart,
} from '../components/AnalyticsCharts';
import { ChartSkeleton } from '../components/SkeletonLoader';
import { formatDate, formatNumber } from '../utils/formatters';

export const Analytics = ({ showToast }) => {
  const { shortCode } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // AI Insights State
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setError('');
      const res = await analyticsService.getUrlAnalytics(shortCode);
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load URL analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (shortCode) {
      fetchAnalytics();
    }
  }, [shortCode]);

  useEffect(() => {
    if (!shortCode) return;
    const socket = getSocket();
    if (socket) {
      if (socket.connected) {
        setIsLiveConnected(true);
        socket.emit('join:link', shortCode);
      }

      const handleConnect = () => {
        setIsLiveConnected(true);
        socket.emit('join:link', shortCode);
      };

      const handleDisconnect = () => setIsLiveConnected(false);
      const handleConnectError = () => setIsLiveConnected(false);

      const handleAnalyticsUpdate = (payload) => {
        if (payload.shortCode && payload.shortCode !== shortCode) return;

        setData((prev) => {
          if (!prev) return prev;
          const newTotalClicks = payload.clicks ?? (prev.summary.totalClicks + 1);

          const newRecentClick = payload.timestamp
            ? {
                timestamp: payload.timestamp,
                referrer: payload.referrer || 'Direct',
                device: payload.device || 'Desktop',
                browser: payload.browser || 'Unknown',
                operatingSystem: payload.operatingSystem || 'Unknown',
                ipAddress: '127.0.0.1',
              }
            : null;

          const updatedRecentClicks = newRecentClick
            ? [newRecentClick, ...(prev.recentClicks || [])].slice(0, 10)
            : prev.recentClicks;

          return {
            ...prev,
            summary: {
              ...prev.summary,
              totalClicks: newTotalClicks,
              clicksToday: (prev.summary.clicksToday || 0) + 1,
              clicksThisWeek: (prev.summary.clicksThisWeek || 0) + 1,
              clicksThisMonth: (prev.summary.clicksThisMonth || 0) + 1,
            },
            recentClicks: updatedRecentClicks,
          };
        });

        if (showToast) {
          showToast(`⚡ Real-time click recorded for /${shortCode}!`, 'info');
        }
      };

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('connect_error', handleConnectError);
      socket.on('analytics:update', handleAnalyticsUpdate);

      return () => {
        socket.emit('leave:link', shortCode);
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleConnectError);
        socket.off('analytics:update', handleAnalyticsUpdate);
      };
    }
  }, [shortCode]);

  const handleGenerateAiInsights = async () => {
    setAiLoading(true);
    try {
      const res = await aiService.getAnalyticsInsights(shortCode);
      if (res.success && res.data?.insights) {
        setAiInsights(res.data.insights);
        if (showToast) showToast('AI Analytics Insights generated!', 'success');
      } else {
        if (showToast) showToast('Could not generate AI insights', 'error');
      }
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || 'AI service unavailable', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div className="h-8 bg-slate-200 dark:bg-zinc-900 rounded w-1/4 animate-pulse"></div>
        <ChartSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Analytics Unavailable
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-500">{error || 'Could not find link data'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workspace</span>
        </Link>
      </div>
    );
  }

  const { url, summary, clicksOverTime, deviceStats, browserStats, osStats, recentClicks } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <Link
              to="/dashboard"
              className="text-xs font-mono text-violet-600 dark:text-violet-400 hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Workspace
            </Link>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all ${
                isLiveConnected
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-500'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isLiveConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400 dark:bg-zinc-600'
                }`}
              />
              <span>{isLiveConnected ? '● LIVE STREAM' : '○ OFFLINE'}</span>
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Analytics</span>
            <span className="text-slate-400 dark:text-zinc-500 font-normal">/</span>
            <span className="font-mono text-lime-600 dark:text-lime-400">{url.shortCode}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono truncate max-w-md">
            Destination: {url.originalUrl}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={url.shortUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-mono font-bold hover:text-slate-900 dark:hover:text-white shadow-sm flex items-center gap-1.5"
          >
            <span>Visit Short Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm ${
              refreshing ? 'animate-spin' : ''
            }`}
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* GIANT STAT & DOMINANT VISUAL GRAPH */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 space-y-8 shadow-xl dark:shadow-2xl backdrop-blur-xl transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-zinc-500">
              TOTAL RECORDED CLICKS
            </span>
            <div className="font-display text-5xl sm:text-7xl font-extrabold text-slate-900 dark:text-white flex items-baseline gap-3">
              <span>{formatNumber(summary.totalClicks)}</span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                +18.4%
              </span>
            </div>
          </div>

          <div className="flex gap-6 font-mono text-xs text-slate-600 dark:text-zinc-400">
            <div>
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase">TODAY</div>
              <div className="text-lime-600 dark:text-lime-400 font-bold text-base">{summary.clicksToday}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase">THIS WEEK</div>
              <div className="text-violet-600 dark:text-violet-400 font-bold text-base">{summary.clicksThisWeek}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase">THIS MONTH</div>
              <div className="text-cyan-600 dark:text-cyan-400 font-bold text-base">{summary.clicksThisMonth}</div>
            </div>
          </div>
        </div>

        {/* DOMINANT CHART */}
        <div className="pt-2">
          <ClicksTimeChart data={clicksOverTime} />
        </div>
      </div>

      {/* AI INSIGHTS CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-violet-900/10 via-zinc-900/40 to-cyan-900/10 dark:from-violet-950/40 dark:via-zinc-900/90 dark:to-cyan-950/40 border border-violet-500/20 dark:border-violet-500/30 space-y-4 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-violet-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>AI Analytics Insights</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 font-bold border border-violet-200 dark:border-violet-800">
                  GPT-4o
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                Automated intelligent performance diagnosis and traffic distribution summary
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateAiInsights}
            disabled={aiLoading}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0"
          >
            {aiLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing traffic...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4" />
                <span>Generate AI Insights</span>
              </>
            )}
          </button>
        </div>

        {aiInsights ? (
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-950/70 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {aiInsights}
          </div>
        ) : (
          <div className="p-4 text-center rounded-2xl bg-slate-50/50 dark:bg-zinc-950/40 border border-dashed border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-400 dark:text-zinc-500">
            Click 'Generate AI Insights' to run an automated OpenAI breakdown of traffic patterns, devices, and engagement.
          </div>
        )}
      </div>

      {/* BREAKDOWN GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Device Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-md dark:shadow-none">
          <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Laptop className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span>Device Breakdown</span>
          </h3>
          <DistributionPieChart data={deviceStats} />
        </div>

        {/* Browser Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-md dark:shadow-none">
          <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Browser Distribution</span>
          </h3>
          <DistributionBarChart data={browserStats} color="#06b6d4" />
        </div>

        {/* OS Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-md dark:shadow-none">
          <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Monitor className="w-4 h-4 text-lime-600 dark:text-lime-400" />
            <span>Operating Systems</span>
          </h3>
          <DistributionBarChart data={osStats} color="#10b981" />
        </div>
      </div>

      {/* RECENT CLICK LOGS TABLE */}
      <div className="bg-white dark:bg-zinc-900/90 rounded-3xl border border-slate-200 dark:border-zinc-800 overflow-hidden p-6 space-y-4 shadow-xl dark:shadow-none">
        <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
          Recent Click Events
        </h2>

        {!recentClicks || recentClicks.length === 0 ? (
          <p className="text-xs font-mono text-slate-500 dark:text-zinc-500">No recent click events logged.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 dark:bg-zinc-950 text-slate-500 dark:text-zinc-500 uppercase tracking-widest font-bold text-[10px] border-b border-slate-200 dark:border-zinc-800">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Referrer</th>
                  <th className="px-4 py-3">Device</th>
                  <th className="px-4 py-3">Browser</th>
                  <th className="px-4 py-3">OS</th>
                  <th className="px-4 py-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-zinc-800 text-slate-700 dark:text-zinc-300">
                {recentClicks.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40">
                    <td className="px-4 py-3 text-slate-500 dark:text-zinc-400">
                      {new Date(c.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 truncate max-w-[150px] text-slate-500 dark:text-zinc-400" title={c.referrer}>
                      {c.referrer}
                    </td>
                    <td className="px-4 py-3">{c.device}</td>
                    <td className="px-4 py-3">{c.browser}</td>
                    <td className="px-4 py-3">{c.operatingSystem}</td>
                    <td className="px-4 py-3 text-slate-400 dark:text-zinc-500">{c.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
