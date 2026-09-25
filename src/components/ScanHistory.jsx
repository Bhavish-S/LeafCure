import React from 'react';
import { 
  History, 
  Trash2, 
  ExternalLink, 
  Download, 
  Clock, 
  Sparkles, 
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { APP_TRANSLATIONS } from '../data/pathologyData';

export default function ScanHistory({ 
  history = [], 
  onSelectScan, 
  onDeleteScan, 
  onClearHistory, 
  lang 
}) {
  const t = APP_TRANSLATIONS[lang] || APP_TRANSLATIONS.en;

  const handleExportJson = () => {
    if (history.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `plantcure_scans_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <section id="scan-history" className="w-full my-12 pt-6 border-t border-slate-800 no-print">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-violet-400" />
            <span>{t.historyTitle}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Persisted locally in browser cache. Scans remain available across page reloads.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            {/* Export JSON */}
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
              title="Export scan records to JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            {/* Clear All */}
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs font-semibold border border-red-800/50 transition-colors"
              title="Clear all stored diagnoses"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearHistoryBtn}</span>
            </button>
          </div>
        )}
      </div>

      {/* History Items Grid */}
      {history.length === 0 ? (
        <div className="rounded-2xl glass-panel p-8 sm:p-12 text-center border border-slate-800 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-3">
            <History className="w-6 h-6" />
          </div>
          <p className="text-slate-400 text-sm max-w-md">
            {t.historyEmpty}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {history.map((item) => {
            const isSevere = item.severity === 'severe';
            const isModerate = item.severity === 'moderate';

            return (
              <div
                key={item.scanId || item.scannedAt}
                className="group relative rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-violet-500/60 transition-all duration-200 overflow-hidden shadow-lg flex flex-col justify-between"
              >
                {/* Image Preview Thumbnail */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden border-b border-slate-800/80">
                  <img
                    src={item.imageUrl || item.sampleImage}
                    alt={item.cropName[lang] || item.cropName.en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {/* Severity Pill */}
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm ${
                      isSevere
                        ? 'bg-red-950/90 text-red-400 border-red-700/80'
                        : isModerate
                        ? 'bg-amber-950/90 text-amber-400 border-amber-700/80'
                        : 'bg-violet-950/90 text-violet-400 border-violet-700/80'
                    }`}
                  >
                    {t[item.severity] || item.severity}
                  </span>

                  <span className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-slate-300">
                    {new Date(item.scannedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider block">
                      {item.cropName[lang] || item.cropName.en}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-0.5 line-clamp-1">
                      {item.diseaseName[lang] || item.diseaseName.en}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-2 font-mono">
                      <span>Conf: {item.confidence}%</span>
                      <span>Lesions: {item.lesions ? item.lesions.length : 0}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => onSelectScan(item)}
                      className="flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{t.viewScan}</span>
                    </button>

                    <button
                      onClick={() => onDeleteScan(item.scanId || item.scannedAt)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                      title={t.deleteScan}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
