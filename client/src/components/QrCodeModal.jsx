import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Download, Copy, ExternalLink } from 'lucide-react';

export const QrCodeModal = ({ isOpen, url, onClose, showToast }) => {
  const qrRef = useRef(null);

  if (!isOpen || !url) return null;

  const downloadQrCode = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `linkforge-qr-${url.shortCode}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      if (showToast) showToast('QR Code PNG downloaded!', 'success');
    }
  };

  const copyShortUrl = () => {
    navigator.clipboard.writeText(url.shortUrl);
    if (showToast) showToast('Short link copied to clipboard!', 'copy');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 space-y-6 shadow-2xl transition-colors text-center">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>QR Code</span>
            <span className="font-mono text-xs text-violet-600 dark:text-violet-400">/{url.shortCode}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Canvas Container */}
        <div ref={qrRef} className="p-4 rounded-2xl bg-white border border-slate-200 dark:border-zinc-800 inline-block shadow-inner mx-auto">
          <QRCodeCanvas
            value={url.shortUrl}
            size={180}
            bgColor="#ffffff"
            fgColor="#09090b"
            level="H"
            includeMargin={true}
          />
        </div>

        <div className="space-y-1 font-mono text-xs">
          <a
            href={url.shortUrl}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-violet-600 dark:text-violet-400 hover:underline inline-flex items-center gap-1"
          >
            <span>{url.shortUrl}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <p className="text-[11px] text-slate-500 dark:text-zinc-500 truncate max-w-xs mx-auto">
            {url.originalUrl}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-zinc-800 font-mono text-xs">
          <button
            onClick={copyShortUrl}
            className="py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </button>

          <button
            onClick={downloadQrCode}
            className="py-2.5 rounded-xl bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400 text-zinc-950 font-bold flex items-center justify-center gap-1.5 shadow-md shadow-lime-400/20 hover:opacity-90 transition-opacity"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrCodeModal;
