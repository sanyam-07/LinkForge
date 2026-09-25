import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  RefreshCw,
  Activity,
} from 'lucide-react';
import urlService from '../services/urlService';
import { getSocket } from '../services/socket';
import { useAuth } from '../hooks/useAuth';
import UrlTable from '../components/UrlTable';
import UrlForm from '../components/UrlForm';
import EditUrlModal from '../components/EditUrlModal';
import ConfirmModal from '../components/ConfirmModal';
import { TableSkeleton } from '../components/SkeletonLoader';
import { formatNumber } from '../utils/formatters';

export const Dashboard = ({ showToast }) => {
  const { user } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Modals state
  const [editingUrl, setEditingUrl] = useState(null);
  const [deletingUrl, setDeletingUrl] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUrls = async () => {
    try {
      const res = await urlService.getUserUrls();
      if (res.success && res.data) {
        setUrls(res.data);
      }
    } catch (err) {
      if (showToast) showToast('Failed to fetch user URLs', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUrls();

    const socket = getSocket();
    if (socket) {
      if (socket.connected) setIsLiveConnected(true);

      const handleConnect = () => setIsLiveConnected(true);
      const handleDisconnect = () => setIsLiveConnected(false);
      const handleConnectError = () => setIsLiveConnected(false);

      const handleClickRecorded = (payload) => {
        setUrls((prevUrls) =>
          prevUrls.map((u) =>
            u.shortCode === payload.shortCode ? { ...u, clicks: payload.clicks } : u
          )
        );
        if (showToast) {
          showToast(`⚡ Real-time click recorded on link /${payload.shortCode}`, 'info');
        }
      };

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('connect_error', handleConnectError);
      socket.on('click:recorded', handleClickRecorded);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleConnectError);
        socket.off('click:recorded', handleClickRecorded);
      };
    }
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUrls();
  };

  // Stat Calculations
  const totalUrls = urls.length;
  const totalClicks = urls.reduce((acc, u) => acc + (u.clicks || 0), 0);
  const activeUrls = urls.filter((u) => u.isActive && (!u.expiresAt || new Date(u.expiresAt) > new Date())).length;

  // Edit URL Handler
  const handleSaveEdit = async (id, updatedData) => {
    try {
      const res = await urlService.updateUrl(id, updatedData);
      if (res.success) {
        if (showToast) showToast('Link updated successfully!', 'success');
        fetchUrls();
      }
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || 'Failed to update link', 'error');
    }
  };

  // Toggle Active Status Handler
  const handleToggleStatus = async (url) => {
    try {
      const res = await urlService.updateUrl(url._id, { isActive: !url.isActive });
      if (res.success) {
        if (showToast) {
          showToast(`Link status set to ${!url.isActive ? 'Active' : 'Inactive'}`, 'success');
        }
        fetchUrls();
      }
    } catch (err) {
      if (showToast) showToast('Failed to toggle status', 'error');
    }
  };

  // Delete URL Handler
  const handleConfirmDelete = async () => {
    if (!deletingUrl) return;
    setActionLoading(true);
    try {
      const res = await urlService.deleteUrl(deletingUrl._id);
      if (res.success) {
        if (showToast) showToast('Link deleted from workspace', 'success');
        setDeletingUrl(null);
        fetchUrls();
      }
    } catch (err) {
      if (showToast) showToast('Failed to delete link', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* WORKSPACE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-violet-600 dark:text-violet-400 font-bold">
              LINK WORKSPACE
            </span>
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
              <span>{isLiveConnected ? '● LIVE' : '○ OFFLINE'}</span>
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Welcome back, {user?.name || 'Creator'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
            Your link collection and engagement workspace at a glance.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleRefresh}
            className={`p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors shadow-sm`}
            title="Refresh links"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowCreateModal(!showCreateModal)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400 hover:opacity-95 text-zinc-950 font-bold text-xs sm:text-sm shadow-md shadow-lime-400/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{showCreateModal ? 'CLOSE FORGE' : 'FORGE NEW LINK'}</span>
          </button>
        </div>
      </div>

      {/* EXPANDABLE FORGE WORKSPACE */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="pb-4"
        >
          <UrlForm
            showToast={showToast}
            onUrlCreated={() => {
              fetchUrls();
              setShowCreateModal(false);
            }}
          />
        </motion.div>
      )}

      {/* MINIMAL TYPOGRAPHY STAT COUNTER ROW */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800/80 shadow-md shadow-slate-200/50 dark:shadow-none flex flex-wrap items-center justify-between gap-6 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-500 dark:text-zinc-500 uppercase tracking-wider font-semibold">TOTAL LINKS</span>
          <span className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {formatNumber(totalUrls)}
          </span>
        </div>

        <div className="hidden sm:block w-[1px] h-8 bg-slate-200 dark:bg-zinc-800"></div>

        <div className="flex items-center gap-3">
          <span className="text-slate-500 dark:text-zinc-500 uppercase tracking-wider font-semibold">TOTAL CLICKS</span>
          <span className="font-display text-xl sm:text-2xl font-bold text-lime-600 dark:text-lime-400">
            {formatNumber(totalClicks)}
          </span>
        </div>

        <div className="hidden sm:block w-[1px] h-8 bg-slate-200 dark:bg-zinc-800"></div>

        <div className="flex items-center gap-3">
          <span className="text-slate-500 dark:text-zinc-500 uppercase tracking-wider font-semibold">ACTIVE LINKS</span>
          <span className="font-display text-xl sm:text-2xl font-bold text-cyan-600 dark:text-cyan-400">
            {formatNumber(activeUrls)}
          </span>
        </div>
      </div>

      {/* WORKSPACE LINK LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Your Forged Links
          </h2>
          <span className="text-xs font-mono text-slate-500 dark:text-zinc-500">
            {urls.length} items registered
          </span>
        </div>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : (
          <UrlTable
            urls={urls}
            onEdit={(url) => setEditingUrl(url)}
            onDelete={(url) => setDeletingUrl(url)}
            onToggleStatus={handleToggleStatus}
            showToast={showToast}
          />
        )}
      </div>

      {/* Edit Modal */}
      <EditUrlModal
        isOpen={!!editingUrl}
        url={editingUrl}
        onClose={() => setEditingUrl(null)}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingUrl}
        title="Remove link from workspace?"
        message={`Are you sure you want to delete 'linkforge/${deletingUrl?.shortCode}'? Click history and redirect statistics will be permanently removed.`}
        confirmText="Remove Link"
        loading={actionLoading}
        onClose={() => setDeletingUrl(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Dashboard;
