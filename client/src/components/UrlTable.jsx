import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Copy,
  ExternalLink,
  BarChart2,
  Edit2,
  Trash2,
  Check,
  Search,
  Zap,
  QrCode,
  Share2,
} from 'lucide-react';
import { formatDate, truncateUrl, formatNumber } from '../utils/formatters';
import QrCodeModal from './QrCodeModal';

export const UrlTable = ({
  urls = [],
  onEdit,
  onDelete,
  onToggleStatus,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [qrModalUrl, setQrModalUrl] = useState(null);

  const filteredUrls = urls.filter(
    (url) =>
      url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (url.customAlias && url.customAlias.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCopy = (shortUrl, id) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    if (showToast) showToast('Short URL copied to clipboard!', 'copy');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (urlObj) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LinkForge Short URL',
          text: `Check out this link: ${urlObj.shortUrl}`,
          url: urlObj.shortUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopy(urlObj.shortUrl, urlObj._id);
        }
      }
    } else {
      handleCopy(urlObj.shortUrl, urlObj._id);
    }
  };

  if (!urls || urls.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-zinc-900/80 rounded-3xl border border-slate-200 dark:border-zinc-800 space-y-4 shadow-sm">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-violet-600 dark:text-violet-400">
          <Zap className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">No forged links yet</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
            Forge your first short link using the button above to begin tracking clicks and managing URLs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900/90 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-xl shadow-slate-200/50 dark:shadow-2xl overflow-hidden backdrop-blur-xl transition-colors">
      {/* Search Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search link or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 outline-none focus:border-violet-500 font-mono transition-colors"
          />
        </div>

        <div className="text-xs font-mono text-slate-500 dark:text-zinc-500">
          Showing <strong className="text-slate-900 dark:text-white">{filteredUrls.length}</strong> of <strong className="text-slate-900 dark:text-white">{urls.length}</strong> links
        </div>
      </div>

      {/* List / Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-100/80 dark:bg-zinc-950/80 text-slate-500 dark:text-zinc-500 font-bold border-b border-slate-200 dark:border-zinc-800 uppercase tracking-widest text-[10px]">
            <tr>
              <th className="px-6 py-3.5">Short Link</th>
              <th className="px-6 py-3.5">Destination</th>
              <th className="px-6 py-3.5 text-center">Clicks</th>
              <th className="px-6 py-3.5">Date</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-zinc-800/80 text-slate-700 dark:text-zinc-300 font-medium">
            {filteredUrls.map((url) => {
              const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date();

              return (
                <tr key={url._id} className="hover:bg-violet-50/50 dark:hover:bg-zinc-800/40 transition-colors group">
                  {/* Short Link */}
                  <td className="px-6 py-4">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 flex items-center gap-1.5"
                    >
                      <span>{url.shortCode}</span>
                      <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                    </a>
                  </td>

                  {/* Destination */}
                  <td className="px-6 py-4 max-w-xs truncate text-slate-600 dark:text-zinc-400" title={url.originalUrl}>
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      {truncateUrl(url.originalUrl, 32)}
                    </a>
                  </td>

                  {/* Click Counter */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-lime-600 dark:text-lime-400">
                      {formatNumber(url.clicks)}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-slate-500 dark:text-zinc-500 text-[11px]">
                    {formatDate(url.createdAt)}
                  </td>

                  {/* Status Toggle */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onToggleStatus && onToggleStatus(url)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                        url.isActive && !isExpired
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-500'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          url.isActive && !isExpired ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-slate-400 dark:bg-zinc-600'
                        }`}
                      ></span>
                      <span>{url.isActive && !isExpired ? 'ACTIVE' : 'INACTIVE'}</span>
                    </button>
                  </td>

                  {/* Hover Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      {/* Copy */}
                      <button
                        onClick={() => handleCopy(url.shortUrl, url._id)}
                        className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-lime-600 dark:hover:text-lime-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                        title="Copy Short URL"
                      >
                        {copiedId === url._id ? (
                          <Check className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* QR Code */}
                      <button
                        onClick={() => setQrModalUrl(url)}
                        className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                        title="View QR Code"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => handleShare(url)}
                        className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                        title="Share Link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Analytics */}
                      <Link
                        to={`/analytics/${url.shortCode}`}
                        className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                        title="View Detailed Analytics"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                      </Link>

                      {/* Edit */}
                      <button
                        onClick={() => onEdit && onEdit(url)}
                        className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                        title="Edit Link"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDelete && onDelete(url)}
                        className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* QR CODE MODAL */}
      <QrCodeModal
        isOpen={!!qrModalUrl}
        onClose={() => setQrModalUrl(null)}
        url={qrModalUrl}
      />
    </div>
  );
};

export default UrlTable;
